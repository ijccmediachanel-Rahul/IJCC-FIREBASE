"use client";

import { useState, useEffect } from 'react';
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from "@/hooks/use-translation";

interface BookResource {
  id: string;
  title: string;
  description: string;
  downloadUrl: string;
}

export default function SelfStudyPage() {
  const { language } = useTranslation();
  const [books, setBooks] = useState<BookResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksCollection = collection(db, 'selfStudyBooks');
        const bookSnapshot = await getDocs(booksCollection);
        const booksList = bookSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          ...(doc.data() as Omit<BookResource, 'id'>),
        }));
        setBooks(booksList);
      } catch (error) {
        console.warn("Could not fetch self-study books from Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="container py-12">
      <div className="space-y-4 mb-12 text-center">
        <h1 className="text-4xl font-headline tracking-tighter sm:text-5xl">
          {language === 'ja' ? '独学用教材＆リソース' : 'Self Study Books & Resources'}
        </h1>
        <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
          {language === 'ja'
            ? '自分のペースで学習できるよう厳選されたPDF教材コレクションをダウンロードしてください。'
            : 'Download our curated collection of PDF books to help you learn at your own pace.'}
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              {language === 'ja' ? '「まるごと」教材 (Marugoto Books)' : 'Marugoto Books'}
            </CardTitle>
            <CardDescription>
              {language === 'ja'
                ? '日本語と日本文化を総合的に学ぶための「まるごと」シリーズのテキストをご覧ください。このリソースは会員限定です。'
                : 'Explore the Marugoto series of textbooks for a comprehensive approach to learning Japanese language and culture. This resource is for members only.'}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/resources/marugoto-books">
                <ArrowRight className="mr-2 h-4 w-4" />
                {language === 'ja' ? '「まるごと」教材にアクセス' : 'Access Marugoto Books'}
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              {language === 'ja' ? '日本語を学ぼう (Lets Learn Japanese)' : 'Lets Learn Japanese'}
            </CardTitle>
            <CardDescription>
              {language === 'ja'
                ? '国際交流基金が提供する、日本語学習を始めるための無料ダウンロード教材です。'
                : 'Free downloadable coursebooks provided by The Japan Foundation to start your language journey.'}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex-wrap gap-4">
            <Button asChild>
              <Link href="/resources/lets-learn-japanese">
                <ArrowRight className="mr-2 h-4 w-4" />
                {language === 'ja' ? '教材にアクセス' : 'Access Books'}
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              {language === 'ja' ? '国際交流基金レッスン (Japan Foundation Lessons)' : 'Japan Foundation Lessons'}
            </CardTitle>
            <CardDescription>
              {language === 'ja'
                ? '日本語学習者向けの多様なトピックを網羅した国際交流基金のレッスンシリーズです。'
                : 'A series of lessons from The Japan Foundation covering various topics for language learners.'}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex-wrap gap-4">
            <Button asChild>
              <Link href="/resources/japan-foundation-lessons">
                <ArrowRight className="mr-2 h-4 w-4" />
                {language === 'ja' ? 'レッスンにアクセス' : 'Access Lessons'}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-5/6 mt-1" />
              </CardHeader>
              <CardFooter>
                <Skeleton className="h-10 w-36" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {books.map((book) => (
            <Card key={book.id}>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">{book.title}</CardTitle>
                <CardDescription>{book.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild>
                  <Link href={book.downloadUrl} target="_blank" rel="noopener noreferrer" download>
                    <Download className="mr-2 h-4 w-4" />
                    {language === 'ja' ? 'PDFをダウンロード' : 'Download PDF'}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border rounded-lg bg-secondary/50 mt-8">
          <h3 className="text-xl font-semibold">
            {language === 'ja' ? '現在利用可能な他の教材はありません' : 'No Other Books Available Yet'}
          </h3>
          <p className="text-muted-foreground mt-2">
            {language === 'ja'
              ? 'さらに多くの独学用教材が追加されるまで、今しばらくお待ちください。'
              : 'Please check back later for more self-study resources.'}
          </p>
        </div>
      )}
    </div>
  );
}
