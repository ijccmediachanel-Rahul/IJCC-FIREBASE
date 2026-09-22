"use client";

import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { doc, getDoc, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { isPaidMember } from "@/lib/definitions";

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<DocumentData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isProtected, setIsProtected] = useState<boolean | null>(null);
  const [loadingCMS, setLoadingCMS] = useState(true);

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

  const hasMembership = isPaidMember(profile);
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

  // If CMS has isProtected == false, allow full access to everyone!
  if (isProtected && !hasMembership) {
    return (
      <div className="container py-12 text-center">
        <Lock className="h-16 w-16 mx-auto text-muted-foreground" />
        <h1 className="text-3xl font-headline mt-6">Access Denied</h1>
        <p className="mt-4 text-muted-foreground max-w-md mx-auto">
          This resource is exclusive to our members. Please log in and ensure you have an active membership to access the Associates section.
        </p>
        <Button asChild className="mt-8">
          <Link href={user ? "/pricing" : "/login"}>
            {user ? "Upgrade Membership" : "Login or Sign Up"}
          </Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
