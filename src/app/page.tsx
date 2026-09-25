
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowRight, Calendar, Users, BookOpen, Mail } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import React from "react";
import { FloatingSocials } from "@/components/floating-socials";
import { useTranslation } from "@/hooks/use-translation";
import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { HOME_PAGE_QUERY } from "@/sanity/lib/queries";


const defaultPartners = [
    { name: "All India Management Association", href: "https://www.aima.in", logoUrl: "https://www.aima.in/img/logo.png", hint: "company logo" },
    { name: "Aranca", href: "https://www.aranca.com/", logoUrl: "https://www.aranca.com/assets/images/icons/aranca-logo-0203.png", hint: "company logo" },
    { name: "AJU Hotels", href: "https://www.ajujapanesehotels.com/english/", logoUrl: "https://www.ajujapanesehotels.com/images/logo.png", hint: "company logo" },
    { name: "Enpointe Adwisers", href: "https://enpointeadwisers.com/", logoUrl: "https://enpointeadwisers.com/wp-content/uploads/2024/02/EPA-Logo-Black.png", hint: "company logo" },
];

const defaultHeroSlides = [
  {
    slideType: 'video',
    videoUrl: "https://www.youtube.com/embed/_JzU0rmDaCg?autoplay=1&mute=1&controls=0&loop=1&playlist=_JzU0rmDaCg",
    alt: "Indo-Japan collaboration video",
  },
  {
    slideType: 'image',
    imageUrl: "https://static.investindia.gov.in/s3fs-public/2021-06/shutterstock_1057997963.jpg",
    alt: "India and Japan flags",
  },
  {
    slideType: 'image',
    imageUrl: "https://imgcp.aacdn.jp/img-a/1200/900/global-aaj-front/article/2015/12/565f05f621364_565f018e5feb3_1467636135.jpg",
    alt: "Japanese cherry blossoms",
  },
];

export default function Home() {
  const { t, language } = useTranslation();
  const [cmsHome, setCmsHome] = useState<any>(null);

  useEffect(() => {
    async function fetchHome() {
      try {
        const data = await client.fetch(HOME_PAGE_QUERY);
        setCmsHome(data);
      } catch (error) {
        console.error("Failed to fetch home page from Sanity", error);
      }
    }
    fetchHome();
  }, []);

  // Everything below comes from the CMS (Home Page doc) when filled,
  // otherwise the built-in defaults below are shown.
  const slides = cmsHome?.heroSlides?.length ? cmsHome.heroSlides : defaultHeroSlides;

  const partnerList = (cmsHome?.partners?.length ? cmsHome.partners : defaultPartners).map((p: any) => ({
    name: p.name,
    href: p.website || p.href,
    logoUrl: p.logoUrl,
  }));

  const featureIcons = [
    <Calendar key="cal" className="h-8 w-8 text-primary" />,
    <Users key="users" className="h-8 w-8 text-primary" />,
    <BookOpen key="book" className="h-8 w-8 text-primary" />,
    <Mail key="mail" className="h-8 w-8 text-primary" />,
  ];
  const defaultFeatureCards = [
    {
      title: t('feature1Title'),
      description: t('feature1Description'),
      link: "/events",
    },
    {
      title: t('feature2Title'),
      description: t('feature2Description'),
      link: "/members",
    },
    {
      title: t('feature3Title'),
      description: t('feature3Description'),
      link: "/resources",
    },
    {
      title: t('feature4Title'),
      description: t('feature4Description'),
      link: "/contact",
    },
  ];
  const features = ((language === 'ja' || !cmsHome?.featureCards?.length) ? defaultFeatureCards : cmsHome.featureCards).map((f: any, i: number) => ({
    icon: featureIcons[i % featureIcons.length],
    title: f.title,
    description: f.description,
    href: f.link,
  }));

  return (
    <>
      <FloatingSocials />
      <section className="relative w-full h-[600px] flex items-center justify-center text-center text-white overflow-hidden">
        <Carousel
          className="absolute inset-0 w-full h-full"
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent className="h-full">
            {slides.map((item: any, index: number) => (
              <CarouselItem key={index} className="h-full">
                {item.slideType === 'image' ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.alt || 'IJCC'}
                      fill
                      className="object-cover brightness-[0.6]"
                     
                    />
                ) : (
                   <div className="absolute inset-0 w-full h-full overflow-hidden brightness-[0.6]">
                    <iframe
                        src={item.videoUrl}
                        title={item.alt || 'IJCC video'}
                        className="pointer-events-none absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                  </div>
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
           <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white bg-black/30 hover:bg-black/50 border-none" />
           <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white bg-black/30 hover:bg-black/50 border-none" />
        </Carousel>

        <div className="relative z-10 container px-4 md:px-6">
           <div className="space-y-6 max-w-4xl mx-auto">
              <h1 className="text-4xl font-headline tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                {language === 'ja' || !cmsHome?.heroTitle ? (
                  <>
                    {t('heroTitlePart1')} <span className="text-accent">{t('heroTitleIndia')}</span> & <span className="text-accent">{t('heroTitleJapan')}</span> {t('heroTitlePart2')}
                  </>
                ) : cmsHome.heroTitle}
              </h1>
              <p className="max-w-2xl mx-auto text-lg md:text-xl">
                {language === 'ja' ? t('heroDescription') : (cmsHome?.heroSubtitle || t('heroDescription'))}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row justify-center">
                <Button asChild size="lg" className="rounded-full">
                  <Link href={cmsHome?.heroPrimaryButtonLink || "/contact"}>
                    {t('heroJoinUsButton')} <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <span className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" variant="secondary" className="rounded-full">
                    <Link href={cmsHome?.heroSecondaryButtonLink || "/events"}>
                      {t('heroUpcomingEventsButton')}
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="secondary" className="rounded-full">
                    <Link href={cmsHome?.heroTertiaryButtonLink || "/gallery"}>
                      {t('heroGalleryButton')}
                    </Link>
                  </Button>
                </span>
              </div>
            </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-background">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <div className="relative w-full h-[500px] overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 rounded-xl">
            <Image
              src={cmsHome?.aboutImageUrl || "https://i.postimg.cc/4nC2jkgX/h1.png"}
              alt="About IJCC"
              layout="fill"
              objectFit="cover"
             
              className="rounded-xl"
            />
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">{language === 'ja' ? t('homeAboutUsBadge') : (cmsHome?.aboutBadge || t('homeAboutUsBadge'))}</div>
              <h2 className="text-3xl font-headline sm:text-4xl">{language === 'ja' ? t('homeAboutUsTitle') : (cmsHome?.aboutTitle || t('homeAboutUsTitle'))}</h2>
            </div>
            <p className="text-muted-foreground md:text-lg">
              {language === 'ja' ? t('homeAboutUsDescription') : (cmsHome?.aboutDescription || t('homeAboutUsDescription'))}
            </p>
            <Button asChild size="lg" className="rounded-full">
              <Link href={cmsHome?.aboutButtonLink || "/about"}>
                {t('homeAboutUsButton')} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section 
        className="py-20 md:py-32 bg-secondary relative bg-cover bg-center"
        style={{ backgroundImage: `url('${cmsHome?.featuresBackgroundImageUrl || "https://i.postimg.cc/26Pq3zBL/background1.png"}')` }}
      >
        <div className="absolute inset-0 bg-secondary/80 backdrop-blur-sm"></div>
        <div className="container px-4 md:px-6 relative">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">{language === 'ja' ? t('keyFeaturesBadge') : (cmsHome?.featuresBadge || t('keyFeaturesBadge'))}</div>
              <h2 className="text-3xl font-headline sm:text-5xl">{language === 'ja' ? t('whyJoinUsTitle') : (cmsHome?.featuresTitle || t('whyJoinUsTitle'))}</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {language === 'ja' ? t('whyJoinUsDescription') : (cmsHome?.featuresDescription || t('whyJoinUsDescription'))}
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-sm sm:max-w-none sm:grid-cols-2 lg:grid-cols-4 items-start gap-8 mt-12">
              {features.map((feature: any) => (
              <Card key={feature.title} className="flex flex-col transform transition-transform duration-300 hover:-translate-y-2 h-full">
                <CardHeader className="items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                    {React.cloneElement(feature.icon, { className: "h-10 w-10 text-primary" })}
                  </div>
                  <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow text-center">
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full rounded-full">
                    <Link href={feature.href}>
                      {t('learnMoreButton')} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <div className="space-y-2">
                    <h2 className="text-3xl font-headline sm:text-5xl">{language === 'ja' ? t('associatePartnersTitle') : (cmsHome?.partnersTitle || t('associatePartnersTitle'))}</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        {language === 'ja' ? t('associatePartnersDescription') : (cmsHome?.partnersDescription || t('associatePartnersDescription'))}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
                {partnerList.map((partner: any) => (
                    <Link href={partner.href} key={partner.name} target="_blank" rel="noopener noreferrer" className="block">
                       <Card className="flex items-center justify-center p-6 h-40 transition-transform transform hover:scale-105 hover:shadow-lg overflow-hidden">
                          <CardContent className="p-0 flex items-center justify-center">
                            <Image src={partner.logoUrl} alt={partner.name} width={150} height={80} className="max-h-20 max-w-[130px] w-auto h-auto object-contain" style={{ maxHeight: '80px', maxWidth: '130px' }} />
                          </CardContent>
                       </Card>
                    </Link>
                ))}
            </div>
        </div>
      </section>


      <section className="py-8 md:py-12">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-headline tracking-tighter md:text-4xl/tight">
              {language === 'ja' ? t('ctaTitle') : (cmsHome?.ctaTitle || t('ctaTitle'))}
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {language === 'ja' ? t('ctaDescription') : (cmsHome?.ctaDescription || t('ctaDescription'))}
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
            <Button asChild size="lg" className="w-full rounded-full">
              <Link href={cmsHome?.ctaButtonLink || "/contact"}>
                <Mail className="mr-2 h-5 w-5" /> {t('ctaButton')}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
