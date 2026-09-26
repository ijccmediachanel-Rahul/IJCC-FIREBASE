"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import Link from "next/link";

export interface VerifiedMemberSession {
  memberId: string;
  name: string;
  email?: string;
  tier: string;
  expiryDate: string;
  verifiedAt: number;
}

const STORAGE_SESSION_KEY = "ijcc_member_session_v1";
const STORAGE_LOCKED_KEY = "ijcc_member_locked";

export function getStoredMemberSession(): VerifiedMemberSession | null {
  if (typeof window === "undefined") return null;
  try {
    const isLocked =
      sessionStorage.getItem(STORAGE_LOCKED_KEY) === "true" ||
      localStorage.getItem(STORAGE_LOCKED_KEY) === "true";
    if (isLocked) return null;

    const raw = localStorage.getItem(STORAGE_SESSION_KEY);
    if (!raw) return null;
    const session: VerifiedMemberSession = JSON.parse(raw);
    // Check if session is expired
    if (session.expiryDate && new Date() > new Date(session.expiryDate)) {
      localStorage.removeItem(STORAGE_SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function saveMemberSession(session: VerifiedMemberSession) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_LOCKED_KEY);
    localStorage.removeItem(STORAGE_LOCKED_KEY);
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
  } catch {}
}

export function clearMemberSession() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_SESSION_KEY);
    sessionStorage.setItem(STORAGE_LOCKED_KEY, "true");
    localStorage.setItem(STORAGE_LOCKED_KEY, "true");
  } catch {}
}

export async function syncAndValidateMemberSession(
  userEmail?: string | null
): Promise<VerifiedMemberSession | null> {
  if (typeof window === "undefined") return null;

  const isLocked =
    sessionStorage.getItem(STORAGE_LOCKED_KEY) === "true" ||
    localStorage.getItem(STORAGE_LOCKED_KEY) === "true";

  if (isLocked) {
    return null;
  }

  const current = getStoredMemberSession();
  // IMPORTANT: Do NOT automatically resurrect or create a member session if user locked/exited!
  // Background validation is ONLY for validating an already authenticated active member session.
  if (!current || !current.memberId) {
    return null;
  }

  const queryParam = `memberId=${encodeURIComponent(current.memberId)}`;

  try {
    const res = await fetch(`/api/member-verify?${queryParam}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      clearMemberSession();
      return null;
    }

    const data = await res.json();
    if (!data.active || data.isSuspended || data.expired || data.status === "inactive") {
      clearMemberSession();
      return null;
    }

    // REAL-TIME SECURITY CHECK: If Admin changed or rebound the email to a different account:
    const dbEmail = (data.email || "").trim().toLowerCase();
    const activeEmail = (userEmail || "").trim().toLowerCase();
    if (dbEmail && activeEmail && dbEmail !== activeEmail) {
      clearMemberSession();
      return null;
    }

    const updatedSession: VerifiedMemberSession = {
      memberId: data.memberId || current?.memberId || "",
      name: data.name || current?.name || "",
      email: data.email || current?.email || "",
      tier: data.tier || current?.tier || "corporate-standard",
      expiryDate: data.expiryDate || current?.expiryDate || "",
      verifiedAt: Date.now(),
    };

    saveMemberSession(updatedSession);
    return updatedSession;
  } catch {
    return current;
  }
}

interface MemberAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (session: VerifiedMemberSession) => void;
  targetResourceTitle?: string;
}

export function MemberAccessModal({
  isOpen,
  onClose,
  onSuccess,
  targetResourceTitle,
}: MemberAccessModalProps) {
  const { language } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const isJa = language === "ja";

  const [memberId, setMemberId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [emailMismatch, setEmailMismatch] = useState<boolean>(false);
  const [expiredInfo, setExpiredInfo] = useState<{ expired: boolean; expiryDate: string } | null>(
    null
  );

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId.trim() || !password.trim()) {
      setErrorMsg(
        isJa
          ? "会員IDとパスワードの両方を入力してください。"
          : "Please enter both Membership ID and Password."
      );
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setEmailMismatch(false);
    setExpiredInfo(null);

    try {
      const res = await fetch("/api/member-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: memberId.trim(),
          password: password.trim(),
          currentUserEmail: user?.email || "",
          currentUid: user?.uid || "",
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.member) {
        const session: VerifiedMemberSession = {
          memberId: data.member.memberId,
          name: data.member.name,
          email: data.member.email,
          tier: data.member.tier,
          expiryDate: data.member.expiryDate,
          verifiedAt: Date.now(),
        };

        saveMemberSession(session);

        // Sync to Firebase user profile if logged in
        if (user?.uid) {
          try {
            await setDoc(
              doc(db, "users", user.uid),
              {
                membershipTier: data.member.tier || "corporate-standard",
                memberId: data.member.memberId,
                membershipExpiryDate: data.member.expiryDate,
                isPaidMember: true,
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            );
          } catch (syncErr) {
            console.warn("Could not sync membership to Firebase user profile:", syncErr);
          }
        }

        toast({
          title: isJa ? "会員認証が完了しました！" : "Membership Bound & Verified!",
          description: isJa
            ? `${session.name} 様、アカウント（${session.email || user?.email}）に会員権が連携されました。`
            : `Welcome, ${session.name}! Membership is now verified and bound to ${session.email || user?.email || "your session"}.`,
        });

        onSuccess(session);
        onClose();
      } else {
        if (data.emailMismatch) {
          setEmailMismatch(true);
          setErrorMsg(data.error);
        } else if (data.expired) {
          setExpiredInfo({
            expired: true,
            expiryDate: data.expiryDate,
          });
          setErrorMsg(data.error);
        } else {
          setErrorMsg(
            data.error ||
              (isJa
                ? "無効な会員IDまたはパスワードです。"
                : "Invalid Membership ID or Password. Please check credentials or contact IJCC.")
          );
        }
      }
    } catch (err: any) {
      setErrorMsg(
        isJa
          ? "サーバー通信エラーが発生しました。もう一度お試しください。"
          : "Verification server error. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[92vw] max-w-[430px] max-h-[85vh] sm:max-h-[82vh] overflow-y-auto p-4 sm:p-5 gap-3 shadow-2xl rounded-2xl">
        <DialogHeader className="text-center space-y-1">
          <div className="mx-auto w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-0.5">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <DialogTitle className="text-base sm:text-lg font-headline tracking-tight text-primary">
            {isJa ? "会員限定リソースのアクセス" : "Official Member Verification"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-snug">
            {targetResourceTitle && (
              <span className="font-semibold block text-foreground">
                "{targetResourceTitle}"
              </span>
            )}
            {isJa
              ? "IJCC事務局より発行された会員IDとパスワードを入力してください。"
              : "Enter your registered IJCC Membership ID and Password to verify."}
          </DialogDescription>
        </DialogHeader>

        {/* Logged in User Account Status Banner */}
        {user?.email ? (
          <div className="bg-muted/50 border rounded-lg px-2.5 py-1.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
              <UserCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span className="shrink-0 text-[11px]">Signed in:</span>
              <strong className="text-foreground truncate text-[11px]">{user.email}</strong>
            </div>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-semibold px-2 py-0.5 rounded-full shrink-0 ml-1">
              Active Session
            </span>
          </div>
        ) : (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-1.5">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-[11px]">
              <span>You are not logged in. Please </span>
              <Link href="/login" onClick={onClose} className="font-bold underline text-primary">
                sign in
              </Link>
              <span> to bind your membership.</span>
            </div>
          </div>
        )}

        {/* Error / Alert Display */}
        {errorMsg && (
          <div
            className={`p-2.5 rounded-lg text-xs flex items-start gap-2 ${
              expiredInfo
                ? "bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300"
                : "bg-destructive/10 border border-destructive/20 text-destructive"
            }`}
          >
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1 text-[11px] sm:text-xs">
              <p className="leading-snug">{errorMsg}</p>
              {expiredInfo && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onClose();
                    router.push("/pricing");
                  }}
                  className="h-7 text-[11px] font-semibold bg-white dark:bg-card border-amber-500/40 text-amber-900 dark:text-amber-200 hover:bg-amber-500/20 cursor-pointer flex items-center gap-1 mt-1"
                >
                  <span>{isJa ? "今すぐ更新する" : "Renew Membership"}</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              )}
              {emailMismatch && (
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      router.push("/login");
                    }}
                    className="inline-flex items-center text-[11px] font-bold underline hover:opacity-80 text-primary cursor-pointer mt-1"
                  >
                    Switch to registered account &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-2.5 pt-0.5">
          <div className="space-y-1">
            <Label htmlFor="modal-member-id" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {isJa ? "会員ID (Member ID)" : "Membership ID"}
            </Label>
            <Input
              id="modal-member-id"
              placeholder={isJa ? "例: IJCC-2026-001" : "e.g. IJCC-2026-001"}
              value={memberId}
              onChange={(e) => setMemberId(e.target.value.toUpperCase())}
              className="h-8 sm:h-9 rounded-md font-mono uppercase text-xs sm:text-sm"
              autoFocus
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="modal-password" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {isJa ? "パスワード (Password)" : "Password"}
            </Label>
            <div className="relative">
              <Input
                id="modal-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-8 sm:h-9 rounded-md pr-9 font-mono text-xs sm:text-sm"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-9 text-xs sm:text-sm font-semibold rounded-md shadow-md hover:shadow-lg transition-all mt-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isJa ? "認証中..." : "Verifying & Linking..."}
              </>
            ) : isJa ? (
              "会員権を確認して解除する"
            ) : (
              "Verify & Bind Account"
            )}
          </Button>
        </form>

        <div className="text-center pt-1.5 border-t text-[11px] text-muted-foreground space-y-0.5">
          <p>
            {isJa
              ? "会員IDをお持ちでない、またはパスワードをお忘れですか？"
              : "Don't have a Member ID or forgot password?"}
          </p>
          <div className="flex justify-center gap-3 font-semibold text-primary">
            <button
              type="button"
              onClick={() => {
                onClose();
                router.push("/pricing");
              }}
              className="hover:underline cursor-pointer"
            >
              {isJa ? "会員申込" : "Apply for Membership"}
            </button>
            <span>•</span>
            <a href="mailto:info@ijcc.in" className="hover:underline">
              {isJa ? "事務局に問い合わせ" : "Contact IJCC Support"}
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
