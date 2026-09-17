
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Handshake, 
  School, 
  Plane, 
  Library, 
  Lightbulb, 
  Briefcase, 
  Users, 
  Building, 
  Target, 
  Zap, 
  Scale, 
  FileSignature, 
  Landmark, 
  Building2, 
  Wallet, 
  Users2, 
  ConciergeBell, 
  Globe, 
  Megaphone, 
  Palette, 
  Sparkles, 
  Award, 
  University, 
  GraduationCap,
  HeartHandshake,
  Monitor,
  Search,
  Languages,
  Rocket
} from "lucide-react";
import { notFound, useParams } from "next/navigation";
import { useTranslation } from "@/hooks/use-translation";
import { ReactNode, useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { SERVICE_DETAIL_QUERY } from "@/sanity/lib/queries";

type ServiceCategory = {
    titleKey: string;
    icon: ReactNode;
    points: ({ mainKey: string; subKeys?: string[] } | string)[];
};

type Service = {
    id: string;
    titleKey: string;
    descriptionKey: string;
    categories: ServiceCategory[];
};

const allServicesData = [
  {
    id: "indian-schools",
    categories: [
      { icon: <Handshake className="h-8 w-8 text-primary" />, points: ["servicedetail_indian-schools_cat1_point1", "servicedetail_indian-schools_cat1_point2", "servicedetail_indian-schools_cat1_point3"] },
      { icon: <Plane className="h-8 w-8 text-primary" />, points: ["servicedetail_indian-schools_cat2_point1", "servicedetail_indian-schools_cat2_point2", "servicedetail_indian-schools_cat2_point3"] },
      { icon: <Languages className="h-8 w-8 text-primary" />, points: ["servicedetail_indian-schools_cat3_point1", "servicedetail_indian-schools_cat3_point2", "servicedetail_indian-schools_cat3_point3"] },
      { icon: <GraduationCap className="h-8 w-8 text-primary" />, points: ["servicedetail_indian-schools_cat4_point1", "servicedetail_indian-schools_cat4_point2", "servicedetail_indian-schools_cat4_point3"] },
      { icon: <Users className="h-8 w-8 text-primary" />, points: ["servicedetail_indian-schools_cat5_point1", "servicedetail_indian-schools_cat5_point2"] },
      { icon: <HeartHandshake className="h-8 w-8 text-primary" />, points: ["servicedetail_indian-schools_cat6_point1", "servicedetail_indian-schools_cat6_point2"] },
    ],
  },
  {
    id: "indian-universities",
    categories: [
        { icon: <University className="h-8 w-8 text-primary" />, points: ["servicedetail_indian-universities_cat1_point1", "servicedetail_indian-universities_cat1_point2", "servicedetail_indian-universities_cat1_point3"] },
        { icon: <Plane className="h-8 w-8 text-primary" />, points: ["servicedetail_indian-universities_cat2_point1", "servicedetail_indian-universities_cat2_point2", "servicedetail_indian-universities_cat2_point3"] },
        { icon: <Languages className="h-8 w-8 text-primary" />, points: ["servicedetail_indian-universities_cat3_point1", "servicedetail_indian-universities_cat3_point2", "servicedetail_indian-universities_cat3_point3"] },
        { icon: <Briefcase className="h-8 w-8 text-primary" />, points: ["servicedetail_indian-universities_cat4_point1", "servicedetail_indian-universities_cat4_point2", "servicedetail_indian-universities_cat4_point3"] },
        { icon: <Zap className="h-8 w-8 text-primary" />, points: ["servicedetail_indian-universities_cat5_point1", "servicedetail_indian-universities_cat5_point2", "servicedetail_indian-universities_cat5_point3"] },
        { icon: <Users2 className="h-8 w-8 text-primary" />, points: ["servicedetail_indian-universities_cat6_point1", "servicedetail_indian-universities_cat6_point2", "servicedetail_indian-universities_cat6_point3"] },
        { icon: <Globe className="h-8 w-8 text-primary" />, points: ["servicedetail_indian-universities_cat7_point1", "servicedetail_indian-universities_cat7_point2", "servicedetail_indian-universities_cat7_point3"] },
    ],
  },
  {
    id: "indian-smes",
    categories: [
      { icon: <Handshake className="h-8 w-8 text-primary" />, points: ["servicedetail_indian-smes_cat1_point1", "servicedetail_indian-smes_cat1_point2"] },
      { icon: <Award className="h-8 w-8 text-primary" />, points: ["servicedetail_indian-smes_cat2_point1", "servicedetail_indian-smes_cat2_point2", "servicedetail_indian-smes_cat2_point3"] },
      { icon: <Plane className="h-8 w-8 text-primary" />, points: ["servicedetail_indian-smes_cat3_point1", "servicedetail_indian-smes_cat3_point2"] },
      { icon: <Library className="h-8 w-8 text-primary" />, points: ["servicedetail_indian-smes_cat4_point1", "servicedetail_indian-smes_cat4_point2"] },
      { icon: <Lightbulb className="h-8 w-8 text-primary" />, points: ["servicedetail_indian-smes_cat5_point1", "servicedetail_indian-smes_cat5_point2"] },
    ],
  },
  {
    id: "japanese-smes",
    categories: [
      { icon: <Search className="h-8 w-8 text-primary" />, points: ["servicedetail_japanese-smes_cat1_point1", "servicedetail_japanese-smes_cat1_point2"] },
      { icon: <Handshake className="h-8 w-8 text-primary" />, points: ["servicedetail_japanese-smes_cat2_point1", "servicedetail_japanese-smes_cat2_point2"] },
      { icon: <Plane className="h-8 w-8 text-primary" />, points: ["servicedetail_japanese-smes_cat3_point1", "servicedetail_japanese-smes_cat3_point2"] },
      { icon: <Users className="h-8 w-8 text-primary" />, points: ["servicedetail_japanese-smes_cat4_point1", "servicedetail_japanese-smes_cat4_point2"] },
      { icon: <Zap className="h-8 w-8 text-primary" />, points: ["servicedetail_japanese-smes_cat5_point1", "servicedetail_japanese-smes_cat5_point2"] },
    ],
  },
  {
    id: "company-registration-jp-in",
    categories: [
      { icon: <Rocket className="h-8 w-8 text-primary" />, points: ["servicedetail_company-registration-jp-in_cat1_point1"] },
      { icon: <Target className="h-8 w-8 text-primary" />, points: [{ mainKey: "servicedetail_company-registration-jp-in_cat2_point1_main", subKeys: ["servicedetail_company-registration-jp-in_cat2_point1_sub1", "servicedetail_company-registration-jp-in_cat2_point1_sub2", "servicedetail_company-registration-jp-in_cat2_point1_sub3"]}, "servicedetail_company-registration-jp-in_cat2_point2"] },
      { icon: <FileSignature className="h-8 w-8 text-primary" />, points: ["servicedetail_company-registration-jp-in_cat3_point1", "servicedetail_company-registration-jp-in_cat3_point2", "servicedetail_company-registration-jp-in_cat3_point3", "servicedetail_company-registration-jp-in_cat3_point4"] },
      { icon: <Scale className="h-8 w-8 text-primary" />, points: ["servicedetail_company-registration-jp-in_cat4_point1", "servicedetail_company-registration-jp-in_cat4_point2", "servicedetail_company-registration-jp-in_cat4_point3", "servicedetail_company-registration-jp-in_cat4_point4"] },
      { icon: <Building2 className="h-8 w-8 text-primary" />, points: ["servicedetail_company-registration-jp-in_cat5_point1", "servicedetail_company-registration-jp-in_cat5_point2"] },
      { icon: <Wallet className="h-8 w-8 text-primary" />, points: ["servicedetail_company-registration-jp-in_cat6_point1", "servicedetail_company-registration-jp-in_cat6_point2", "servicedetail_company-registration-jp-in_cat6_point3"] },
      { icon: <Users2 className="h-8 w-8 text-primary" />, points: ["servicedetail_company-registration-jp-in_cat7_point1", "servicedetail_company-registration-jp-in_cat7_point2", "servicedetail_company-registration-jp-in_cat7_point3"] },
      { icon: <ConciergeBell className="h-8 w-8 text-primary" />, points: ["servicedetail_company-registration-jp-in_cat8_point1", "servicedetail_company-registration-jp-in_cat8_point2", "servicedetail_company-registration-jp-in_cat8_point3"] }
    ],
  },
  {
    id: "digital-services",
    categories: [
      { icon: <Monitor className="h-8 w-8 text-primary" />, points: ["servicedetail_digital-services_cat1_point1", "servicedetail_digital-services_cat1_point2", "servicedetail_digital-services_cat1_point3", "servicedetail_digital-services_cat1_point4", "servicedetail_digital-services_cat1_point5"] },
      { icon: <Megaphone className="h-8 w-8 text-primary" />, points: ["servicedetail_digital-services_cat2_point1", "servicedetail_digital-services_cat2_point2", "servicedetail_digital-services_cat2_point3", "servicedetail_digital-services_cat2_point4", "servicedetail_digital-services_cat2_point5"] },
      { icon: <Palette className="h-8 w-8 text-primary" />, points: ["servicedetail_digital-services_cat3_point1", "servicedetail_digital-services_cat3_point2", "servicedetail_digital-services_cat3_point3", "servicedetail_digital-services_cat3_point4"] },
      { icon: <Building className="h-8 w-8 text-primary" />, points: ["servicedetail_digital-services_cat4_point1", "servicedetail_digital-services_cat4_point2", "servicedetail_digital-services_cat4_point3"] },
    ],
  },
  {
    id: "company-registration-in-jp",
    categories: [
      { icon: <Scale className="h-8 w-8 text-primary" />, points: [{ mainKey: "servicedetail_company-registration-in-jp_cat1_point1_main", subKeys: ["servicedetail_company-registration-in-jp_cat1_point1_sub1", "servicedetail_company-registration-in-jp_cat1_point1_sub2", "servicedetail_company-registration-in-jp_cat1_point1_sub3", "servicedetail_company-registration-in-jp_cat1_point1_sub4"] }, "servicedetail_company-registration-in-jp_cat1_point2", "servicedetail_company-registration-in-jp_cat1_point3"] },
      { icon: <FileSignature className="h-8 w-8 text-primary" />, points: ["servicedetail_company-registration-in-jp_cat2_point1", "servicedetail_company-registration-in-jp_cat2_point2", "servicedetail_company-registration-in-jp_cat2_point3", "servicedetail_company-registration-in-jp_cat2_point4", "servicedetail_company-registration-in-jp_cat2_point5"] },
      { icon: <Landmark className="h-8 w-8 text-primary" />, points: ["servicedetail_company-registration-in-jp_cat3_point1", "servicedetail_company-registration-in-jp_cat3_point2", "servicedetail_company-registration-in-jp_cat3_point3", "servicedetail_company-registration-in-jp_cat3_point4"] },
      { icon: <Handshake className="h-8 w-8 text-primary" />, points: ["servicedetail_company-registration-in-jp_cat4_point1", "servicedetail_company-registration-in-jp_cat4_point2", "servicedetail_company-registration-in-jp_cat4_point3"] },
      { icon: <ConciergeBell className="h-8 w-8 text-primary" />, points: ["servicedetail_company-registration-in-jp_cat5_point1", "servicedetail_company-registration-in-jp_cat5_point2", "servicedetail_company-registration-in-jp_cat5_point3"] },
      { icon: <Award className="h-8 w-8 text-primary" />, points: ["servicedetail_company-registration-in-jp_cat6_point1", "servicedetail_company-registration-in-jp_cat6_point2", "servicedetail_company-registration-in-jp_cat6_point3"] },
    ],
  },
  {
    id: "startup-support",
    categories: [
        { icon: <Lightbulb className="h-8 w-8 text-primary" />, points: ["servicedetail_startup-support_cat1_point1", "servicedetail_startup-support_cat1_point2", "servicedetail_startup-support_cat1_point3"] },
        { icon: <Wallet className="h-8 w-8 text-primary" />, points: ["servicedetail_startup-support_cat2_point1", "servicedetail_startup-support_cat2_point2", "servicedetail_startup-support_cat2_point3"] },
        { icon: <Plane className="h-8 w-8 text-primary" />, points: ["servicedetail_startup-support_cat3_point1", "servicedetail_startup-support_cat3_point2", "servicedetail_startup-support_cat3_point3"] },
        { icon: <Zap className="h-8 w-8 text-primary" />, points: ["servicedetail_startup-support_cat4_point1", "servicedetail_startup-support_cat4_point2", "servicedetail_startup-support_cat4_point3"] },
        { icon: <Award className="h-8 w-8 text-primary" />, points: ["servicedetail_startup-support_cat5_point1", "servicedetail_startup-support_cat5_point2", "servicedetail_startup-support_cat5_point3"] },
        { icon: <Globe className="h-8 w-8 text-primary" />, points: ["servicedetail_startup-support_cat6_point1", "servicedetail_startup-support_cat6_point2", "servicedetail_startup-support_cat6_point3"] },
    ],
  },
  {
    id: "management-training",
    categories: [
        { icon: <Sparkles className="h-8 w-8 text-primary" />, points: ["servicedetail_management-training_cat1_point1", "servicedetail_management-training_cat1_point2", "servicedetail_management-training_cat1_point3"] },
        { icon: <Zap className="h-8 w-8 text-primary" />, points: ["servicedetail_management-training_cat2_point1", "servicedetail_management-training_cat2_point2", "servicedetail_management-training_cat2_point3"] },
        { icon: <Award className="h-8 w-8 text-primary" />, points: ["servicedetail_management-training_cat3_point1", "servicedetail_management-training_cat3_point2", "servicedetail_management-training_cat3_point3"] },
        { icon: <Target className="h-8 w-8 text-primary" />, points: ["servicedetail_management-training_cat4_point1", "servicedetail_management-training_cat4_point2", "servicedetail_management-training_cat4_point3"] },
        { icon: <Users className="h-8 w-8 text-primary" />, points: ["servicedetail_management-training_cat5_point1", "servicedetail_management-training_cat5_point2", "servicedetail_management-training_cat5_point3"] },
        { icon: <Lightbulb className="h-8 w-8 text-primary" />, points: ["servicedetail_management-training_cat6_point1", "servicedetail_management-training_cat6_point2", "servicedetail_management-training_cat6_point3"] },
        { icon: <Globe className="h-8 w-8 text-primary" />, points: ["servicedetail_management-training_cat7_point1", "servicedetail_management-training_cat7_point2", "servicedetail_management-training_cat7_point3"] },
    ],
  }
].map(service => ({
  ...service,
  titleKey: `servicedetail_${service.id}_title`,
  descriptionKey: `servicedetail_${service.id}_description`,
  categories: service.categories.map((cat, index) => ({
    ...cat,
    titleKey: `servicedetail_${service.id}_cat${index + 1}_title`,
  }))
}));


const ServiceSection = ({ service }: { service: Service }) => {
    const { t } = useTranslation();
    return (
        <Card className="p-6">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-headline">{t(service.titleKey)}</CardTitle>
                <CardDescription className="max-w-3xl mx-auto pt-4 text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">
                    {t(service.descriptionKey)}
                </CardDescription>
            </CardHeader>
            <CardContent className="mt-8">
                <Accordion type="single" collapsible className="w-full" defaultValue={t(service.categories[0].titleKey)}>
                    {service.categories.map((category: ServiceCategory) => (
                        <AccordionItem value={t(category.titleKey)} key={t(category.titleKey)} className="border-b py-2">
                            <AccordionTrigger className="text-xl font-headline hover:no-underline py-4">
                                <div className="flex items-center gap-4 text-left">
                                    <div className="bg-primary/5 p-2 rounded-lg">
                                        {category.icon}
                                    </div>
                                    <span className="text-primary">{t(category.titleKey)}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 pl-16">
                                <ul className="list-disc space-y-3 text-muted-foreground text-base">
                                    {category.points.map((point, index: number) => (
                                        <li key={index} className="pl-2">
                                            {typeof point === 'string' ? t(point) : t(point.mainKey)}
                                            {typeof point !== 'string' && point.subKeys && Array.isArray(point.subKeys) && (
                                                <ul className="list-circle pl-8 mt-3 space-y-2 text-sm text-foreground/80">
                                                    {point.subKeys.map((subPointKey: string, subIndex: number) => (
                                                        <li key={subIndex}>{t(subPointKey)}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
};

const sectionIcons = [
    <Handshake className="h-8 w-8 text-primary" />,
    <Briefcase className="h-8 w-8 text-primary" />,
    <Target className="h-8 w-8 text-primary" />,
    <FileSignature className="h-8 w-8 text-primary" />,
    <Scale className="h-8 w-8 text-primary" />,
    <Building2 className="h-8 w-8 text-primary" />,
    <Globe className="h-8 w-8 text-primary" />,
    <Lightbulb className="h-8 w-8 text-primary" />,
    <Zap className="h-8 w-8 text-primary" />,
    <Award className="h-8 w-8 text-primary" />,
    <Users className="h-8 w-8 text-primary" />,
    <GraduationCap className="h-8 w-8 text-primary" />,
];

// Renders a service from the CMS (title + accordion sections).
const CmsServiceSection = ({ service }: { service: any }) => {
    return (
        <Card className="p-6">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-headline">{service.title}</CardTitle>
                {service.shortDescription ? (
                    <CardDescription className="max-w-3xl mx-auto pt-4 text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">
                        {service.shortDescription}
                    </CardDescription>
                ) : null}
            </CardHeader>
            <CardContent className="mt-8">
                <Accordion type="single" collapsible className="w-full" defaultValue={service.sections?.[0]?.title}>
                    {(service.sections || []).map((section: any, i: number) => (
                        <AccordionItem value={section.title} key={section.title || i} className="border-b py-2">
                            <AccordionTrigger className="text-xl font-headline hover:no-underline py-4">
                                <div className="flex items-center gap-4 text-left">
                                    <div className="bg-primary/5 p-2 rounded-lg">
                                        {sectionIcons[i % sectionIcons.length]}
                                    </div>
                                    <span className="text-primary">{section.title}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 pl-16">
                                <ul className="list-disc space-y-3 text-muted-foreground text-base">
                                    {(section.items || []).map((item: any, index: number) => (
                                        <li key={index} className="pl-2">
                                            {item.text}
                                            {Array.isArray(item.subItems) && item.subItems.length > 0 && (
                                                <ul className="list-circle pl-8 mt-3 space-y-2 text-sm text-foreground/80">
                                                    {item.subItems.map((sub: string, subIndex: number) => (
                                                        <li key={subIndex}>{sub}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
};

export default function ServiceDetailPage() {
    const params = useParams();
    const [cmsService, setCmsService] = useState<any>(null);
    const [cmsLoaded, setCmsLoaded] = useState(false);

    useEffect(() => {
        client.fetch(SERVICE_DETAIL_QUERY, { slug: params.id })
            .then((d) => { setCmsService(d); setCmsLoaded(true); })
            .catch(() => setCmsLoaded(true));
    }, [params.id]);

    const service = allServicesData.find(s => s.id === params.id);

    if (cmsLoaded && !cmsService && !service) {
        notFound();
    }

    // CMS version wins when the doc has sections; otherwise the built-in
    // version below is shown (it stays as the fallback).
    if (cmsService?.sections?.length) {
        return (
            <div className="container py-12">
                <div className="max-w-5xl mx-auto space-y-12">
                    <CmsServiceSection service={cmsService} />
                </div>
            </div>
        );
    }

    if (!service) {
        return null;
    }

  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto space-y-12">
        <ServiceSection service={service} />
      </div>
    </div>
  );
}
