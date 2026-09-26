"use client";

import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { doc, getDoc, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Lock, Loader2, ShieldCheck, CheckCircle2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { isPaidMember } from "@/lib/definitions";
import {
  MemberAccessModal,
  getStoredMemberSession,
  clearMemberSession,
  syncAndValidateMemberSession,
  VerifiedMemberSession,
} from "@/components/MemberAccessModal";

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<DocumentData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isProtected, setIsProtected] = useState<boolean | null>(null);
  const [loadingCMS, setLoadingCMS] = useState(true);

  // Custom Member ID & Password Session
  const [memberSession, setMemberSession] = useState<VerifiedMemberSession | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // 1. Initial optimistic load
    setMemberSession(getStoredMemberSession());

    // 2. Real-time background server verification
    const verifyStatus = async () => {
      const fresh = await syncAndValidateMemberSession(user?.email);
      setMemberSession(fresh);
    };

    verifyStatus();

    // 3. Re-verify when user switches back to this tab or every 4 seconds
    window.addEventListener("focus", verifyStatus);
    const interval = setInterval(verifyStatus, 4000);
    return () => {
      window.removeEventListener("focus", verifyStatus);
      clearInterval(interval);
    };
  }, [user?.email]);

  useEffect(() => {
    async function fetchProtection() {
      try {
        const data = await client.fetch(
          groq`*[_type == "resourceItem" && resourceId == "associates"][0]{isProtected}`
        );
        setIsProtected(data?.isProtected ?? false);
      } catch (error) {
        console.error("Failed to fetch protection status from Sanity:", error);
        setIsProtected(false);
      } finally {
        setLoadingCMS(false);
      }
    }
    fetchProtection();
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoadingProfile(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data());
        }
      } catch (error: any) {
        console.warn("Could not fetch user profile (Firestore permissions/offline):", error?.message || error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user, authLoading]);

  const hasMembership = !!memberSession;
  const isLoading = authLoading || loadingProfile || loadingCMS;

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // If CMS has isProtected == true and user has no active membership / credentials
  if (isProtected && !hasMembership) {
    return (
      <div className="container py-16 text-center max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 text-primary">
          <Lock className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-headline font-bold text-foreground">Member-Exclusive Section</h1>
        <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
          This section is exclusively available for active IJCC Members. Please authenticate using the Membership ID & Password provided by IJCC, or apply for membership.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Button
            onClick={() => setIsModalOpen(true)}
            size="lg"
            className="w-full sm:w-auto font-semibold shadow-md gap-2"
          >
            <ShieldCheck className="h-4 w-4" /> Enter Member ID & Password
          </Button>

          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/membership-application">Apply for Membership</Link>
          </Button>
        </div>

        {/* Member Access Modal */}
        <MemberAccessModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={(session) => {
            setMemberSession(session);
            setIsModalOpen(false);
          }}
          targetResourceTitle="Associates & News Portal"
        />
      </div>
    );
  }

  return (
    <>
      {memberSession && (
        <div className="bg-emerald-500/10 border-b border-emerald-500/20 py-2.5 px-4 text-xs">
          <div className="container flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                Verified Member: <strong className="font-semibold">{memberSession.name}</strong> ({memberSession.memberId})
              </span>
            </div>
            <button
              onClick={() => {
                clearMemberSession();
                setMemberSession(null);
              }}
              className="text-muted-foreground hover:text-destructive flex items-center gap-1 font-medium text-[11px]"
            >
              <LogOut className="h-3 w-3" /> Log Out
            </button>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
