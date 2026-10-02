"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  ShieldCheck,
  ShieldAlert,
  Shield,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  RefreshCw,
  Search,
  Download,
  Calendar,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Edit,
  Copy,
  LogOut,
  ExternalLink,
  ChevronDown,
  Sparkles,
  UserCheck,
  Loader2,
  Users,
  KeyRound,
  Send,
  Check,
  X,
  Menu,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { MemberRecord } from "@/lib/memberships";

const ADMIN_STORAGE_KEY = "ijcc_admin_auth_key_v1";
const ADMIN_EMAIL_STORAGE_KEY = "ijcc_admin_email_v1";

// Helper: Calculate End Date dynamically from Start Date and Duration (Months)
function computeEndDate(startDateStr: string, durationMonths: string | number): string {
  if (!startDateStr) return "";
  const parts = startDateStr.split("-");
  if (parts.length !== 3) return "";
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return "";

  const d = new Date(year, month, day);
  const months = parseInt(String(durationMonths), 10);
  if (isNaN(months) || months <= 0) return startDateStr;

  d.setMonth(d.getMonth() + months);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Helper: Get today's local date string as YYYY-MM-DD
function getTodayString(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function AdminMembersDashboard() {
  const { toast } = useToast();
  const { user } = useAuth();

  // Mounting state to prevent browser extension hydration mismatch
  const [mounted, setMounted] = useState<boolean>(false);

  // Authentication & Sanity-Style Access State
  const [adminKey, setAdminKey] = useState<string>("");
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [adminRole, setAdminRole] = useState<string>("admin");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [accessStatus, setAccessStatus] = useState<
    "checking" | "authorized" | "unauthorized" | "pending" | "rejected" | "none"
  >("checking");
  const [accessRequestData, setAccessRequestData] = useState<any>(null);
  const [requestReason, setRequestReason] = useState<string>("");
  const [isSubmittingRequest, setIsSubmittingRequest] = useState<boolean>(false);
  const [manualEmailInput, setManualEmailInput] = useState<string>("");
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState<boolean>(false);
  const [isCheckingPermission, setIsCheckingPermission] = useState<boolean>(false);
  const [permissionCheckMessage, setPermissionCheckMessage] = useState<{
    type: "success" | "pending" | "error";
    text: string;
  } | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Team & Access Dialog State (For Sir)
  const [isTeamModalOpen, setIsTeamModalOpen] = useState<boolean>(false);
  const [adminUsersList, setAdminUsersList] = useState<any[]>([]);
  const [pendingAccessRequests, setPendingAccessRequests] = useState<any[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState<string>("");
  const [newAdminName, setNewAdminName] = useState<string>("");
  const [newAdminRole, setNewAdminRole] = useState<"admin" | "owner">("admin");
  const [isManagingAdmins, setIsManagingAdmins] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Data State
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Delete Member Dialog State
  const [memberToDelete, setMemberToDelete] = useState<MemberRecord | null>(null);
  const [isDeletingMember, setIsDeletingMember] = useState<boolean>(false);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // New Member Form State with Dynamic Start & End Date
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    memberId: "",
    password: "",
    name: "",
    email: "",
    phone: "",
    tier: "corporate-standard",
    startDate: getTodayString(),
    durationMonths: "12",
    endDate: computeEndDate(getTodayString(), "12"),
    notes: "",
    applicationId: "",
  });

  // Edit Member Modal State with Dynamic Start & End Date
  const [editingMember, setEditingMember] = useState<MemberRecord | null>(null);
  const [showEditPassword, setShowEditPassword] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState({
    memberId: "",
    password: "",
    name: "",
    email: "",
    phone: "",
    tier: "",
    startDate: getTodayString(),
    durationMonths: "custom",
    expiryDate: computeEndDate(getTodayString(), "12"),
    status: "active",
    notes: "",
  });

  // Loading & Saving Animation States
  const [isSavingMember, setIsSavingMember] = useState<boolean>(false);
  const [isCreatingMember, setIsCreatingMember] = useState<boolean>(false);
  const [renewingMemberId, setRenewingMemberId] = useState<string | null>(null);

  // WhatsApp / Email Share Modal State
  const [shareModalMember, setShareModalMember] = useState<MemberRecord | null>(null);

  // Show password visibility maps
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // Check stored admin key or active session on mount (Strictly respect logged-out status)
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      // 1. Immediately hydrate members from localStorage cache so the table is never blank
      try {
        const cached = localStorage.getItem("ijcc_admin_members_cache");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMembers(parsed);
          }
        }
      } catch {}

      const isLoggedOut =
        sessionStorage.getItem("ijcc_admin_logged_out") === "true" ||
        localStorage.getItem("ijcc_admin_logged_out") === "true";
      const isSessionActive = sessionStorage.getItem("ijcc_admin_session_active") === "true";
      const storedKey = sessionStorage.getItem(ADMIN_STORAGE_KEY);
      const storedEmail = sessionStorage.getItem(ADMIN_EMAIL_STORAGE_KEY);

      // If user is explicitly logged out OR session is not active, STRICTLY stay on login screen
      if (isLoggedOut || !isSessionActive) {
        setIsAuthenticated(false);
        setAccessStatus("none");
        return;
      }

      if (storedKey) {
        setAdminKey(storedKey);
        setIsAuthenticated(true);
        setAccessStatus("authorized");
        fetchData(storedKey, storedEmail || "");
        fetchTeamData(storedKey, storedEmail || "");
        return;
      }

      if (storedEmail) {
        // Re-verify in background while maintaining active session
        fetch(`/api/admin/auth?email=${encodeURIComponent(storedEmail.trim().toLowerCase())}`)
          .then((r) => r.json())
          .then((data) => {
            if (data.authorized) {
              setAdminEmail(storedEmail.trim().toLowerCase());
              setAdminRole(data.admin?.role || "admin");
              setIsAuthenticated(true);
              setAccessStatus("authorized");
              fetchData("", storedEmail.trim().toLowerCase());
              fetchTeamData("", storedEmail.trim().toLowerCase());
            } else {
              handleLogout();
            }
          })
          .catch(() => {
            handleLogout();
          });
        return;
      }
    }

    setIsAuthenticated(false);
    setAccessStatus("none");
  }, []);

  // Verify and authenticate a verified Google account
  const verifyAndLoginGoogleUser = async (emailToCheck: string) => {
    if (!emailToCheck) {
      setAccessStatus("none");
      return;
    }
    setAccessStatus("checking");
    setAuthError(null);
    try {
      const res = await fetch(`/api/admin/auth?email=${encodeURIComponent(emailToCheck.trim().toLowerCase())}`);
      const data = await res.json();
      if (data.authorized) {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("ijcc_admin_logged_out");
          localStorage.removeItem("ijcc_admin_logged_out");
          sessionStorage.setItem("ijcc_admin_session_active", "true");
          sessionStorage.setItem(ADMIN_EMAIL_STORAGE_KEY, emailToCheck.trim().toLowerCase());
        }
        setIsAuthenticated(true);
        setAdminEmail(emailToCheck.trim().toLowerCase());
        setAdminRole(data.admin?.role || "admin");
        setAccessStatus("authorized");
        fetchData(adminKey, emailToCheck.trim().toLowerCase());
        fetchTeamData(adminKey, emailToCheck.trim().toLowerCase());
      } else {
        // Sign out unauthorized user from Firebase Auth
        try {
          await auth.signOut();
        } catch {}
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("ijcc_admin_session_active");
          sessionStorage.removeItem(ADMIN_EMAIL_STORAGE_KEY);
        }
        setIsAuthenticated(false);
        setAdminEmail(emailToCheck.trim().toLowerCase());
        setAccessStatus(data.status || "unauthorized");
        setAccessRequestData(data.request || null);
      }
    } catch {
      setAccessStatus("none");
    }
  };

  // 1-Click Official Google Sign-In (Sanity Studio pattern)
  const handleGoogleSignIn = async () => {
    setIsGoogleSigningIn(true);
    setAuthError(null);
    setPermissionCheckMessage(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      const authedUser = result.user;
      if (authedUser?.email) {
        await verifyAndLoginGoogleUser(authedUser.email);
      }
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user" && err.code !== "auth/cancelled-popup-request") {
        setAuthError(err.message || "Google sign-in was cancelled or failed.");
      }
    } finally {
      setIsGoogleSigningIn(false);
    }
  };

  // Check email permission status ONLY without authenticating or granting dashboard access
  const handleCheckPermissionOnly = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailToCheck = manualEmailInput.trim().toLowerCase();
    if (!emailToCheck) return;

    setIsCheckingPermission(true);
    setPermissionCheckMessage(null);
    setAuthError(null);

    try {
      const res = await fetch(`/api/admin/auth?email=${encodeURIComponent(emailToCheck)}`);
      const data = await res.json();

      if (data.authorized) {
        setPermissionCheckMessage({
          type: "success",
          text: `✓ ${emailToCheck} is an Authorized ${data.admin?.role === "owner" ? "Owner" : "Administrator"}. Please click "Continue with Google" above with this account to log in.`,
        });
      } else if (data.status === "pending") {
        setAdminEmail(emailToCheck);
        setAccessRequestData(data.request || null);
        setAccessStatus("pending");
      } else {
        setAdminEmail(emailToCheck);
        setAccessRequestData(data.request || null);
        setAccessStatus("unauthorized");
      }
    } catch {
      setPermissionCheckMessage({
        type: "error",
        text: "Could not check permission status. Please check your network connection.",
      });
    } finally {
      setIsCheckingPermission(false);
    }
  };

  // Fetch Team & Access Requests Data (for Sir)
  const fetchTeamData = async (keyToUse = adminKey, emailToUse = adminEmail) => {
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get_admin_data",
          callerEmail: emailToUse,
          callerKey: keyToUse,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAdminUsersList(data.admins || []);
        setPendingAccessRequests(
          (data.requests || []).filter((r: any) => r.status === "pending")
        );
      }
    } catch {
      // Non-blocking team data sync
    }
  };

  // Helper to ensure request headers ALWAYS have admin credentials
  const getAdminHeaders = (extraHeaders?: Record<string, string>) => {
    const headers: Record<string, string> = { ...extraHeaders };
    const key =
      adminKey ||
      (typeof window !== "undefined"
        ? sessionStorage.getItem(ADMIN_STORAGE_KEY) || localStorage.getItem(ADMIN_STORAGE_KEY)
        : "") ||
      "IJCC#Admin2026";
    const email =
      adminEmail ||
      (typeof window !== "undefined"
        ? sessionStorage.getItem(ADMIN_EMAIL_STORAGE_KEY) || localStorage.getItem(ADMIN_EMAIL_STORAGE_KEY)
        : "") ||
      user?.email ||
      "";
    if (key) headers["x-admin-key"] = key;
    if (email) headers["x-admin-email"] = email;
    return headers;
  };

  // Fetch data when authenticated
  const fetchData = async (keyToUse = adminKey, emailToUse = adminEmail) => {
    if (!keyToUse && !emailToUse && !adminKey && !adminEmail) {
      const storedKey = typeof window !== "undefined" ? sessionStorage.getItem(ADMIN_STORAGE_KEY) || localStorage.getItem(ADMIN_STORAGE_KEY) : "";
      const storedEmail = typeof window !== "undefined" ? sessionStorage.getItem(ADMIN_EMAIL_STORAGE_KEY) || localStorage.getItem(ADMIN_EMAIL_STORAGE_KEY) : "";
      if (!storedKey && !storedEmail && !user?.email) return;
    }
    setLoading(true);
    try {
      const headers = getAdminHeaders();
      if (keyToUse) headers["x-admin-key"] = keyToUse;
      if (emailToUse) headers["x-admin-email"] = emailToUse;

      const res = await fetch("/api/admin/members", { headers });
      if (res.status === 401) {
        setIsAuthenticated(false);
        sessionStorage.removeItem(ADMIN_STORAGE_KEY);
        sessionStorage.removeItem(ADMIN_EMAIL_STORAGE_KEY);
        setAuthError("Session expired or unauthorized. Please verify permissions.");
        return;
      }
      const data = await res.json();
      const serverMembers: MemberRecord[] = data.members || [];

      // Update state and cache with authoritative server list
      setMembers(serverMembers);
      try {
        localStorage.setItem("ijcc_admin_members_cache", JSON.stringify(serverMembers));
      } catch {}

      setApplications(data.applications || []);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error fetching data",
        description: err.message || "Failed to load members from server.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle User Requesting Access (Sanity-style)
  const handleRequestAccess = async () => {
    const emailToReq = user?.email || manualEmailInput.trim().toLowerCase();
    if (!emailToReq) {
      toast({ variant: "destructive", title: "Email required" });
      return;
    }

    setIsSubmittingRequest(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "request_access",
          email: emailToReq,
          name: user?.displayName || emailToReq.split("@")[0],
          reason: requestReason.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit request");

      setAccessStatus("pending");
      setAccessRequestData(data.request);
      toast({
        title: "Access Request Sent! ✓",
        description: "Your request has been sent to the IJCC Administrator (Sir).",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Request Failed",
        description: err.message,
      });
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  // Handle Team Operations (Approve / Reject / Add / Remove)
  const handleApproveRequest = async (requestId: string) => {
    setIsManagingAdmins(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "approve_request",
          requestId,
          callerEmail: adminEmail,
          callerKey: adminKey,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Approval failed");

      setAdminUsersList(data.admins || []);
      setPendingAccessRequests(
        (data.requests || []).filter((r: any) => r.status === "pending")
      );
      toast({
        title: "Access Approved! ✓",
        description: "User is now an authorized administrator.",
      });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setIsManagingAdmins(false);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    setIsManagingAdmins(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reject_request",
          requestId,
          callerEmail: adminEmail,
          callerKey: adminKey,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");

      setPendingAccessRequests(
        (data.requests || []).filter((r: any) => r.status === "pending")
      );
      toast({ title: "Request Rejected" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setIsManagingAdmins(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;

    setIsManagingAdmins(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_admin",
          email: newAdminEmail.trim().toLowerCase(),
          name: newAdminName.trim(),
          role: newAdminRole,
          callerEmail: adminEmail,
          callerKey: adminKey,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add admin");

      setAdminUsersList(data.admins || []);
      setNewAdminEmail("");
      setNewAdminName("");
      toast({
        title: "Administrator Added! ✓",
        description: `${data.message}`,
      });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setIsManagingAdmins(false);
    }
  };

  const handleRemoveAdmin = async (email: string) => {
    if (!confirm(`Are you sure you want to remove administrator permissions for ${email}?`)) {
      return;
    }
    setIsManagingAdmins(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "remove_admin",
          email,
          callerEmail: adminEmail,
          callerKey: adminKey,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove");

      setAdminUsersList(data.admins || []);
      toast({ title: "Administrator Removed" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setIsManagingAdmins(false);
    }
  };

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("ijcc_admin_logged_out", "true");
      localStorage.setItem("ijcc_admin_logged_out", "true");
      sessionStorage.removeItem("ijcc_admin_session_active");
      sessionStorage.removeItem(ADMIN_STORAGE_KEY);
      sessionStorage.removeItem(ADMIN_EMAIL_STORAGE_KEY);
      localStorage.removeItem(ADMIN_STORAGE_KEY);
      localStorage.removeItem(ADMIN_EMAIL_STORAGE_KEY);
    }
    setAdminKey("");
    setAdminEmail("");
    setIsAuthenticated(false);
    setManualEmailInput("");
    setAccessStatus("none");
    setPermissionCheckMessage(null);
    setAuthError(null);
    try {
      await auth.signOut();
    } catch {}
    toast({
      title: "Signed Out",
      description: "You have been securely logged out of the IJCC Administration Studio.",
    });
  };

  // Helper generators
  const generateRandomId = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(100 + Math.random() * 900);
    return `IJCC-${year}-${randomNum}`;
  };

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let pwd = "";
    for (let i = 0; i < 6; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `Ijcc@${pwd}`;
  };

  // Handle Create Member
  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.memberId || !formData.password || !formData.name) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Member ID, Password, and Name are required.",
      });
      return;
    }

    setIsCreatingMember(true);
    try {
      const headers = getAdminHeaders({
        "Content-Type": "application/json",
      });

      const res = await fetch("/api/admin/members", {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...formData,
          startDate: formData.startDate ? new Date(formData.startDate).toISOString() : new Date().toISOString(),
          endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
          expiryDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create member");

      const createdMember: MemberRecord = data.member;

      // 1. Immediately update UI state and localStorage so member NEVER disappears
      setMembers((prev) => {
        const filtered = prev.filter(
          (m) => m.id !== createdMember.id && m.memberId !== createdMember.memberId
        );
        const updated = [createdMember, ...filtered];
        try {
          localStorage.setItem("ijcc_admin_members_cache", JSON.stringify(updated));
        } catch {}
        return updated;
      });

      // 2. Also try client-side Firestore sync (since admin user is authenticated in browser)
      try {
        const { doc, setDoc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        await setDoc(doc(db, "memberships", createdMember.id), createdMember, { merge: true });
      } catch (fsErr) {
        console.warn("Client Firestore sync notice:", fsErr);
      }

      toast({
        title: "Member Created Successfully!",
        description: `${createdMember.name} (ID: ${createdMember.memberId}) is now active.`,
      });

      setShareModalMember(createdMember);
      const today = getTodayString();
      setFormData({
        memberId: "",
        password: "",
        name: "",
        email: "",
        phone: "",
        tier: "corporate-standard",
        startDate: today,
        durationMonths: "12",
        endDate: computeEndDate(today, "12"),
        notes: "",
        applicationId: "",
      });
      setIsFormOpen(false);
      await fetchData();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: err.message,
      });
    } finally {
      setIsCreatingMember(false);
    }
  };

  // Handle 1-Click Renewal (+1 Year)
  const handleRenewMember = async (member: MemberRecord) => {
    setRenewingMemberId(member.id);
    try {
      const headers = getAdminHeaders({
        "Content-Type": "application/json",
      });

      const res = await fetch("/api/admin/members", {
        method: "PUT",
        headers,
        body: JSON.stringify({
          id: member.id,
          action: "renew",
          currentExpiryDate: member.expiryDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Renewal failed");

      // Optimistic update
      setMembers((prev) => {
        const updated = prev.map((m) =>
          m.id === member.id
            ? { ...m, expiryDate: data.newExpiryDate, status: "active" as const, updatedAt: new Date().toISOString() }
            : m
        );
        try {
          localStorage.setItem("ijcc_admin_members_cache", JSON.stringify(updated));
        } catch {}
        return updated;
      });

      // Client Firestore sync
      try {
        const { doc, setDoc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        await setDoc(
          doc(db, "memberships", member.id),
          { expiryDate: data.newExpiryDate, status: "active", updatedAt: new Date().toISOString() },
          { merge: true }
        );
      } catch {}

      const newDateStr = new Date(data.newExpiryDate).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      toast({
        title: "Membership Renewed! (+1 Year)",
        description: `${member.name} is now active until ${newDateStr}.`,
      });

      await fetchData();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Renewal Failed",
        description: err.message,
      });
    } finally {
      setRenewingMemberId(null);
    }
  };

  // Handle Edit Member
  const handleEditSave = async () => {
    if (!editingMember) return;
    setIsSavingMember(true);
    try {
      const headers = getAdminHeaders({
        "Content-Type": "application/json",
      });

      const res = await fetch("/api/admin/members", {
        method: "PUT",
        headers,
        body: JSON.stringify({
          id: editingMember.id,
          memberId: editFormData.memberId,
          password: editFormData.password,
          email: editFormData.email.trim().toLowerCase(),
          startDate: editFormData.startDate ? new Date(editFormData.startDate).toISOString() : undefined,
          expiryDate: editFormData.expiryDate ? new Date(editFormData.expiryDate).toISOString() : undefined,
          status: editFormData.status,
          notes: editFormData.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      if (data.member) {
        setMembers((prev) => {
          const updated = prev.map((m) => (m.id === data.member.id ? data.member : m));
          try {
            localStorage.setItem("ijcc_admin_members_cache", JSON.stringify(updated));
          } catch {}
          return updated;
        });

        // Client Firestore sync
        try {
          const { doc, setDoc } = await import("firebase/firestore");
          const { db } = await import("@/lib/firebase");
          await setDoc(doc(db, "memberships", data.member.id), data.member, { merge: true });
        } catch {}
      }

      toast({
        title: "Member Updated",
        description: "Credentials and details have been saved.",
      });

      setEditingMember(null);
      await fetchData();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: err.message,
      });
    } finally {
      setIsSavingMember(false);
    }
  };

  // Open Delete Confirmation Dialog
  const handleDeleteMember = (member: MemberRecord) => {
    setMemberToDelete(member);
  };

  // Confirm and Execute Delete Member (Permanent & Instant)
  const confirmDeleteMember = async () => {
    if (!memberToDelete) return;
    const member = memberToDelete;
    setIsDeletingMember(true);

    try {
      const headers = getAdminHeaders();

      // Optimistic delete: immediately remove from state and cache
      setMembers((prev) => {
        const updated = prev.filter((m) => m.id !== member.id && m.memberId !== member.memberId);
        try {
          localStorage.setItem("ijcc_admin_members_cache", JSON.stringify(updated));
        } catch {}
        return updated;
      });

      const res = await fetch(`/api/admin/members?id=${encodeURIComponent(member.id)}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Delete failed");
      }

      // Client Firestore delete
      try {
        const { doc, deleteDoc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        await deleteDoc(doc(db, "memberships", member.id));
        if (member.memberId && member.memberId !== member.id) {
          await deleteDoc(doc(db, "memberships", member.memberId));
        }
      } catch {}

      toast({
        title: "Member Deleted",
        description: `Member ${member.name} (${member.memberId}) has been permanently deleted.`,
      });

      setMemberToDelete(null);
      await fetchData();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: err.message || "Failed to delete member",
      });
    } finally {
      setIsDeletingMember(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (members.length === 0) {
      toast({ title: "No data to export" });
      return;
    }

    const headers = [
      "Member ID",
      "Name",
      "Email",
      "Phone",
      "Tier",
      "Password",
      "Start Date",
      "End Date",
      "Status",
    ];

    const rows = members.map((m) => [
      `"${m.memberId}"`,
      `"${m.name || ""}"`,
      `"${m.email || ""}"`,
      `"${m.phone || ""}"`,
      `"${m.tier || ""}"`,
      `"${m.password || ""}"`,
      `"${m.startDate ? m.startDate.slice(0, 10) : ""}"`,
      `"${m.expiryDate ? m.expiryDate.slice(0, 10) : ""}"`,
      `"${m.status}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `IJCC_Members_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Completed",
      description: "Member directory CSV downloaded.",
    });
  };

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (m.memberId && m.memberId.toLowerCase().includes(q)) ||
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.email && m.email.toLowerCase().includes(q)) ||
        (m.phone && m.phone.toLowerCase().includes(q));

      const isExpired = m.expiryDate && new Date() > new Date(m.expiryDate);
      const computedStatus = isExpired ? "expired" : m.status;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "expired" && isExpired) ||
        (statusFilter === "active" && !isExpired && m.status === "active") ||
        (statusFilter === "inactive" && m.status === "inactive");

      return matchesSearch && matchesStatus;
    });
  }, [members, searchQuery, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    const total = members.length;
    let active = 0;
    let expired = 0;
    const now = new Date();

    members.forEach((m) => {
      if (m.expiryDate && now > new Date(m.expiryDate)) {
        expired++;
      } else if (m.status === "active") {
        active++;
      }
    });

    return { total, active, expired, pending: applications.length };
  }, [members, applications]);

  // Format share message
  const getShareText = (m: MemberRecord) => {
    const formattedStartDate = m.startDate
      ? new Date(m.startDate).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : m.createdAt
      ? new Date(m.createdAt).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "";

    const formattedDate = m.expiryDate
      ? new Date(m.expiryDate).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "1 Year";

    const validityPeriodStr = formattedStartDate
      ? `${formattedStartDate} to ${formattedDate}`
      : formattedDate;

    return `Dear ${m.name},

Welcome to the Indo-Japan Chamber of Commerce (IJCC)!
Here are your official Member Portal credentials to access exclusive chamber resources:

• Membership ID: ${m.memberId}
• Password: ${m.password}
• Category: ${m.tier}
• Validity Period: ${validityPeriodStr}

Access your resources anytime at:
https://ijcc.in/resources

Warm regards,
Indo-Japan Chamber of Commerce (IJCC) Secretariat
Email: info@ijcc.in | Web: www.ijcc.in`;
  };

  const copyToClipboard = (text: string, label = "Credentials copied to clipboard!") => {
    navigator.clipboard.writeText(text);
    toast({ title: label });
  };

  // -----------------------------------------------------------
  // MOUNTED GUARD (Prevents browser extension hydration mismatches)
  // -----------------------------------------------------------
  if (!mounted) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-muted-foreground">Loading Admin Portal...</p>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------
  // AUTHENTICATION SCREEN (Sanity Studio Style Access Control)
  // -----------------------------------------------------------
  if (!isAuthenticated) {
    if (accessStatus === "checking") {
      return (
        <div suppressHydrationWarning className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-muted-foreground">Verifying administrative access...</p>
          </div>
        </div>
      );
    }

    if (accessStatus === "pending") {
      return (
        <div suppressHydrationWarning className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center px-3 py-6 sm:p-4 pb-20 sm:pb-4">
          <Card suppressHydrationWarning className="max-w-md w-full border border-border shadow-xl rounded-2xl overflow-hidden bg-card text-card-foreground">
            <div className="bg-card border-b border-border/80 p-4 sm:p-8 text-center space-y-2">
              <div className="flex items-center justify-center mb-1">
                <img
                  src="https://i.postimg.cc/mkDLyKfN/JPG-LOGO-removebg-preview.png"
                  alt="Indo-Japan Chamber of Commerce"
                  className="h-14 sm:h-16 w-auto object-contain mx-auto"
                />
              </div>
              <h1 className="text-xl sm:text-2xl font-headline font-bold text-foreground tracking-tight break-normal">
                IJCC Administration Studio
              </h1>
              <p className="text-xs text-muted-foreground">Access Permission Request</p>
            </div>

            <CardContent className="p-4 sm:p-8 space-y-5 text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mx-auto">
                <Clock className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <h2 className="text-base sm:text-lg font-bold font-headline text-foreground">Access Request Pending</h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Your request for <strong className="text-foreground font-semibold break-all">{adminEmail || user?.email || manualEmailInput}</strong> has been submitted to the IJCC Administrator (Sir).
                </p>
                <p className="text-[11px] sm:text-xs text-muted-foreground/80">
                  As soon as your email is approved, you will have immediate access to this portal.
                </p>
              </div>

              <div className="pt-2 space-y-2.5">
                <Button
                  onClick={async () => {
                    const email = adminEmail || user?.email || manualEmailInput;
                    if (!email) return;
                    try {
                      const res = await fetch(`/api/admin/auth?email=${encodeURIComponent(email.trim().toLowerCase())}`);
                      const data = await res.json();
                      if (data.authorized) {
                        toast({
                          title: "Access Approved! ✓",
                          description: "Your account is authorized. Please click 'Continue with Google' to sign in.",
                        });
                        setAccessStatus("none");
                      } else {
                        toast({
                          title: "Still Pending",
                          description: "Your request has not been approved by the Administrator yet.",
                        });
                      }
                    } catch {}
                  }}
                  className="w-full h-10 sm:h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs sm:text-sm rounded-full shadow-md px-3"
                >
                  <RefreshCw className="mr-1.5 sm:mr-2 h-4 w-4 shrink-0" /> Check Approval Status
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setAccessStatus("none");
                    setAdminEmail("");
                    sessionStorage.removeItem(ADMIN_EMAIL_STORAGE_KEY);
                  }}
                  className="w-full h-9 sm:h-10 text-muted-foreground hover:text-foreground text-xs rounded-full"
                >
                  Sign in with a different account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (accessStatus === "unauthorized") {
      return (
        <div suppressHydrationWarning className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center px-3 py-6 sm:p-4 pb-20 sm:pb-4">
          <Card suppressHydrationWarning className="max-w-md w-full border border-border shadow-xl rounded-2xl overflow-hidden bg-card text-card-foreground">
            <div className="bg-card border-b border-border/80 p-4 sm:p-8 text-center space-y-2">
              <div className="flex items-center justify-center mb-1">
                <img
                  src="https://i.postimg.cc/mkDLyKfN/JPG-LOGO-removebg-preview.png"
                  alt="Indo-Japan Chamber of Commerce"
                  className="h-14 sm:h-16 w-auto object-contain mx-auto"
                />
              </div>
              <h1 className="text-xl sm:text-2xl font-headline font-bold text-foreground tracking-tight break-normal">
                IJCC Administration Studio
              </h1>
              <p className="text-xs text-muted-foreground">Restricted Access Control</p>
            </div>

            <CardContent className="p-4 sm:p-8 space-y-4 sm:space-y-5">
              <div className="text-center space-y-1.5 sm:space-y-2">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center mx-auto">
                  <ShieldAlert className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <h2 className="text-base sm:text-lg font-bold font-headline text-foreground">Permission Required</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  You are signed in as <strong className="text-foreground font-semibold break-all">{adminEmail || user?.email || manualEmailInput}</strong>, but you do not have permission to access the IJCC Administration Studio.
                </p>
                <p className="text-[11px] text-muted-foreground/80">
                  Ask the project administrator (Sir) to invite you or send an access request below:
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <div className="space-y-1.5">
                  <Label htmlFor="req-reason" className="text-xs font-semibold text-foreground">
                    Reason / Role (Optional)
                  </Label>
                  <Input
                    id="req-reason"
                    placeholder="e.g. Developer access / Secretariat member"
                    value={requestReason}
                    onChange={(e) => setRequestReason(e.target.value)}
                    className="bg-background border-input text-foreground h-9 sm:h-10 rounded-xl text-xs focus-visible:ring-primary"
                  />
                </div>

                <Button
                  onClick={handleRequestAccess}
                  disabled={isSubmittingRequest}
                  className="w-full h-10 sm:h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs sm:text-sm rounded-full shadow-md px-3"
                >
                  {isSubmittingRequest ? (
                    <>
                      <Loader2 className="mr-1.5 sm:mr-2 h-4 w-4 animate-spin shrink-0" /> Submitting Request...
                    </>
                  ) : (
                    <>
                      <Send className="mr-1.5 sm:mr-2 h-4 w-4 shrink-0" /> Request Access from Administrator
                    </>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
                    setAccessStatus("none");
                    setAdminEmail("");
                    sessionStorage.removeItem(ADMIN_EMAIL_STORAGE_KEY);
                  }}
                  className="w-full h-9 text-muted-foreground hover:text-foreground text-xs rounded-full"
                >
                  Use a different account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Default: Google OAuth Login + Work Email Option (Synced with App UI)
    return (
      <div suppressHydrationWarning className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center px-3 py-6 sm:p-4 pb-20 sm:pb-4">
        <Card suppressHydrationWarning className="max-w-md w-full border border-border shadow-xl rounded-2xl overflow-hidden bg-card text-card-foreground">
          <div className="bg-card border-b border-border/80 p-4 sm:p-8 text-center space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-center mb-1">
              <img
                src="https://i.postimg.cc/mkDLyKfN/JPG-LOGO-removebg-preview.png"
                alt="Indo-Japan Chamber of Commerce"
                className="h-14 sm:h-16 w-auto object-contain mx-auto"
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-headline font-bold text-foreground tracking-tight break-normal">
              IJCC Administration Studio
            </h1>
            <p className="text-xs text-muted-foreground">Authorized Personnel Only</p>
          </div>

          <CardContent suppressHydrationWarning className="p-4 sm:p-8 space-y-4 sm:space-y-5">
            {authError && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {permissionCheckMessage && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                  permissionCheckMessage.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                    : permissionCheckMessage.type === "pending"
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400"
                    : "bg-destructive/10 border-destructive/20 text-destructive"
                }`}
              >
                {permissionCheckMessage.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                )}
                <span>{permissionCheckMessage.text}</span>
              </div>
            )}

            {/* 1-Click Google Sign In (Sanity Studio Standard) */}
            <div className="space-y-2.5 sm:space-y-3">
              <Button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleSigningIn}
                className="w-full h-10 sm:h-12 rounded-full text-xs sm:text-sm font-semibold shadow-xs bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white dark:border-slate-700 flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 transition-all cursor-pointer"
              >
                {isGoogleSigningIn ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
                    <span className="truncate">Connecting Google...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span className="truncate">Continue with Google</span>
                  </>
                )}
              </Button>

              <p className="text-[10px] sm:text-[11px] text-center text-muted-foreground leading-tight">
                Sign in with your verified Google account to authenticate
              </p>
            </div>

            {/* Subtle Divider for Non-Google Check */}
            <div className="relative py-1 sm:py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-[10px] font-semibold text-muted-foreground">
                  Or check email permission
                </span>
              </div>
            </div>

            <form onSubmit={handleCheckPermissionOnly} className="space-y-2.5 sm:space-y-3">
              <div className="relative">
                <Input
                  id="admin-email-in"
                  type="email"
                  placeholder="name@example.com"
                  value={manualEmailInput}
                  onChange={(e) => {
                    setManualEmailInput(e.target.value);
                    if (permissionCheckMessage) setPermissionCheckMessage(null);
                  }}
                  className="h-9 sm:h-10 rounded-xl pr-10 bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary text-xs"
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              </div>

              <Button
                type="submit"
                variant="outline"
                disabled={isCheckingPermission}
                className="w-full h-9 sm:h-10 rounded-full text-xs font-semibold px-3"
              >
                {isCheckingPermission ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin shrink-0" /> Checking Permission...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-1.5 h-3.5 w-3.5 shrink-0" /> Check Permission Status
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // -----------------------------------------------------------
  // MAIN ADMIN DASHBOARD
  // -----------------------------------------------------------
  return (
    <div suppressHydrationWarning className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Top Header */}
      <header className="bg-card border-b sticky top-0 z-30 shadow-xs">
        {/* MOBILE HEADER (< 640px) */}
        <div className="sm:hidden px-3.5 py-2.5 flex items-center justify-between gap-2">
          {/* Brand & Portal Title */}
          <div className="flex items-center gap-2 min-w-0">
            <img
              src="https://i.postimg.cc/mkDLyKfN/JPG-LOGO-removebg-preview.png"
              alt="Indo-Japan Chamber of Commerce"
              className="h-8 w-auto object-contain shrink-0"
            />
            <div className="border-l pl-2 py-0.5 min-w-0">
              <div className="font-headline font-bold text-sm leading-tight text-foreground truncate">
                Admin Portal
              </div>
              <div className="text-[10px] text-muted-foreground leading-tight truncate">
                IJCC Membership
              </div>
            </div>
          </div>

          {/* Right: Hamburger Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8.5 w-8.5 p-0 rounded-xl relative shrink-0 border-border bg-card"
                aria-label="Open Admin Menu"
              >
                <Menu className="h-4.5 w-4.5 text-foreground" />
                {pendingAccessRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-600 text-white text-[8px] font-bold flex items-center justify-center">
                    {pendingAccessRequests.length}
                  </span>
                )}
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[85vw] max-w-[320px] p-5 flex flex-col justify-between">
              <div className="space-y-5">
                <SheetHeader className="text-left space-y-1.5 pb-3.5 border-b">
                  <SheetTitle className="font-headline text-base font-bold text-primary flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" /> Admin Controls
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    Admin portal navigation and quick management actions
                  </SheetDescription>
                  {adminEmail && (
                    <div className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <span className="font-medium text-foreground truncate">{adminEmail}</span>
                      <Badge variant="outline" className="text-[9px] h-4 py-0 uppercase shrink-0">
                        {adminRole}
                      </Badge>
                    </div>
                  )}
                </SheetHeader>

                {/* Quick Actions List in Drawer */}
                <div className="space-y-2.5">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      fetchTeamData();
                      setIsTeamModalOpen(true);
                    }}
                    className="w-full justify-start h-11 text-xs font-semibold rounded-xl"
                  >
                    <Users className="h-4 w-4 mr-2.5 text-primary shrink-0" />
                    <span className="flex-1 text-left">Team & Access</span>
                    {pendingAccessRequests.length > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-bold">
                        {pendingAccessRequests.length}
                      </span>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      fetchData();
                    }}
                    disabled={loading}
                    className="w-full justify-start h-11 text-xs font-semibold rounded-xl"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2.5 shrink-0 ${loading ? "animate-spin" : ""}`} />
                    <span>Refresh Database</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleExportCSV();
                    }}
                    className="w-full justify-start h-11 text-xs font-semibold rounded-xl"
                  >
                    <Download className="h-4 w-4 mr-2.5 shrink-0" />
                    <span>Export CSV</span>
                  </Button>
                </div>
              </div>

              {/* Logout Button at Bottom of Drawer */}
              <div className="pt-4 border-t">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full justify-start h-11 text-destructive hover:bg-destructive/10 text-xs font-bold rounded-xl"
                >
                  <LogOut className="h-4 w-4 mr-2.5 shrink-0" />
                  <span>Logout from Portal</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* DESKTOP HEADER (>= 640px) */}
        <div className="hidden sm:flex container px-6 py-3 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="https://i.postimg.cc/mkDLyKfN/JPG-LOGO-removebg-preview.png"
              alt="Indo-Japan Chamber of Commerce"
              className="h-14 sm:h-16 w-auto object-contain"
            />
            <div className="border-l pl-4 py-0.5">
              <h1 className="font-headline font-bold text-lg sm:text-xl leading-tight text-foreground">
                Membership Administration Portal
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage Member IDs, Passwords & Validity Dates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {adminEmail && (
              <div className="hidden lg:flex items-center gap-2 bg-muted/60 px-3 py-1.5 rounded-full border text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium text-foreground">{adminEmail}</span>
                <Badge variant="outline" className="text-[10px] h-4 py-0 uppercase">
                  {adminRole}
                </Badge>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                fetchTeamData();
                setIsTeamModalOpen(true);
              }}
              className="h-9 relative font-medium"
            >
              <Users className="h-3.5 w-3.5 mr-1.5 text-primary" /> Team & Access
              {pendingAccessRequests.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-bold">
                  {pendingAccessRequests.length}
                </span>
              )}
            </Button>

            <Button variant="outline" size="sm" onClick={() => fetchData()} disabled={loading} className="h-9">
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-9">
              <Download className="h-3.5 w-3.5 mr-1.5" /> Export CSV
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="h-9 text-muted-foreground hover:text-destructive">
              <LogOut className="h-3.5 w-3.5 mr-1.5" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-3 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <Card className="border shadow-xs bg-card overflow-hidden">
            <CardContent className="p-2.5 sm:p-4 flex flex-col justify-between gap-1.5 sm:gap-2 h-full">
              <div className="flex items-center justify-between w-full">
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <UserCheck className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                </div>
                <span className="text-base sm:text-2xl font-bold font-headline text-foreground">
                  {stats.total}
                </span>
              </div>
              <div className="text-[11px] sm:text-xs font-medium text-muted-foreground leading-tight">
                Total Members
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-xs bg-card overflow-hidden">
            <CardContent className="p-2.5 sm:p-4 flex flex-col justify-between gap-1.5 sm:gap-2 h-full">
              <div className="flex items-center justify-between w-full">
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                </div>
                <span className="text-base sm:text-2xl font-bold font-headline text-emerald-600">
                  {stats.active}
                </span>
              </div>
              <div className="text-[11px] sm:text-xs font-medium text-muted-foreground leading-tight">
                Active Access
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-xs bg-card overflow-hidden">
            <CardContent className="p-2.5 sm:p-4 flex flex-col justify-between gap-1.5 sm:gap-2 h-full">
              <div className="flex items-center justify-between w-full">
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-600 shrink-0">
                  <Clock className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                </div>
                <span className="text-base sm:text-2xl font-bold font-headline text-rose-600">
                  {stats.expired}
                </span>
              </div>
              <div className="text-[11px] sm:text-xs font-medium text-muted-foreground leading-tight">
                Expired (Due)
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-xs bg-card overflow-hidden">
            <CardContent className="p-2.5 sm:p-4 flex flex-col justify-between gap-1.5 sm:gap-2 h-full">
              <div className="flex items-center justify-between w-full">
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                  <Sparkles className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                </div>
                <span className="text-base sm:text-2xl font-bold font-headline text-amber-600">
                  {stats.pending}
                </span>
              </div>
              <div className="text-[11px] sm:text-xs font-medium text-muted-foreground leading-tight">
                Applications
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar + Search */}
        <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
          <div className="flex flex-col xs:flex-row sm:flex-row items-stretch sm:items-center gap-2 w-full sm:max-w-md">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search by ID, Name, Phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 sm:h-10 bg-card rounded-xl text-xs"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full xs:w-[120px] sm:w-[130px] h-9 sm:h-10 bg-card rounded-xl text-xs shrink-0">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="expired">Expired Only</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => {
              const today = getTodayString();
              setFormData({
                memberId: generateRandomId(),
                password: generateRandomPassword(),
                name: "",
                email: "",
                phone: "",
                tier: "corporate-standard",
                startDate: today,
                durationMonths: "12",
                endDate: computeEndDate(today, "12"),
                notes: "",
                applicationId: "",
              });
              setIsFormOpen(!isFormOpen);
            }}
            className="h-9.5 sm:h-10 rounded-xl shadow-xs font-semibold w-full sm:w-auto text-xs"
          >
            <UserPlus className="mr-1.5 h-3.5 w-3.5 shrink-0" /> Issue New Member Access
          </Button>
        </div>

        {/* ➕ Issue New Member Form (Collapsible Card) */}
        {isFormOpen && (
          <Card className="border-2 border-primary/20 shadow-xl overflow-hidden bg-card animate-in fade-in-50 duration-200">
            <CardHeader className="bg-primary/5 p-3.5 sm:p-6 pb-2.5 sm:pb-4 border-b">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <CardTitle className="text-sm sm:text-xl font-headline text-primary flex items-center gap-1.5 leading-snug">
                    <UserPlus className="h-4 w-4 shrink-0 text-primary" />
                    <span>Issue Member Access</span>
                  </CardTitle>
                  <CardDescription className="text-[11px] sm:text-xs mt-0.5">
                    Create a new member record. Customize ID & password as needed.
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsFormOpen(false)} className="h-7 px-2 text-xs text-muted-foreground shrink-0">
                  Cancel
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleCreateMember} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 items-start">
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between h-5">
                    <Label htmlFor="create-name" className="text-xs font-bold uppercase text-muted-foreground">
                      Member / Company Name *
                    </Label>
                  </div>
                  <Input
                    id="create-name"
                    required
                    placeholder="e.g. Member or Company Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-10 text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between h-5">
                    <Label htmlFor="create-id" className="text-xs font-bold uppercase text-muted-foreground">
                      Membership ID *
                    </Label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, memberId: generateRandomId() })}
                      className="text-[11px] text-primary hover:underline font-semibold leading-none"
                    >
                      🎲 Generate
                    </button>
                  </div>
                  <Input
                    id="create-id"
                    required
                    placeholder="e.g. IJCC-2026-001"
                    value={formData.memberId}
                    onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                    className="h-10 font-mono text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between h-5">
                    <Label htmlFor="create-pass" className="text-xs font-bold uppercase text-muted-foreground">
                      Password *
                    </Label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, password: generateRandomPassword() })}
                      className="text-[11px] text-primary hover:underline font-semibold leading-none"
                    >
                      🎲 Generate
                    </button>
                  </div>
                  <Input
                    id="create-pass"
                    required
                    placeholder="e.g. Pass@2026"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="h-10 font-mono text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between h-5">
                    <Label htmlFor="create-email" className="text-xs font-bold uppercase text-muted-foreground">
                      Email Address
                    </Label>
                  </div>
                  <Input
                    id="create-email"
                    type="email"
                    placeholder="e.g. member@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-10 text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between h-5">
                    <Label htmlFor="create-phone" className="text-xs font-bold uppercase text-muted-foreground">
                      Phone / WhatsApp Number
                    </Label>
                  </div>
                  <Input
                    id="create-phone"
                    placeholder="e.g. +91 98XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-10 text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between h-5">
                    <Label className="text-xs font-bold uppercase text-muted-foreground">Membership Tier</Label>
                  </div>
                  <Select
                    value={formData.tier}
                    onValueChange={(val) => setFormData({ ...formData, tier: val })}
                  >
                    <SelectTrigger className="h-10 text-xs sm:text-sm">
                      <SelectValue placeholder="Select Tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corporate-standard">Corporate Standard</SelectItem>
                      <SelectItem value="corporate-premium">Corporate Premium</SelectItem>
                      <SelectItem value="sme-standard">SME Standard</SelectItem>
                      <SelectItem value="sme-plus">SME Plus</SelectItem>
                      <SelectItem value="startup">Startup</SelectItem>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="patron">Patron / Strategic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Start Date */}
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between h-5">
                    <Label htmlFor="create-start-date" className="text-xs font-bold uppercase text-muted-foreground">
                      Start Date *
                    </Label>
                    <button
                      type="button"
                      onClick={() => {
                        const today = getTodayString();
                        setFormData((prev) => ({
                          ...prev,
                          startDate: today,
                          endDate:
                            prev.durationMonths !== "custom"
                              ? computeEndDate(today, prev.durationMonths)
                              : prev.endDate,
                        }));
                      }}
                      className="text-[11px] text-primary hover:underline font-semibold leading-none"
                    >
                      📅 Today
                    </button>
                  </div>
                  <Input
                    id="create-start-date"
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => {
                      const newStart = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        startDate: newStart,
                        endDate:
                          prev.durationMonths !== "custom" && newStart
                            ? computeEndDate(newStart, prev.durationMonths)
                            : prev.endDate,
                      }));
                    }}
                    className="h-10 font-mono text-xs sm:text-sm"
                  />
                </div>

                {/* Validity Duration */}
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between h-5">
                    <Label htmlFor="create-duration" className="text-xs font-bold uppercase text-muted-foreground">
                      Validity Duration
                    </Label>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      Select Period
                    </span>
                  </div>
                  <Select
                    value={formData.durationMonths}
                    onValueChange={(val) => {
                      setFormData((prev) => ({
                        ...prev,
                        durationMonths: val,
                        endDate:
                          val !== "custom" && prev.startDate
                            ? computeEndDate(prev.startDate, val)
                            : prev.endDate,
                      }));
                    }}
                  >
                    <SelectTrigger id="create-duration" className="h-10 text-xs sm:text-sm">
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Month</SelectItem>
                      <SelectItem value="3">3 Months</SelectItem>
                      <SelectItem value="6">6 Months</SelectItem>
                      <SelectItem value="12">1 Year (12 Months)</SelectItem>
                      <SelectItem value="24">2 Years (24 Months)</SelectItem>
                      <SelectItem value="36">3 Years (36 Months)</SelectItem>
                      <SelectItem value="60">5 Years (60 Months)</SelectItem>
                      <SelectItem value="custom">Custom End Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* End Date (Auto-calculated dynamically from start date + duration) */}
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between h-5">
                    <Label htmlFor="create-end-date" className="text-xs font-bold uppercase text-muted-foreground">
                      End Date (Expiry) *
                    </Label>
                    {formData.durationMonths !== "custom" ? (
                      <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 leading-none">
                        ⚡ Auto-set
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800 leading-none">
                        Custom
                      </span>
                    )}
                  </div>
                  <Input
                    id="create-end-date"
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                        durationMonths: "custom",
                      }));
                    }}
                    className="h-10 font-mono text-xs sm:text-sm"
                  />
                </div>

                {/* Visual Duration & Period Summary Banner */}
                {formData.startDate && formData.endDate && (
                  <div className="md:col-span-2 lg:col-span-3 p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground">
                        Membership Period:{" "}
                        <strong className="font-semibold text-primary">
                          {new Date(formData.startDate).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </strong>{" "}
                        ➔{" "}
                        <strong className="font-semibold text-foreground">
                          {new Date(formData.endDate).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </strong>
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {formData.durationMonths === "custom"
                        ? "Custom Range"
                        : `${formData.durationMonths} Months Duration`}
                    </span>
                  </div>
                )}

                <div className="space-y-1.5 sm:space-y-2 md:col-span-2">
                  <Label htmlFor="create-notes" className="text-xs font-bold uppercase text-muted-foreground">
                    Notes (Optional)
                  </Label>
                  <Input
                    id="create-notes"
                    placeholder="e.g. Paid via Bank Transfer, Ref: UTR-9821..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="h-10 text-xs sm:text-sm"
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-3 pt-2 flex flex-col sm:flex-row justify-end gap-2.5 sm:gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} className="w-full sm:w-auto order-2 sm:order-1">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreatingMember} className="w-full sm:w-auto px-8 font-semibold order-1 sm:order-2">
                    {isCreatingMember ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Member...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Save & Activate Member
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Tabs: Active Directory vs Submitted Applications */}
        <Tabs defaultValue="members" className="w-full space-y-3 sm:space-y-6">
          <TabsList className="grid grid-cols-2 w-full h-9 p-1 bg-card rounded-xl border">
            <TabsTrigger value="members" className="rounded-lg font-semibold py-1.5 px-2 text-[11px] sm:text-sm text-center">
              <span className="hidden sm:inline">All Members Directory</span>
              <span className="sm:hidden">Members</span> ({filteredMembers.length})
            </TabsTrigger>
            <TabsTrigger value="applications" className="rounded-lg font-semibold py-1.5 px-2 text-[11px] sm:text-sm text-center">
              <span className="hidden sm:inline">Pending Applications</span>
              <span className="sm:hidden">Applications</span> ({applications.length})
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: MEMBERS DIRECTORY */}
          <TabsContent value="members" className="space-y-3 sm:space-y-4">
            {/* MOBILE VIEW: RESPONSIVE CARDS */}
            <div className="md:hidden space-y-3">
              {filteredMembers.length === 0 ? (
                <Card className="border shadow-xs bg-card p-8 text-center text-muted-foreground text-xs">
                  No members found matching your search.
                </Card>
              ) : (
                filteredMembers.map((member) => {
                  const isExpired = member.expiryDate && new Date() > new Date(member.expiryDate);
                  const isVisible = visiblePasswords[member.id];
                  const formattedStartDate = member.startDate
                    ? new Date(member.startDate).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : member.createdAt
                    ? new Date(member.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A";
                  const formattedDueDate = member.expiryDate
                    ? new Date(member.expiryDate).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A";

                  return (
                    <Card key={member.id} className="border shadow-xs bg-card p-3.5 space-y-3">
                      {/* Card Header: Member ID & Status */}
                      <div className="flex items-center justify-between gap-2 border-b pb-2.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-mono font-bold text-sm text-primary truncate">
                            {member.memberId}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(member.memberId, "Member ID copied!")}
                            className="text-muted-foreground hover:text-foreground shrink-0 p-1"
                            title="Copy Member ID"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isExpired ? (
                            <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/20 text-[10px] px-1.5 py-0">
                              Expired
                            </Badge>
                          ) : member.status === "active" ? (
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] px-1.5 py-0">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-muted text-muted-foreground text-[10px] px-1.5 py-0">
                              Inactive
                            </Badge>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={renewingMemberId === member.id}
                            onClick={() => handleRenewMember(member)}
                            className="h-6 px-2 text-[10px] font-semibold hover:border-emerald-500 hover:text-emerald-600"
                          >
                            {renewingMemberId === member.id ? (
                              <Loader2 className="h-2.5 w-2.5 animate-spin mr-1 text-primary" />
                            ) : (
                              <RefreshCw className="h-2.5 w-2.5 mr-1" />
                            )}
                            +1 Yr
                          </Button>
                        </div>
                      </div>

                      {/* Member Name & Tier */}
                      <div>
                        <div className="font-bold text-sm text-foreground">{member.name}</div>
                        <div className="text-xs text-muted-foreground capitalize mt-0.5">
                          {member.tier?.replace(/-/g, " ")}
                        </div>
                      </div>

                      {/* Contact Info */}
                      {(member.email || member.phone) && (
                        <div className="space-y-1 text-xs text-muted-foreground pt-1 border-t border-dashed">
                          {member.email && (
                            <a
                              href={`mailto:${member.email}`}
                              className="flex items-center gap-1.5 hover:text-foreground truncate"
                            >
                              <Mail className="h-3 w-3 shrink-0 text-primary" />
                              <span className="truncate">{member.email}</span>
                            </a>
                          )}
                          {member.phone && (
                            <a
                              href={`tel:${member.phone}`}
                              className="flex items-center gap-1.5 hover:text-foreground"
                            >
                              <Phone className="h-3 w-3 shrink-0 text-primary" />
                              <span>{member.phone}</span>
                            </a>
                          )}
                        </div>
                      )}

                      {/* Password & Validity Dates */}
                      <div className="space-y-2 text-xs bg-muted/40 p-2.5 rounded-lg border">
                        <div className="flex items-center justify-between border-b pb-1.5">
                          <span className="text-[10px] text-muted-foreground uppercase font-semibold">Password</span>
                          <div className="flex items-center gap-1.5 font-mono">
                            <span className="text-xs font-semibold select-all">
                              {isVisible ? member.password : "••••••••"}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setVisiblePasswords((prev) => ({
                                  ...prev,
                                  [member.id]: !prev[member.id],
                                }))
                              }
                              className="text-muted-foreground hover:text-foreground p-0.5"
                            >
                              {isVisible ? (
                                <EyeOff className="h-3 w-3" />
                              ) : (
                                <Eye className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-0.5">
                          <div>
                            <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Start Date</span>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Calendar className="h-3 w-3 text-primary shrink-0" />
                              <span className="text-xs text-foreground font-medium">
                                {formattedStartDate}
                              </span>
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] text-muted-foreground block uppercase font-semibold">End Date</span>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
                              <span className={`text-xs ${isExpired ? "text-rose-600 font-bold" : "text-foreground font-medium"}`}>
                                {formattedDueDate}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons Row */}
                      <div className="flex items-center justify-between gap-1.5 pt-1 border-t">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShareModalMember(member)}
                          className="flex-1 h-8 text-xs font-medium"
                        >
                          <Copy className="h-3.5 w-3.5 mr-1 text-primary" /> WhatsApp / Share
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const start = member.startDate
                              ? member.startDate.slice(0, 10)
                              : member.createdAt
                              ? member.createdAt.slice(0, 10)
                              : getTodayString();
                            const end = member.expiryDate
                              ? member.expiryDate.slice(0, 10)
                              : computeEndDate(start, "12");

                            setEditingMember(member);
                            setShowEditPassword(false);
                            setEditFormData({
                              memberId: member.memberId || "",
                              name: member.name || "",
                              password: member.password || "",
                              email: member.email || "",
                              phone: member.phone || "",
                              tier: member.tier || "",
                              startDate: start,
                              durationMonths: "custom",
                              expiryDate: end,
                              status: member.status || "active",
                              notes: member.notes || "",
                            });
                          }}
                          className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteMember(member)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive shrink-0"
                          title="Delete Member"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>

            {/* DESKTOP VIEW: FULL TABLE */}
            <Card className="hidden md:block border-none shadow-sm overflow-hidden bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 border-b text-xs uppercase text-muted-foreground font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">Member ID</th>
                      <th className="py-3.5 px-4">Name / Company</th>
                      <th className="py-3.5 px-4">Contact</th>
                      <th className="py-3.5 px-4">Password</th>
                      <th className="py-3.5 px-4">Start Date</th>
                      <th className="py-3.5 px-4">End Date</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredMembers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-12 text-muted-foreground">
                          No members found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredMembers.map((member) => {
                        const isExpired = member.expiryDate && new Date() > new Date(member.expiryDate);
                        const isVisible = visiblePasswords[member.id];

                        const formattedStartDate = member.startDate
                          ? new Date(member.startDate).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : member.createdAt
                          ? new Date(member.createdAt).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A";

                        const formattedDueDate = member.expiryDate
                          ? new Date(member.expiryDate).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A";

                        return (
                          <tr key={member.id} className="hover:bg-muted/30 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-primary">
                              {member.memberId}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-foreground">{member.name}</div>
                              <div className="text-xs text-muted-foreground capitalize">
                                {member.tier?.replace(/-/g, " ")}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              {member.email && (
                                <a
                                  href={`mailto:${member.email}`}
                                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                                >
                                  <Mail className="h-3 w-3" /> {member.email}
                                </a>
                              )}
                              {member.phone && (
                                <a
                                  href={`tel:${member.phone}`}
                                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mt-0.5"
                                >
                                  <Phone className="h-3 w-3" /> {member.phone}
                                </a>
                              )}
                            </td>
                            <td className="py-3.5 px-4 font-mono">
                              <div className="flex items-center gap-2">
                                <span className="bg-muted px-2 py-0.5 rounded text-xs select-all">
                                  {isVisible ? member.password : "••••••••"}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setVisiblePasswords((prev) => ({
                                      ...prev,
                                      [member.id]: !prev[member.id],
                                    }))
                                  }
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  {isVisible ? (
                                    <EyeOff className="h-3.5 w-3.5" />
                                  ) : (
                                    <Eye className="h-3.5 w-3.5" />
                                  )}
                                </button>
                              </div>
                            </td>
                            {/* Start Date Column */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                                <span className="font-medium text-foreground">{formattedStartDate}</span>
                              </div>
                            </td>
                            {/* End Date Column */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-1.5 text-xs">
                                <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <span className={isExpired ? "text-rose-600 font-bold" : "text-foreground font-medium"}>
                                  {formattedDueDate}
                                </span>
                              </div>
                              {isExpired ? (
                                <span className="text-[10px] text-rose-500 font-semibold block">
                                  Expired
                                </span>
                              ) : (
                                <span className="text-[10px] text-emerald-600 font-medium block">
                                  Active
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              {isExpired ? (
                                <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/20 text-xs">
                                  Expired
                                </Badge>
                              ) : member.status === "active" ? (
                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                                  Active
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-muted text-muted-foreground text-xs">
                                  Inactive
                                </Badge>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={renewingMemberId === member.id}
                                  onClick={() => handleRenewMember(member)}
                                  title="Renew for +1 Year"
                                  className="h-8 text-xs font-semibold hover:border-emerald-500 hover:text-emerald-600 min-w-[70px]"
                                >
                                  {renewingMemberId === member.id ? (
                                    <Loader2 className="h-3 w-3 animate-spin mr-1 text-primary" />
                                  ) : (
                                    <RefreshCw className="h-3 w-3 mr-1" />
                                  )}
                                  +1 Yr
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setShareModalMember(member)}
                                  title="Share Credentials via WhatsApp / Email"
                                  className="h-8 w-8 p-0"
                                >
                                  <Copy className="h-3.5 w-3.5 text-primary" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    const start = member.startDate
                                      ? member.startDate.slice(0, 10)
                                      : member.createdAt
                                      ? member.createdAt.slice(0, 10)
                                      : getTodayString();
                                    const end = member.expiryDate
                                      ? member.expiryDate.slice(0, 10)
                                      : computeEndDate(start, "12");

                                    setEditingMember(member);
                                    setShowEditPassword(false);
                                    setEditFormData({
                                      memberId: member.memberId || "",
                                      name: member.name || "",
                                      password: member.password || "",
                                      email: member.email || "",
                                      phone: member.phone || "",
                                      tier: member.tier || "",
                                      startDate: start,
                                      durationMonths: "custom",
                                      expiryDate: end,
                                      status: member.status || "active",
                                      notes: member.notes || "",
                                    });
                                  }}
                                  title="Edit Member Details"
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteMember(member)}
                                  title="Delete Member"
                                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 2: PENDING APPLICATIONS */}
          <TabsContent value="applications" className="space-y-3 sm:space-y-4">
            {/* MOBILE VIEW FOR APPLICATIONS */}
            <div className="md:hidden space-y-3">
              {applications.length === 0 ? (
                <Card className="border shadow-xs bg-card p-8 text-center text-muted-foreground text-xs">
                  No submitted applications yet.
                </Card>
              ) : (
                applications.map((app) => (
                  <Card key={app.id} className="border shadow-xs bg-card p-3.5 space-y-3">
                    <div className="flex items-center justify-between gap-2 border-b pb-2">
                      <Badge variant={app.status === "approved" ? "outline" : "default"} className="text-xs">
                        {app.status || "Pending"}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "Recent"}
                      </span>
                    </div>

                    <div>
                      <div className="font-bold text-sm text-foreground">{app.legalCompanyName || "N/A"}</div>
                      <div className="text-xs text-muted-foreground">
                        {app.applicantName || app.primaryContactPerson || "N/A"}
                      </div>
                      <div className="text-xs text-muted-foreground capitalize mt-0.5">
                        Tier: {app.membershipTier?.replace(/-/g, " ")}
                      </div>
                    </div>

                    {(app.emailAddress || app.mobileNumber) && (
                      <div className="text-xs text-muted-foreground space-y-0.5 pt-1 border-t border-dashed">
                        {app.emailAddress && <div>{app.emailAddress}</div>}
                        {app.mobileNumber && <div>{app.mobileNumber}</div>}
                      </div>
                    )}

                    {app.status !== "approved" && (
                      <Button
                        size="sm"
                        onClick={() => {
                          const today = getTodayString();
                          setFormData({
                            memberId: generateRandomId(),
                            password: generateRandomPassword(),
                            name: app.legalCompanyName || app.applicantName || "",
                            email: app.emailAddress || "",
                            phone: app.mobileNumber || "",
                            tier: app.membershipTier || "corporate-standard",
                            startDate: today,
                            durationMonths: "12",
                            endDate: computeEndDate(today, "12"),
                            notes: `Approved from online application (${app.id})`,
                            applicationId: app.id,
                          });
                          setIsFormOpen(true);
                          window.scrollTo({ top: 180, behavior: "smooth" });
                        }}
                        className="w-full h-8 text-xs font-semibold"
                      >
                        <UserPlus className="h-3 w-3 mr-1.5" /> Approve & Issue ID
                      </Button>
                    )}
                  </Card>
                ))
              )}
            </div>

            {/* DESKTOP VIEW: FULL APPLICATIONS TABLE */}
            <Card className="hidden md:block border-none shadow-sm overflow-hidden bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 border-b text-xs uppercase text-muted-foreground font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">Company Name</th>
                      <th className="py-3.5 px-4">Applicant</th>
                      <th className="py-3.5 px-4">Contact</th>
                      <th className="py-3.5 px-4">Tier</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {applications.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-muted-foreground">
                          No submitted applications yet.
                        </td>
                      </tr>
                    ) : (
                      applications.map((app) => (
                        <tr key={app.id} className="hover:bg-muted/30">
                          <td className="py-3.5 px-4 font-bold">{app.legalCompanyName || "N/A"}</td>
                          <td className="py-3.5 px-4">{app.applicantName || app.primaryContactPerson || "N/A"}</td>
                          <td className="py-3.5 px-4 text-xs">
                            <div>{app.emailAddress}</div>
                            <div className="text-muted-foreground">{app.mobileNumber}</div>
                          </td>
                          <td className="py-3.5 px-4 capitalize text-xs">{app.membershipTier?.replace(/-/g, " ")}</td>
                          <td className="py-3.5 px-4 text-xs text-muted-foreground">
                            {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "Recent"}
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge variant={app.status === "approved" ? "outline" : "default"}>
                              {app.status || "Pending"}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {app.status !== "approved" && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  const today = getTodayString();
                                  setFormData({
                                    memberId: generateRandomId(),
                                    password: generateRandomPassword(),
                                    name: app.legalCompanyName || app.applicantName || "",
                                    email: app.emailAddress || "",
                                    phone: app.mobileNumber || "",
                                    tier: app.membershipTier || "corporate-standard",
                                    startDate: today,
                                    durationMonths: "12",
                                    endDate: computeEndDate(today, "12"),
                                    notes: `Approved from online application (${app.id})`,
                                    applicationId: app.id,
                                  });
                                  setIsFormOpen(true);
                                  window.scrollTo({ top: 180, behavior: "smooth" });
                                }}
                                className="h-8 text-xs font-semibold"
                              >
                                <UserPlus className="h-3 w-3 mr-1" /> Approve & Issue ID
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* MODAL: SHARE / COPY CREDENTIALS MESSAGE */}
      {shareModalMember && (
        <Dialog open={!!shareModalMember} onOpenChange={(open) => !open && setShareModalMember(null)}>
          <DialogContent className="w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl font-headline text-primary flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                Member Credentials Issued
              </DialogTitle>
              <DialogDescription className="text-xs">
                Copy the text below to send to the member via WhatsApp or Email.
              </DialogDescription>
            </DialogHeader>

            <div className="p-3 sm:p-4 rounded-xl bg-muted/50 font-mono text-xs whitespace-pre-wrap leading-relaxed select-all border max-h-[45vh] overflow-y-auto">
              {getShareText(shareModalMember)}
            </div>

            <DialogFooter className="flex flex-col sm:flex-row justify-between sm:justify-between items-stretch sm:items-center gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() =>
                  copyToClipboard(
                    getShareText(shareModalMember),
                    "WhatsApp/Email text copied to clipboard!"
                  )
                }
                className="w-full sm:w-auto text-xs"
              >
                <Copy className="h-4 w-4 mr-2" /> Copy Full Message
              </Button>
              <Button onClick={() => setShareModalMember(null)} className="w-full sm:w-auto text-xs">
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* MODAL: EDIT MEMBER */}
      {editingMember && (
        <Dialog open={!!editingMember} onOpenChange={(open) => !open && setEditingMember(null)}>
          <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden shadow-2xl">
            <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 border-b bg-muted/20">
              <DialogTitle className="text-base sm:text-lg font-headline text-primary flex items-center gap-2">
                <Edit className="h-4 w-4 sm:h-5 sm:w-5 text-accent shrink-0" />
                Edit Member Access & Credentials
              </DialogTitle>
              <DialogDescription className="text-xs">
                Modify Membership ID format, Password, Due Date, or contact information.
              </DialogDescription>
            </DialogHeader>

            <div className="px-4 sm:px-6 py-3 sm:py-4 space-y-3 sm:space-y-4 overflow-y-auto flex-1">
              {/* Member Identity Profile */}
              <div className="bg-muted/40 border rounded-xl p-3 sm:p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">Company / Member:</span>
                  <span className="font-bold text-foreground truncate max-w-[180px]">{editingMember.name || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">Phone:</span>
                  <span className="text-foreground">{editingMember.phone || "N/A"}</span>
                </div>
                {/* Bound Email Input with Reset Option */}
                <div className="pt-2 border-t space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Bound Google/Login Email
                    </Label>
                    {editFormData.email && (
                      <button
                        type="button"
                        onClick={() => setEditFormData({ ...editFormData, email: "" })}
                        className="text-[10px] text-amber-600 dark:text-amber-400 hover:underline font-semibold"
                        title="Clear binding to let member bind on next login"
                      >
                        Reset / Unbind Email
                      </button>
                    )}
                  </div>
                  <Input
                    type="text"
                    autoComplete="off"
                    value={editFormData.email}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, email: e.target.value.toLowerCase().trim() })
                    }
                    placeholder="e.g. member@company.com"
                    className="font-mono h-8 text-xs bg-background"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    {editFormData.email
                      ? "Only this exact Google account can redeem this Member ID."
                      : "No account bound. The first Google account to log in with this ID & Password will automatically bind."}
                  </p>
                </div>
              </div>

              {/* Row 1: Membership ID & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
                {/* Membership ID Field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Membership ID <span className="text-destructive">*</span>
                    </Label>
                    <button
                      type="button"
                      className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1"
                      onClick={() =>
                        setEditFormData({
                          ...editFormData,
                          memberId: generateRandomId(),
                        })
                      }
                    >
                      <Sparkles className="h-3 w-3" /> 🎲 Auto-ID
                    </button>
                  </div>
                  <Input
                    value={editFormData.memberId}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, memberId: e.target.value.toUpperCase() })
                    }
                    placeholder="e.g. IJCC-2026-001 or IJCC-HONDA"
                    className="font-mono font-bold tracking-wide uppercase h-9 text-xs sm:text-sm"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Password <span className="text-destructive">*</span>
                    </Label>
                    <button
                      type="button"
                      className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1"
                      onClick={() => {
                        setEditFormData({
                          ...editFormData,
                          password: generateRandomPassword(),
                        });
                        setShowEditPassword(true);
                      }}
                    >
                      <Sparkles className="h-3 w-3" /> 🎲 New Pass
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      type={showEditPassword ? "text" : "password"}
                      value={editFormData.password}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, password: e.target.value })
                      }
                      className="font-mono pr-8 h-9 text-xs sm:text-sm"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      title={showEditPassword ? "Hide password" : "Show password"}
                    >
                      {showEditPassword ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 2: Start Date & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-start">
                <div className="space-y-1">
                  <div className="flex items-center justify-between h-5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Start Date
                    </Label>
                    <button
                      type="button"
                      onClick={() => {
                        const today = getTodayString();
                        setEditFormData((prev) => ({
                          ...prev,
                          startDate: today,
                          expiryDate:
                            prev.durationMonths !== "custom"
                              ? computeEndDate(today, prev.durationMonths)
                              : prev.expiryDate,
                        }));
                      }}
                      className="text-[10px] text-primary hover:underline font-semibold leading-none"
                    >
                      📅 Set Today
                    </button>
                  </div>
                  <Input
                    type="date"
                    value={editFormData.startDate}
                    onChange={(e) => {
                      const newStart = e.target.value;
                      setEditFormData((prev) => ({
                        ...prev,
                        startDate: newStart,
                        expiryDate:
                          prev.durationMonths !== "custom" && newStart
                            ? computeEndDate(newStart, prev.durationMonths)
                            : prev.expiryDate,
                      }));
                    }}
                    className="font-mono h-9 text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between h-5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Validity Duration
                    </Label>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      Select Period
                    </span>
                  </div>
                  <Select
                    value={editFormData.durationMonths}
                    onValueChange={(val) => {
                      setEditFormData((prev) => ({
                        ...prev,
                        durationMonths: val,
                        expiryDate:
                          val !== "custom" && prev.startDate
                            ? computeEndDate(prev.startDate, val)
                            : prev.expiryDate,
                      }));
                    }}
                  >
                    <SelectTrigger className="h-9 text-xs sm:text-sm">
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Month</SelectItem>
                      <SelectItem value="3">3 Months</SelectItem>
                      <SelectItem value="6">6 Months</SelectItem>
                      <SelectItem value="12">1 Year (12 Months)</SelectItem>
                      <SelectItem value="24">2 Years (24 Months)</SelectItem>
                      <SelectItem value="36">3 Years (36 Months)</SelectItem>
                      <SelectItem value="60">5 Years (60 Months)</SelectItem>
                      <SelectItem value="custom">Custom End Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 3: End Date & Access Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-start">
                <div className="space-y-1">
                  <div className="flex items-center justify-between h-5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      End Date (Due Date)
                    </Label>
                    {editFormData.durationMonths !== "custom" ? (
                      <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 leading-none">
                        ⚡ Auto-set
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800 leading-none">
                        Custom
                      </span>
                    )}
                  </div>
                  <Input
                    type="date"
                    value={editFormData.expiryDate}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        expiryDate: e.target.value,
                        durationMonths: "custom",
                      }))
                    }
                    className="font-mono h-9 text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between h-5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Access Status
                    </Label>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      Permission
                    </span>
                  </div>
                  <Select
                    value={editFormData.status}
                    onValueChange={(val) => setEditFormData({ ...editFormData, status: val })}
                  >
                    <SelectTrigger className="h-9 text-xs sm:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active (Access Granted)</SelectItem>
                      <SelectItem value="inactive">Inactive / Suspended (Access Blocked)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Edit Modal Duration & Period Summary Banner */}
              {editFormData.startDate && editFormData.expiryDate && (
                <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/20 text-xs flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="text-foreground">
                      Period:{" "}
                      <strong className="font-semibold text-primary">
                        {new Date(editFormData.startDate).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </strong>{" "}
                      ➔{" "}
                      <strong className="font-semibold text-foreground">
                        {new Date(editFormData.expiryDate).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </strong>
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {editFormData.durationMonths === "custom"
                      ? "Custom Range"
                      : `${editFormData.durationMonths} Months`}
                  </span>
                </div>
              )}
            </div>

            <DialogFooter className="px-4 sm:px-6 py-2.5 sm:py-3 border-t bg-muted/20 flex flex-row items-center justify-end gap-2">
              <Button variant="outline" size="sm" disabled={isSavingMember} onClick={() => setEditingMember(null)} className="h-8 text-xs">
                Cancel
              </Button>
              <Button size="sm" onClick={handleEditSave} disabled={isSavingMember} className="h-8 text-xs font-semibold shadow-sm min-w-[120px]">
                {isSavingMember ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* MODAL: TEAM ACCESS & PERMISSIONS (SANITY STYLE) */}
      <Dialog open={isTeamModalOpen} onOpenChange={setIsTeamModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg font-headline font-bold">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
              Administrative Team & Permissions
            </DialogTitle>
            <DialogDescription className="text-xs">
              Manage authorized administrator emails and review access permission requests.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="requests" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4 h-auto p-1 bg-muted/60">
              <TabsTrigger value="requests" className="relative text-[11px] sm:text-xs py-1.5 px-1 truncate">
                <span className="hidden sm:inline">Pending </span>Requests
                {pendingAccessRequests.length > 0 && (
                  <span className="ml-1 px-1 rounded-full bg-red-600 text-white text-[9px] font-bold">
                    {pendingAccessRequests.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="admins" className="text-[11px] sm:text-xs py-1.5 px-1 truncate">
                <span className="hidden sm:inline">Authorized </span>Admins ({adminUsersList.length})
              </TabsTrigger>
              <TabsTrigger value="add" className="text-[11px] sm:text-xs py-1.5 px-1 truncate">
                + Add<span className="hidden sm:inline"> Admin</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: PENDING REQUESTS */}
            <TabsContent value="requests" className="space-y-3">
              {pendingAccessRequests.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground text-sm space-y-1">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                  <p className="font-medium text-foreground">No Pending Access Requests</p>
                  <p className="text-xs">All requests have been reviewed.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {pendingAccessRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-3.5 rounded-xl border bg-muted/30 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-foreground">{req.email}</span>
                          {req.name && (
                            <Badge variant="outline" className="text-[10px]">
                              {req.name}
                            </Badge>
                          )}
                        </div>
                        {req.reason && (
                          <p className="text-xs text-muted-foreground italic">
                            &quot;{req.reason}&quot;
                          </p>
                        )}
                        <p className="text-[10px] text-muted-foreground">
                          Requested: {new Date(req.requestedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button
                          size="sm"
                          disabled={isManagingAdmins}
                          onClick={() => handleApproveRequest(req.id)}
                          className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                        >
                          <Check className="h-3.5 w-3.5 mr-1" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isManagingAdmins}
                          onClick={() => handleRejectRequest(req.id)}
                          className="h-8 text-xs text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3.5 w-3.5 mr-1" /> Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* TAB 2: AUTHORIZED ADMINS */}
            <TabsContent value="admins" className="space-y-3">
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 border-b font-medium text-muted-foreground">
                    <tr>
                      <th className="py-2.5 px-3">Email Address</th>
                      <th className="py-2.5 px-3">Name / Role</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {adminUsersList.map((adm) => (
                      <tr key={adm.id} className="hover:bg-muted/20">
                        <td className="py-2.5 px-3 font-semibold text-foreground">
                          {adm.email}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="capitalize">{adm.name || "Admin"}</span>
                          <span className="ml-1 text-[10px] uppercase font-bold text-muted-foreground">
                            ({adm.role})
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300 bg-emerald-50">
                            Active
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {adm.email !== "info@ijcc.in" ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isManagingAdmins}
                              onClick={() => handleRemoveAdmin(adm.email)}
                              className="h-7 px-2 text-destructive hover:bg-destructive/10 text-xs"
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                            </Button>
                          ) : (
                            <span className="text-[11px] text-muted-foreground italic">Primary Owner</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* TAB 3: ADD ADMINISTRATOR */}
            <TabsContent value="add" className="space-y-4 pt-1">
              <form onSubmit={handleAddAdmin} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="new-admin-email" className="text-xs font-semibold">
                    Administrator Email Address *
                  </Label>
                  <Input
                    id="new-admin-email"
                    type="email"
                    placeholder="e.g. colleague@ijcc.in"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    required
                    className="h-10 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="new-admin-name" className="text-xs font-semibold">
                      Name / Title (Optional)
                    </Label>
                    <Input
                      id="new-admin-name"
                      placeholder="e.g. Tech Lead"
                      value={newAdminName}
                      onChange={(e) => setNewAdminName(e.target.value)}
                      className="h-10 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Role</Label>
                    <Select
                      value={newAdminRole}
                      onValueChange={(val: any) => setNewAdminRole(val)}
                    >
                      <SelectTrigger className="h-10 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="owner">Co-Owner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isManagingAdmins || !newAdminEmail.trim()}
                  className="w-full h-10 font-semibold text-xs mt-2"
                >
                  <UserPlus className="mr-1.5 h-4 w-4" /> Add Administrator
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <DialogFooter className="border-t pt-3">
            <Button variant="outline" size="sm" onClick={() => setIsTeamModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 🗑️ Premium Delete Confirmation Dialog */}
      <Dialog
        open={!!memberToDelete}
        onOpenChange={(open) => !open && !isDeletingMember && setMemberToDelete(null)}
      >
        <DialogContent className="w-[92vw] sm:max-w-md p-0 overflow-hidden bg-card border border-border shadow-2xl rounded-2xl">
          {/* Header Banner */}
          <div className="p-6 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-500/20 shrink-0 shadow-xs">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                  Delete Member
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Are you sure you want to permanently remove this member?
                </DialogDescription>
              </div>
            </div>

            {/* Member Details Mini-Card */}
            {memberToDelete && (
              <div className="mt-4 p-3.5 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-foreground truncate">
                      {memberToDelete.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-background border border-border text-primary font-mono text-[11px] font-semibold">
                      {memberToDelete.memberId}
                    </span>
                  </div>
                  {(memberToDelete.email || memberToDelete.phone) && (
                    <p className="text-xs text-muted-foreground truncate mt-1 flex items-center gap-2">
                      {memberToDelete.email && <span>{memberToDelete.email}</span>}
                      {memberToDelete.email && memberToDelete.phone && <span>•</span>}
                      {memberToDelete.phone && <span>{memberToDelete.phone}</span>}
                    </p>
                  )}
                </div>
                <Badge
                  variant="outline"
                  className={
                    memberToDelete.status === "active"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] uppercase font-semibold shrink-0"
                      : "bg-muted text-muted-foreground text-[10px] uppercase font-semibold shrink-0"
                  }
                >
                  {memberToDelete.status || "Member"}
                </Badge>
              </div>
            )}

            {/* Warning Callout */}
            <div className="mt-3 flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/25 text-xs text-amber-900 dark:text-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-snug">
                This action is <strong>irreversible</strong>. Login credentials and directory access for this member will be permanently deleted.
              </p>
            </div>
          </div>

          {/* Footer Controls */}
          <DialogFooter className="px-6 py-3.5 border-t bg-muted/30 flex flex-row items-center justify-end gap-2.5">
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-4 text-xs font-medium border-border hover:bg-muted text-muted-foreground hover:text-foreground"
              disabled={isDeletingMember}
              onClick={() => setMemberToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="h-9 px-4 text-xs font-semibold bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm transition-all flex items-center gap-1.5"
              disabled={isDeletingMember}
              onClick={confirmDeleteMember}
            >
              {isDeletingMember ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Deleting Member...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Member</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
