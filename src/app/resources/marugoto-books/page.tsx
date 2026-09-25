"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { doc, getDoc, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { isPaidMember } from "@/lib/definitions";
import { useTranslation } from "@/hooks/use-translation";

const marugotoBooks = [
  { level: "A1", title: "Marugoto A1 Rikai", titleJa: "まるごと A1 りかい", description: "Focuses on understanding and comprehension for the A1 level.", descriptionJa: "A1レベルの言語構造と読解・理解に焦点を当てています。", file: "https://jumpshare.com/share/aufWQ9WfeAKcUb5Iv15R", isExternal: true },
  { level: "A1", title: "Marugoto A1 Katsudo", titleJa: "まるごと A1 かつどう", description: "Focuses on practical communication and activities for the A1 level.", descriptionJa: "A1レベルの実践的なコミュニケーションと活動に焦点を当てています。", file: "https://jumpshare.com/share/qJcmrw5XsCKmKAWnDjuW", isExternal: true },
  { level: "A2", title: "Marugoto A2 Rikai", titleJa: "まるごと A2 りかい", description: "Focuses on understanding and comprehension for the A2 level.", descriptionJa: "A2レベルの言語構造と読解・理解に焦点を当てています。", file: "https://jumpshare.com/share/E7tQVPZIup5FmZtL83UE", isExternal: true },
  { level: "A2", title: "Marugoto A2 Katsudo", titleJa: "まるごと A2 かつどう", description: "Focuses on practical communication and activities for the A2 level.", descriptionJa: "A2レベルの実践的なコミュニケーションと活動に焦点を当てています。", file: "https://jumpshare.com/share/TOzJRmN0U45KAUEW5cN9", isExternal: true },
  { level: "A2/B1", title: "Marugoto A2/B1 (Pre-Intermediate)", titleJa: "まるごと A2/B1 (初中級)", description: "Bridges the gap between elementary and intermediate levels, enhancing communication skills.", descriptionJa: "初級と中級の架け橋となり、コミュニケーション能力を向上させます。", file: "https://jumpshare.com/share/3Ir0AGbpMsT1tOLxNxSz", isExternal: true },
  { level: "B1", title: "Marugoto B1 (Intermediate)", titleJa: "まるごと B1 (中級)", description: "Aims to develop the ability to communicate in a broader range of situations.", descriptionJa: "より幅広い場面でのコミュニケーション能力を養うことを目指します。", file: "https://drive.google.com/drive/folders/1D8E-n2S-p9q-v9z-u1S-j-X9-gJ-z9bB?usp=drive_link", isExternal: true },
];

export default function MarugotoBooksPage() {
  const { language } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<DocumentData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const { toast } = useToast();

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
         <div className="space-y-4 mb-12 text-center">
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </div>
        <div className="space-y-8">
            {[...Array(4)].map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/4" />
                        <Skeleton className="h-5 w-3/4 mt-2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-4 w-full" />
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-10 w-48" />
                    </CardFooter>
                </Card>
            ))}
        </div>
      </div>
    );
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
            ? 'このリソースは会員限定です。「まるごと」教材にアクセスするには、ログインして有効な会員権をお持ちであることをご確認ください。'
            : 'This resource is exclusive to our members. Please log in and ensure you have an active membership to access the Marugoto books.'}
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
    <div className="container py-12">
      <div className="space-y-4 mb-12 text-center">
        <h1 className="text-4xl font-headline tracking-tighter sm:text-5xl">
          {language === 'ja' ? '「まるごと」教材' : 'Marugoto Books'}
        </h1>
        <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
          {language === 'ja'
            ? 'JF日本語教育スタンダードに準拠した、総合的な日本語学習のための「まるごと」シリーズ教材をダウンロードできます。'
            : 'Download the Marugoto series books for comprehensive Japanese language learning, aligned with the JF Standard for Japanese-Language Education.'}
        </p>
      </div>

      <div className="space-y-8">
        {marugotoBooks.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle className="font-headline text-3xl">
                {language === 'ja' ? item.titleJa : item.title}
              </CardTitle>
              <CardDescription className="text-lg">
                {language === 'ja' ? item.descriptionJa : item.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {language === 'ja'
                  ? `${item.level}レベルのコースブックとワークブックにアクセスできます。`
                  : `Access the coursebook and workbook for the ${item.level} level.`}
              </p>
            </CardContent>
            <CardFooter>
                {item.isExternal ? (
                  <Button asChild>
                    <Link href={item.file} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {language === 'ja' ? `${item.level}教材にアクセス` : `Access ${item.level} Books`}
                    </Link>
                  </Button>
                ) : (
                  <Button asChild>
                    <Link href={item.file} download>
                      <Download className="mr-2 h-4 w-4" />
                      {language === 'ja' ? `${item.level}教材をダウンロード` : `Download ${item.level} Books`}
                    </Link>
                  </Button>
                )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
