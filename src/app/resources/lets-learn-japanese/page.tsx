"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";

const resources = [
    { 
      title: "Lets Learn Japanese - Vol 1 PDF", 
      titleJa: "日本語を学ぼう - 第1巻 PDF",
      description: "The downloadable PDF coursebook for the first volume of the 'Lets Learn Japanese' series.",
      descriptionJa: "「日本語を学ぼう」シリーズ第1巻のダウンロード可能なPDFコースブック。",
      file: "https://jumpshare.com/share/hl8x1mh8XIANZnyigTWA", 
      isExternal: true,
      buttonText: "Download PDF",
      buttonTextJa: "PDFをダウンロード"
    },
    { 
      title: "Lets Learn Japanese - Vol 2 PDF", 
      titleJa: "日本語を学ぼう - 第2巻 PDF",
      description: "The downloadable PDF coursebook for the second volume of the 'Lets Learn Japanese' series.",
      descriptionJa: "「日本語を学ぼう」シリーズ第2巻のダウンロード可能なPDFコースブック。",
      file: "https://jumpshare.com/share/7oDaV9tFLionMvWA4b5t", 
      isExternal: true,
      buttonText: "Download PDF",
      buttonTextJa: "PDFをダウンロード"
    },
    { 
      title: "Lets Learn Japanese - Vol 3 PDF", 
      titleJa: "日本語を学ぼう - 第3巻 PDF",
      description: "The downloadable PDF coursebook for the third volume of the 'Lets Learn Japanese' series.",
      descriptionJa: "「日本語を学ぼう」シリーズ第3巻のダウンロード可能なPDFコースブック。",
      file: "https://jumpshare.com/share/GpVBcssuUkIOo1n0jgLY", 
      isExternal: true,
      buttonText: "Download PDF",
      buttonTextJa: "PDFをダウンロード"
    },
];

export default function LetsLearnJapanesePage() {
  const { language } = useTranslation();

  return (
    <div className="container py-12">
      <div className="space-y-4 mb-12 text-center">
        <h1 className="text-4xl font-headline tracking-tighter sm:text-5xl">
          {language === 'ja' ? '日本語を学ぼう' : 'Lets Learn Japanese'}
        </h1>
        <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
          {language === 'ja'
            ? '国際交流基金が提供する、日本語学習を始めるための無料教材です。'
            : 'Free resources provided by The Japan Foundation to start your language journey.'}
        </p>
      </div>

      <div className="space-y-8">
        {resources.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                {language === 'ja' ? item.titleJa : item.title}
              </CardTitle>
              <CardDescription className="text-lg">
                {language === 'ja' ? item.descriptionJa : item.description}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <Link href={item.file} target="_blank" rel="noopener noreferrer">
                  {item.buttonText === "Download PDF" ? <Download className="mr-2 h-4 w-4" /> : <ExternalLink className="mr-2 h-4 w-4" />}
                  {language === 'ja' ? item.buttonTextJa : item.buttonText}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
