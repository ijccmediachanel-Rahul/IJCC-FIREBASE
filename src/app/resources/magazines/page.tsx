
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Loader2, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { doc, getDoc, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { isPaidMember } from "@/lib/definitions";
import { useTranslation } from "@/hooks/use-translation";

const magazines = [
  {
    title: "IJCC Monthly - June 2024",
    titleJa: "IJCC月刊誌 - 2024年6月号",
    description: "Featuring an exclusive interview with the Ambassador of Japan to India, and a special report on the growing fintech collaboration between the two nations.",
    descriptionJa: "駐インド日本国大使への独占インタビューと、両国間で急成長するフィンテック連携に関する特別レポートを掲載。",
    imageUrl: "https://picsum.photos/seed/mag-june/800/1000",
    hint: "magazine cover",
    file: "#",
  },
  {
    title: "IJCC Monthly - May 2024",
    titleJa: "IJCC月刊誌 - 2024年5月号",
    description: "A deep dive into the automotive industry's supply chain integration and a look at the cultural impact of Japanese anime in India.",
    descriptionJa: "自動車産業のサプライチェーン統合の深層分析と、インドにおける日本アニメの文化的影響力に迫る特集。",
    imageUrl: "https://picsum.photos/seed/mag-may/800/1000",
    hint: "magazine cover",
    file: "#",
  },
  {
    title: "IJCC Monthly - April 2024",
    titleJa: "IJCC月刊誌 - 2024年4月号",
    description: "This issue covers the latest trends in renewable energy partnerships and celebrates the success of the Indo-Japanese food festival.",
    descriptionJa: "再生可能エネルギー連携の最新動向と、大成功を収めた日印フードフェスティバルの特集号。",
    imageUrl: "https://picsum.photos/seed/mag-april/800/1000",
    hint: "magazine cover",
    file: "#",
  },
];

const featuredMagazine = magazines[0];

export default function MagazinesPage() {
  const { language } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<DocumentData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

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
  const isLoading = authLoading || loadingProfile;

  if (isLoading) {
      return (
          <div className="container py-12">
              <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
                  <Loader2 className="h-16 w-16 animate-spin text-primary" />
              </div>
          </div>
      )
  }

  if (!hasMembership) {
    return (
      <div className="container py-12 text-center">
        <Lock className="h-16 w-16 mx-auto text-muted-foreground" />
        <h1 className="text-3xl font-headline mt-6">
          {language === 'ja' ? 'アクセスが制限されています' : 'Access Denied'}
        </h1>
        <p className="mt-4 text-muted-foreground max-w-md mx-auto">
          {language === 'ja'
            ? 'このリソースは会員限定です。月刊誌にアクセスするには、ログインして有効な会員権をお持ちであることをご確認ください。'
            : 'This resource is exclusive to our members. Please log in and ensure you have an active membership to access the magazines.'}
        </p>
        <Button asChild className="mt-8">
          <Link href={user ? "/pricing" : "/login"}>
            {language === 'ja'
              ? (user ? "メンバーシップをアップグレード" : "ログイン / 新規登録")
              : (user ? "Upgrade Membership" : "Login or Sign Up")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
    <section className="bg-secondary/50 py-20">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold">
                  {language === 'ja' ? '注目の号' : 'Featured Issue'}
                </div>
                <h1 className="text-4xl font-headline tracking-tighter sm:text-5xl">
                  {language === 'ja' ? featuredMagazine.titleJa : featuredMagazine.title}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {language === 'ja' ? featuredMagazine.descriptionJa : featuredMagazine.description}
                </p>
                <Button asChild size="lg" className="rounded-full">
                    <Link href={featuredMagazine.file} download>
                      <Download className="mr-2 h-5 w-5" />
                      {language === 'ja' ? '今すぐダウンロード' : 'Download Now'}
                    </Link>
                </Button>
            </div>
             <div className="relative w-full h-[500px] shadow-2xl rounded-lg transform transition-transform duration-500 hover:scale-105">
                <Image
                    src={featuredMagazine.imageUrl}
                    alt={featuredMagazine.title}
                    layout="fill"
                    objectFit="cover"
                   
                    className="rounded-lg"
                />
            </div>
        </div>
    </section>

    <div className="container py-12">
      <div className="space-y-4 mb-12 text-center">
        <h2 className="text-3xl font-headline tracking-tighter sm:text-4xl">
          {language === 'ja' ? 'バックナンバー' : 'Past Issues'}
        </h2>
        <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
          {language === 'ja'
            ? '日印関係の洞察が詰まった月刊誌のコレクションをご覧ください。'
            : 'Explore our collection of monthly magazines, packed with insights on Indo-Japan relations.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {magazines.map((magazine) => (
          <Card key={magazine.title}>
            <CardHeader className="p-0">
                <div className="relative w-full h-[400px] rounded-t-lg overflow-hidden">
                    <Image
                        src={magazine.imageUrl}
                        alt={magazine.title}
                        layout="fill"
                        objectFit="cover"
                       
                    />
                </div>
                <div className="p-6">
                    <CardTitle className="font-headline text-2xl">
                      {language === 'ja' ? magazine.titleJa : magazine.title}
                    </CardTitle>
                    <CardDescription className="pt-2">
                      {language === 'ja' ? magazine.descriptionJa : magazine.description}
                    </CardDescription>
                </div>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full rounded-full">
                <Link href={magazine.file} download>
                  <Download className="mr-2 h-4 w-4" />
                  {language === 'ja' ? 'PDFをダウンロード' : 'Download PDF'}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
    </>
  );
}
