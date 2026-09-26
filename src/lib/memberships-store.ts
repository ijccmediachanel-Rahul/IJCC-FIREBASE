import fs from "fs";
import path from "path";
import { MemberRecord } from "./memberships";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const MEMBERS_FILE = path.join(DATA_DIR, "memberships.json");
const APPLICATIONS_FILE = path.join(DATA_DIR, "membership-applications.json");

function ensureFilesExist() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(MEMBERS_FILE)) {
    fs.writeFileSync(MEMBERS_FILE, JSON.stringify([], null, 2), "utf-8");
  }
  if (!fs.existsSync(APPLICATIONS_FILE)) {
    fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

function readLocalMembers(): MemberRecord[] {
  ensureFilesExist();
  try {
    const raw = fs.readFileSync(MEMBERS_FILE, "utf-8");
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to read local memberships.json:", err);
    return [];
  }
}

function writeLocalMembers(members: MemberRecord[]) {
  ensureFilesExist();
  try {
    fs.writeFileSync(MEMBERS_FILE, JSON.stringify(members, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write local memberships.json:", err);
  }
}

function readLocalApplications(): any[] {
  ensureFilesExist();
  try {
    const raw = fs.readFileSync(APPLICATIONS_FILE, "utf-8");
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to read local applications.json:", err);
    return [];
  }
}

function writeLocalApplications(apps: any[]) {
  ensureFilesExist();
  try {
    fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(apps, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write local applications.json:", err);
  }
}

// -------------------------------------------------------------
// Public Data Store Methods (Local JSON Primary + Firestore Sync)
// -------------------------------------------------------------

export async function getAllMembers(): Promise<MemberRecord[]> {
  const localMembers = readLocalMembers();
  return localMembers;
}

export async function findMemberById(rawId: string): Promise<MemberRecord | null> {
  const all = await getAllMembers();
  const search = rawId.trim().toLowerCase();
  return all.find((m) => m.memberId && m.memberId.trim().toLowerCase() === search) || null;
}

export async function saveMember(newMember: MemberRecord): Promise<void> {
  const all = readLocalMembers();
  const idx = all.findIndex((m) => m.id === newMember.id || m.memberId === newMember.memberId);
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
    // Expected if Firestore rules restrict direct client writes
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
  } catch {
    // Ignore firestore permission error
  }

  return updated;
}

export async function deleteMember(id: string): Promise<boolean> {
  const all = readLocalMembers();
  const filtered = all.filter((m) => m.id !== id);
  writeLocalMembers(filtered);

  // Background sync to Firestore
  try {
    await deleteDoc(doc(db, "memberships", id));
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

export async function updateApplicationStatus(id: string, status: string, assignedMemberId?: string): Promise<void> {
  const all = readLocalApplications();
  const idx = all.findIndex((a) => a.id === id);
  if (idx >= 0) {
    all[idx].status = status;
    if (assignedMemberId) all[idx].assignedMemberId = assignedMemberId;
    writeLocalApplications(all);
  }
}
