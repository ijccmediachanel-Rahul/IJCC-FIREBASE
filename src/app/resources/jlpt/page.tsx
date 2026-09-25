"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";

const jlptLevels = [
  {
    level: "N1",
    description: "The most advanced level, requiring a deep understanding of Japanese used in a broad range of circumstances.",
    descriptionJa: "幅広い場面で使われる日本語を深く理解することが求められる最上級レベル。",
    file: "https://drive.google.com/drive/folders/1VAAso-cz684IFl3a2K6OdoCT1ynYqpzg?usp=drive_link",
    isExternal: true
  },
  {
    level: "N2",
    description: "The ability to understand Japanese used in everyday situations and in a variety of circumstances to a certain degree.",
    descriptionJa: "日常的な場面で使われる日本語に加え、より幅広い場面で使われる日本語をある程度理解できるレベル。",
    file: "https://drive.google.com/drive/folders/19vTGl0UKuJgigDnf_k7Ico2N36KHLdLp?usp=drive_link",
    isExternal: true
  },
  {
    level: "N3",
    description: "The ability to understand Japanese used in everyday situations to a certain degree.",
    descriptionJa: "日常的な場面で使われる日本語をある程度理解できるレベル。",
    file: "https://drive.google.com/drive/folders/1jjk-VNMKQOIuJG0av7qdMvN_vENTGluB?usp=drive_link",
    isExternal: true
  },
  {
    level: "N4",
    description: "The ability to understand basic Japanese.",
    descriptionJa: "基本的な日本語を理解できるレベル。",
    file: "https://drive.google.com/drive/folders/10hhOLQM1ifhXqF3ub60_pUgdpCZNwY5s?usp=drive_link",
    isExternal: true
  },
  {
    level: "N5",
    description: "The ability to understand some basic Japanese.",
    descriptionJa: "基本的な日本語をある程度理解できるレベル。",
    file: "https://drive.google.com/drive/folders/1_rOKudGAr5sRUhy2cCn3SfIJktJDlT97?usp=drive_link",
    isExternal: true
  },
];

export default function JlptPage() {
  const { language } = useTranslation();

  return (
    <div className="container py-12">
      <div className="space-y-4 mb-12 text-center">
        <h1 className="text-4xl font-headline tracking-tighter sm:text-5xl">
          {language === 'ja' ? '過去のJLPT問題用紙' : 'JLPT Previous Year Question Papers'}
        </h1>
        <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
          {language === 'ja'
            ? '日本語能力試験（JLPT）の準備のために過去の試験問題をダウンロードできます。'
            : 'Download past papers to prepare for the Japanese-Language Proficiency Test.'}
        </p>
      </div>

      <div className="space-y-8">
        {jlptLevels.map((item) => (
          <Card key={item.level}>
            <CardHeader>
              <CardTitle className="font-headline text-3xl">{item.level}</CardTitle>
              <CardDescription className="text-lg">
                {language === 'ja' ? item.descriptionJa : item.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {language === 'ja'
                  ? 'このセクションには過去のサンプル問題用紙が含まれています。これらは練習目的のみに使用されることにご留意ください。'
                  : 'This section contains sample question papers from previous years. Please note these are for practice purposes only.'}
              </p>
            </CardContent>
            <CardFooter>
              {item.isExternal ? (
                <Button asChild>
                  <Link href={item.file} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {language === 'ja' ? `${item.level}問題用紙にアクセス` : `Access ${item.level} Papers`}
                  </Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link href={item.file} download>
                    <Download className="mr-2 h-4 w-4" />
                    {language === 'ja' ? `${item.level}問題用紙をダウンロード` : `Download ${item.level} Papers`}
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
