
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Script from "next/script";
import { verifyRazorpayPayment, logMembershipPaymentToGoogleSheet } from "@/lib/actions";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useTranslation } from "@/hooks/use-translation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const pricingTiers = [
  {
    id: "student",
    titleKey: "membershipTier_student_title",
    eligibilityKey: "membershipTier_student_eligibility",
    price: 3000,
    displayPrice: "₹3,000",
    period: "/ year",
    benefitsKeys: [
      "membershipTier_student_benefit1",
      "membershipTier_student_benefit2",
      "membershipTier_student_benefit3",
    ],
  },
  {
    id: "individual",
    titleKey: "membershipTier_individual_title",
    eligibilityKey: "membershipTier_individual_eligibility",
    price: 11000,
    displayPrice: "₹11,000",
    period: "/ year",
    benefitsKeys: [
      "membershipTier_individual_benefit1",
      "membershipTier_individual_benefit2",
      "membershipTier_individual_benefit3",
      "membershipTier_individual_benefit4",
      "membershipTier_individual_benefit5",
      "membershipTier_individual_benefit6",
      "membershipTier_individual_benefit7",
    ],
  },
  {
    id: "startup",
    titleKey: "membershipTier_startup_title",
    eligibilityKey: "membershipTier_startup_eligibility",
    price: 15000,
    displayPrice: "₹15,000",
    period: "/ year",
    benefitsKeys: [
      "membershipTier_startup_benefit1",
      "membershipTier_startup_benefit2",
      "membershipTier_startup_benefit3",
      "membershipTier_startup_benefit4",
      "membershipTier_startup_benefit5",
      "membershipTier_startup_benefit6",
      "membershipTier_startup_benefit7",
    ],
  },
  {
    id: "sme-standard",
    titleKey: "membershipTier_smeStandard_title",
    eligibilityKey: "membershipTier_smeStandard_eligibility",
    price: 35000,
    displayPrice: "₹35,000",
    period: "/ year",
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
  },
  {
    id: "sme-plus",
    titleKey: "membershipTier_smePlus_title",
    eligibilityKey: "membershipTier_smePlus_eligibility",
    price: 75000,
    displayPrice: "₹75,000",
    period: "/ year",
    benefitsKeys: [
      "membershipTier_smePlus_benefit1",
      "membershipTier_smePlus_benefit2",
      "membershipTier_smePlus_benefit3",
      "membershipTier_smePlus_benefit4",
      "membershipTier_smePlus_benefit5",
      "membershipTier_smePlus_benefit6",
      "membershipTier_smePlus_benefit7",
    ],
  },
  {
    id: "corporate-standard",
    titleKey: "membershipTier_corporateStandard_title",
    eligibilityKey: "membershipTier_corporateStandard_eligibility",
    price: 100000,
    displayPrice: "₹1,00,000",
    period: "/ year",
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
  },
  {
    id: "corporate-premium",
    titleKey: "membershipTier_corporatePremium_title",
    eligibilityKey: "membershipTier_corporatePremium_eligibility",
    price: 250000,
    displayPrice: "₹2,50,000",
    period: "/ year",
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
  },
  {
    id: "patron",
    titleKey: "membershipTier_patron_title",
    eligibilityKey: "membershipTier_patron_eligibility",
    price: 500000,
    displayPrice: "₹5,00,000",
    period: "/ year",
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
  },
  {
    id: "strategic-platinum",
    titleKey: "membershipTier_strategicPlatinum_title",
    eligibilityKey: "membershipTier_strategicPlatinum_eligibility",
    price: 0,
    displayPrice: "T&C Applicable",
    period: "",
    benefitsKeys: [
      "membershipTier_strategicPlatinum_benefit1",
      "membershipTier_strategicPlatinum_benefit2",
      "membershipTier_strategicPlatinum_benefit3",
      "membershipTier_strategicPlatinum_benefit4",
      "membershipTier_strategicPlatinum_benefit5",
      "membershipTier_strategicPlatinum_benefit6",
      "membershipTier_strategicPlatinum_benefit7",
      "membershipTier_strategicPlatinum_benefit8",
    ],
  },
];


export default function PricingPage() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const { user } = useAuth();
    const router = useRouter();
    const [loadingTier, setLoadingTier] = useState<string | null>(null);
    const [initialTier, setInitialTier] = useState<string | null>(null);

    useEffect(() => {
        // Wait for hydration to access window.location
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const tierParam = urlParams.get('tier');
            if (tierParam) {
                setInitialTier(tierParam);
                // Optional: Scroll to the selected tier
                setTimeout(() => {
                    const el = document.getElementById(tierParam);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 500);
            }
        }
    }, []);

    const handlePayment = async (tier: typeof pricingTiers[0]) => {
        if (!user) {
            router.push(`/membership-application?tier=${tier.id}`);
            return;
        }

        setLoadingTier(tier.id);

        try {
            const response = await fetch('/api/createOrder', {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                amount: tier.price * 100, // Amount in paise
                currency: 'INR'
              }),
            });
            
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || "Order creation failed.");
            }
            
            const order = await response.json();

            if (!order || !order.id) {
                throw new Error("Received invalid order data from server.");
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: order.amount,
                currency: order.currency,
                name: "Indo-Japan Chamber of Commerce",
                description: `Membership - ${t(tier.titleKey)}`,
                order_id: order.id,
                handler: async function (response: any) {
                    setLoadingTier(tier.id);
                    const verificationResult = await verifyRazorpayPayment({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    });

                    if (verificationResult.success) {
                        const userDocRef = doc(db, 'users', user.uid);
                        await updateDoc(userDocRef, {
                            membershipTier: tier.id,
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                            membershipUpdatedAt: new Date(),
                        });

                        // 1. Sync payment to Google Sheet & Admin Applications Store (non-blocking)
                        logMembershipPaymentToGoogleSheet({
                            uid: user.uid,
                            displayName: user.displayName || user.email || "IJCC Member",
                            email: user.email || "",
                            phoneNumber: user.phoneNumber || "",
                            membershipTier: tier.id,
                            tierTitle: t(tier.titleKey) || tier.id,
                            amount: tier.price,
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                        }).catch((err) => console.warn("Google Sheet payment sync failed:", err));
                        
                        toast({
                            title: t('membershipForm_toastSuccessTitle') || "Payment Successful!",
                            description: `Your membership has been upgraded to ${t(tier.titleKey)}.`,
                        });
                        router.push('/profile');
                    } else {
                        toast({
                            variant: "destructive",
                            title: "Payment Verification Failed",
                            description: "Your payment could not be verified. Please contact support.",
                        });
                    }
                    setLoadingTier(null);
                },
                prefill: {
                    name: user.displayName || undefined,
                    email: user.email || undefined,
                },
                theme: {
                    color: "#D40000"
                },
                modal: {
                    ondismiss: function() {
                        setLoadingTier(null);
                    }
                }
            };
            
            const rzp = new (window as any).Razorpay(options);
            rzp.open();

        } catch (error: any) {
            console.error("Payment initiation failed:", error);
            toast({
                variant: "destructive",
                title: "Payment Failed",
                description: error.message || "Could not initiate payment. Please try again.",
            });
            setLoadingTier(null);
        }
    };
    
    return (
        <>
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />
            <div className="container py-12">
                <div className="space-y-4 mb-12 text-center">
                    <h1 className="text-4xl font-headline tracking-tighter sm:text-5xl">{t('membership_payment_title') || "Membership Pricing"}</h1>
                    <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
                        {t('membership_payment_description') || "Choose the plan that's right for you and join our mission to foster Indo-Japan collaboration."}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    {pricingTiers.map((tier) => (
                        <Card 
                            key={tier.id} 
                            id={tier.id} 
                            className={cn(
                                'flex flex-col h-full transition-all duration-300 hover:ring-2 hover:ring-destructive hover:ring-offset-2 hover:ring-offset-background',
                                loadingTier === tier.id && 'ring-2 ring-primary ring-offset-2 ring-offset-background animate-pulse'
                            )}
                        >
                            <CardHeader>
                                <CardTitle className="font-headline text-2xl min-h-[64px]">{t(tier.titleKey)}</CardTitle>
                                <CardDescription className="min-h-[40px]">{t(tier.eligibilityKey)}</CardDescription>
                                 <div className="flex items-baseline gap-2 pt-4">
                                    <span className="text-4xl font-bold">{tier.displayPrice}</span>
                                    {tier.period && <span className="text-muted-foreground">{tier.period}</span>}
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                 <ul className="space-y-3">
                                    {tier.benefitsKeys.map((featureKey, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        <span className="text-muted-foreground text-sm">{t(featureKey)}</span>
                                    </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                               <Button 
                                 onClick={() => handlePayment(tier)} 
                                 className="w-full"
                                 variant={"outline"}
                                 disabled={!!loadingTier}
                                >
                                 {loadingTier === tier.id ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        <span>{t('membership_payment_processing') || "Processing..."}</span>
                                    </>
                                 ) : tier.id === "strategic-platinum" ? (
                                    "Contact Us"
                                 ) : (
                                    user ? (t('membership_payment_payNow') || "Pay Now") : (t('membershipForm_submitButton') || "Apply Now")
                                 )}
                               </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}
