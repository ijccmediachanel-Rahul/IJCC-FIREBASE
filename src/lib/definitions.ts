
import { z } from 'zod';

export const ContactFormSchema = z.object({
  name: z.string().min(2, { message: "contactForm_validation_name" }),
  email: z.string().email({ message: "contactForm_validation_email" }),
  website: z.string().optional(),
  phone: z.string().optional(),
  inquiryType: z.enum([
    "general", 
    "membership", 
    "events",
    "indian-schools",
    "indian-universities",
    "indian-smes",
    "japanese-smes",
    "company-registration-jp-in",
    "company-registration-in-jp",
    "digital-services",
    "startup-support",
    "management-training"
  ], {
    errorMap: () => ({ message: "contactForm_validation_inquiryType" }),
  }),
  message: z.string().min(10, { message: "contactForm_validation_message" }),
});

export const PAID_MEMBERSHIP_TIERS = [
  "student",
  "individual",
  "startup",
  "sme-standard",
  "sme-plus",
  "corporate-standard",
  "corporate-premium",
  "patron",
  "strategic-platinum"
] as const;

export type PaidMembershipTier = typeof PAID_MEMBERSHIP_TIERS[number];

export function isPaidMember(profile: { membershipTier?: string } | null | undefined): boolean {
  if (!profile || !profile.membershipTier) return false;
  const tier = String(profile.membershipTier).toLowerCase().trim();
  if (tier === "none" || tier === "free" || tier === "" || tier === "null" || tier === "undefined") {
    return false;
  }
  return (PAID_MEMBERSHIP_TIERS as readonly string[]).includes(tier);
}

export const MembershipFormSchema = z.object({
  // Part A
  legalCompanyName: z.string().min(2, "membershipForm_validation_legalCompanyName"),
  entityType: z.enum(["private-ltd", "public-ltd", "llp", "partnership", "proprietorship"], {
    required_error: "membershipForm_validation_entityType",
  }),
  dateOfIncorporation: z.string().min(1, { message: "membershipForm_validation_dateOfIncorporation" }),
  msmeRegistration: z.string().optional(),
  registeredAddress: z.string().min(10, "membershipForm_validation_registeredAddress"),
  city: z.string().min(2, "membershipForm_validation_city"),
  state: z.string().min(2, "membershipForm_validation_state"),
  pincode: z.string().min(6, "membershipForm_validation_pincode_min").max(10, "membershipForm_validation_pincode_max"),
  website: z.string().optional(),
  directors: z.string().min(2, "membershipForm_validation_directors"),
  primaryContactPerson: z.string().min(2, "membershipForm_validation_primaryContactPerson"),
  primaryContactDesignation: z.string().min(2, "membershipForm_validation_primaryContactDesignation"),
  mobileNumber: z.string().min(10, "membershipForm_validation_mobileNumber"),
  emailAddress: z.string().email("membershipForm_validation_emailAddress"),
  membershipTier: z.enum(PAID_MEMBERSHIP_TIERS),

  // Part B
  coreBusinessActivity: z.enum([
    "accounting-finance",
    "manufacturing",
    "it-ites",
    "engineering-automotive",
    "healthcare-pharma",
    "agri-food",
    "textiles-apparel",
    "cleantech-energy",
    "consulting-services",
    "other"
  ], {
    required_error: "membershipForm_validation_coreBusinessActivity",
  }),
  otherBusinessActivity: z.string().optional(),
  annualTurnover: z.enum([
    "less-than-5cr",
    "5-25cr",
    "25-100cr",
    "above-100cr"
  ], {
    required_error: "membershipForm_validation_annualTurnover",
  }),
  japanInterest: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "membershipForm_validation_japanInterest",
  }),
  otherJapanInterest: z.string().optional(),
  companyDescription: z.string().min(50, "membershipForm_validation_companyDescription_min").max(1000, "membershipForm_validation_companyDescription_max"),
  marketObjectives: z.string().min(20, "membershipForm_validation_marketObjectives"),
  
  // Part C
  declaration: z.literal(true, {
    errorMap: () => ({ message: "membershipForm_validation_declaration" }),
  }),
  applicantName: z.string().min(2, "membershipForm_validation_applicantName"),
  applicantDesignation: z.string().min(2, "membershipForm_validation_applicantDesignation"),
  applicantDate: z.string().min(1, { message: "membershipForm_validation_applicantDate" }),

}).refine(data => {
    if (data.coreBusinessActivity === 'other') {
        return !!data.otherBusinessActivity && data.otherBusinessActivity.length > 2;
    }
    return true;
}, {
    message: "membershipForm_validation_otherBusinessActivity",
    path: ["otherBusinessActivity"],
}).refine(data => {
    if (data.japanInterest.includes('other')) {
        return !!data.otherJapanInterest && data.otherJapanInterest.length > 2;
    }
    return true;
}, {
    message: "membershipForm_validation_otherJapanInterest",
    path: ["otherJapanInterest"],
});


export type ContactFormState = {
  message: string;
  errors?: z.ZodError<z.infer<typeof ContactFormSchema>>['formErrors']['fieldErrors'];
  success: boolean;
};

export type MembershipFormState = {
  message: string;
  errors?: z.ZodError<z.infer<typeof MembershipFormSchema>>['formErrors']['fieldErrors'];
  success: boolean;
};

export const RazorpayOrderSchema = z.object({
  amount: z.number().min(100), // Amount in paise, so at least 1 Rupee
  currency: z.string().length(3),
  receipt: z.string(),
});

export const RazorpayVerificationSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});
