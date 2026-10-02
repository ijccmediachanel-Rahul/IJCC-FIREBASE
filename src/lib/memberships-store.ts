import fs from "fs";
import path from "path";
import os from "os";
import { MemberRecord } from "./memberships";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

declare global {
  // eslint-disable-next-line no-var
  var __ijcc_members_cache: MemberRecord[] | undefined;
  // eslint-disable-next-line no-var
  var __ijcc_apps_cache: any[] | undefined;
}

const LOCAL_DATA_DIR = path.join(process.cwd(), "src", "data");
const TMP_DATA_DIR = path.join(os.tmpdir(), "ijcc_store");

// Determine the safest writable path for storage (works on both Localhost & Vercel Serverless)
function getStorageFilePath(filename: string): string {
  // 1. Try local src/data first (works on development and persistent server environments)
  try {
    if (!fs.existsSync(LOCAL_DATA_DIR)) {
      fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
    }
    const testFile = path.join(LOCAL_DATA_DIR, `.write_check_${Date.now()}`);
    fs.writeFileSync(testFile, "1");
    fs.unlinkSync(testFile);
    return path.join(LOCAL_DATA_DIR, filename);
  } catch {
    // 2. Read-only filesystem (e.g. Vercel Serverless / AWS Lambda) -> fallback to /tmp
    try {
      if (!fs.existsSync(TMP_DATA_DIR)) {
        fs.mkdirSync(TMP_DATA_DIR, { recursive: true });
      }
      const tmpFile = path.join(TMP_DATA_DIR, filename);
      // Seed from bundled static src/data file if /tmp file does not exist yet
      if (!fs.existsSync(tmpFile)) {
        const bundledFile = path.join(LOCAL_DATA_DIR, filename);
        if (fs.existsSync(bundledFile)) {
          const content = fs.readFileSync(bundledFile, "utf-8");
          fs.writeFileSync(tmpFile, content, "utf-8");
        } else {
          fs.writeFileSync(tmpFile, JSON.stringify([], null, 2), "utf-8");
        }
      }
      return tmpFile;
    } catch {
      return path.join(LOCAL_DATA_DIR, filename);
    }
  }
}

function readLocalMembers(): MemberRecord[] {
  const filePath = getStorageFilePath("memberships.json");
  let members: MemberRecord[] = [];

  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      if (raw) members = JSON.parse(raw);
    }
  } catch (err) {
    console.warn("Failed to read memberships file:", err);
    if (globalThis.__ijcc_members_cache) {
      return globalThis.__ijcc_members_cache;
    }
  }

  globalThis.__ijcc_members_cache = members;
  return members;
}

function writeLocalMembers(members: MemberRecord[]) {
  globalThis.__ijcc_members_cache = members;
  const filePath = getStorageFilePath("memberships.json");
  try {
    fs.writeFileSync(filePath, JSON.stringify(members, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to write memberships file:", err);
  }

  // Always write directly to local src/data/memberships.json so git/file system is always in sync
  try {
    const localFile = path.join(LOCAL_DATA_DIR, "memberships.json");
    fs.writeFileSync(localFile, JSON.stringify(members, null, 2), "utf-8");
  } catch {}
}

function readLocalApplications(): any[] {
  if (globalThis.__ijcc_apps_cache && Array.isArray(globalThis.__ijcc_apps_cache) && globalThis.__ijcc_apps_cache.length > 0) {
    return globalThis.__ijcc_apps_cache;
  }

  const filePath = getStorageFilePath("membership-applications.json");
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const data = raw ? JSON.parse(raw) : [];
      globalThis.__ijcc_apps_cache = data;
      return data;
    }
  } catch (err) {
    console.warn("Failed to read applications file:", err);
  }
  return [];
}

function writeLocalApplications(apps: any[]) {
  globalThis.__ijcc_apps_cache = apps;
  const filePath = getStorageFilePath("membership-applications.json");
  try {
    fs.writeFileSync(filePath, JSON.stringify(apps, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to write applications file:", err);
  }

  try {
    const localFile = path.join(LOCAL_DATA_DIR, "membership-applications.json");
    fs.writeFileSync(localFile, JSON.stringify(apps, null, 2), "utf-8");
  } catch {}
}

// -------------------------------------------------------------
// Public Data Store Methods
// -------------------------------------------------------------

export async function getAllMembers(): Promise<MemberRecord[]> {
  const localFilePath = path.join(LOCAL_DATA_DIR, "memberships.json");
  const isInitialized = fs.existsSync(localFilePath);

  const localMembers = readLocalMembers();

  // Only seed from Firestore on first setup if the local file has NEVER been initialized
  if (!isInitialized && localMembers.length === 0) {
    try {
      const snap = await getDocs(collection(db, "memberships"));
      if (!snap.empty) {
        const fsMembers: MemberRecord[] = [];
        snap.forEach((d) => {
          fsMembers.push(d.data() as MemberRecord);
        });
        if (fsMembers.length > 0) {
          writeLocalMembers(fsMembers);
          return fsMembers;
        }
      }
    } catch {}
  }

  return localMembers;
}

export async function findMemberById(rawId: string): Promise<MemberRecord | null> {
  const all = await getAllMembers();
  const search = rawId.trim().toLowerCase();
  return (
    all.find(
      (m) =>
        (m.memberId && m.memberId.trim().toLowerCase() === search) ||
        (m.id && m.id.trim().toLowerCase() === search)
    ) || null
  );
}

export async function saveMember(newMember: MemberRecord): Promise<void> {
  const all = readLocalMembers();
  const idx = all.findIndex(
    (m) =>
      m.id === newMember.id ||
      (m.memberId && newMember.memberId && m.memberId.trim().toLowerCase() === newMember.memberId.trim().toLowerCase())
  );
  if (idx >= 0) {
    all[idx] = newMember;
  } else {
    all.unshift(newMember);
  }
  writeLocalMembers(all);

  // Background sync to Firestore
  try {
    const docRef = doc(db, "memberships", newMember.id);
    await setDoc(docRef, newMember, { merge: true });
  } catch {
    // Handled gracefully if client authentication is required
  }
}

export async function updateMember(
  id: string,
  updates: Partial<MemberRecord>
): Promise<MemberRecord | null> {
  const all = readLocalMembers();
  const idx = all.findIndex((m) => m.id === id);
  if (idx < 0) return null;

  const updated: MemberRecord = {
    ...all[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  all[idx] = updated;
  writeLocalMembers(all);

  // Background sync to Firestore
  try {
    const docRef = doc(db, "memberships", id);
    await setDoc(docRef, updated, { merge: true });
  } catch {}

  return updated;
}

export async function deleteMember(id: string): Promise<boolean> {
  const all = readLocalMembers();
  const target = all.find((m) => m.id === id || m.memberId === id);
  const targetDocId = target?.id || id;
  const filtered = all.filter((m) => m.id !== id && m.memberId !== id);
  writeLocalMembers(filtered);

  // Background sync to Firestore
  try {
    await deleteDoc(doc(db, "memberships", targetDocId));
    if (target?.memberId && target.memberId !== targetDocId) {
      await deleteDoc(doc(db, "memberships", target.memberId));
    }
  } catch {}

  return true;
}

// -------------------------------------------------------------
// Applications Store
// -------------------------------------------------------------

export async function getAllApplications(): Promise<any[]> {
  const local = readLocalApplications();
  try {
    const snap = await getDocs(collection(db, "membership_applications"));
    if (!snap.empty) {
      const fsList: any[] = [];
      snap.forEach((d) => fsList.push({ id: d.id, ...d.data() }));
      return fsList;
    }
  } catch {}
  return local;
}

export async function saveApplication(app: any): Promise<void> {
  const all = readLocalApplications();
  all.unshift(app);
  writeLocalApplications(all);

  try {
    const docRef = doc(db, "membership_applications", app.id);
    await setDoc(docRef, app);
  } catch {}
}

export async function updateApplicationStatus(
  id: string,
  status: string,
  assignedMemberId?: string
): Promise<void> {
  const all = readLocalApplications();
  const idx = all.findIndex((a) => a.id === id);
  if (idx >= 0) {
    all[idx].status = status;
    if (assignedMemberId) all[idx].assignedMemberId = assignedMemberId;
    writeLocalApplications(all);
  }
}
