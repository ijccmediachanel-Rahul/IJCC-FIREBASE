"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { client } from '@/sanity/lib/client';
import { GALLERY_QUERY, GALLERY_PAGE_QUERY } from '@/sanity/lib/queries';
import { useTranslation } from "@/hooks/use-translation";

export default function GalleryPage() {
    const { t } = useTranslation();
    const [images, setImages] = useState<any[]>([]);
    const [cmsPage, setCmsPage] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGallery() {
            try {
                const [data, pageData] = await Promise.all([
                    client.fetch(GALLERY_QUERY),
                    client.fetch(GALLERY_PAGE_QUERY)
                ]);
                setImages(data || []);
                if (pageData) setCmsPage(pageData);
            } catch (error) {
                console.error('Failed to fetch gallery images', error);
            } finally {
                setLoading(false);
            }
        }
        fetchGallery();
    }, []);

    return (
        <div className="container py-12">
            <div className="space-y-4 mb-12 text-center">
                <h1 className="text-4xl font-headline tracking-tighter sm:text-5xl">{cmsPage?.title || t('gallery_title')}</h1>
                <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
                    {cmsPage?.description || t('gallery_description')}
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {!loading && images.length === 0 && (
                    <p className="col-span-full text-center text-muted-foreground">
                        No photos yet — add some in the Studio under Gallery Images.
                    </p>
                )}
                {images.map((image, index) => {
                    const imgUrl = image.imageUrl || image.src;
                    const altText = image.title || image.alt || `Gallery Image ${index + 1}`;
                    return (
                        <Dialog key={image._id || index}>
                            <DialogTrigger asChild>
                                <div className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group bg-muted/20">
                                    <Image
                                        src={imgUrl}
                                        alt={altText}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                    />
                                </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl p-0">
                                <div className="relative aspect-video">
                                    <Image src={imgUrl} alt={altText} fill className="object-contain" />
                                </div>
                            </DialogContent>
                        </Dialog>
                    );
                })}
            </div>
        </div>
    );
}
