
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import { notFound, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { NEWS_ARTICLE_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";

// Generic renderer for CMS articles that have no dedicated static page
// (e.g. newly added articles). Existing static routes like
// /news/iia-partnership keep working and take precedence over this route.
export default function NewsArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    client
      .fetch(NEWS_ARTICLE_BY_SLUG_QUERY, { slug: params.slug })
      .then((d) => {
        setArticle(d);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [params.slug]);

  if (!loaded) return null;
  if (!article) return notFound();

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <Button asChild variant="outline" size="sm" className="rounded-full">
          <Link href="/news">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Link>
        </Button>
        {article.tag ? (
          <div>
            <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
              {article.tag}
            </span>
          </div>
        ) : null}
        <h1 className="text-4xl font-headline tracking-tight">{article.title}</h1>
        {article.publishDate ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(article.publishDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        ) : null}
        {article.featuredImageUrl ? (
          <div className="relative w-full overflow-hidden rounded-xl bg-muted">
            <Image
              src={article.featuredImageUrl}
              alt={article.title}
              width={1200}
              height={630}
              className="w-full h-auto object-cover"
            />
          </div>
        ) : null}
        {article.excerpt ? (
          <p className="text-lg text-muted-foreground font-medium">{article.excerpt}</p>
        ) : null}
        {article.content ? (
          <div className="prose max-w-none text-foreground">
            <PortableText value={article.content} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
