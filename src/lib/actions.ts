
"use server";

import { z } from "zod";
import { ContactFormSchema, type ContactFormState, RazorpayVerificationSchema, MembershipFormSchema, MembershipFormState } from "./definitions";
import nodemailer from "nodemailer";
import crypto from "crypto";

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

  // 1. Send Application Details via Email (Nodemailer)
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
