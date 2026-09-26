"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/auth-context";
import { doc, getDoc, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  FileText, Download, ExternalLink, Lock, Loader2, Search, 
  Filter, Building2, MapPin, Sparkles, CheckCircle2, ChevronRight,
  PlayCircle, QrCode, ArrowLeft, ShieldCheck
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { STATE_POLICIES, STATE_METADATA, TRIPURA_MEDIA, TRIPURA_QR_CODES, StatePolicy } from "@/data/state-policies";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { isPaidMember } from "@/lib/definitions";
import { useTranslation } from "@/hooks/use-translation";
import {
  MemberAccessModal,
  getStoredMemberSession,
  clearMemberSession,
  VerifiedMemberSession,
} from "@/components/MemberAccessModal";

export default function IndianStatePoliciesPage() {
  const { language } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<DocumentData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isProtected, setIsProtected] = useState<boolean | null>(null);
  const [loadingCMS, setLoadingCMS] = useState(true);

  const [selectedState, setSelectedState] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    async function fetchProtection() {
      try {
        const data = await client.fetch(
          groq`*[_type == "resourceItem" && resourceId == "indian-states-policy-2026"][0]{isProtected}`,
          {},
          { cache: 'no-store' }
        );
        setIsProtected(data?.isProtected ?? false);
      } catch (error) {
        console.error("Failed to fetch protection from Sanity:", error);
        setIsProtected(false);
      } finally {
        setLoadingCMS(false);
      }
    }
    fetchProtection();
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoadingProfile(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data());
        }
      } catch (error: any) {
        console.warn("Could not fetch user profile (Firestore permissions/offline):", error?.message || error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user, authLoading]);

  const [memberSession, setMemberSession] = useState<VerifiedMemberSession | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const session = getStoredMemberSession();
    if (session) setMemberSession(session);
  }, []);

  const hasMembership = isPaidMember(profile) || !!memberSession;
  const isLoading = authLoading || loadingCMS || (isProtected && loadingProfile);
  const isLocked = isProtected === true && !hasMembership;

  // Reset category filter when state changes
  useEffect(() => {
    setSelectedCategory("all");
  }, [selectedState]);

  // Category list derived dynamically from currently selected state policies
  const relevantPolicies = selectedState === "all" 
    ? STATE_POLICIES 
    : STATE_POLICIES.filter((p) => p.stateId === selectedState);

  const availableCategories = [
    "all",
    ...Array.from(new Set(relevantPolicies.map((p) => p.category))).sort()
  ];

  // Filtered policies
  const filteredPolicies = STATE_POLICIES.filter((policy) => {
    const matchesState = selectedState === "all" || policy.stateId === selectedState;
    const matchesCategory = selectedCategory === "all" || policy.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      policy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesState && matchesCategory && matchesSearch;
  });

  const getStateColor = (stateId: string) => {
    switch (stateId) {
      case "haryana":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300";
      case "gujarat":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300";
      case "madhya-pradesh":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300";
      case "tripura":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  if (isLoading) {
    return (
      <div className="container py-24">
        <div className="flex min-h-[calc(100vh-300px)] flex-col items-center justify-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium animate-pulse">
            {language === 'ja' ? '会員権を確認中...' : 'Verifying Membership Access...'}
          </p>
        </div>
      </div>
    );
  }

  // Member-Only Lock Screen (Only shown if isProtected === true in CMS and user is not a member)
  if (isLocked) {
    return (
      <div className="container py-20">
        <div className="max-w-2xl mx-auto text-center bg-card border rounded-2xl p-8 sm:p-12 shadow-xl">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary mb-6">
            <Lock className="h-10 w-10 text-primary" />
          </div>
          <Badge variant="outline" className="mb-4 text-xs font-semibold uppercase tracking-wider">
            {language === 'ja' ? '会員限定コンテンツ' : 'Members-Only Exclusive'}
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-headline font-bold text-foreground mb-4">
            {language === 'ja' ? 'インド各州政府政策 2026' : 'Indian Government States Policy 2026'}
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg mb-8 leading-relaxed">
            {language === 'ja'
              ? 'このリポジトリには、ハリヤナ州、グジャラート州、マディヤ・プラデーシュ州、トリプラ州の公式産業政策文書や優遇措置ガイドラインが収録されています。アクセスはIJCC会員限定です。'
              : 'This repository contains confidential state policy documents, official incentive frameworks, and investment compendiums from Haryana, Gujarat, Madhya Pradesh, and Tripura. Access is reserved exclusively for registered IJCC Corporate and Standard Members.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => setIsModalOpen(true)}
              size="lg"
              className="w-full sm:w-auto font-bold px-8 shadow-md gap-2"
            >
              <ShieldCheck className="h-5 w-5" />
              {language === 'ja' ? '会員IDとパスワードで解除' : 'Enter Member ID & Password'}
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/membership-application">
                {language === 'ja' ? '会員登録を申し込む' : 'Apply for Membership'}
              </Link>
            </Button>
          </div>

          <MemberAccessModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={(session) => {
              setMemberSession(session);
              setIsModalOpen(false);
            }}
            targetResourceTitle="Indian Government States Policy 2026"
          />

          <div className="mt-10 pt-8 border-t grid grid-cols-2 sm:grid-cols-4 gap-4 text-left text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <span>Official Gazettes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              <span>Direct PDF Downloads</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary shrink-0" />
              <span>4 Strategic States</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary shrink-0" />
              <span>MoU Advisory</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Member Content View
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb & Top Bar */}
      <div className="border-b bg-muted/30">
        <div className="container py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/resources" className="hover:text-primary transition-colors">
            {language === 'ja' ? 'リソース' : 'Resources'}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium truncate">
            {language === 'ja' ? 'インド各州政府政策 2026' : 'Indian Government States Policy 2026'}
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 via-background to-background py-14 border-b">
        <div className="container max-w-6xl">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs px-3 py-1 font-semibold rounded-full shadow-sm">
              {language === 'ja' ? '🇮🇳 公式政策リポジトリ 2026' : '🇮🇳 Official Policy Repository 2026'}
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50 dark:bg-green-950/40 text-xs px-2.5 py-0.5 font-medium rounded-full">
              {language === 'ja' ? '会員アクセス有効' : 'Member Access Active'}
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-5xl font-headline font-bold text-foreground tracking-tight leading-tight">
            {language === 'ja' ? 'インド各州政府政策 2026' : 'Indian Government States Policy 2026'}
          </h1>
          <p className="mt-4 text-base sm:text-xl text-muted-foreground max-w-3xl leading-relaxed">
            {language === 'ja'
              ? '日本企業や投資家の市場参入や立地選定を支援する、ハリヤナ州、グジャラート州、マディヤ・プラデーシュ州、トリプラ州の公式産業青写真、優遇措置、規制ガイドライン。'
              : 'Authoritative industrial blueprints, state incentive schemes, and regulatory guidelines across Haryana, Gujarat, Madhya Pradesh, and Tripura to assist Japanese companies and investors with market entry and site selection.'}
          </p>

          {/* Quick Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {STATE_METADATA.map((state) => (
              <button
                key={state.id}
                onClick={() => setSelectedState(state.id)}
                className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                  selectedState === state.id
                    ? "border-primary ring-2 ring-primary/20 bg-primary/5 shadow-md"
                    : "border-border/60 bg-card hover:border-primary/50 hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base text-foreground">{state.name}</span>
                  <Badge variant="secondary" className="text-[11px] font-mono">
                    {state.badge}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{state.tagline}</p>
                <div className="mt-3 flex items-center text-xs font-semibold text-primary">
                  <span>{state.count} Policies</span>
                  <ChevronRight className="h-3 w-3 ml-1" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="container max-w-6xl py-10 space-y-8">
        {/* Controls: State Tabs + Search & Filters */}
        <div className="space-y-4">
          {/* State Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b pb-4">
            <button
              onClick={() => setSelectedState("all")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                selectedState === "all"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              All States ({STATE_POLICIES.length})
            </button>
            {STATE_METADATA.map((state) => (
              <button
                key={state.id}
                onClick={() => setSelectedState(state.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                  selectedState === state.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>{state.name}</span>
                <span className="text-xs opacity-80">({state.count})</span>
              </button>
            ))}
          </div>

          {/* Search Bar & Category Filter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search policies (e.g. Semiconductor, Data Centre, AI, EV, Land, GCC)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-card rounded-xl border-border/80 shadow-sm"
              />
            </div>
            <div>
              <Select 
                value={selectedCategory} 
                onValueChange={(val) => setSelectedCategory(val)}
              >
                <SelectTrigger className="w-full h-11 px-3.5 bg-card border border-border/80 rounded-xl text-sm font-medium shadow-sm hover:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all">
                  <div className="flex items-center gap-2 truncate">
                    <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                    <SelectValue placeholder="All Categories" />
                  </div>
                </SelectTrigger>
                <SelectContent className="max-h-80 rounded-xl border border-border/80 bg-popover shadow-xl z-50">
                  <SelectItem value="all" className="font-semibold cursor-pointer rounded-lg">
                    All Categories ({relevantPolicies.length})
                  </SelectItem>
                  {availableCategories
                    .filter((c) => c !== "all")
                    .map((cat) => {
                      const count = relevantPolicies.filter((p) => p.category === cat).length;
                      return (
                        <SelectItem key={cat} value={cat} className="cursor-pointer rounded-lg">
                          {cat} ({count})
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Selected State Spotlight Banner (if state is selected) */}
        {selectedState !== "all" && (
          (() => {
            const currentMeta = STATE_METADATA.find((m) => m.id === selectedState);
            if (!currentMeta) return null;
            return (
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-headline font-bold text-foreground">{currentMeta.name} State Profile</h2>
                    <Badge variant="outline" className="text-xs">{currentMeta.capital}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{currentMeta.highlight}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedState("all")}
                  className="text-xs font-semibold shrink-0"
                >
                  View All States
                </Button>
              </div>
            );
          })()
        )}

        {/* Results Count & Clear Filter */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <span>Showing <strong>{filteredPolicies.length}</strong> policies</span>
          {(searchQuery || selectedCategory !== "all" || selectedState !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedState("all");
              }}
              className="text-primary hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Policies Grid */}
        {filteredPolicies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolicies.map((policy) => (
              <Card 
                key={policy.id} 
                className="flex flex-col border-border/70 hover:border-primary/40 hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden bg-card"
              >
                <CardHeader className="pb-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${getStateColor(policy.stateId)}`}>
                      {policy.state}
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono font-medium">
                      {policy.year}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-headline font-bold leading-snug line-clamp-2 pt-1 text-foreground">
                    {policy.title}
                  </CardTitle>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-[11px] font-normal">
                      {policy.category}
                    </Badge>
                    <span>•</span>
                    <span className="font-mono text-[11px]">{policy.size}</span>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 pb-4">
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {policy.description}
                  </p>
                </CardContent>

                <CardFooter className="pt-3 border-t bg-muted/20 flex items-center gap-2">
                  <Button asChild size="sm" className="flex-1 text-xs font-semibold rounded-lg shadow-sm">
                    <a href={encodeURI(policy.filePath)} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                      {language === 'ja' ? 'PDFを閲覧' : 'View PDF'}
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="text-xs font-semibold rounded-lg">
                    <a href={encodeURI(policy.filePath)} download>
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      {language === 'ja' ? 'ダウンロード' : 'Download'}
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border rounded-2xl bg-card">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <h3 className="text-lg font-semibold">No policies matched your criteria</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
              Try adjusting your search query or reset the state and category filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedState("all");
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Media & Interactive Section (for Tripura or All) */}
        {(selectedState === "all" || selectedState === "tripura") && (
          <div className="space-y-8 pt-8 border-t">
            {/* Investment Promotion Video Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-headline font-bold">Featured Investment Film</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Official state visual showcase of industrial corridors, connectivity, and investment climate.
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">Tripura</Badge>
              </div>

              <div className="rounded-2xl border bg-card overflow-hidden shadow-md">
                <div className="aspect-video w-full bg-black relative flex items-center justify-center">
                  <video 
                    controls 
                    preload="metadata"
                    className="w-full h-full object-contain"
                    poster="/images/hero-carousel-1.jpg"
                  >
                    <source src={encodeURI(TRIPURA_MEDIA[0].url)} type="video/mp4" />
                    Your browser does not support HTML5 video streaming.
                  </video>
                </div>
                <div className="p-4 bg-muted/20 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-sm">{TRIPURA_MEDIA[0].title}</h4>
                    <p className="text-xs text-muted-foreground">{TRIPURA_MEDIA[0].description}</p>
                  </div>
                  <Button asChild variant="outline" size="sm" className="text-xs shrink-0">
                    <a href={encodeURI(TRIPURA_MEDIA[0].url)} download>
                      <Download className="h-3.5 w-3.5 mr-1" /> Download Video (167 MB)
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile QR Codes Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <QrCode className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="text-xl font-headline font-bold">Fast Access Mobile QR Codes</h3>
                  <p className="text-xs text-muted-foreground">Scan with your smartphone camera for rapid policy viewing on the go.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {TRIPURA_QR_CODES.map((qr, idx) => (
                  <Card key={idx} className="p-3 text-center bg-card hover:shadow-md transition-shadow">
                    <div className="relative aspect-square w-full bg-white rounded-lg overflow-hidden border p-2 flex items-center justify-center">
                      <img 
                        src={encodeURI(qr.url)} 
                        alt={qr.title} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-xs font-medium mt-2 text-foreground line-clamp-2 leading-tight">
                      {qr.title}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Advisory / Support Banner */}
        <div className="rounded-2xl border bg-gradient-to-r from-primary/10 via-background to-primary/5 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-xl font-headline font-bold text-foreground">
              Need Assistance with State Subsidies & Approvals?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              The Indo-Japan Chamber of Commerce (IJCC) liaises directly with State Industrial Development Corporations (HSIIDC, GIDC, MPIDC, TIDC) to facilitate land allocation, single-window clearances, and capital incentive claims.
            </p>
          </div>
          <Button asChild size="lg" className="rounded-xl font-bold shrink-0 shadow-md">
            <Link href="/contact?type=state-policies">
              Contact IJCC Advisory
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
