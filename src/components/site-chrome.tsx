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

  // Sanity Studio is a full-viewport app — render it without
  // the site header/footer/widgets so it can scroll and fill the screen.
  if (isStudio) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <main className="flex-grow animate-fade-in">{children}</main>
        <AppFooter />
      </div>
      <Toaster />
      <CookieBanner />
      <ChatWidget />
    </>
  );
}
