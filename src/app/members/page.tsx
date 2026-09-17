
"use client";

import { MembershipDetails } from "@/components/membership-details";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { ASSOCIATES_QUERY, MEMBERS_PAGE_QUERY } from "@/sanity/lib/queries";

const defaultMembers = [
    { name: "All India Management Association", href: "https://www.aima.in", logoUrl: "https://www.aima.in/img/logo.png", hint: "company logo" },
    { name: "Aranca", href: "https://www.aranca.com", logoUrl: "https://www.aranca.com/assets/images/icons/aranca-logo-0203.png", hint: "company logo" },
    { name: "AJU Hotels", href: "https://www.ajujapanesehotels.com/english/", logoUrl: "https://www.ajujapanesehotels.com/images/logo.png", hint: "company logo" },
    { name: "Veena Solar", href: "https://veenapower.com", logoUrl: "https://ui-avatars.com/api/?name=Veena+Solar&background=random", hint: "company logo" },
    { name: "Aamida Infotech", href: "http://www.aamidainfotech.com", logoUrl: "https://i.postimg.cc/mr4wdjkb/ammida.jpg", hint: "company logo" },
    { name: "JETRO", href: "https://www.jetro.go.jp/en/", logoUrl: "https://pbs.twimg.com/profile_images/1138406890595971073/o01XWG4J_400x400.png", hint: "organization logo" },
    { name: "JICA", href: "https://www.jica.go.jp/english/overseas/india/index.html", logoUrl: "https://www.jica.go.jp/english/assets/img/logo-en.png", hint: "organization logo" },
    { name: "All Nippon Airways", href: "https://www.ana.co.jp/en/in/", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8d/All_Nippon_Airways_Logo.svg", hint: "airline logo" },
    { name: "Indian Council for Cultural Relations", href: "https://iccr.gov.in/home", logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEYuDws_3GHEcMoqAZ6w9ufbUWnwZcoKyTKg&s", hint: "organization logo" },
    { name: "Embassy of India, Tokyo", href: "https://www.indembassy-tokyo.gov.in/", logoUrl: "https://www.indembassy-tokyo.gov.in/public_files/assets/images/common_images/logo_english_2021.png", hint: "embassy logo" },
    { name: "Consulate General of India, Osaka-Kobe", href: "https://www.indconosaka.gov.in/", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg", hint: "embassy logo" },
    { name: "Government of Haryana", href: "https://haryana.gov.in/", logoUrl: "https://i.postimg.cc/j2qYy3HN/haryana-govt11.png", hint: "government logo", className: "p-2 bg-white rounded-md"},
    { name: "Government of Uttar Pradesh", href: "https://up.gov.in/en", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Seal_of_Uttar_Pradesh.svg", hint: "government logo" },
    { name: "Japan Chamber of Commerce and Industry in India", href: "https://jccii.in/english", logoUrl: "https://jccii.in/wp-content/uploads/2020/02/logo.png", hint: "organization logo" },
    { name: "Osaka Chamber of Commerce and Industry", href: "https://www.osaka.cci.or.jp/e/", logoUrl: "https://www.osaka.cci.or.jp/e/common/img/logo_sitename.png", hint: "organization logo" },
    { name: "North Eastern Council", href: "https://necouncil.gov.in/", logoUrl: "https://abhimanuias.com/userfiles/image/North-Eastern-Council.jpg", hint: "organization logo" },
    { name: "The Japan Foundation", href: "https://nd.jpf.go.jp/", logoUrl: "https://nd.jpf.go.jp/wp-content/uploads/2022/07/JFND_logo_bgtransparent-1.png", hint: "organization logo" },
    { name: "India Cellular & Electronics Association", href: "https://icea.org.in/", logoUrl: "https://timestech.in/wp-content/uploads/2025/08/Untitled-design-2025-08-04T153554.381.jpg", hint: "organization logo" },
    { name: "The Shipbuilders' Association of Japan", href: "https://www.seaj.or.jp/", logoUrl: "https://www.seaj.or.jp/images/logo.png", hint: "organization logo" },
    { name: "Enpointe Adwisers", href: "https://enpointeadwisers.com/", logoUrl: "https://enpointeadwisers.com/wp-content/uploads/2024/02/EPA-Logo-Black.png", hint: "company logo" },
    { name: "BLS International", href: "https://www.blsinternational.com/", logoUrl: "https://www.blsinternational.com/assets/images/bls-logo.png", hint: "company logo" },
    { name: "Harkesh", href: "https://www.harkesh.com/", logoUrl: "https://www.harkesh.com/wp-content/uploads/2024/01/new-logo1.png", hint: "company logo" },
    { name: "Suman Khaitan & Co", href: "https://sumankhaitanco.in/", logoUrl: "https://sumankhaitanco.in/wp-content/uploads/2020/01/toplogo.png", hint: "company logo" },
    { name: "Bhoruka Extrusions", href: "https://bhorukaextrusions.com/", logoUrl: "https://i0.wp.com/bhorukaextrusions.com/wp-content/uploads/2023/03/215x68_logo.png?fit=215%2C68&ssl=1", hint: "company logo" },
    { name: "Digitup Solutions", href: "https://www.digitup.in", logoUrl: "https://images.ctfassets.net/y2mincmqvg0k/5mgIg4WYjVs3S4EbjYcMqy/e46f1cce42fc0813566f4f7c96a53ce3/header-logo-digitup-solutions-pvt-ltd.svg", hint: "company logo" },
    { name: "Kamal Coach Works Pvt. Ltd.", href: "https://www.kamalcoach.com", logoUrl: "https://i.ibb.co/HLQxTMWQ/kamal-coach.png", hint: "company logo" },
    { name: "Storytelling", href: "https://storytelling-jp.com", logoUrl: "https://i.ibb.co/pBQNz0JN/storytelling.png", hint: "company logo" },
    { name: "EXI", href: "https://exi.co.in", logoUrl: "https://i.ibb.co/rG4XYfBV/excactitude.png", hint: "company logo" },
    { name: "Unitherm Engineers", href: "https://unithermengineers.com", logoUrl: "https://i.ibb.co/mF8xLc2s/unitherm-logo.png", hint: "company logo" },
];


export default function MembersPage() {
  const { t } = useTranslation();
  const [cmsAssociates, setCmsAssociates] = useState<any[]>([]);
  const [cmsPage, setCmsPage] = useState<any>(null);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const [assocData, pageData] = await Promise.all([
          client.fetch(ASSOCIATES_QUERY),
          client.fetch(MEMBERS_PAGE_QUERY)
        ]);
        setCmsAssociates(assocData);
        setCmsPage(pageData);
      } catch (error) {
        console.error("Failed to fetch members from Sanity", error);
      }
    }
    fetchMembers();
  }, []);

  // Associate logos come from the CMS when available, otherwise defaults.
  const members = (cmsAssociates.length > 0 ? cmsAssociates : defaultMembers).map((m: any) => ({
    name: m.name,
    href: m.website || m.href,
    logoUrl: m.logoUrl,
    className: m.cardClass || m.className || '',
  }));

  return (
    <div className="container py-12">
      <div className="mb-16">
        <MembershipDetails />
      </div>

       <div className="text-center mt-16 pb-16 border-b">
          <Button asChild size="lg" className="rounded-full px-12 h-16 text-xl shadow-xl hover:shadow-2xl transition-all">
            <Link href="/membership-application">
              <Mail className="mr-3 h-6 w-6" /> {t('members_applyButton')}
            </Link>
          </Button>
      </div>

      <div className="space-y-4 my-20 text-center">
        <h2 className="text-4xl font-headline tracking-tighter sm:text-5xl text-primary">
          {cmsPage?.associatesTitle || t('members_associatesTitle')}
        </h2>
        <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl font-medium">
          {cmsPage?.associatesDescription || t('members_associatesDescription')}
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
          {members.map((member) => (
            <Link href={member.href} key={member.name} target="_blank" rel="noopener noreferrer" className="block">
              <Card className="flex items-center justify-center p-6 h-40 transition-all transform hover:scale-105 hover:shadow-xl border-2 border-primary/5">
                <CardContent className="p-0 flex items-center justify-center h-full w-full">
                    <Image 
                        src={member.logoUrl} 
                        alt={member.name} 
                        width={150} 
                        height={80} 
                        className={`object-contain ${member.className || ''}`}
                        
                    />
                </CardContent>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  );
}
