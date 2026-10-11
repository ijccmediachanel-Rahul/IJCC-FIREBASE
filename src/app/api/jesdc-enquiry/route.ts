import { NextRequest, NextResponse } from "next/server";
import { doc, setDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type = "enrolment" } = body;

    const timestamp = new Date().toISOString();
    const istTimeStr = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST";

    // ========================================================
    // 1. STUDENT ENROLMENT & COUNSELLING ENQUIRY
    // ========================================================
    if (type === "enrolment") {
      const { name, phone, email, centre, program, message } = body;

      if (!name || !phone) {
        return NextResponse.json(
          { success: false, message: "Name and phone number are required." },
          { status: 400 }
        );
      }

      const enquiryId = `jesdc_enq_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      // A. Save to Firebase Firestore
      try {
        if (db) {
          await setDoc(doc(db, "jesdc_enquiries", enquiryId), {
            id: enquiryId,
            type: "enrolment",
            name,
            phone,
            email: email || "",
            centre: centre || "Nearest Available Centre",
            program: program || "General Consultation",
            message: message || "",
            status: "new",
            createdAt: timestamp,
            createdAtIST: istTimeStr,
          });
          console.log(`[JESDC API] Saved enrolment enquiry ${enquiryId} to Firestore.`);
        }
      } catch (dbErr) {
        console.warn("[JESDC API] Firestore save error (continuing):", dbErr);
      }



      // C. Sync with Separate JESDC Google Sheet Webhook
      const jesdcSheetUrl = process.env.GOOGLE_SHEET_JESDC_URL;
      if (jesdcSheetUrl) {
        try {
          await fetch(jesdcSheetUrl, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({
              formType: "JESDC Enrolment",
              type: "enrolment",
              name,
              phone,
              email: email || "",
              centre: centre || "Nearest Available Centre",
              program: program || "General Consultation",
              message: message || "",
              timestamp: istTimeStr,
              createdAt: timestamp,
            }),
            redirect: "follow",
            signal: AbortSignal.timeout(6000),
          });
          console.log("[JESDC API] Successfully synced enrolment to Separate JESDC Sheet.");
        } catch (sheetErr: any) {
          console.warn("[JESDC API] Separate Sheet sync error:", sheetErr?.message);
        }
      }

      return NextResponse.json({
        success: true,
        message: "Enquiry submitted successfully.",
        enquiryId,
      });
    }

    // ========================================================
    // 2. PARTNER WITH US / OPEN A CENTRE PROPOSAL
    // ========================================================
    if (type === "partner") {
      const { institutionName, contactPerson, phone, email, city, state, message } = body;

      if (!institutionName || !phone) {
        return NextResponse.json(
          { success: false, message: "Institution name and phone are required." },
          { status: 400 }
        );
      }

      const partnerId = `jesdc_ptn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      // A. Save to Firebase Firestore
      try {
        if (db) {
          await setDoc(doc(db, "jesdc_partnerships", partnerId), {
            id: partnerId,
            type: "partner_proposal",
            institutionName,
            contactPerson: contactPerson || "",
            phone,
            email: email || "",
            city: city || "",
            state: state || "",
            message: message || "",
            status: "new",
            createdAt: timestamp,
            createdAtIST: istTimeStr,
          });
          console.log(`[JESDC API] Saved partnership proposal ${partnerId} to Firestore.`);
        }
      } catch (dbErr) {
        console.warn("[JESDC API] Firestore save error (continuing):", dbErr);
      }



      // C. Sync with Separate JESDC Google Sheet Webhook for Partner Proposal
      const jesdcPartnerSheetUrl = process.env.GOOGLE_SHEET_JESDC_URL;
      if (jesdcPartnerSheetUrl) {
        try {
          await fetch(jesdcPartnerSheetUrl, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({
              formType: "JESDC Partner Proposal",
              type: "partner",
              institutionName,
              contactPerson: contactPerson || "",
              phone,
              email: email || "",
              city: city || "",
              state: state || "",
              message: message || "",
              timestamp: istTimeStr,
              createdAt: timestamp,
            }),
            redirect: "follow",
            signal: AbortSignal.timeout(6000),
          });
          console.log(`[JESDC API] Successfully synced partner proposal to Separate JESDC Sheet.`);
        } catch (sheetErr: any) {
          console.warn("[JESDC API] Separate Sheet sync error for partner:", sheetErr?.message);
        }
      }

      return NextResponse.json({
        success: true,
        message: "Partnership application received successfully.",
        partnerId,
      });
    }

    return NextResponse.json({ success: false, message: "Invalid form type." }, { status: 400 });
  } catch (error: any) {
    console.error("[JESDC API] Error processing form submission:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}

// ========================================================
// 3. GET ENDPOINT — EXCEL / CSV DYNAMIC EXPORT OR JSON
// ========================================================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format");
    const type = searchParams.get("type") || "enrolment";

    const enquiries: any[] = [];
    if (db) {
      try {
        const colName = type === "partner" ? "jesdc_partnerships" : "jesdc_enquiries";
        const q = query(collection(db, colName), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        snapshot.forEach((d) => {
          enquiries.push({ id: d.id, ...d.data() });
        });
      } catch (err: any) {
        console.warn("[JESDC API GET] Firestore query fallback:", err?.message);
        try {
          const colName = type === "partner" ? "jesdc_partnerships" : "jesdc_enquiries";
          const snapshot = await getDocs(collection(db, colName));
          snapshot.forEach((d) => {
            enquiries.push({ id: d.id, ...d.data() });
          });
        } catch (fbErr) {
          console.error("[JESDC API GET] Firestore fetch error:", fbErr);
        }
      }
    }

    // Export directly as Excel-compatible CSV if format is csv or excel
    if (format === "csv" || format === "excel") {
      let headers: string[] = [];
      let rows: string[][] = [];

      if (type === "partner") {
        headers = [
          "ID",
          "Submission Date (IST)",
          "Institution Name",
          "Contact Person",
          "Phone / Mobile",
          "Email Address",
          "City",
          "State",
          "Message / Proposal",
          "Status",
        ];
        rows = enquiries.map((e) => [
          `"${e.id || ""}"`,
          `"${e.createdAtIST || e.createdAt || ""}"`,
          `"${(e.institutionName || "").replace(/"/g, '""')}"`,
          `"${(e.contactPerson || "").replace(/"/g, '""')}"`,
          `"${e.phone || ""}"`,
          `"${e.email || ""}"`,
          `"${e.city || ""}"`,
          `"${e.state || ""}"`,
          `"${(e.message || "").replace(/"/g, '""')}"`,
          `"${e.status || "new"}"`,
        ]);
      } else {
        headers = [
          "ID",
          "Submission Date (IST)",
          "Student Name",
          "Phone / WhatsApp",
          "Email Address",
          "Preferred Centre",
          "Program of Interest",
          "Queries / Career Goals",
          "Status",
        ];
        rows = enquiries.map((e) => [
          `"${e.id || ""}"`,
          `"${e.createdAtIST || e.createdAt || ""}"`,
          `"${(e.name || "").replace(/"/g, '""')}"`,
          `"${e.phone || ""}"`,
          `"${e.email || ""}"`,
          `"${(e.centre || "").replace(/"/g, '""')}"`,
          `"${(e.program || "").replace(/"/g, '""')}"`,
          `"${(e.message || "").replace(/"/g, '""')}"`,
          `"${e.status || "new"}"`,
        ]);
      }

      // Prepend UTF-8 BOM (\uFEFF) so Excel opens UTF-8 characters without corruption
      const csvContent =
        "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="JESDC_${type === "partner" ? "Partnerships" : "Enquiries"}_${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      total: enquiries.length,
      enquiries,
    });
  } catch (err: any) {
    console.error("[JESDC API GET] Error:", err);
    return NextResponse.json({ success: false, message: err?.message }, { status: 500 });
  }
}
