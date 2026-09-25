"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";

const resources = [
    {
        title: "Japan Foundation Video Lessons",
        titleJa: "国際交流基金 ビデオレッスン",
        description: "A comprehensive YouTube playlist from The Japan Foundation covering various aspects of the Japanese language.",
        descriptionJa: "日本語の多様な表現や文法を網羅した国際交流基金の公式YouTubeプレイリストです。",
        file: "https://www.youtube.com/playlist?list=PLSCa5W3CPVCiYZpeh-6KSfaxpwjCIWg27",
        isExternal: true,
        buttonText: "Watch on YouTube",
        buttonTextJa: "YouTubeで視聴する"
    }
];

export default function JapanFoundationLessonsPage() {
  const { language } = useTranslation();

  return (
    <div className="container py-12">
      <div className="space-y-4 mb-12 text-center">
        <h1 className="text-4xl font-headline tracking-tighter sm:text-5xl">
          {language === 'ja' ? '国際交流基金レッスン' : 'Japan Foundation Lessons'}
        </h1>
        <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
          {language === 'ja'
            ? '国際交流基金が提供するレッスンと教材をご覧ください。'
            : 'Explore lessons and materials from The Japan Foundation.'}
        </p>
      </div>

        {resources.length > 0 ? (
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
                            {item.isExternal ? <ExternalLink className="mr-2 h-4 w-4" /> : <Download className="mr-2 h-4 w-4" />}
                            {language === 'ja' ? item.buttonTextJa : (item.buttonText || "Access Resource")}
                        </Link>
                    </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
            <div className="text-center py-16 border rounded-lg bg-secondary/50 mt-8">
                <h3 className="text-xl font-semibold">
                  {language === 'ja' ? '準備中' : 'Coming Soon'}
                </h3>
                <p className="text-muted-foreground mt-2">
                  {language === 'ja' ? 'レッスンや教材は近日中に追加されます。' : 'Lessons and resources will be added here shortly.'}
                </p>
            </div>
        )}
    </div>
  );
}
