import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "owner" | "admin";
  status: "active" | "disabled";
  addedAt: string;
}

export interface AccessRequest {
  id: string;
  email: string;
  name: string;
  reason?: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

interface AdminAuthData {
  admins: AdminUser[];
  requests: AccessRequest[];
}

const DATA_DIR = path.join(process.cwd(), "src", "data");
const AUTH_FILE = path.join(DATA_DIR, "admin-users.json");

const DEFAULT_ADMINS: AdminUser[] = [
  {
    id: "admin_owner_1",
    email: "info@ijcc.in",
    name: "IJCC Secretariat (Sir)",
    role: "owner",
    status: "active",
    addedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "admin_owner_2",
    email: "ijccmediachanel@gmail.com",
    name: "IJCC Media Channel",
    role: "owner",
    status: "active",
    addedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "admin_dev_1",
    email: "codernitin268@gmail.com",
    name: "Nitin Prakash (Developer)",
    role: "admin",
    status: "active",
    addedAt: "2026-09-25T00:00:00.000Z",
  },
];

function readData(): AdminAuthData {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(AUTH_FILE)) {
    const initial: AdminAuthData = {
      admins: DEFAULT_ADMINS,
      requests: [],
    };
    fs.writeFileSync(AUTH_FILE, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }

  try {
    const raw = fs.readFileSync(AUTH_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      admins: Array.isArray(parsed.admins) ? parsed.admins : DEFAULT_ADMINS,
      requests: Array.isArray(parsed.requests) ? parsed.requests : [],
    };
  } catch (err) {
    console.error("Failed to read admin-users.json:", err);
    return { admins: DEFAULT_ADMINS, requests: [] };
  }
}

function writeData(data: AdminAuthData) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(AUTH_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export function isEmailAuthorizedAdmin(email: string): boolean {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  const data = readData();
  return data.admins.some(
    (a) => a.email.toLowerCase().trim() === clean && a.status === "active"
  );
}

export function getAdminRecord(email: string): AdminUser | null {
  if (!email) return null;
  const clean = email.toLowerCase().trim();
  const data = readData();
  return (
    data.admins.find((a) => a.email.toLowerCase().trim() === clean) || null
  );
}

export function getAllAdmins(): AdminUser[] {
  return readData().admins;
}

export function getAllAccessRequests(): AccessRequest[] {
  return readData().requests;
}

export function getAccessRequestByEmail(email: string): AccessRequest | null {
  if (!email) return null;
  const clean = email.toLowerCase().trim();
  const data = readData();
  return (
    data.requests.find(
      (r) => r.email.toLowerCase().trim() === clean && r.status === "pending"
    ) ||
    data.requests.find((r) => r.email.toLowerCase().trim() === clean) ||
    null
  );
}

export async function createAccessRequest(
  email: string,
  name?: string,
  reason?: string
): Promise<AccessRequest> {
  const clean = email.toLowerCase().trim();
  const data = readData();

  // If already active admin, return pseudo
  const existingAdmin = data.admins.find(
    (a) => a.email.toLowerCase().trim() === clean && a.status === "active"
  );
  if (existingAdmin) {
    return {
      id: "already_admin",
      email: clean,
      name: existingAdmin.name,
      status: "approved",
      requestedAt: new Date().toISOString(),
    };
  }

  // Check if pending request exists
  const existingReqIdx = data.requests.findIndex(
    (r) => r.email.toLowerCase().trim() === clean
  );

  const newRequest: AccessRequest = {
    id: `req_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`,
    email: clean,
    name: name || clean.split("@")[0],
    reason: reason || "Requested access to IJCC Administration Studio",
    status: "pending",
    requestedAt: new Date().toISOString(),
  };

  if (existingReqIdx >= 0) {
    data.requests[existingReqIdx] = newRequest;
  } else {
    data.requests.unshift(newRequest);
  }

  writeData(data);

  // Send Email Notification to Sir / Secretariat
  try {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 465,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const receiver = process.env.CONTACT_FORM_RECEIVER || "info@ijcc.in";

      await transporter.sendMail({
        from: `"IJCC Security System" <${process.env.SMTP_USER}>`,
        to: receiver,
        replyTo: clean,
        subject: `[Admin Access Request] ${newRequest.name} (${clean}) requested portal access`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #0f172a; color: #ffffff; padding: 20px 24px;">
              <h2 style="margin: 0; font-size: 18px;">IJCC Admin Studio — Access Permission Request</h2>
              <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.8;">Action required by Secretariat / Administrator</p>
            </div>
            
            <div style="padding: 24px;">
              <p style="font-size: 14px; margin-top: 0;">
                A user or developer has requested administrative access to the <strong>IJCC Administration Studio</strong> (ijcc.in/admin):
              </p>

              <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin: 16px 0; background: #f8fafc; border-radius: 6px; padding: 12px;">
                <tr><td style="padding: 8px 12px; font-weight: bold; width: 35%;">Requested Email:</td><td style="padding: 8px 12px;"><strong>${clean}</strong></td></tr>
                <tr><td style="padding: 8px 12px; font-weight: bold;">Name:</td><td style="padding: 8px 12px;">${newRequest.name}</td></tr>
                <tr><td style="padding: 8px 12px; font-weight: bold;">Date & Time:</td><td style="padding: 8px 12px;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td></tr>
              </table>

              <p style="font-size: 13px; color: #64748b;">
                If you recognize this person, log in to the Admin Portal to approve their access. Once approved, they can directly log in with their email.
              </p>

              <div style="margin-top: 24px; text-align: center;">
                <a href="https://ijcc.in/admin" style="background-color: #990000; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
                  Review & Approve in Admin Studio ➔
                </a>
              </div>
            </div>
          </div>
        `,
      });
      console.log("Admin access request notification email sent to:", receiver);
    }
  } catch (emailErr) {
    console.warn("Could not dispatch access request email:", emailErr);
  }

  return newRequest;
}

export function approveAccessRequest(
  requestId: string,
  reviewerEmail = "info@ijcc.in"
): boolean {
  const data = readData();
  const req = data.requests.find((r) => r.id === requestId);
  if (!req) return false;

  req.status = "approved";
  req.reviewedAt = new Date().toISOString();
  req.reviewedBy = reviewerEmail;

  // Add to active admins if not already there
  const existingIdx = data.admins.findIndex(
    (a) => a.email.toLowerCase().trim() === req.email.toLowerCase().trim()
  );
  if (existingIdx >= 0) {
    data.admins[existingIdx].status = "active";
  } else {
    data.admins.push({
      id: `admin_${Date.now()}`,
      email: req.email.toLowerCase().trim(),
      name: req.name,
      role: "admin",
      status: "active",
      addedAt: new Date().toISOString(),
    });
  }

  writeData(data);
  return true;
}

export function rejectAccessRequest(
  requestId: string,
  reviewerEmail = "info@ijcc.in"
): boolean {
  const data = readData();
  const req = data.requests.find((r) => r.id === requestId);
  if (!req) return false;

  req.status = "rejected";
  req.reviewedAt = new Date().toISOString();
  req.reviewedBy = reviewerEmail;

  writeData(data);
  return true;
}

export function addAuthorizedAdmin(
  email: string,
  name?: string,
  role: "owner" | "admin" = "admin"
): AdminUser {
  const clean = email.toLowerCase().trim();
  const data = readData();

  const existingIdx = data.admins.findIndex(
    (a) => a.email.toLowerCase().trim() === clean
  );
  if (existingIdx >= 0) {
    data.admins[existingIdx].status = "active";
    data.admins[existingIdx].role = role;
    if (name) data.admins[existingIdx].name = name;
    writeData(data);
    return data.admins[existingIdx];
  }

  const newAdmin: AdminUser = {
    id: `admin_${Date.now()}`,
    email: clean,
    name: name || clean.split("@")[0],
    role,
    status: "active",
    addedAt: new Date().toISOString(),
  };

  data.admins.push(newAdmin);
  writeData(data);
  return newAdmin;
}

export function removeAuthorizedAdmin(email: string): boolean {
  const clean = email.toLowerCase().trim();
  const data = readData();

  // Protect primary owner
  if (clean === "info@ijcc.in") return false;

  const idx = data.admins.findIndex(
    (a) => a.email.toLowerCase().trim() === clean
  );
  if (idx < 0) return false;

  data.admins.splice(idx, 1);
  writeData(data);
  return true;
}
