
"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Handshake,
  GraduationCap,
  Globe,
  Zap,
  Scale,
  Building2,
  Target,
  Users,
  Briefcase,
  Lightbulb,
  Building,
  Landmark,
  Users2,
  University,
  CheckCircle2,
  Calendar,
  Layers,
  Database,
  SearchCode,
  ArrowRight,
  Sparkles,
  Sprout,
  Cpu,
  Trophy,
  Instagram,
  Linkedin,
  Facebook
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { MEMBERS_QUERY, ABOUT_PAGE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";

const verticals = [
  { id: "01", icon: <Handshake className="h-6 w-6" />, titleKey: "vertical_01_title", descKey: "vertical_01_desc", points: ["vertical_01_p1", "vertical_01_p2", "vertical_01_p3", "vertical_01_p4", "vertical_01_p5", "vertical_01_p6"] },
  { id: "02", icon: <University className="h-6 w-6" />, titleKey: "vertical_02_title", descKey: "vertical_02_desc", points: ["vertical_02_p1", "vertical_02_p2", "vertical_02_p3", "vertical_02_p4", "vertical_02_p5"] },
  { id: "03", icon: <Users2 className="h-6 w-6" />, titleKey: "vertical_03_title", descKey: "vertical_03_desc", points: ["vertical_03_p1", "vertical_03_p2", "vertical_03_p3", "vertical_03_p4", "vertical_03_p5"] },
  { id: "04", icon: <Lightbulb className="h-6 w-6" />, titleKey: "vertical_04_title", descKey: "vertical_04_desc", points: ["vertical_04_p1", "vertical_04_p2", "vertical_04_p3", "vertical_04_p4", "vertical_04_p5"] },
  { id: "05", icon: <Zap className="h-6 w-6" />, titleKey: "vertical_05_title", descKey: "vertical_05_desc", points: ["vertical_05_p1", "vertical_05_p2", "vertical_05_p3", "vertical_05_p4"] },
  { id: "06", icon: <Scale className="h-6 w-6" />, titleKey: "vertical_06_title", descKey: "vertical_06_desc", points: ["vertical_06_p1", "vertical_06_p2", "vertical_06_p3", "vertical_06_p4"] },
  { id: "07", icon: <Building2 className="h-6 w-6" />, titleKey: "vertical_07_title", descKey: "vertical_07_desc", points: ["vertical_07_p1", "vertical_07_p2", "vertical_07_p3", "vertical_07_p4", "vertical_07_p5"] },
  { id: "08", icon: <Sprout className="h-6 w-6" />, titleKey: "vertical_08_title", descKey: "vertical_08_desc", points: ["vertical_08_p1", "vertical_08_p2", "vertical_08_p3", "vertical_08_p4", "vertical_08_p5"] },
  { id: "09", icon: <Target className="h-6 w-6" />, titleKey: "vertical_09_title", descKey: "vertical_09_desc", points: ["vertical_09_p1", "vertical_09_p2", "vertical_09_p3", "vertical_09_p4", "vertical_09_p5"] },
  { id: "10", icon: <Database className="h-6 w-6" />, titleKey: "vertical_10_title", descKey: "vertical_10_desc", points: ["vertical_10_p1", "vertical_10_p2", "vertical_10_p3", "vertical_10_p4", "vertical_10_p5"] },
  { id: "11", icon: <Cpu className="h-6 w-6" />, titleKey: "vertical_11_title", descKey: "vertical_11_desc", points: ["vertical_11_p1", "vertical_11_p2", "vertical_11_p3", "vertical_11_p4", "vertical_11_p5"] },
  { id: "12", icon: <SearchCode className="h-6 w-6" />, titleKey: "vertical_12_title", descKey: "vertical_12_desc", points: ["vertical_12_p1", "vertical_12_p2", "vertical_12_p3", "vertical_12_p4", "vertical_12_p5"] }
];

export default function AboutPage() {
  const { t, language } = useTranslation();
  const [cmsMembers, setCmsMembers] = useState<any[]>([]);
  const [cmsAbout, setCmsAbout] = useState<any>(null);
  const [siteSettings, setSiteSettings] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersData, aboutData, settingsData] = await Promise.all([
          client.fetch(MEMBERS_QUERY),
          client.fetch(ABOUT_PAGE_QUERY),
          client.fetch(SITE_SETTINGS_QUERY)
        ]);
        setCmsMembers(membersData);
        setCmsAbout(aboutData);
        if (settingsData) setSiteSettings(settingsData);
      } catch (error) {
        console.error("Failed to fetch from Sanity", error);
      }
    };
    fetchData();
  }, []);

  // Team data comes 100% from Sanity CMS (member docs with
  // category Board / Advisory). Editing a name/role/bio/photo in the
  // Studio reflects on the site after refresh — no code change needed.
  const pickLang = (m: any, base: 'name' | 'role' | 'bio') =>
    language === 'ja' && m[`${base}_ja`] ? m[`${base}_ja`] : m[base];

  const leadership = cmsMembers
    .filter((m) => m.category === 'Board')
    .map((m) => ({
      id: m._id,
      imageUrl: m.imageUrl,
      name: pickLang(m, 'name'),
      title: pickLang(m, 'role'),
      bio: pickLang(m, 'bio'),
    }));

  const advisors = cmsMembers
    .filter((m) => m.category === 'Advisory')
    .map((m) => ({
      id: m._id,
      imageUrl: m.imageUrl,
      name: pickLang(m, 'name'),
      role: pickLang(m, 'role'),
      bio: pickLang(m, 'bio'),
    }));

  // ---- CMS-driven content (falls back to built-in text when CMS is empty) ----
  const verticalsList = (cmsAbout?.verticals?.length
    ? cmsAbout.verticals.map((v: any, i: number) => ({
        id: String(i + 1).padStart(2, '0'),
        icon: (verticals[i] || verticals[0]).icon,
        title: v.title,
        description: v.description,
        points: v.points || [],
      }))
    : verticals.map((v) => ({
        id: v.id,
        icon: v.icon,
        title: t(v.titleKey),
        description: t(v.descKey),
        points: v.points.map((p) => t(p)),
      })));

  const factIcons = [
    <Calendar key="f1" className="text-primary h-5 w-5" />,
    <Layers key="f2" className="text-primary h-5 w-5" />,
    <Handshake key="f3" className="text-primary h-5 w-5" />,
    <Users key="f4" className="text-primary h-5 w-5" />,
    <Building2 key="f5" className="text-primary h-5 w-5" />,
  ];
  const defaultFacts = [
    { label: t('about_facts_est'), value: "2025" },
    { label: t('about_facts_verts'), value: "12" },
    { label: t('about_facts_mous'), value: "5" },
    { label: t('about_facts_msme_members'), value: "16,000+" },
    { label: t('about_facts_corp_members'), value: "36,000+" },
  ];
  const factsList = (cmsAbout?.facts?.length ? cmsAbout.facts : defaultFacts).map((f: any, i: number) => ({
    label: f.label,
    value: f.value,
    icon: factIcons[i % factIcons.length],
  }));

  const objectiveIcons = [
    <Briefcase key="o1" className="h-6 w-6 text-primary" />,
    <GraduationCap key="o2" className="h-6 w-6 text-primary" />,
    <Users2 key="o3" className="h-6 w-6 text-primary" />,
    <Zap key="o4" className="h-6 w-6 text-primary" />,
    <Sparkles key="o5" className="h-6 w-6 text-primary" />,
    <Scale key="o6" className="h-6 w-6 text-primary" />,
    <Building2 key="o7" className="h-6 w-6 text-primary" />,
    <Sprout key="o8" className="h-6 w-6 text-primary" />,
    <Target key="o9" className="h-6 w-6 text-primary" />,
    <Database key="o10" className="h-6 w-6 text-primary" />,
    <Cpu key="o11" className="h-6 w-6 text-primary" />,
    <SearchCode key="o12" className="h-6 w-6 text-primary" />,
  ];
  const defaultObjectives = Array.from({ length: 12 }, (_, i) => {
    const n = String(i + 1).padStart(2, '0');
    return { id: n, title: t(`obj_${n}_title`), desc: t(`obj_${n}_desc`) };
  });
  const objectivesList = (cmsAbout?.objectives?.length ? cmsAbout.objectives : defaultObjectives).map((o: any, i: number) => ({
    id: o.id || String(i + 1).padStart(2, '0'),
    icon: objectiveIcons[i % objectiveIcons.length],
    title: o.title,
    desc: o.description || o.desc,
  }));

  const benefitIcons = [
    <Globe key="b1" className="h-8 w-8 text-primary" />,
    <GraduationCap key="b2" className="h-8 w-8 text-primary" />,
    <Scale key="b3" className="h-8 w-8 text-primary" />,
    <Sparkles key="b4" className="h-8 w-8 text-primary" />,
  ];
  const defaultBenefits = ["01", "02", "03", "04"].map((n) => ({
    id: n,
    title: t(`ben_${n}_title`),
    points: [1, 2, 3, 4].map((p) => t(`ben_${n}_p${p}`)),
  }));
  const benefitsList = (cmsAbout?.benefits?.length ? cmsAbout.benefits : defaultBenefits).map((b: any, i: number) => ({
    id: b.id || String(i + 1).padStart(2, '0'),
    icon: benefitIcons[i % benefitIcons.length],
    title: b.title,
    points: b.points || [],
  }));

  const defaultMouPartners = [
    { id: "spolto", name: "Spolto", desc: t('mou_spolto_desc') },
    { id: "nihon", name: "Nihon Edutech", desc: t('mou_nihon_desc') },
    { id: "iia", name: "Indian Industries Association (IIA)", desc: t('mou_iia_desc') },
    { id: "wadhwani", name: "Wadhwani Foundation", desc: t('mou_wadhwani_desc') },
    { id: "sem", name: "SEM — Smart Education Method", desc: t('mou_sem_desc') },
    { id: "alliances", name: "JETRO | FICCI | CII | AIMA", desc: t('mou_alliances_desc') },
  ];
  const mouList = (cmsAbout?.mouPartners?.length ? cmsAbout.mouPartners : defaultMouPartners).map((p: any, i: number) => ({
    id: p.id || `mou-${i}`,
    name: p.name,
    desc: p.description || p.desc,
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="container relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <Badge className="bg-accent text-accent-foreground px-4 py-1 text-sm font-bold tracking-widest uppercase mb-4">
              {cmsAbout?.heroBadge || t('about_hero_badge')}
            </Badge>
            <h1 className="text-5xl font-headline tracking-tight lg:text-7xl leading-tight">
              {cmsAbout?.heroTitle || t('about_hero_title')}
            </h1>
            <p className="text-2xl font-headline italic text-accent">
              "{cmsAbout?.heroTagline || t('about_hero_tagline')}"
            </p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-primary-foreground/80 font-medium">
              {verticalsList.map((v: any, i: number) => (
                <span key={v.id}>{i > 0 ? ' • ' : ''}{v.title}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="container py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <h2 className="text-4xl font-headline text-primary border-b-4 border-accent/30 pb-2 inline-block">
              {cmsAbout?.pageTitle || t('about_intro_title')}
            </h2>
            <div className="prose prose-lg text-muted-foreground max-w-none space-y-6">
              {cmsAbout?.introduction ? (
                cmsAbout.introduction.split(/\n\n+/).map((para: string, i: number) => (
                  <p key={i}>{para}</p>
                ))
              ) : (
                <>
                  <p>{t('about_intro_p1')}</p>
                  <p dangerouslySetInnerHTML={{ __html: t('about_intro_p2') }} />
                </>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mt-12">
              <Card className="bg-primary/5 border-none shadow-none text-left">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2 text-primary uppercase tracking-wider">
                    <Target className="h-5 w-5" /> {cmsAbout?.missionTitle || t('about_mission_title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm leading-relaxed prose-sm prose-p:my-1">
                  {cmsAbout?.mission ? (
                    <PortableText value={cmsAbout.mission} />
                  ) : (
                    t('about_mission_desc')
                  )}
                </CardContent>
              </Card>
              <Card className="bg-accent/5 border-none shadow-none text-left">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2 text-accent uppercase tracking-wider">
                    <Globe className="h-5 w-5" /> {cmsAbout?.visionTitle || t('about_vision_title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm leading-relaxed prose-sm prose-p:my-1">
                  {cmsAbout?.visionDescription ? (
                    cmsAbout.visionDescription.split(/\n\n+/).map((para: string, i: number) => (
                      <p key={i} className="my-1">{para}</p>
                    ))
                  ) : cmsAbout?.history ? (
                    <PortableText value={cmsAbout.history} />
                  ) : (
                    t('about_vision_desc')
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="bg-muted/30 p-8 rounded-3xl space-y-8">
            <h3 className="text-2xl font-headline text-primary">{cmsAbout?.factsTitle || t('about_facts_title')}</h3>
            <div className="grid grid-cols-2 gap-8">
              {factsList.map((stat: any, i: number) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    {stat.icon} {stat.label}
                  </div>
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                </div>
              ))}
            </div>
            <div className="pt-8 border-t border-muted-foreground/20 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{cmsAbout?.orgTypeLabel || t('about_facts_type_label')}:</span>
                <span className="font-bold">{cmsAbout?.orgTypeValue || t('about_facts_type_val')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{cmsAbout?.hqLabel || t('about_facts_hq_label')}:</span>
                <span className="font-bold">{cmsAbout?.hqValue || t('about_facts_hq_val')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{cmsAbout?.websiteLabel || t('about_facts_web_label')}:</span>
                <span className="font-bold">{cmsAbout?.websiteValue || "www.ijcc.in"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Objectives */}
      <section className="bg-muted/30 py-24">
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-headline text-primary">{cmsAbout?.objectivesTitle || t('about_objectives_title')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto italic">{cmsAbout?.objectivesSubtitle || t('about_objectives_subtitle')}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {objectivesList.map((obj: any) => (
              <Card key={obj.id} className="group border-none shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <div className="text-primary/20 text-3xl font-bold group-hover:text-primary/40 transition-colors">{obj.id}</div>
                  <div className="bg-primary/5 p-2 rounded-lg">{obj.icon}</div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <CardTitle className="text-lg">{obj.title}</CardTitle>
                  <p className="text-sm text-muted-foreground leading-relaxed">{obj.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Organisation Verticals */}
      <section className="container py-24">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-headline text-primary uppercase tracking-tight">{cmsAbout?.verticalsTitle || t('about_verts_title')}</h2>
            <p className="text-muted-foreground">{cmsAbout?.verticalsSubtitle || t('about_verts_subtitle')}</p>
          </div>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {verticalsList.map((v: any) => (
              <AccordionItem key={v.id} value={v.id} className="border rounded-2xl px-6 bg-white overflow-hidden shadow-sm">
                <AccordionTrigger className="hover:no-underline py-6">
                  <div className="flex items-center gap-4 text-left">
                    <div className="bg-primary text-white font-bold h-8 w-8 rounded-full flex items-center justify-center shrink-0">
                      {v.id}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-primary shrink-0">{v.icon}</div>
                      <span className="text-xl font-headline">{v.title}</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-8 pt-2 pl-12">
                  <div className="space-y-4">
                    {v.description && <p className="text-primary font-semibold">{v.description}</p>}
                    {v.points && v.points.length > 0 && (
                      <ul className="flex flex-col gap-y-3">
                        {v.points.map((point: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-muted-foreground text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="bg-primary py-24 text-primary-foreground">
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-headline uppercase tracking-tight">{cmsAbout?.leadershipTitle || t('about_leadership_title')}</h2>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto italic">
              {cmsAbout?.leadershipSubtitle || t('about_leadership_subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadership.map((member) => (
              <Dialog key={member.id}>
                <DialogTrigger asChild>
                  <Card className="bg-white/5 border-white/10 text-center space-y-4 group hover:bg-white/10 transition-all cursor-pointer transform hover:-translate-y-1">
                    <CardHeader>
                      <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white/20 bg-white/10 flex items-center justify-center">
                        {member.imageUrl ? (
                          <Image src={member.imageUrl} alt={member.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <Users2 className="h-12 w-12 text-white/50" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <h4 className="text-xl font-bold text-white">{member.name}</h4>
                      <div className="text-accent font-medium text-sm">{member.title}</div>
                      <p className="text-xs text-primary-foreground/60 line-clamp-2 pt-2">{member.bio?.substring(0, 100)}...</p>
                      <div className="pt-4 text-accent text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                        {t('view_bio')} <ArrowRight className="h-3 w-3" />
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader className="flex flex-col items-center text-center space-y-4">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/10 bg-primary/5 flex items-center justify-center">
                      {member.imageUrl ? (
                        <Image src={member.imageUrl} alt={member.name} fill className="object-cover" />
                      ) : (
                        <Users2 className="h-12 w-12 text-primary/30" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <DialogTitle className="text-3xl font-headline text-primary">{member.name}</DialogTitle>
                      <div className="text-accent font-bold uppercase tracking-tighter">{member.title}</div>
                    </div>
                  </DialogHeader>
                  <div className="mt-6 border-t pt-6 max-h-[50vh] overflow-y-auto pr-4 text-justify whitespace-pre-wrap">
                    <p className="text-muted-foreground leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </section>

      {/* Advisory Board */}
      <section className="container py-24">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-headline text-primary uppercase tracking-tight">{cmsAbout?.advisoryTitle || t('about_advisory_title')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{cmsAbout?.advisorySubtitle || t('about_advisory_subtitle')}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advisors.map((advisor) => {
            const hasBio = !!advisor.bio;
            const cardContent = (
              <Card className={`flex flex-row items-center gap-4 p-4 rounded-2xl bg-muted/30 border-none shadow-sm ${hasBio ? 'hover:bg-muted transition-colors cursor-pointer' : ''}`}>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border-2 border-accent overflow-hidden">
                  {advisor.imageUrl ? (
                    <Image src={advisor.imageUrl} alt={advisor.name} width={64} height={64} className="object-cover w-full h-full" />
                  ) : (
                    <Users2 className="h-8 w-8 text-primary/30" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg text-primary">{advisor.name}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest leading-tight">{advisor.role}</div>
                  {hasBio && (
                    <div className="mt-2 text-accent text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                      {t('view_bio')} <ArrowRight className="h-3 w-3" />
                    </div>
                  )}
                </div>
              </Card>
            );

            if (!hasBio) return <div key={advisor.id}>{cardContent}</div>;

            return (
              <Dialog key={advisor.id}>
                <DialogTrigger asChild>
                  {cardContent}
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader className="flex flex-col items-center text-center space-y-4">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/10 bg-primary/5 flex items-center justify-center">
                      {advisor.imageUrl ? (
                        <Image src={advisor.imageUrl} alt={advisor.name} fill className="object-cover" />
                      ) : (
                        <Users2 className="h-12 w-12 text-primary/30" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <DialogTitle className="text-3xl font-headline text-primary">{advisor.name}</DialogTitle>
                      <div className="text-accent font-bold uppercase tracking-tighter">{advisor.role}</div>
                    </div>
                  </DialogHeader>
                  <div className="mt-6 border-t pt-6 max-h-[50vh] overflow-y-auto pr-4 text-justify whitespace-pre-wrap">
                    <p className="text-muted-foreground leading-relaxed">
                      {advisor.bio}
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      </section>

      {/* Membership Benefits */}
      <section className="bg-muted/30 py-24">
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-headline text-primary uppercase tracking-tight">{cmsAbout?.benefitsTitle || t('about_benefits_title')}</h2>
            <p className="text-muted-foreground">{cmsAbout?.benefitsSubtitle || t('about_benefits_subtitle')}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefitsList.map((benefit: any) => (
              <Card key={benefit.id} className="border-none shadow-xl hover:-translate-y-2 transition-transform">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">{benefit.icon}</div>
                  <CardTitle className="text-lg uppercase tracking-tight">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {benefit.points.map((point: string, j: number) => (
                      <li key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" /> {point}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* MoU Partners */}
      <section className="container py-24">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-headline text-primary uppercase tracking-tight">{cmsAbout?.mouTitle || t('about_mou_title')}</h2>
          <p className="text-muted-foreground">{cmsAbout?.mouSubtitle || t('about_mou_subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {mouList.map((partner: any) => (
            <Card key={partner.id} className="bg-primary/5 border-none text-center p-6 group hover:bg-primary transition-colors">
              <CardTitle className="text-xl font-headline mb-4 group-hover:text-white">{partner.name}</CardTitle>
              <CardDescription className="text-sm group-hover:text-white/80">{partner.desc}</CardDescription>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact & Connect Footer */}
      <section className="bg-muted py-16">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
            <div className="space-y-4">
              <h3 className="text-3xl font-headline text-primary">{cmsAbout?.connectTitle || t('about_footer_title')}</h3>
              <p className="text-muted-foreground">{cmsAbout?.connectSubtitle || t('about_footer_subtitle')}</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-8">
              {[
                { label: "Website", icon: <Globe className="h-6 w-6" />, href: "/" },
                { label: "LinkedIn", icon: <Linkedin className="h-6 w-6" />, href: siteSettings?.linkedinUrl || "https://www.linkedin.com/company/indo-japan-chamber-of-commerce/" },
                { label: "Instagram", icon: <Instagram className="h-6 w-6" />, href: siteSettings?.instagramUrl || "https://www.instagram.com/ijccindia?igsh=YW41MzJzNDY2M25y" },
                { label: "Facebook", icon: <Facebook className="h-6 w-6" />, href: siteSettings?.facebookUrl || "https://www.facebook.com/people/Indo-Japan-Chamber-of-Commerce/61573931145126/" },
              ].map((link, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{link.label}</div>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-full bg-white shadow-sm text-primary hover:bg-primary hover:text-white transition-all duration-300 border-2 border-primary/5 hover:scale-110"
                  >
                    {link.icon}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
