import { NextRequest, NextResponse } from "next/server";
import { isMemberExpired } from "@/lib/memberships";
import { findMemberById, updateMember } from "@/lib/memberships-store";

export const runtime = "nodejs";

function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return email;
  const [local, domain] = email.split("@");
  if (local.length <= 2) return `${local[0]}*@${domain}`;
  const first = local[0];
  const last = local[local.length - 1];
  const stars = "*".repeat(Math.min(5, Math.max(3, local.length - 2)));
  return `${first}${stars}${last}@${domain}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawMemberId = typeof body?.memberId === "string" ? body.memberId.trim() : "";
    const rawPassword = typeof body?.password === "string" ? body.password.trim() : "";
    const currentUserEmail = typeof body?.currentUserEmail === "string" ? body.currentUserEmail.trim().toLowerCase() : "";
    const currentUid = typeof body?.currentUid === "string" ? body.currentUid.trim() : "";

    if (!rawMemberId || !rawPassword) {
      return NextResponse.json(
        { success: false, error: "Please enter both Membership ID and Password." },
        { status: 400 }
      );
    }

    const matchedDoc = await findMemberById(rawMemberId);

    if (!matchedDoc) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Membership ID or Password. Please check your credentials or contact IJCC.",
        },
        { status: 401 }
      );
    }

    // Check Password match
    if (matchedDoc.password !== rawPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Membership ID or Password. Please check your credentials.",
        },
        { status: 401 }
      );
    }

    // Check Status
    if (matchedDoc.status === "inactive") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your membership access is currently suspended. Please contact IJCC administration at info@ijcc.in.",
        },
        { status: 403 }
      );
    }

    // Check Due Date / Expiry
    if (isMemberExpired(matchedDoc.expiryDate)) {
      const formattedDate = new Date(matchedDoc.expiryDate).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      return NextResponse.json(
        {
          success: false,
          expired: true,
          expiryDate: matchedDoc.expiryDate,
          name: matchedDoc.name,
          error: `Your IJCC membership expired on ${formattedDate}. Please renew your membership to continue accessing exclusive resources.`,
        },
        { status: 403 }
      );
    }

    // -------------------------------------------------------------
    // ACCOUNT & EMAIL BINDING VALIDATION (Security Feature)
    // -------------------------------------------------------------
    const registeredEmail = matchedDoc.email ? matchedDoc.email.trim().toLowerCase() : "";

    if (registeredEmail) {
      // 1. If member record has a registered email:
      if (!currentUserEmail) {
        // User is not logged into any account on the website
        return NextResponse.json(
          {
            success: false,
            requireLogin: true,
            registeredEmailMasked: maskEmail(registeredEmail),
            error: `Security Verification: This Membership ID is registered to ${maskEmail(registeredEmail)}. Please log in with this Google/Email account first to verify access.`,
          },
          { status: 401 }
        );
      }

      if (currentUserEmail !== registeredEmail) {
        // Logged in email does NOT match the registered membership email!
        return NextResponse.json(
          {
            success: false,
            emailMismatch: true,
            currentEmail: currentUserEmail,
            registeredEmailMasked: maskEmail(registeredEmail),
            error: `Security Alert: This Membership ID belongs to account (${maskEmail(registeredEmail)}), but you are logged in as (${currentUserEmail}). Please switch to your registered account.`,
          },
          { status: 403 }
        );
      }
    } else {
      // 2. If member record had no email yet, bind it to this user's email automatically!
      if (currentUserEmail) {
        try {
          await updateMember(matchedDoc.id, {
            email: currentUserEmail,
            notes: (matchedDoc.notes ? matchedDoc.notes + " | " : "") + `Bound to ${currentUserEmail} on ${new Date().toISOString()}`,
          });
          matchedDoc.email = currentUserEmail;
        } catch (e) {
          console.warn("Could not bind email to member doc:", e);
        }
      }
    }

    // Success! Return sanitized member session details
    return NextResponse.json({
      success: true,
      member: {
        id: matchedDoc.id,
        memberId: matchedDoc.memberId,
        name: matchedDoc.name,
        email: matchedDoc.email,
        tier: matchedDoc.tier,
        expiryDate: matchedDoc.expiryDate,
      },
      boundEmail: currentUserEmail || matchedDoc.email,
    });
  } catch (error: any) {
    console.error("Member verification error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Verification server error. Please try again or contact support.",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get("memberId")?.trim();
    const email = searchParams.get("email")?.trim().toLowerCase();

    if (!memberId && !email) {
      return NextResponse.json(
        { active: false, error: "Member ID or email is required" },
        { status: 400 }
      );
    }

    let member: any = null;
    if (memberId) {
      member = await findMemberById(memberId);
    }
    if (!member && email) {
      const { getAllMembers } = await import("@/lib/memberships-store");
      const all = await getAllMembers();
      member = all.find((m) => m.email && m.email.toLowerCase() === email);
    }

    if (!member) {
      return NextResponse.json(
        { active: false, error: "Member record not found" },
        { status: 404 }
      );
    }

    const isExpired = isMemberExpired(member.expiryDate);
    const isSuspended = member.status === "inactive";
    const isActive = !isSuspended && !isExpired;

    return NextResponse.json({
      active: isActive,
      status: member.status,
      isSuspended,
      expired: isExpired,
      expiryDate: member.expiryDate,
      name: member.name,
      email: member.email,
      tier: member.tier,
      memberId: member.memberId,
    });
  } catch (error: any) {
    return NextResponse.json({ active: false, error: error.message }, { status: 500 });
  }
}
