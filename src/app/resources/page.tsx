
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, Presentation, BarChart, ArrowRight, BookOpen, Sparkles, Lock } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { doc, getDoc, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/use-translation";
import { client } from "@/sanity/lib/client";
import { RESOURCES_QUERY, RESOURCES_PAGE_QUERY } from "@/sanity/lib/queries";

const allResources = [
  {
    id: "business-in-japan",
    type: "Document",
    icon: <FileText className="h-8 w-8 text-primary" />,
    isLink: true,
    href: "https://jumpshare.com/share/JnOOQyDsSQOXwzzJZt8X",
    isProtected: true,
  },
  {
    id: "jlpt-papers",
    type: "Document",
    icon: <BarChart className="h-8 w-8 text-primary" />,
    isLink: true,
    href: "/resources/jlpt",
    isProtected: false,
  },
  {
    id: "magazines",
    type: "Magazine",
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    isLink: true,
    href: "/resources/magazines",
    isProtected: true,
  },
  {
    id: "self-study",
    type: "Self Study",
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    isLink: true,
    href: "/resources/self-study",
    isProtected: false,
  },
  {
    id: "learn-japanese",
    type: "Books",
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    isLink: true,
    href: "/resources/lets-learn-japanese",
    isProtected: false,
  },
  {
    id: "marugoto",
    type: "Books",
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    isLink: true,
    href: "/resources/marugoto-books",
    isProtected: true,
  },
  {
    id: "cross-cultural",
    type: "Presentation",
    icon: <Presentation className="h-8 w-8 text-primary" />,
    isLink: false,
    href: "#",
    isProtected: true,
  },
  {
    id: "import-export",
    type: "Document",
    icon: <FileText className="h-8 w-8 text-primary" />,
    isLink: false,
    href: "#",
    isProtected: true,
  },
];

export default function ResourcesPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<DocumentData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [cmsResources, setCmsResources] = useState<any[]>([]);
  const [cmsPage, setCmsPage] = useState<any>(null);

  useEffect(() => {
    async function fetchResources() {
      try {
        const [resData, pageData] = await Promise.all([
          client.fetch(RESOURCES_QUERY),
          client.fetch(RESOURCES_PAGE_QUERY)
        ]);
        if (resData && resData.length > 0) setCmsResources(resData);
        if (pageData) setCmsPage(pageData);
      } catch (error) {
        console.error("Failed to fetch resources from Sanity", error);
      }
    }
    fetchResources();
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
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user, authLoading]);

  const hasMembership = profile?.membershipTier && profile.membershipTier !== "none";

  const cardIconPool = [
    <FileText key="r1" className="h-8 w-8 text-primary" />,
    <BarChart key="r2" className="h-8 w-8 text-primary" />,
    <BookOpen key="r3" className="h-8 w-8 text-primary" />,
    <Sparkles key="r4" className="h-8 w-8 text-primary" />,
    <BookOpen key="r5" className="h-8 w-8 text-primary" />,
    <BookOpen key="r6" className="h-8 w-8 text-primary" />,
    <Presentation key="r7" className="h-8 w-8 text-primary" />,
    <FileText key="r8" className="h-8 w-8 text-primary" />,
  ];

  // Cards come from the CMS when available, otherwise built-in defaults.
  // CMS controls title, description, link and member-gating; icon/type shell stays in code.
  const cards = (cmsResources.length > 0
    ? cmsResources.map((d: any, i: number) => {
        const base = allResources.find((r) => r.id === d.resourceId) ?? {
          id: d.resourceId, icon: cardIconPool[i % cardIconPool.length], type: "Document", href: "", isProtected: false,
        };
        const linkUrl = d.linkUrl || "";
        return {
          ...base,
          title: d.title,
          description: d.description || "",
          href: linkUrl || base.href,
          isLink: linkUrl.length > 0,
          isProtected: d.isProtected ?? base.isProtected,
        };
      })
    : allResources.map((r) => ({
        ...r,
        title: t(`resource_${r.id}_title`),
        description: t(`resource_${r.id}_description`),
      })));

  const handleDownload = (resourceTitle: string) => {
    toast({
      title: "Download Started",
      description: `Downloading "${resourceTitle}"... (This is a demo)`,
    });
  };

  const handleProtectedClick = () => {
      toast({
          variant: "destructive",
          title: "Access Denied",
          description: "This resource is for members only. Please log in and ensure you have an active membership.",
      });
  };

  const isLoading = authLoading || loadingProfile;

  const visibleResources = allResources.filter(resource => {
      if (!resource.isProtected) return true;
      return hasMembership;
  });

  return (
    <div className="container py-12">
      <div className="space-y-4 mb-12 text-center">
        <h1 className="text-4xl font-headline tracking-tighter sm:text-5xl">{cmsPage?.title || t('resources_title')}</h1>
        <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
          {cmsPage?.description || t('resources_description')}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-6 w-3/4 mt-4" />
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-1/2 mt-1" />
                </CardHeader>
                <CardContent className="flex-grow" />
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))
          : cards.map((resource: any) => {
              const isAccessible = !resource.isProtected || hasMembership;
              return (
                <Card key={resource.id} className="flex flex-col transform transition-transform duration-300 hover:-translate-y-2">
                  <CardHeader>
                    {resource.icon}
                    <CardTitle className="font-headline mt-4">{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow" />
                  <CardFooter>
                    {isAccessible ? (
                      resource.isLink ? (
                         <Button asChild variant="outline" className="w-full rounded-full">
                          <Link href={resource.href!} target={resource.href?.startsWith('http') ? "_blank" : "_self"} rel="noopener noreferrer">
                            {resource.href?.startsWith('http') ? <Download className="mr-2 h-4 w-4" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                            {resource.href?.startsWith('http') ? `Download ${resource.type}` : `Access ${resource.type}`}
                          </Link>
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full rounded-full" onClick={() => handleDownload(resource.title)}>
                          <Download className="mr-2 h-4 w-4" />
                          {t('resource_download')} {t(`resource_type_${resource.type.toLowerCase().replace(' ', '')}`) || resource.type}
                        </Button>
                      )
                    ) : (
                        <Button variant="outline" className="w-full rounded-full" onClick={handleProtectedClick}>
                            <Lock className="mr-2 h-4 w-4" />
                            {t('resource_membersOnly')}
                        </Button>
                    )}
                  </CardFooter>
                </Card>
              );
        })}
      </div>
    </div>
  );
}
