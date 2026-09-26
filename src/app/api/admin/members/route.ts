import { NextRequest, NextResponse } from "next/server";
import { MemberRecord, calculateExpiryDate } from "@/lib/memberships";
import {
  getAllMembers,
  saveMember,
  updateMember,
  deleteMember,
  getAllApplications,
  updateApplicationStatus,
} from "@/lib/memberships-store";

import { isEmailAuthorizedAdmin } from "@/lib/admin-auth-store";

export const runtime = "nodejs";

const ADMIN_MASTER_KEY = process.env.ADMIN_MASTER_KEY || "IJCC#Admin2026";

function isAuthorizedAdmin(req: NextRequest): boolean {
  const authHeader = req.headers.get("x-admin-key");
  const emailHeader = (req.headers.get("x-admin-email") || "").toLowerCase().trim();

  if (authHeader && authHeader === ADMIN_MASTER_KEY) {
    return true;
  }
  if (emailHeader && isEmailAuthorizedAdmin(emailHeader)) {
    return true;
  }
  return false;
}

// GET: Fetch all members & pending applications
export async function GET(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const members = await getAllMembers();
    const applications = await getAllApplications();
    return NextResponse.json({ members, applications });
  } catch (err: any) {
    console.error("Admin GET members error:", err);
    return NextResponse.json({ error: err.message || "Failed to load members" }, { status: 500 });
  }
}

// POST: Create a new Member
export async function POST(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      memberId,
      password,
      name,
      email,
      phone,
      tier = "corporate-standard",
      durationMonths = 12,
      notes = "",
      applicationId,
    } = body;

    if (!memberId || !password || !name) {
      return NextResponse.json(
        { error: "Member ID, Password, and Member Name are required." },
        { status: 400 }
      );
    }

    const trimmedId = String(memberId).trim();
    const docId = `mem_${trimmedId.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
    const now = new Date();
    const expiry = calculateExpiryDate(now, Number(durationMonths) || 12);

    const newMember: MemberRecord = {
      id: docId,
      memberId: trimmedId,
      password: String(password).trim(),
      name: String(name).trim(),
      email: String(email || "").trim(),
      phone: String(phone || "").trim(),
      tier: String(tier || "corporate-standard"),
      startDate: now.toISOString(),
      expiryDate: expiry,
      status: "active",
      notes: String(notes || ""),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    await saveMember(newMember);

    // If linked to an application, mark application as approved
    if (applicationId) {
      await updateApplicationStatus(applicationId, "approved", trimmedId);
    }

    return NextResponse.json({ success: true, member: newMember });
  } catch (err: any) {
    console.error("Admin POST member error:", err);
    return NextResponse.json({ error: err.message || "Failed to create member" }, { status: 500 });
  }
}

// PUT: Renew (+1 Year), Update Password/Details, or Toggle Status
export async function PUT(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, action, memberId, password, name, email, phone, tier, status, notes, expiryDate } = body;

    if (!id) {
      return NextResponse.json({ error: "Member document ID is required" }, { status: 400 });
    }

    const now = new Date();

    if (action === "renew") {
      const currentExpiryStr = body.currentExpiryDate;
      const baseDate =
        currentExpiryStr && new Date(currentExpiryStr) > now
          ? new Date(currentExpiryStr)
          : now;

      const newExpiry = calculateExpiryDate(baseDate, 12);
      const updated = await updateMember(id, {
        expiryDate: newExpiry,
        status: "active",
      });

      return NextResponse.json({
        success: true,
        newExpiryDate: newExpiry,
        status: "active",
        member: updated,
      });
    }

    // General update
    const updatePayload: Partial<MemberRecord> = {};
    if (memberId !== undefined) {
      const cleanId = String(memberId).trim().toUpperCase();
      if (!cleanId) {
        return NextResponse.json({ error: "Member ID cannot be empty" }, { status: 400 });
      }
      // Check for duplicate ID among other members
      const allMembers = await getAllMembers();
      const duplicate = allMembers.find(
        (m) => m.id !== id && m.memberId?.trim().toLowerCase() === cleanId.toLowerCase()
      );
      if (duplicate) {
        return NextResponse.json(
          { error: `Member ID "${cleanId}" is already taken by ${duplicate.name}` },
          { status: 409 }
        );
      }
      updatePayload.memberId = cleanId;
    }
    if (password !== undefined) updatePayload.password = String(password).trim();
    if (name !== undefined) updatePayload.name = String(name).trim();
    if (email !== undefined) updatePayload.email = String(email).trim();
    if (phone !== undefined) updatePayload.phone = String(phone).trim();
    if (tier !== undefined) updatePayload.tier = String(tier);
    if (status !== undefined) updatePayload.status = status;
    if (notes !== undefined) updatePayload.notes = String(notes);
    if (expiryDate !== undefined) updatePayload.expiryDate = String(expiryDate);

    const updated = await updateMember(id, updatePayload);
    return NextResponse.json({ success: true, member: updated });
  } catch (err: any) {
    console.error("Admin PUT member error:", err);
    return NextResponse.json({ error: err.message || "Failed to update member" }, { status: 500 });
  }
}

// DELETE: Remove Member
export async function DELETE(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Member ID required" }, { status: 400 });
    }

    await deleteMember(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Admin DELETE member error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete member" }, { status: 500 });
  }
}
