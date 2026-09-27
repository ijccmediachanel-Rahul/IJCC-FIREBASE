
"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitMembershipForm } from "@/lib/actions";
import { MembershipFormSchema } from "@/lib/definitions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useTranslation } from "@/hooks/use-translation";

function MembershipFormComponent() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();
  
  const form = useForm<z.infer<typeof MembershipFormSchema>>({
    resolver: zodResolver(MembershipFormSchema),
    defaultValues: {
      membershipTier: (searchParams.get('tier') as "student" | "individual" | "startup" | "sme-standard" | "sme-plus" | "corporate-standard" | "corporate-premium" | "patron" | "strategic-platinum") || 'student',
      legalCompanyName: "",
      entityType: undefined,
      dateOfIncorporation: "",
      msmeRegistration: "",
      registeredAddress: "",
      city: "",
      state: "",
      pincode: "",
      website: "",
      directors: "",
      primaryContactPerson: "",
      primaryContactDesignation: "",
      mobileNumber: "",
      emailAddress: "",
      coreBusinessActivity: undefined,
      otherBusinessActivity: "",
      annualTurnover: undefined,
      japanInterest: [],
      otherJapanInterest: "",
      companyDescription: "",
      marketObjectives: "",
      declaration: undefined,
      applicantName: "",
      applicantDesignation: "",
      applicantDate: new Date().toLocaleDateString('en-GB'),
    },
  });

  const onFormSubmit = async (values: z.infer<typeof MembershipFormSchema>) => {
    setIsSubmitting(true);
    const result = await submitMembershipForm(values);

    if (result.success) {
      toast({
        title: t('membershipForm_toastSuccessTitle'),
        description: t('membershipForm_toastSuccessDescription'),
      });
      form.reset();
      router.push(`/pricing?tier=${values.membershipTier}#${values.membershipTier}`);
    } else {
      toast({
        variant: "destructive",
        title: t('membershipForm_toastErrorTitle'),
        description: t(result.message),
      });
       if (result.errors) {
        for (const [key, value] of Object.entries(result.errors)) {
          form.setError(key as keyof z.infer<typeof MembershipFormSchema>, {
            type: 'server',
            message: Array.isArray(value) ? value.join(', ') : String(value),
          });
        }
      }
    }
    setIsSubmitting(false);
  };
  
  const watchingCoreBusiness = form.watch("coreBusinessActivity");
  const watchingJapanInterest = form.watch("japanInterest");

  return (
    <Card className="border-none shadow-xl">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-12">
              <CardHeader className="bg-primary/5 rounded-t-xl border-b border-primary/10">
                <CardTitle className="font-headline text-2xl text-primary">{t('membershipForm_partA_title')}</CardTitle>
                <CardDescription className="font-medium">{t('membershipForm_partA_description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pt-8">
                <FormField
                  control={form.control}
                  name="membershipTier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold">{t('membershipForm_tier_label')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 border-2">
                            <SelectValue placeholder={t('membershipForm_tier_placeholder')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="student">{t('membershipTier_student_title') || 'Student / Young Professional'}</SelectItem>
                            <SelectItem value="individual">{t('membershipTier_individual_title') || 'Individual / Professional / Consultant'}</SelectItem>
                            <SelectItem value="startup">{t('membershipTier_startup_title') || 'Startup / Emerging SME'}</SelectItem>
                            <SelectItem value="sme-standard">{t('membershipTier_smeStandard_title') || 'SME Standard'}</SelectItem>
                            <SelectItem value="sme-plus">{t('membershipTier_smePlus_title') || 'SME Plus'}</SelectItem>
                            <SelectItem value="corporate-standard">{t('membershipTier_corporateStandard_title') || 'Corporate Standard'}</SelectItem>
                            <SelectItem value="corporate-premium">{t('membershipTier_corporatePremium_title') || 'Corporate Premium'}</SelectItem>
                            <SelectItem value="patron">{t('membershipTier_patron_title') || 'Patron'}</SelectItem>
                            <SelectItem value="strategic-platinum">{t('membershipTier_strategicPlatinum_title') || 'Strategic Platinum'}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="legalCompanyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold">{t('membershipForm_legalName_label')}</FormLabel>
                      <FormControl>
                        <Input className="h-12 border-2" placeholder={t('membershipForm_legalName_placeholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="entityType"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-bold">{t('membershipForm_entityType_label')}</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="private-ltd" /></FormControl>
                            <FormLabel className="font-medium cursor-pointer">{t('membershipForm_entityType_privateLtd')}</FormLabel>
                          </FormItem>
                           <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="public-ltd" /></FormControl>
                            <FormLabel className="font-medium cursor-pointer">{t('membershipForm_entityType_publicLtd')}</FormLabel>
                          </FormItem>
                           <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="llp" /></FormControl>
                            <FormLabel className="font-medium cursor-pointer">{t('membershipForm_entityType_llp')}</FormLabel>
                          </FormItem>
                           <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="partnership" /></FormControl>
                            <FormLabel className="font-medium cursor-pointer">{t('membershipForm_entityType_partnership')}</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="proprietorship" /></FormControl>
                            <FormLabel className="font-medium cursor-pointer">{t('membershipForm_entityType_proprietorship')}</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="dateOfIncorporation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold">{t('membershipForm_incorporationDate_label')}</FormLabel>
                        <FormControl>
                          <Input className="h-12 border-2" placeholder={t('membershipForm_incorporationDate_placeholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="msmeRegistration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold">{t('membershipForm_msme_label')}</FormLabel>
                        <FormControl>
                          <Input className="h-12 border-2" placeholder={t('membershipForm_msme_placeholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="registeredAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold">{t('membershipForm_address_label')}</FormLabel>
                      <FormControl>
                        <Textarea className="border-2 min-h-[100px]" placeholder={t('membershipForm_address_placeholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold">{t('membershipForm_city_label')}</FormLabel>
                        <FormControl><Input className="h-12 border-2" placeholder={t('membershipForm_city_placeholder')} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold">{t('membershipForm_state_label')}</FormLabel>
                        <FormControl><Input className="h-12 border-2" placeholder={t('membershipForm_state_placeholder')} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pincode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold">{t('membershipForm_pincode_label')}</FormLabel>
                        <FormControl><Input className="h-12 border-2" placeholder={t('membershipForm_pincode_placeholder')} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold">{t('membershipForm_website_label')}</FormLabel>
                        <FormControl><Input className="h-12 border-2" placeholder="https://example.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="directors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold">{t('membershipForm_directors_label')}</FormLabel>
                        <FormControl><Input className="h-12 border-2" placeholder={t('membershipForm_directors_placeholder')} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="primaryContactPerson"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold">{t('membershipForm_primaryContact_label')}</FormLabel>
                        <FormControl><Input className="h-12 border-2" placeholder={t('membershipForm_primaryContact_placeholder')} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="primaryContactDesignation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold">{t('membershipForm_designation_label')}</FormLabel>
                        <FormControl><Input className="h-12 border-2" placeholder={t('membershipForm_designation_placeholder')} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="mobileNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold">{t('membershipForm_mobile_label')}</FormLabel>
                        <FormControl><Input className="h-12 border-2" type="tel" placeholder="e.g. +91 98XXXXXXXX" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emailAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold">{t('membershipForm_email_label')}</FormLabel>
                        <FormControl><Input className="h-12 border-2" type="email" placeholder="contact@example.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>

              <CardHeader className="bg-primary/5 border-y border-primary/10">
                <CardTitle className="font-headline text-2xl text-primary">{t('membershipForm_partB_title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 pt-8">
                <FormField
                  control={form.control}
                  name="coreBusinessActivity"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-bold">{t('membershipForm_coreBusiness_label')}</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                          <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="accounting-finance" /></FormControl><FormLabel className="font-medium cursor-pointer">{t('membershipForm_coreBusiness_accounting')}</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="manufacturing" /></FormControl><FormLabel className="font-medium cursor-pointer">{t('membershipForm_coreBusiness_manufacturing')}</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="it-ites" /></FormControl><FormLabel className="font-medium cursor-pointer">{t('membershipForm_coreBusiness_it')}</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="engineering-automotive" /></FormControl><FormLabel className="font-medium cursor-pointer">{t('membershipForm_coreBusiness_engineering')}</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="healthcare-pharma" /></FormControl><FormLabel className="font-medium cursor-pointer">{t('membershipForm_coreBusiness_healthcare')}</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="agri-food" /></FormControl><FormLabel className="font-medium cursor-pointer">{t('membershipForm_coreBusiness_agri')}</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="textiles-apparel" /></FormControl><FormLabel className="font-medium cursor-pointer">{t('membershipForm_coreBusiness_textiles')}</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="cleantech-energy" /></FormControl><FormLabel className="font-medium cursor-pointer">{t('membershipForm_coreBusiness_cleantech')}</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="consulting-services" /></FormControl><FormLabel className="font-medium cursor-pointer">{t('membershipForm_coreBusiness_consulting')}</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="other" /></FormControl><FormLabel className="font-medium cursor-pointer">{t('membershipForm_coreBusiness_other')}</FormLabel></FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchingCoreBusiness === 'other' && (
                    <FormField
                      control={form.control}
                      name="otherBusinessActivity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">{t('membershipForm_otherActivity_label')}</FormLabel>
                          <FormControl><Input className="h-12 border-2" placeholder={t('membershipForm_otherActivity_placeholder')} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                )}

                <FormField
                  control={form.control}
                  name="annualTurnover"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-bold">{t('membershipForm_turnover_label')}</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="less-than-5cr" /></FormControl><FormLabel className="font-medium cursor-pointer">{t('membershipForm_turnover_lessThan5')}</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="5-25cr" /></FormControl><FormLabel className="font-medium cursor-pointer">{t('membershipForm_turnover_5to25')}</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="25-100cr" /></FormControl><FormLabel className="font-medium cursor-pointer">{t('membershipForm_turnover_25to100')}</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="above-100cr" /></FormControl><FormLabel className="font-medium cursor-pointer">{t('membershipForm_turnover_above100')}</FormLabel></FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="japanInterest"
                  render={() => (
                    <FormItem>
                        <div className="mb-6">
                            <FormLabel className="text-base font-bold">{t('membershipForm_japanInterest_label')}</FormLabel>
                            <FormDescription className="font-medium">{t('membershipForm_japanInterest_description')}</FormDescription>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                              { id: "jv-partner", label: t('membershipForm_japanInterest_jv') },
                              { id: "tech-transfer", label: t('membershipForm_japanInterest_tech') },
                              { id: "investment", label: t('membershipForm_japanInterest_investment') },
                              { id: "export", label: t('membershipForm_japanInterest_export') },
                              { id: "sourcing", label: t('membershipForm_japanInterest_sourcing') },
                              { id: "culture", label: t('membershipForm_japanInterest_culture') },
                              { id: "other", label: t('membershipForm_japanInterest_other') },
                          ].map((item) => (
                              <FormField
                              key={item.id}
                              control={form.control}
                              name="japanInterest"
                              render={({ field }) => {
                                  return (
                                  <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                      <FormControl>
                                      <Checkbox
                                          className="mt-1"
                                          checked={field.value?.includes(item.id)}
                                          onCheckedChange={(checked) => {
                                          return checked
                                              ? field.onChange([...(field.value || []), item.id])
                                              : field.onChange(
                                                  field.value?.filter(
                                                  (value) => value !== item.id
                                                  )
                                              )
                                          }}
                                      />
                                      </FormControl>
                                      <FormLabel className="font-medium leading-normal cursor-pointer">{item.label}</FormLabel>
                                  </FormItem>
                                  )
                              }}
                              />
                          ))}
                        </div>
                        <FormMessage />
                    </FormItem>
                  )}
                />

                {watchingJapanInterest?.includes('other') && (
                    <FormField
                      control={form.control}
                      name="otherJapanInterest"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">{t('membershipForm_otherInterest_label')}</FormLabel>
                          <FormControl><Input className="h-12 border-2" placeholder={t('membershipForm_otherInterest_placeholder')} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                )}

                <FormField
                  control={form.control}
                  name="companyDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold">{t('membershipForm_companyDescription_label')}</FormLabel>
                      <FormControl><Textarea className="border-2 min-h-[120px]" placeholder={t('membershipForm_companyDescription_placeholder')} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="marketObjectives"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold">{t('membershipForm_marketObjectives_label')}</FormLabel>
                      <FormControl><Textarea className="border-2 min-h-[120px]" placeholder={t('membershipForm_marketObjectives_placeholder')} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>

               <CardHeader className="bg-primary/5 border-y border-primary/10">
                <CardTitle className="font-headline text-2xl text-primary">{t('membershipForm_partC_title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 pt-8">
                <FormField
                  control={form.control}
                  name="declaration"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-4 space-y-0 rounded-xl border-2 border-primary/20 p-6 bg-primary/5">
                      <FormControl>
                        <Checkbox
                          className="h-6 w-6 border-2"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-relaxed">
                        <FormLabel className="text-base font-medium text-foreground/80 cursor-pointer">
                          {t('membershipForm_declaration_label')}
                        </FormLabel>
                      </div>
                       <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <FormField
                      control={form.control}
                      name="applicantName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-bold">{t('membershipForm_applicantName_label')}</FormLabel>
                          <FormControl><Input className="h-12 border-2" placeholder={t('membershipForm_applicantName_placeholder')} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="applicantDesignation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-bold">{t('membershipForm_applicantDesignation_label')}</FormLabel>
                          <FormControl><Input className="h-12 border-2" placeholder={t('membershipForm_applicantDesignation_placeholder')} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="applicantDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-bold">{t('membershipForm_applicantDate_label')}</FormLabel>
                          <FormControl>
                            <Input className="h-12 border-2" placeholder={t('membershipForm_applicantDate_placeholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>

                 <Card className="bg-muted/30 mt-12 border-2 border-dashed border-muted-foreground/30">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-muted-foreground uppercase tracking-widest">{t('membershipForm_officeUse_title')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex items-center gap-2 border-b-2 border-muted-foreground/20 pb-2">
                        <span className="font-bold text-sm text-muted-foreground">{t('membershipForm_officeUse_appNo')}:</span>
                        <div className="flex-1" />
                      </div>
                      <div className="flex items-center gap-2 border-b-2 border-muted-foreground/20 pb-2">
                        <span className="font-bold text-sm text-muted-foreground">{t('membershipForm_officeUse_dateReceived')}:</span>
                        <div className="flex-1" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="font-bold text-sm text-muted-foreground">{t('membershipForm_officeUse_status')}:</p>
                      <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 border-2 border-muted-foreground/30" />
                          <span className="text-sm font-medium">{t('membershipForm_officeUse_approved')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 border-2 border-muted-foreground/30" />
                          <span className="text-sm font-medium">{t('membershipForm_officeUse_underReview')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 border-2 border-muted-foreground/30" />
                          <span className="text-sm font-medium">{t('membershipForm_officeUse_infoRequested')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 border-b-2 border-muted-foreground/20 pb-2">
                      <span className="font-bold text-sm text-muted-foreground whitespace-nowrap">{t('membershipForm_officeUse_tierAllotted')}:</span>
                      <div className="flex-1 text-center font-bold text-muted-foreground/40">/ ______________ / ______________ /</div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>

              <CardFooter className="pb-12 px-8">
                 <Button type="submit" disabled={isSubmitting} className="w-full h-16 text-xl rounded-full shadow-xl hover:shadow-2xl transition-all">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                        {t('membershipForm_processing') || 'Processing...'}
                      </>
                    ) : (
                      t('membershipForm_submitButton')
                    )}
                </Button>
              </CardFooter>
            </form>
        </Form>
    </Card>
  );
}

export function MembershipForm() {
    return (
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
            <MembershipFormComponent />
        </Suspense>
    )
}
