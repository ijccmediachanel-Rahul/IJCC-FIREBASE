export interface MemberRecord {
  id: string; // Firestore document ID
  memberId: string; // Unique Membership ID assigned by Sir (e.g. IJCC-2026-001)
  password: string; // Password assigned by Sir
  name: string; // Company / Individual Name
  email: string; // Email address
  phone: string; // Contact phone / WhatsApp
  tier: string; // Membership Tier (e.g. corporate-standard, sme-standard, student, etc.)
  startDate: string; // ISO date string
  expiryDate: string; // ISO date string (Due date / Expiration date)
  status: "active" | "expired" | "inactive";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberApplicationRecord {
  id: string;
  legalCompanyName: string;
  applicantName: string;
  emailAddress: string;
  mobileNumber: string;
  membershipTier: string;
  city: string;
  state: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  rawDetails?: Record<string, any>;
}

export function isMemberExpired(expiryDate: string | null | undefined): boolean {
  if (!expiryDate) return false;
  const exp = new Date(expiryDate);
  const now = new Date();
  return now.getTime() > exp.getTime();
}

export function calculateExpiryDate(startDate = new Date(), durationMonths = 12): string {
  const d = new Date(startDate);
  d.setMonth(d.getMonth() + durationMonths);
  return d.toISOString();
}
