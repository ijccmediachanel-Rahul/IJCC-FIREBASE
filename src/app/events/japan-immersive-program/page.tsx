
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/use-translation";
import { 
  Users, 
  Star, 
  GraduationCap, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  HeartHandshake,
  Navigation,
  QrCode
} from "lucide-react";
import Link from "next/link";
import placeholders from "@/app/lib/placeholder-images.json";

export default function JapanImmersiveProgramPage() {
  const { t, language } = useTranslation();

  return (
    <div className="min-h-screen bg-sakura-pink/5">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="container relative z-10">
          <div className="max-w-3xl space-y-6">
            <Badge className="bg-accent text-accent-foreground hover:bg-accent/90 px-4 py-1 text-sm font-bold uppercase tracking-widest">
              {t('immersive_program_org')}
            </Badge>
            <h1 className="text-5xl font-headline tracking-tight lg:text-7xl">
              {t('immersive_program_title')}
            </h1>
            <p className="text-2xl font-headline italic text-accent">
              {t('immersive_program_tagline')}
            </p>
            <p className="text-xl text-primary-foreground/90 max-w-2xl leading-relaxed">
              {t('immersive_program_overview')}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full border border-white/20">
                <Clock className="h-5 w-5 text-accent" />
                <span className="font-semibold text-lg">{t('immersive_program_duration_stat')}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full border border-white/20">
                <Navigation className="h-5 w-5 text-accent" />
                <span className="font-semibold text-lg">
                  {language === 'ja' ? '日本（複数都市）' : 'Japan (Multiple Cities)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Visuals & Registration */}
          <div className="lg:col-span-1 space-y-8">
            <div className="sticky top-28 space-y-8">
              <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/10 bg-white">
                <Image
                  src={placeholders.japanImmersivePoster.url}
                  alt="Japan Immersion Program"
                  fill
                  className="object-cover"
                 
                  priority
                />
              </div>
              
              <Card id="registration-section" className="border-2 border-primary shadow-lg overflow-hidden scroll-mt-28">
                <CardHeader className="bg-primary text-primary-foreground text-center">
                  <CardTitle className="text-2xl font-headline flex items-center justify-center gap-2">
                    <QrCode className="h-6 w-6" /> {t('immersive_program_registration_title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6 text-center">
                  <div className="relative w-48 h-48 mx-auto flex items-center justify-center rounded-xl border-2 border-primary/10 overflow-hidden bg-white shadow-inner">
                    <Image
                      src={placeholders.japanImmersiveQr.url}
                      alt="Registration QR Code"
                      width={200}
                      height={200}
                      className="object-contain p-2"
                     
                      unoptimized
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Please scan the QR code above using your mobile device to access the official registration form.
                  </p>
                  <div className="w-full rounded-full bg-primary/5 text-primary border-2 border-dashed border-primary/30 font-bold h-14 flex items-center justify-center cursor-default">
                    {t('immersive_program_booking_button')}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/10 shadow-lg bg-white/80 backdrop-blur">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="text-xl font-headline text-primary">{t('immersive_program_contact_title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  {[
                    { icon: <Phone className="h-5 w-5" />, label: "+91 92679 19281" },
                    { icon: <Phone className="h-5 w-5" />, label: "+91 86383 38422" },
                    { icon: <Mail className="h-5 w-5" />, label: "info@ijcc.in" },
                    { icon: <Globe className="h-5 w-5" />, label: "www.ijcc.in" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-sakura-pink/10 border border-sakura-pink/20">
                      <div className="text-primary">{item.icon}</div>
                      <span className="font-semibold text-primary/80">{item.label}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column: Detailed Content */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Program Section Branding */}
            <section className="space-y-8">
              <h2 className="text-4xl font-headline text-primary border-b-4 border-accent/30 pb-2 inline-block">
                {t('immersive_program_who_title')}
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <Card className="bg-white border-2 border-primary/5 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-primary/5">
                    <CardTitle className="text-xl flex items-center gap-2 text-primary">
                      <Users className="h-6 w-6" /> {t('immersive_program_students_label')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-4">
                      {[
                        "School students seeking early global exposure",
                        "College & university students (UG / PG)",
                        "Management, Engineering, Arts & Tech backgrounds",
                        "Faculty members & coordinators"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-muted-foreground font-medium">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-white border-2 border-accent/5 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-accent/5">
                    <CardTitle className="text-xl flex items-center gap-2 text-accent">
                      <Star className="h-6 w-6" /> {t('immersive_program_aspiration_label')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-4">
                      {[
                        "Higher studies abroad",
                        "Global career pathways",
                        "Safe meaningful learning for children",
                        "International academic networking"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-muted-foreground font-medium">
                          <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Experience Section */}
            <section className="space-y-8">
              <h2 className="text-4xl font-headline text-primary border-b-4 border-accent/30 pb-2 inline-block">
                {t('immersive_program_learning_title')}
              </h2>
              <div className="grid gap-4">
                {[
                  { title: "University Visits", content: "Visits to reputed universities and colleges in Japan.", icon: <GraduationCap className="h-8 w-8" />, color: "bg-primary/10" },
                  { title: "Industry Exposure", content: "Exposure to Japanese industries, innovation & technology.", icon: <Globe className="h-8 w-8" />, color: "bg-sakura-pink/20" },
                  { title: "Personal Interaction", content: "Interaction with Japanese students, professors & professionals.", icon: <Users className="h-8 w-8" />, color: "bg-primary/10" },
                  { title: "Discipline & Ethics", content: "Understanding Japanese discipline, work culture & ethics.", icon: <HeartHandshake className="h-8 w-8" />, color: "bg-sakura-pink/20" },
                  { title: "Cultural Workshops", content: "Workshops on Japanese traditions & etiquette (Calligraphy, Origami).", icon: <Star className="h-8 w-8" />, color: "bg-primary/10" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 p-6 rounded-2xl bg-white border-2 border-primary/5 hover:border-primary/20 transition-all duration-300 shadow-sm group">
                    <div className={`flex-shrink-0 flex items-center justify-center p-4 rounded-xl ${item.color} text-primary group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-primary mb-2">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Safety & Supervision */}
            <section className="bg-white rounded-3xl p-10 shadow-xl border-2 border-primary/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-24 -mt-24" />
              <div className="relative z-10 space-y-8">
                <h2 className="text-4xl font-headline text-primary">{t('immersive_program_safety_title')}</h2>
                <div className="grid sm:grid-cols-2 gap-8">
                  {[
                    { title: "Indian Coordinators", content: "Group travel supervised by experienced Indian coordinators.", icon: <ShieldCheck className="h-6 w-6 text-primary" /> },
                    { title: "Live Tracking", content: "Safe accommodation with live location tracking technology.", icon: <Navigation className="h-6 w-6 text-primary" /> },
                    { title: "Pre-planned Itinerary", content: "Guided movements and pre-planned local support in Japan.", icon: <MapPin className="h-6 w-6 text-primary" /> },
                    { title: "IJCC Coordination", content: "Continuous 24/7 coordination by the core IJCC team.", icon: <HeartHandshake className="h-6 w-6 text-primary" /> },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="bg-primary/10 p-3 rounded-full h-fit mt-1">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-primary">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Program Schedule */}
            <section className="space-y-8">
              <h2 className="text-4xl font-headline text-primary border-b-4 border-accent/30 pb-2 inline-block">
                {t('immersive_program_schedule_title')}
              </h2>
              <Card className="border-none shadow-none bg-transparent">
                <CardContent className="p-0 space-y-6">
                  <p className="text-xl text-muted-foreground font-medium">
                    Program Available in <span className="text-primary font-bold">April, May & June</span>.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { batch: "Batch 1", dates: "4/5th April to 12th April" },
                      { batch: "Batch 2", dates: "11th April to 18/19th April" },
                      { batch: "Batch 3", dates: "18th April to 25/26th April" },
                    ].map((item, i) => (
                      <div key={i} className="bg-white p-6 rounded-2xl border-2 border-sakura-pink shadow-sm text-center">
                        <div className="text-xs font-bold text-accent uppercase mb-2">{item.batch}</div>
                        <div className="text-primary font-bold text-lg">{item.dates}</div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-muted/50 rounded-xl text-center text-sm italic">
                    *Exact dates for May & June and specific batch details are provided during enquiry.
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Closing CTA */}
            <section className="bg-primary p-12 rounded-[3rem] border-4 border-accent/30 space-y-8 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
              <div className="relative z-10">
                <h2 className="text-4xl font-headline text-white mb-6">
                  An investment in your child’s global future.
                </h2>
                <p className="text-primary-foreground/90 text-xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
                  Join the Indo-Japan Chamber of Commerce for an educational journey that builds confidence, independence, and a global mindset.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <Button size="lg" asChild className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-12 h-16 text-xl shadow-2xl uppercase tracking-widest">
                    <Link href="#registration-section">Book Now</Link>
                  </Button>
                  <Button size="lg" asChild className="rounded-full bg-white text-primary hover:bg-white/90 font-bold px-12 h-16 text-xl shadow-xl">
                    <Link href="/contact">Enquire Today</Link>
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
