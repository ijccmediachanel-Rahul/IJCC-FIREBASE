
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Landmark, Menu, Instagram, Linkedin, Facebook, ChevronDown, Mail, Handshake, Briefcase, FileSignature, Globe, Building, School, University, Lightbulb, Zap, LogOut, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { auth } from "@/lib/firebase";
import { client } from "@/sanity/lib/client";
import { SERVICES_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { signOut } from "firebase/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LanguageSwitcher } from "./language-switcher";
import { useTranslation } from "@/hooks/use-translation";

const logoUrl = "https://i.postimg.cc/mkDLyKfN/JPG-LOGO-removebg-preview.png";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-x-2">
            {icon && <div className="mt-1">{icon}</div>}
            <div className="flex-1">
              <div className="text-sm font-medium leading-none">{title}</div>
              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                {children}
              </p>
            </div>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";


export function AppHeader() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  const [cmsServices, setCmsServices] = useState<any[]>([]);
  const [socialLinks, setSocialLinks] = useState({ instagram: "", linkedin: "", facebook: "" });

  useEffect(() => {
    client.fetch(SERVICES_QUERY).then(setCmsServices).catch(() => {});
    client.fetch(SITE_SETTINGS_QUERY).then((s) => {
      if (s) {
        setSocialLinks({
          instagram: s.instagramUrl || "",
          linkedin: s.linkedinUrl || "",
          facebook: s.facebookUrl || "",
        });
      }
    }).catch(() => {});
  }, []);

  const serviceMenuIcons = [
    <School key="s1" className="text-primary" />,
    <University key="s2" className="text-primary" />,
    <Handshake key="s3" className="text-primary" />,
    <Briefcase key="s4" className="text-primary" />,
    <Building key="s5" className="text-primary" />,
    <Landmark key="s6" className="text-primary" />,
    <Globe key="s7" className="text-primary" />,
    <Lightbulb key="s8" className="text-primary" />,
    <Zap key="s9" className="text-primary" />,
  ];
  const serviceMenuIds = [
    "indian-schools",
    "indian-universities",
    "indian-smes",
    "japanese-smes",
    "company-registration-jp-in",
    "company-registration-in-jp",
    "digital-services",
    "startup-support",
    "management-training",
  ];
  // Services menu comes from the CMS when available, otherwise the built-in list.
  const servicesSubmenu = (cmsServices.length > 0
    ? cmsServices.map((s: any, i: number) => ({
        href: `/services/${s.slug}`,
        title: s.title,
        description: s.shortDescription,
        icon: serviceMenuIcons[i % serviceMenuIcons.length],
      }))
    : serviceMenuIds.map((id, i) => ({
        href: `/services/${id}`,
        title: t(`service_${id}_title`),
        description: t(`service_${id}_description`),
        icon: serviceMenuIcons[i % serviceMenuIcons.length],
      }))
  );

  const navLinks = [
    { href: "/", label: t('navHome') },
    { href: "/about", label: t('navAboutUs') },
    { 
      href: "/services", 
      label: t('navServices'),
      submenu: servicesSubmenu
    },
    { href: "/members", label: t('navMembers') },
    { href: "/events", label: t('navEvents') },
    { href: "/resources", label: t('navResources') },
    { href: "/contact", label: t('navContact') },
  ];
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getInitials = (email: string | null | undefined) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-transparent backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-24 items-center justify-between">
        <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-4">
              <Image src={logoUrl} alt="Indo-Japan Chamber of Commerce Logo" width={160} height={160} className="h-24 w-auto" />
            </Link>
        </div>

        <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
                {navLinks.map((link) => (
                    <NavigationMenuItem key={link.href}>
                        {link.submenu ? (
                            <>
                                <NavigationMenuTrigger className={cn(
                                  navigationMenuTriggerStyle(),
                                  "bg-transparent",
                                  pathname.startsWith(link.href) && "text-primary"
                                )}>
                                    {link.label}
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] lg:grid-cols-3 lg:w-[750px]">
                                      {link.submenu.map((item) => (
                                        <ListItem
                                          key={item.title}
                                          title={item.title}
                                          href={item.href}
                                          icon={item.icon}
                                        >
                                          {item.description}
                                        </ListItem>
                                      ))}
                                    </ul>
                                </NavigationMenuContent>
                            </>
                        ) : (
                          <NavigationMenuLink asChild className={cn(
                              navigationMenuTriggerStyle(),
                              "bg-transparent",
                              pathname === link.href && "text-primary"
                          )}>
                              <Link href={link.href}>
                                {link.label}
                              </Link>
                          </NavigationMenuLink>
                        )}
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
        
        <div className="flex items-center justify-end gap-2">
            <LanguageSwitcher />
            
            <Button asChild variant="ghost" size="icon">
              <Link href="https://sh003.webhostingservices.com:2096/webmaillogout.cgi" target="_blank" rel="noopener noreferrer">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Webmail</span>
              </Link>
            </Button>
            
            {!loading && (
              <div className="hidden md:flex items-center gap-2">
                {user ? (
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{t('userMenuMyAccount')}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                         <Link href="/profile">
                            <User className="mr-2 h-4 w-4" />
                            <span>{t('userMenuProfile')}</span>
                          </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>{t('userMenuLogout')}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Button asChild variant="ghost">
                      <Link href="/login">{t('authLogin')}</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/signup">{t('authSignUp')}</Link>
                    </Button>
                  </>
                )}
              </div>
            )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">Mobile site navigation links</SheetDescription>
              <Link href="/" className="mr-6 flex items-center gap-4 mb-6">
                <Image src={logoUrl} alt="Indo-Japan Chamber of Commerce Logo" width={80} height={80} className="h-16 w-auto" />
              </Link>
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "transition-colors hover:text-primary",
                      pathname === link.href ? "text-primary font-semibold" : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                  <hr className="my-2"/>
                   {!loading && (
                    <div className="flex flex-col gap-2">
                        {user ? (
                            <>
                                <Link href="/profile" className="text-muted-foreground hover:text-primary">{t('userMenuProfile')}</Link>
                                <button onClick={handleLogout} className="text-left text-muted-foreground hover:text-primary">{t('userMenuLogout')}</button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-muted-foreground hover:text-primary">{t('authLogin')}</Link>
                                <Link href="/signup" className="text-muted-foreground hover:text-primary">{t('authSignUp')}</Link>
                            </>
                        )}
                    </div>
                   )}
                  <hr className="my-2"/>
                  <div className="flex items-center gap-2">
                    <Button asChild variant="ghost">
                      <Link href={socialLinks.instagram || "https://www.instagram.com/ijccindia?igsh=YW41MzJzNDY2M25y"} target="_blank" rel="noopener noreferrer">
                        <Instagram className="mr-2"/> Instagram
                      </Link>
                    </Button>
                    <Button asChild variant="ghost">
                      <Link href={socialLinks.linkedin || "https://www.linkedin.com/company/indo-japan-chamber-of-commerce/"} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="mr-2"/> LinkedIn
                      </Link>
                    </Button>
                     <Button asChild variant="ghost">
                      <Link href={socialLinks.facebook || "https://www.facebook.com/people/Indo-Japan-Chamber-of-Commerce/61573931145126/"} target="_blank" rel="noopener noreferrer">
                        <Facebook className="mr-2"/> Facebook
                      </Link>
                    </Button>
                  </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
    
