"use client";

import { usePathname } from "next/navigation";
import { AppHeader } from "@/components/header";
import { AppFooter } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { CookieBanner } from "@/components/cookie-banner";
import ChatWidget from "@/components/ChatWidget";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio") ?? false;
  const isAdmin = pathname?.startsWith("/admin") ?? false;
  const isIsolated = isStudio || isAdmin;

  return (
    <>
      {isIsolated ? (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
          {children}
        </div>
      ) : (
        <div className="flex min-h-screen flex-col">
          <AppHeader />
          <main className="flex-grow animate-fade-in">{children}</main>
          <AppFooter />
        </div>
      )}
      <Toaster />
      {!isIsolated && (
        <>
          <CookieBanner />
          <ChatWidget />
        </>
      )}
    </>
  );
}
