
"use server";

import { z } from "zod";
import { ContactFormSchema, type ContactFormState, RazorpayVerificationSchema, MembershipFormSchema, MembershipFormState } from "./definitions";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function submitMembershipForm(
  values: z.infer<typeof MembershipFormSchema>
): Promise<MembershipFormState> {
  const validatedFields = MembershipFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "membershipForm_toastErrorValidation",
      success: false,
    };
  }

  const data = validatedFields.data;

  // 1. Save Application to Store for Real-time Admin Portal access
  try {
    const { saveApplication } = await import("./memberships-store");
    const appId = `app_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    await saveApplication({
      id: appId,
      legalCompanyName: data.legalCompanyName,
      applicantName: data.applicantName,
      primaryContactPerson: data.primaryContactPerson,
      emailAddress: data.emailAddress,
      mobileNumber: data.mobileNumber,
      membershipTier: data.membershipTier,
      city: data.city,
      state: data.state,
      status: "pending",
      createdAt: new Date().toISOString(),
      rawDetails: data,
    });
  } catch (dbErr) {
    console.warn("Could not save membership application:", dbErr);
  }

  // 2. Send Application Details via Email (Nodemailer)
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

      const mailOptions = {
        from: `"IJCC Membership Portal" <${process.env.SMTP_USER}>`,
        to: receiver,
        replyTo: data.emailAddress,
        subject: `New Membership Application: ${data.legalCompanyName} (${data.membershipTier})`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 650px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #990000; color: #fff; padding: 18px 24px;">
              <h2 style="margin: 0; font-size: 20px;">New Membership Application Submitted</h2>
              <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">IJCC Membership Application Portal</p>
            </div>
            
            <div style="padding: 24px;">
              <h3 style="color: #990000; border-bottom: 2px solid #eee; padding-bottom: 6px; margin-top: 0;">1. Company Details</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 18px; font-size: 14px;">
                <tr><td style="padding: 6px 0; width: 40%; font-weight: bold;">Legal Company Name:</td><td>${data.legalCompanyName}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold;">Entity Type:</td><td>${data.entityType}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold;">Date of Incorporation:</td><td>${data.dateOfIncorporation}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold;">MSME / Reg No:</td><td>${data.msmeRegistration || "N/A"}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold;">Registered Address:</td><td>${data.registeredAddress}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold;">City, State, PIN:</td><td>${data.city}, ${data.state} - ${data.pincode}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold;">Website:</td><td>${data.website || "N/A"}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold;">Directors / Partners:</td><td>${data.directors}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold;">Selected Tier:</td><td style="color: #990000; font-weight: bold;">${data.membershipTier.toUpperCase()}</td></tr>
              </table>

              <h3 style="color: #990000; border-bottom: 2px solid #eee; padding-bottom: 6px;">2. Contact Person</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 18px; font-size: 14px;">
                <tr><td style="padding: 6px 0; width: 40%; font-weight: bold;">Primary Contact:</td><td>${data.primaryContactPerson}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold;">Designation:</td><td>${data.primaryContactDesignation}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold;">Mobile:</td><td>${data.mobileNumber}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td><a href="mailto:${data.emailAddress}">${data.emailAddress}</a></td></tr>
              </table>

              <h3 style="color: #990000; border-bottom: 2px solid #eee; padding-bottom: 6px;">3. Business Profile & Interests</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 18px; font-size: 14px;">
                <tr><td style="padding: 6px 0; width: 40%; font-weight: bold;">Core Activity:</td><td>${data.coreBusinessActivity} ${data.otherBusinessActivity ? `(${data.otherBusinessActivity})` : ''}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold;">Annual Turnover:</td><td>${data.annualTurnover}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold;">Japan Interest:</td><td>${Array.isArray(data.japanInterest) ? data.japanInterest.join(', ') : data.japanInterest} ${data.otherJapanInterest ? `(${data.otherJapanInterest})` : ''}</td></tr>
              </table>

              <div style="margin-bottom: 16px;">
                <strong>Company Description:</strong>
                <p style="background: #f9f9f9; padding: 10px; border-radius: 4px; margin: 6px 0; font-size: 13px;">${data.companyDescription}</p>
              </div>

              <div style="margin-bottom: 16px;">
                <strong>Market Objectives:</strong>
                <p style="background: #f9f9f9; padding: 10px; border-radius: 4px; margin: 6px 0; font-size: 13px;">${data.marketObjectives}</p>
              </div>

              <h3 style="color: #990000; border-bottom: 2px solid #eee; padding-bottom: 6px;">4. Authorized Signatory</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr><td style="padding: 6px 0; width: 40%; font-weight: bold;">Signatory Name:</td><td>${data.applicantName}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold;">Designation:</td><td>${data.applicantDesignation}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold;">Date:</td><td>${data.applicantDate}</td></tr>
              </table>
            </div>
            
            <div style="background-color: #f2f2f2; padding: 12px 24px; font-size: 12px; color: #666; text-align: center;">
              This is an automated notification from Indo-Japan Chamber of Commerce (IJCC) website.
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log("Application email successfully sent to:", receiver);
    } else {
      console.warn("SMTP settings missing; skipping email dispatch.");
    }
  } catch (emailError) {
    console.error("Failed to send application email notification:", emailError);
  }

  // 2. Attempt Sync with Google Sheet Webhook if configured
  const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_WEB_APP_URL;
  if (GOOGLE_SHEET_URL) {
    try {
      const dataForGoogleSheet = {
        ...data,
        dateOfIncorporation: data.dateOfIncorporation,
        applicantDate: data.applicantDate,
        japanInterest: Array.isArray(data.japanInterest) ? data.japanInterest.join(', ') : data.japanInterest,
      };

      const response = await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(dataForGoogleSheet),
        redirect: 'follow',
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        console.warn(`Google Sheet webhook returned status ${response.status}.`);
      } else {
        await response.text();
        console.log("Google Sheet sync completed successfully.");
      }
    } catch (gsError: any) {
      console.warn("Google Sheet sync failed (skipped to avoid blocking submission):", gsError.message || gsError);
    }
  }

  return {
    message: "membershipForm_toastSuccessDescription",
    success: true,
    errors: {},
  };
}

export async function logUserSignupToGoogleSheet(data: {
  uid: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  membershipTier: string;
}) {
  const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_USERS_WEB_APP_URL;
  if (!GOOGLE_SHEET_URL) {
    console.warn("GOOGLE_SHEET_USERS_WEB_APP_URL not configured; skipping signup sheet sync.");
    return { success: false, message: "GOOGLE_SHEET_USERS_WEB_APP_URL not configured" };
  }

  try {
    const payload = {
      type: "USER_SIGNUP",
      ...data,
    };

    const response = await fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
      redirect: "follow",
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.warn(`Google Sheet signup sync returned status ${response.status}.`);
      return { success: false };
    }
    console.log("User signup logged to Google Sheet successfully.");
    return { success: true };
  } catch (error: any) {
    console.warn("Google Sheet signup sync failed (skipped to avoid blocking user):", error.message || error);
    return { success: false };
  }
}

export async function logMembershipPaymentToGoogleSheet(data: {
  uid: string;
  displayName: string;
  email: string;
  phoneNumber?: string;
  membershipTier: string;
  tierTitle: string;
  amount: number;
  paymentId: string;
  orderId: string;
}) {
  const istDateStr = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  // 1. Save directly into Admin Portal Applications store as "Paid Online"
  try {
    const { saveApplication } = await import("./memberships-store");
    const appId = `pay_${data.paymentId || Date.now()}`;
    await saveApplication({
      id: appId,
      legalCompanyName: data.displayName || "Online Member",
      applicantName: data.displayName || "Online Member",
      primaryContactPerson: data.displayName || "Online Member",
      emailAddress: data.email,
      mobileNumber: data.phoneNumber || "",
      membershipTier: data.membershipTier,
      city: "Online Payment (Razorpay)",
      state: `Amount: ₹${data.amount.toLocaleString("en-IN")}`,
      status: "Paid Online",
      createdAt: new Date().toISOString(),
      rawDetails: {
        ...data,
        paidOnline: true,
        paidAtIST: istDateStr,
      },
    });
    console.log("Online payment recorded in Admin Applications store.");
  } catch (storeErr) {
    console.warn("Could not save payment to Admin Applications store:", storeErr);
  }

  // 2. Dispatch Email Alert to Secretariat (if SMTP is configured)
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
        from: `"IJCC Payment Gateway" <${process.env.SMTP_USER}>`,
        to: receiver,
        replyTo: data.email,
        subject: `Online Membership Payment Received: ${data.displayName || data.email} (${data.tierTitle} - ₹${data.amount.toLocaleString("en-IN")})`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 650px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #059669; color: #fff; padding: 18px 24px;">
              <h2 style="margin: 0; font-size: 20px;">✓ Online Membership Payment Received</h2>
              <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.95;">IJCC Razorpay Payment Gateway</p>
            </div>
            
            <div style="padding: 24px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr><td style="padding: 8px 0; font-weight: bold; width: 35%;">Member Name:</td><td>${data.displayName || "N/A"}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td>${data.email}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td>${data.phoneNumber || "N/A"}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Selected Plan:</td><td><strong>${data.tierTitle} (${data.membershipTier})</strong></td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Amount Paid:</td><td><strong style="color: #059669; font-size: 16px;">₹${data.amount.toLocaleString("en-IN")}</strong></td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Razorpay Payment ID:</td><td><code>${data.paymentId}</code></td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Razorpay Order ID:</td><td><code>${data.orderId}</code></td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Date & Time:</td><td>${istDateStr}</td></tr>
              </table>

              <div style="margin-top: 24px; padding: 16px; background-color: #f8fafc; border-radius: 6px; border: 1px dashed #cbd5e1; text-align: center;">
                <p style="margin: 0 0 12px 0; font-size: 13px; color: #64748b;">
                  Action Required: Please log in to the Admin Portal to issue Member ID & Password for this member.
                </p>
                <a href="https://ijcc.in/admin" style="background-color: #0f172a; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block;">
                  Open Admin Portal ➔
                </a>
              </div>
            </div>
          </div>
        `,
      });
      console.log("Payment notification email successfully sent to:", receiver);
    }
  } catch (emailErr) {
    console.warn("Could not send payment notification email:", emailErr);
  }

  // 3. Post to Google Sheet Webhooks (Both Membership Sheet & User Sheet if configured)
  const membershipSheetUrl = process.env.GOOGLE_SHEET_WEB_APP_URL;
  const usersSheetUrl = process.env.GOOGLE_SHEET_USERS_WEB_APP_URL;

  const payload = {
    type: "ONLINE_MEMBERSHIP_PAYMENT",
    legalCompanyName: data.displayName || "Online Member",
    applicantName: data.displayName || "Online Member",
    primaryContactPerson: data.displayName || "Online Member",
    emailAddress: data.email,
    mobileNumber: data.phoneNumber || "",
    membershipTier: data.membershipTier,
    tierTitle: data.tierTitle,
    amount: `₹${data.amount.toLocaleString("en-IN")}`,
    paymentId: data.paymentId,
    orderId: data.orderId,
    status: "PAID_ONLINE",
    paymentDate: istDateStr,
    applicantDate: istDateStr,
    remarks: `Razorpay Payment ID: ${data.paymentId}`,
  };

  const targetUrls = [membershipSheetUrl, usersSheetUrl].filter(Boolean) as string[];

  for (const url of targetUrls) {
    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
        redirect: "follow",
        signal: AbortSignal.timeout(5000),
      });
      console.log("Payment logged successfully to sheet webhook:", url.slice(0, 45) + "...");
    } catch (gsErr: any) {
      console.warn("Payment sync to Google Sheet webhook failed (skipped non-blocking):", gsErr.message || gsErr);
    }
  }

  return { success: true };
}

const OTP_SECRET = process.env.SMTP_PASS || process.env.RAZORPAY_KEY_SECRET || "ijcc-otp-secret-key-2026";

export async function sendSignupOTP(email: string) {
  const trimmedEmail = email.trim().toLowerCase();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
    return { success: false, message: "Please enter a valid email address." };
  }

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("SMTP settings missing for OTP sending.");
    return { success: false, message: "Email service is temporarily unavailable. Please try again later." };
  }

  // Generate secure 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Generate HMAC signature token
  const payloadToSign = `${trimmedEmail}:${otp}:${expiresAt}`;
  const hash = crypto.createHmac("sha256", OTP_SECRET).update(payloadToSign).digest("hex");
  const token = Buffer.from(JSON.stringify({ email: trimmedEmail, expiresAt, hash })).toString("base64");

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Indo-Japan Chamber of Commerce" <${process.env.SMTP_USER}>`,
      to: trimmedEmail,
      subject: `Your IJCC Account Verification Code: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 550px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #990000; color: #fff; padding: 20px; text-align: center;">
            <h2 style="margin: 0; font-size: 22px; font-weight: bold;">Indo-Japan Chamber of Commerce</h2>
            <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9;">Account Email Verification</p>
          </div>
          
          <div style="padding: 28px 24px; text-align: center;">
            <p style="font-size: 15px; margin-top: 0; color: #444;">
              Thank you for signing up with IJCC. Use the following One-Time Password (OTP) to verify your email address:
            </p>
            
            <div style="margin: 24px auto; padding: 14px 28px; background: #fff5f5; border: 2px dashed #990000; border-radius: 8px; display: inline-block;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #990000;">${otp}</span>
            </div>
            
            <p style="font-size: 13px; color: #666; margin: 16px 0 0;">
              This code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.
            </p>
          </div>
          
          <div style="background-color: #f7f7f7; padding: 14px 20px; font-size: 12px; color: #888; text-align: center; border-top: 1px solid #eee;">
            If you did not request this verification, you can safely ignore this email.
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent successfully to: ${trimmedEmail}`);
    return {
      success: true,
      token,
      message: "A 6-digit OTP has been sent to your email address.",
    };
  } catch (error: any) {
    console.error("Failed to send OTP email:", error);
    return {
      success: false,
      message: "Could not send verification email. Please check your email address and try again.",
    };
  }
}

export async function verifySignupOTP(email: string, otp: string, token: string) {
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedOtp = otp.trim();

  if (!trimmedOtp || trimmedOtp.length !== 6) {
    return { success: false, message: "Please enter a valid 6-digit OTP." };
  }

  if (!token) {
    return { success: false, message: "Session expired. Please request a new OTP." };
  }

  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));

    if (decoded.email !== trimmedEmail) {
      return { success: false, message: "Email mismatch. Please request a new OTP." };
    }

    if (Date.now() > decoded.expiresAt) {
      return { success: false, message: "OTP has expired. Please request a new code." };
    }

    const payloadToSign = `${trimmedEmail}:${trimmedOtp}:${decoded.expiresAt}`;
    const expectedHash = crypto.createHmac("sha256", OTP_SECRET).update(payloadToSign).digest("hex");

    if (expectedHash !== decoded.hash) {
      return { success: false, message: "Invalid OTP code. Please check and try again." };
    }

    return {
      success: true,
      message: "Email verified successfully!",
    };
  } catch (err: any) {
    return { success: false, message: "Invalid or corrupted OTP session." };
  }
}

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const validatedFields = ContactFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "contactForm_toastErrorValidation",
      success: false,
    };
  }

  const { name, email, website, phone, inquiryType, message } = validatedFields.data;

  if (!process.env.SMTP_HOST) {
    console.error("SMTP environment variables are not set.");
     return {
      message: "contactForm_toastErrorServerConfig",
      success: false,
      errors: {},
    };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"IJCC Contact Form" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_FORM_RECEIVER,
    subject: `New Contact Form Submission - ${inquiryType}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Website:</strong> ${website || "Not provided"}</p>
      <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
      <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      message: "contactForm_toastSuccessDescription",
      success: true,
      errors: {},
    };
  } catch (error) {
    console.error("Failed to send email:", error);
    return {
      message: "contactForm_toastErrorGeneric",
      success: false,
      errors: {},
    };
  }
}


export async function verifyRazorpayPayment(data: z.infer<typeof RazorpayVerificationSchema>) {
    const validatedFields = RazorpayVerificationSchema.safeParse(data);

    if (!validatedFields.success) {
        return { success: false, message: "Invalid verification data." };
    }
    
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error("Razorpay secret key is not configured.");
      return { success: false, message: "Server configuration error." };
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = validatedFields.data;
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        return { success: true, message: "Payment verified successfully." };
    } else {
        console.error("Razorpay signature mismatch.");
        return { success: false, message: "Payment verification failed." };
    }
}
