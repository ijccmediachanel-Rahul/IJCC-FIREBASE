
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Handshake, School, Lightbulb, Briefcase, Building, Landmark, Globe, Zap, University, Plane } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { client } from "@/sanity/lib/client";
import { SERVICES_QUERY } from "@/sanity/lib/queries";

const serviceIconMap: Record<string, ReactNode> = {
  School: <School className="h-10 w-10 text-primary" />,
  University: <University className="h-10 w-10 text-primary" />,
  Handshake: <Handshake className="h-10 w-10 text-primary" />,
  Briefcase: <Briefcase className="h-10 w-10 text-primary" />,
  Building: <Building className="h-10 w-10 text-primary" />,
  Landmark: <Landmark className="h-10 w-10 text-primary" />,
  Globe: <Globe className="h-10 w-10 text-primary" />,
  Lightbulb: <Lightbulb className="h-10 w-10 text-primary" />,
  Zap: <Zap className="h-10 w-10 text-primary" />,
};

const servicesListRaw = [
    { id: "indian-schools", icon: <School className="h-10 w-10 text-primary" /> },
    { id: "indian-universities", icon: <University className="h-10 w-10 text-primary" /> },
    { id: "indian-smes", icon: <Handshake className="h-10 w-10 text-primary" /> },
    { id: "japanese-smes", icon: <Briefcase className="h-10 w-10 text-primary" /> },
    { id: "company-registration-jp-in", icon: <Building className="h-10 w-10 text-primary" /> },
    { id: "company-registration-in-jp", icon: <Landmark className="h-10 w-10 text-primary" /> },
    { id: "digital-services", icon: <Plane className="h-10 w-10 text-primary" /> },
    { id: "startup-support", icon: <Lightbulb className="h-10 w-10 text-primary" /> },
    { id: "management-training", icon: <Zap className="h-10 w-10 text-primary" /> },
];


export default function ServicesPage() {
  const { t, language } = useTranslation();
  const [cmsServices, setCmsServices] = useState<any[]>([]);

  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await client.fetch(SERVICES_QUERY);
        setCmsServices(data);
      } catch (error) {
        console.error("Failed to fetch services from Sanity", error);
      }
    }
    fetchServices();
  }, []);

  const servicesList = servicesListRaw.map(service => ({
    ...service,
    title: t(`service_${service.id}_title`),
    description: t(`service_${service.id}_description`),
  }));

  return (
    <div className="container py-12">
      <div className="space-y-4 mb-12 text-center">
        <h1 className="text-4xl font-headline tracking-tighter sm:text-5xl">{t('services_title')}</h1>
        <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
          {t('services_description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cmsServices.length > 0 && language !== 'ja' ? cmsServices.map((service: any, i: number) => (
            <Link href={`/services/${service.slug}`} key={service._id}>
                <Card className="h-full flex flex-col transform transition-transform duration-300 hover:-translate-y-2 cursor-pointer">
                    <CardHeader>
                        <div className="flex items-center gap-4 mb-2">
                            {serviceIconMap[service.iconName] || Object.values(serviceIconMap)[i % 9]}
                            <CardTitle className="font-headline text-2xl">{service.title}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <CardDescription>{service.shortDescription}</CardDescription>
                    </CardContent>
                </Card>
            </Link>
        )) : servicesList.map(service => (
            <Link href={`/services/${service.id}`} key={service.id}>
                <Card className="h-full flex flex-col transform transition-transform duration-300 hover:-translate-y-2 cursor-pointer">
                    <CardHeader>
                        <div className="flex items-center gap-4 mb-2">
                            {service.icon}
                            <CardTitle className="font-headline text-2xl">{service.title}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <CardDescription>{service.description}</CardDescription>
                    </CardContent>
                </Card>
            </Link>
        ))}
      </div>
    </div>
  );
}
