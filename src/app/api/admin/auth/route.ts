import { NextRequest, NextResponse } from "next/server";
import {
  isEmailAuthorizedAdmin,
  getAdminRecord,
  getAccessRequestByEmail,
  createAccessRequest,
  approveAccessRequest,
  rejectAccessRequest,
  addAuthorizedAdmin,
  removeAuthorizedAdmin,
  getAllAdmins,
  getAllAccessRequests,
} from "@/lib/admin-auth-store";

export const runtime = "nodejs";

const ADMIN_MASTER_KEY = process.env.ADMIN_MASTER_KEY || "IJCC#Admin2026";

// GET: Check authorization status for an email or passkey
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = (searchParams.get("email") || "").toLowerCase().trim();
  const passkey = searchParams.get("passkey") || "";

  // 1. Passkey check (emergency backdoor for server/system)
  if (passkey && passkey === ADMIN_MASTER_KEY) {
    return NextResponse.json({
      authorized: true,
      role: "owner",
      email: "system@ijcc.in",
      name: "Emergency Master Key",
    });
  }

  if (!email) {
    return NextResponse.json({
      authorized: false,
      status: "none",
      message: "Email required",
    });
  }

  const isAuthorized = isEmailAuthorizedAdmin(email);
  if (isAuthorized) {
    const admin = getAdminRecord(email);
    return NextResponse.json({
      authorized: true,
      status: "active",
      admin,
    });
  }

  const reqRecord = getAccessRequestByEmail(email);
  return NextResponse.json({
    authorized: false,
    status: reqRecord ? reqRecord.status : "unauthorized",
    request: reqRecord || null,
  });
}

// POST: Manage Access Requests & Admins
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // 1. User/Developer Requests Access
    if (action === "request_access") {
      const email = (body.email || "").toLowerCase().trim();
      const name = body.name || email.split("@")[0];
      const reason = body.reason || "";

      if (!email || !email.includes("@")) {
        return NextResponse.json(
          { error: "A valid email address is required." },
          { status: 400 }
        );
      }

      const accessReq = await createAccessRequest(email, name, reason);
      return NextResponse.json({
        success: true,
        message: "Access request submitted to IJCC Administrator.",
        request: accessReq,
      });
    }

    // Check caller permission for admin operations
    const callerEmail = (req.headers.get("x-admin-email") || body.callerEmail || "")
      .toLowerCase()
      .trim();
    const callerKey = req.headers.get("x-admin-key") || body.callerKey || "";

    const isMasterKey = callerKey === ADMIN_MASTER_KEY;
    const isOwnerOrAdmin = isEmailAuthorizedAdmin(callerEmail);

    if (!isMasterKey && !isOwnerOrAdmin) {
      return NextResponse.json(
        { error: "Unauthorized: Administrator permissions required." },
        { status: 403 }
      );
    }

    // 2. Fetch Admin Management Data (Admins list + Pending requests)
    if (action === "get_admin_data") {
      return NextResponse.json({
        admins: getAllAdmins(),
        requests: getAllAccessRequests(),
      });
    }

    // 3. Approve Request
    if (action === "approve_request") {
      const { requestId } = body;
      const success = approveAccessRequest(requestId, callerEmail || "info@ijcc.in");
      if (!success) {
        return NextResponse.json({ error: "Request not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: "Access request approved. User is now an active administrator.",
        admins: getAllAdmins(),
        requests: getAllAccessRequests(),
      });
    }

    // 4. Reject Request
    if (action === "reject_request") {
      const { requestId } = body;
      const success = rejectAccessRequest(requestId, callerEmail || "info@ijcc.in");
      return NextResponse.json({
        success: true,
        message: "Access request rejected.",
        requests: getAllAccessRequests(),
      });
    }

    // 5. Directly Add Admin
    if (action === "add_admin") {
      const email = (body.email || "").toLowerCase().trim();
      const name = body.name || "";
      const role = body.role === "owner" ? "owner" : "admin";

      if (!email || !email.includes("@")) {
        return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
      }

      const newAdmin = addAuthorizedAdmin(email, name, role);
      return NextResponse.json({
        success: true,
        message: `${newAdmin.email} is now an authorized administrator.`,
        admins: getAllAdmins(),
      });
    }

    // 6. Remove Admin
    if (action === "remove_admin") {
      const email = (body.email || "").toLowerCase().trim();
      const success = removeAuthorizedAdmin(email);
      if (!success) {
        return NextResponse.json(
          { error: "Cannot remove primary owner or admin not found." },
          { status: 400 }
        );
      }
      return NextResponse.json({
        success: true,
        message: "Administrator removed.",
        admins: getAllAdmins(),
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error("Admin Auth API error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
