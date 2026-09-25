
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, User, Rocket, Building, Landmark, Mail, Phone, Globe, ArrowRight, GraduationCap, Briefcase, Building2, Crown, Star } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslation } from "@/hooks/use-translation";
import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { MEMBERSHIP_PRICING_QUERY, SITE_SETTINGS_QUERY, MEMBERS_PAGE_QUERY } from "@/sanity/lib/queries";

const membershipTiers = [
  {
    icon: <GraduationCap className="h-10 w-10 text-primary" />,
    titleKey: "membershipTier_student_title",
    eligibilityKey: "membershipTier_student_eligibility",
    benefitsKeys: [
      "membershipTier_student_benefit1",
      "membershipTier_student_benefit2",
      "membershipTier_student_benefit3",
    ],
    priceId: "student",
    price: "₹3,000",
  },
  {
    icon: <User className="h-10 w-10 text-primary" />,
    titleKey: "membershipTier_individual_title",
    eligibilityKey: "membershipTier_individual_eligibility",
    benefitsKeys: [
      "membershipTier_individual_benefit1",
      "membershipTier_individual_benefit2",
      "membershipTier_individual_benefit3",
      "membershipTier_individual_benefit4",
      "membershipTier_individual_benefit5",
      "membershipTier_individual_benefit6",
      "membershipTier_individual_benefit7",
    ],
    priceId: "individual",
    price: "₹11,000",
  },
  {
    icon: <Rocket className="h-10 w-10 text-primary" />,
    titleKey: "membershipTier_startup_title",
    eligibilityKey: "membershipTier_startup_eligibility",
    benefitsKeys: [
      "membershipTier_startup_benefit1",
      "membershipTier_startup_benefit2",
      "membershipTier_startup_benefit3",
      "membershipTier_startup_benefit4",
      "membershipTier_startup_benefit5",
      "membershipTier_startup_benefit6",
      "membershipTier_startup_benefit7",
    ],
    priceId: "startup",
    price: "₹15,000",
  },
  {
    icon: <Briefcase className="h-10 w-10 text-primary" />,
    titleKey: "membershipTier_smeStandard_title",
    eligibilityKey: "membershipTier_smeStandard_eligibility",
    benefitsKeys: [
      "membershipTier_smeStandard_benefit1",
      "membershipTier_smeStandard_benefit2",
      "membershipTier_smeStandard_benefit3",
      "membershipTier_smeStandard_benefit4",
      "membershipTier_smeStandard_benefit5",
      "membershipTier_smeStandard_benefit6",
      "membershipTier_smeStandard_benefit7",
      "membershipTier_smeStandard_benefit8",
    ],
    priceId: "sme-standard",
    price: "₹35,000",
  },
  {
    icon: <Briefcase className="h-10 w-10 text-primary" />,
    titleKey: "membershipTier_smePlus_title",
    eligibilityKey: "membershipTier_smePlus_eligibility",
    benefitsKeys: [
      "membershipTier_smePlus_benefit1",
      "membershipTier_smePlus_benefit2",
      "membershipTier_smePlus_benefit3",
      "membershipTier_smePlus_benefit4",
      "membershipTier_smePlus_benefit5",
      "membershipTier_smePlus_benefit6",
      "membershipTier_smePlus_benefit7",
    ],
    priceId: "sme-plus",
    price: "₹75,000",
  },
  {
    icon: <Building2 className="h-10 w-10 text-primary" />,
    titleKey: "membershipTier_corporateStandard_title",
    eligibilityKey: "membershipTier_corporateStandard_eligibility",
    benefitsKeys: [
      "membershipTier_corporateStandard_benefit1",
      "membershipTier_corporateStandard_benefit2",
      "membershipTier_corporateStandard_benefit3",
      "membershipTier_corporateStandard_benefit4",
      "membershipTier_corporateStandard_benefit5",
      "membershipTier_corporateStandard_benefit6",
      "membershipTier_corporateStandard_benefit7",
      "membershipTier_corporateStandard_benefit8",
    ],
    priceId: "corporate-standard",
    price: "₹1,00,000",
  },
  {
    icon: <Crown className="h-10 w-10 text-primary" />,
    titleKey: "membershipTier_corporatePremium_title",
    eligibilityKey: "membershipTier_corporatePremium_eligibility",
    benefitsKeys: [
      "membershipTier_corporatePremium_benefit1",
      "membershipTier_corporatePremium_benefit2",
      "membershipTier_corporatePremium_benefit3",
      "membershipTier_corporatePremium_benefit4",
      "membershipTier_corporatePremium_benefit5",
      "membershipTier_corporatePremium_benefit6",
      "membershipTier_corporatePremium_benefit7",
      "membershipTier_corporatePremium_benefit8",
    ],
    priceId: "corporate-premium",
    price: "₹2,50,000",
  },
  {
    icon: <Crown className="h-10 w-10 text-primary" />,
    titleKey: "membershipTier_patron_title",
    eligibilityKey: "membershipTier_patron_eligibility",
    benefitsKeys: [
      "membershipTier_patron_benefit1",
      "membershipTier_patron_benefit2",
      "membershipTier_patron_benefit3",
      "membershipTier_patron_benefit4",
      "membershipTier_patron_benefit5",
      "membershipTier_patron_benefit6",
      "membershipTier_patron_benefit7",
      "membershipTier_patron_benefit8",
      "membershipTier_patron_benefit9",
      "membershipTier_patron_benefit10",
      "membershipTier_patron_benefit11",
    ],
    priceId: "patron",
    price: "₹5,00,000",
  },
  {
    icon: <Star className="h-10 w-10 text-primary" />,
    titleKey: "membershipTier_strategicPlatinum_title",
    eligibilityKey: "membershipTier_strategicPlatinum_eligibility",
    benefitsKeys: [
      "membershipTier_strategicPlatinum_benefit1",
      "membershipTier_strategicPlatinum_benefit2",
      "membershipTier_strategicPlatinum_benefit3",
      "membershipTier_strategicPlatinum_benefit4",
      "membershipTier_strategicPlatinum_benefit5",
      "membershipTier_strategicPlatinum_benefit6",
      "membershipTier_strategicPlatinum_benefit7",
      "membershipTier_strategicPlatinum_benefit8",
      "membershipTier_strategicPlatinum_benefit9",
    ],
    priceId: "strategic-platinum",
    price: "₹10,00,000+",
  },
];

const TierCard = ({ tier }: { tier: any }) => {
    const { user, loading } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const { t } = useTranslation();

    const handleGetStarted = () => {
        if (!user) {
            toast({
                title: "Login Required",
                description: "Please login to apply for membership.",
                variant: "destructive",
            });
            router.push('/login');
        } else {
            router.push(`/membership-application?tier=${tier.priceId}`);
        }
    };

    return (
        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow border-2 border-primary/5">
            <CardHeader>
              <div className="flex items-start gap-4 mb-2">
                <div className="bg-primary/5 p-3 rounded-2xl">{tier.icon}</div>
                <div className="flex-1">
                    <CardTitle className="font-headline text-2xl text-primary">{tier.title}</CardTitle>
                    <div className="flex items-baseline gap-2 pt-2">
                        <span className="text-3xl font-bold text-logo-blue">{tier.price}</span>
                    </div>
                </div>
              </div>
              <CardDescription className="font-medium text-muted-foreground">{tier.eligibility}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3 pt-4 border-t border-primary/10">
                {tier.benefits.map((benefit: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground leading-snug">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-6">
                <Button onClick={handleGetStarted} className="w-full h-12 rounded-xl text-base font-bold shadow-md hover:shadow-xl transition-all" disabled={loading}>
                    {t('membershipDetails_getStarted')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
};

export function MembershipDetails() {
  const { t, language } = useTranslation();
  const [pricingData, setPricingData] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [mp, setMp] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [pData, sData, mpData] = await Promise.all([
          client.fetch(MEMBERSHIP_PRICING_QUERY, {}, { cache: 'no-store' }),
          client.fetch(SITE_SETTINGS_QUERY, {}, { cache: 'no-store' }),
          client.fetch(MEMBERS_PAGE_QUERY, {}, { cache: 'no-store' })
        ]);
        if (pData && pData.length > 0) setPricingData(pData);
        if (sData) setSettings(sData);
        if (mpData) setMp(mpData);
      } catch (error) {
        console.error('Failed to fetch from Sanity', error);
      }
    }
    fetchData();
  }, []);

  const formatCmsPrice = (p: any) => {
    const symbol = p.currency === 'INR' ? '₹' : p.currency === 'USD' ? '$' : p.currency === 'JPY' ? '¥' : (p.currency || '₹');
    return `${symbol}${Number(p.price).toLocaleString('en-IN')}`;
  };

  // Tiers come from the CMS (matched by tierId) when available,
  // otherwise the built-in list below is shown.
  const cards = (pricingData.length > 0 && language !== 'ja')
    ? [...pricingData]
        .filter((p: any) => p.tierId)
        .sort((a: any, b: any) => (a.order ?? 99) - (b.order ?? 99))
        .map((p: any, i: number) => {
          const base = membershipTiers.find((tier) => tier.priceId === (p.tierId || '').toLowerCase());
          return {
            priceId: p.tierId,
            icon: base?.icon ?? <Star key="cms-star" className="h-10 w-10 text-primary" />,
            title: p.tierName,
            eligibility: p.eligibility || '',
            benefits: Array.isArray(p.benefits) && p.benefits.length > 0 ? p.benefits : [],
            price: typeof p.price === 'number' ? formatCmsPrice(p) : p.price,
          };
        })
    : membershipTiers.map((tier) => ({
        priceId: tier.priceId,
        icon: tier.icon,
        title: t(tier.titleKey),
        eligibility: t(tier.eligibilityKey),
        benefits: tier.benefitsKeys.map((k) => t(k)),
        price: tier.price,
      }));

  const rulesList = (mp?.rules?.length && language !== 'ja')
    ? mp.rules
    : [1, 2, 3, 4, 5].map((n) => t(`membershipRules_rule${n}`));

  return (
    <div className="space-y-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((tier) => (
          <TierCard key={tier.priceId} tier={tier} />
        ))}
          <Card className="lg:col-span-2 border-2 border-primary/20 bg-primary/5 shadow-xl">
            <CardHeader className="text-center sm:text-left">
                <CardTitle className="font-headline text-3xl text-primary">{language === 'ja' ? t('membershipDetails_paymentTitle') : (mp?.paymentTitle || t('membershipDetails_paymentTitle'))}</CardTitle>
                <CardDescription className="text-base font-medium">{language === 'ja' ? t('membershipDetails_paymentSubtitle') : (mp?.paymentSubtitle || t('membershipDetails_paymentSubtitle'))}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-12 pb-10">
                <div className="space-y-4 text-muted-foreground flex-1 text-center sm:text-left">
                    <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-x-4 gap-y-2 text-sm">
                        <span className="font-bold text-foreground">{language === 'ja' ? t('membershipDetails_accountNameLabel') : (mp?.accountNameLabel || t('membershipDetails_accountNameLabel'))}:</span>
                        <span className="font-medium">{mp?.accountName || "INDO JAPAN CHAMBER OF COMMERCE"}</span>
                        
                        <span className="font-bold text-foreground">{language === 'ja' ? t('membershipDetails_bankNameLabel') : (mp?.bankNameLabel || t('membershipDetails_bankNameLabel'))}:</span>
                        <span className="font-medium">{mp?.bankName || "IDFC First Bank"}</span>
                        
                        <span className="font-bold text-foreground">{language === 'ja' ? t('membershipDetails_accountNoLabel') : (mp?.accountNoLabel || t('membershipDetails_accountNoLabel'))}:</span>
                        <span className="font-bold text-logo-blue text-lg">{mp?.accountNo || "10226043148"}</span>
                        
                        <span className="font-bold text-foreground">{language === 'ja' ? t('membershipDetails_branchLabel') : (mp?.branchLabel || t('membershipDetails_branchLabel'))}:</span>
                        <span className="font-medium">{mp?.branch || "Crossing Republic-Ghaziabad"}</span>
                        
                        <span className="font-bold text-foreground">{language === 'ja' ? t('membershipDetails_ifscCodeLabel') : (mp?.ifscCodeLabel || t('membershipDetails_ifscCodeLabel'))}:</span>
                        <span className="font-bold tracking-wider text-logo-blue">{mp?.ifscCode || "IDFB0021413"}</span>
                        
                        <span className="font-bold text-foreground">{language === 'ja' ? t('membershipDetails_micrCodeLabel') : (mp?.micrCodeLabel || t('membershipDetails_micrCodeLabel'))}:</span>
                        <span className="font-medium">{mp?.micrCode || "110751034"}</span>
                        
                        <span className="font-bold text-foreground">{language === 'ja' ? t('membershipDetails_branchCodeLabel') : (mp?.branchCodeLabel || t('membershipDetails_branchCodeLabel'))}:</span>
                        <span className="font-medium">{mp?.branchCode || "21413"}</span>
                    </div>
                </div>
                <div className="flex-shrink-0 flex flex-col items-center gap-4 group">
                    <div className="bg-white p-4 rounded-3xl border-4 border-white shadow-2xl transition-transform duration-500 group-hover:scale-105">
                        <Image 
                            src={mp?.qrImageUrl || "https://i.postimg.cc/hGRkss7h/qr-ijcc.jpg"}
                            alt="Payment QR Code"
                            width={200}
                            height={200}
                            className="rounded-xl"
                           
                        />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] uppercase font-black text-primary tracking-[0.2em]">{language === 'ja' ? t('membershipDetails_scanToPay') : (mp?.scanLabel || t('membershipDetails_scanToPay'))}</span>
                        <span className="text-[9px] text-muted-foreground font-bold italic">{mp?.supportText || `${t('membershipDetails_support')} +91-92679 19281`}</span>
                    </div>
                </div>
                <div className="w-full mt-6 px-1">
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed border-l-4 border-primary/40 pl-3 py-1 bg-primary/5 rounded-r-lg" dangerouslySetInnerHTML={{ __html: mp?.paymentNote || t('membershipDetails_paymentNote') }} />
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Membership Rules */}
      <Card className="border-2 border-primary/10 shadow-lg mt-8 mb-16">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary">{language === 'ja' ? t('membershipRules_title') : (mp?.rulesTitle || t('membershipRules_title'))}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {rulesList.map((rule: string, i: number) => (
              <li key={i} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{rule}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <Card className="border-none bg-muted/30 shadow-inner">
            <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary">{language === 'ja' ? t('membershipDetails_enrollmentTitle') : (mp?.enrollmentTitle || t('membershipDetails_enrollmentTitle'))}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground leading-relaxed font-medium">{language === 'ja' ? t('membershipDetails_enrollmentDescription') : (mp?.enrollmentDescription || t('membershipDetails_enrollmentDescription'))}</p>
            </CardContent>
        </Card>
        
        <Card className="text-center border-none bg-primary text-primary-foreground shadow-xl flex flex-col justify-center">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">{language === 'ja' ? t('membershipDetails_contactTitle') : (mp?.contactTitle || t('membershipDetails_contactTitle'))}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap justify-center gap-8">
                 <div className="flex flex-col items-center gap-2 group">
                    <div className="bg-white/10 p-3 rounded-full group-hover:bg-white/20 transition-colors">
                        <Mail className="h-6 w-6 text-accent" />
                    </div>
                    <span className="text-sm font-bold">{settings?.contactEmail || "info@ijcc.in"}</span>
                 </div>
                 <div className="flex flex-col items-center gap-2 group">
                    <div className="bg-white/10 p-3 rounded-full group-hover:bg-white/20 transition-colors">
                        <Phone className="h-6 w-6 text-accent" />
                    </div>
                    <span className="text-sm font-bold">{settings?.phoneNumber || "+91-92679 19281"}</span>
                 </div>
                 <div className="flex flex-col items-center gap-2 group">
                    <div className="bg-white/10 p-3 rounded-full group-hover:bg-white/20 transition-colors">
                        <Globe className="h-6 w-6 text-accent" />
                    </div>
                    <span className="text-sm font-bold">www.ijcc.in</span>
                 </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
