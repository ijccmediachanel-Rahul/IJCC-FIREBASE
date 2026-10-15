"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  Building2,
  BookOpen,
  Users2,
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  Search,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Send,
  HelpCircle,
  Headphones,
  Award,
  Globe2,
  MessageSquare,
  Landmark,
  ShieldCheck,
  Check,
  Briefcase,
  Layers,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Library,
  Video,
  MonitorCheck,
  Compass
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { useAutoTranslate } from "@/hooks/use-auto-translate";
import { client } from "@/sanity/lib/client";
import { JESDC_PAGE_QUERY, JESDC_CENTRES_QUERY } from "@/sanity/lib/queries";
import { useToast } from "@/hooks/use-toast";

// Baseline pre-seeded centres to guarantee immediate rich render
const DEFAULT_CENTRES = [
  {
    _id: "jesdc-delhi",
    name: "JESDC Delhi NCR (Central Training Hub)",
    cityName: "New Delhi",
    stateName: "Delhi NCR",
    address: "IJCC Secretariat, Core 4B, India Habitat Centre / Barakhamba Road, New Delhi, PIN - 110001",
    coordinatorName: "Shri Rajesh Sharma (Senior Skilling Director)",
    phone: "+91-92679 19281",
    email: "delhi@jesdc.ijcc.in",
    timings: "Mon–Sat, 09:00 AM – 06:30 PM",
    googleMapUrl: "https://maps.google.com/?q=New+Delhi",
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=80",
    programsAvailable: [
      "SSW / TITP Japanese (Blue-Collar)",
      "Japanese for University Students",
      "Japanese for Professionals (IT / Non-IT)",
      "Japanese for Further Studies",
      "University Admission Assistance",
    ],
    facilities: [
      "Japanese Library",
      "Audio-Visual Classroom",
      "Online / Hybrid Classes",
      "Placement Guidance Cell",
    ],
    upcomingBatchDate: "1st November 2026",
    availableSeats: "12 Seats Open",
    order: 10,
  },
  {
    _id: "jesdc-kolkata",
    name: "JESDC Kolkata Regional Centre",
    cityName: "Kolkata",
    stateName: "West Bengal",
    address: "Salt Lake Sector V, Near IT Corridor, Kolkata, West Bengal, PIN - 700091",
    coordinatorName: "Shri Palash Sen (Regional Skilling Lead)",
    phone: "+91-92679 19281",
    email: "kolkata@jesdc.ijcc.in",
    timings: "Mon–Sat, 09:30 AM – 06:00 PM",
    googleMapUrl: "https://maps.google.com/?q=Salt+Lake+Sector+V+Kolkata",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=900&q=80",
    programsAvailable: [
      "SSW / TITP Japanese (Blue-Collar)",
      "Japanese for University Students",
      "Japanese for Professionals (IT / Non-IT)",
      "Japanese for Further Studies",
      "University Admission Assistance",
    ],
    facilities: [
      "Japanese Library",
      "Audio-Visual Classroom",
      "Online / Hybrid Classes",
      "Placement Guidance Cell",
    ],
    upcomingBatchDate: "15th November 2026",
    availableSeats: "18 Seats Open",
    order: 20,
  },
  {
    _id: "jesdc-patna",
    name: "JESDC Bihar Centre (Patna)",
    cityName: "Patna",
    stateName: "Bihar",
    address: "Exhibition Road / Fraser Road Institutional Zone, Patna, Bihar, PIN - 800001",
    coordinatorName: "Dr. Vinod K. Yadavendu (State Coordinator)",
    phone: "+91-92679 19281",
    email: "bihar@jesdc.ijcc.in",
    timings: "Mon–Sat, 09:00 AM – 05:30 PM",
    googleMapUrl: "https://maps.google.com/?q=Patna+Exhibition+Road",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80",
    programsAvailable: [
      "SSW / TITP Japanese (Blue-Collar)",
      "Japanese for University Students",
      "Japanese for Professionals (IT / Non-IT)",
      "Japanese for Further Studies",
      "University Admission Assistance",
    ],
    facilities: [
      "Japanese Library",
      "Audio-Visual Classroom",
      "Online / Hybrid Classes",
      "Placement Guidance Cell",
    ],
    upcomingBatchDate: "10th November 2026",
    availableSeats: "20 Seats Open",
    order: 30,
  },
];

// Helper to provide realistic, high-resolution Japanese language centre imagery when no CMS image is uploaded
function getCentreFallbackImage(cityName?: string, name?: string): string {
  const combined = `${cityName || ""} ${name || ""}`.toLowerCase();
  if (combined.includes("delhi")) {
    return "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=80";
  }
  if (combined.includes("kolkata") || combined.includes("bengal")) {
    return "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=900&q=80";
  }
  if (combined.includes("assam") || combined.includes("dibrugarh")) {
    return "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80";
  }
  if (combined.includes("patna") || combined.includes("bihar")) {
    return "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80";
  }
  return "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=80";
}

// Campus & Training Visual Showcase Slides (Option B)
const SHOWCASE_SLIDES = [
  {
    title: "JESDC Delhi NCR (Central Training Hub)",
    location: "New Delhi • India Habitat Centre",
    tag: "CENTRAL HUB",
    description: "Equipped with dedicated Japanese Audio-Visual Language Lab, native curriculum desks, and high-speed hybrid skilling facilities.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1400&q=80",
    centreName: "JESDC Delhi NCR (Central Training Hub)",
  },
  {
    title: "JESDC Kolkata Regional Centre",
    location: "Kolkata • Salt Lake Sector V",
    tag: "EAST REGIONAL HUB",
    description: "State-of-the-art interactive smart classroom, library of Japanese study materials, and direct interview placement guidance cell.",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1400&q=80",
    centreName: "JESDC Kolkata Regional Centre",
  },
  {
    title: "JESDC Assam Centre (Dibrugarh)",
    location: "Dibrugarh • Assam",
    tag: "NORTHEAST GATEWAY",
    description: "Dedicated skilling wing for Northeast youth, fostering SSW & TITP technical training, language proficiency, and work visa pathways.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80",
    centreName: "JESDC Assam Centre (Dibrugarh)",
  },
  {
    title: "Smart Audio-Visual Classrooms & Hybrid Learning",
    location: "Pan-India JESDC Network",
    tag: "MODERN INFRASTRUCTURE",
    description: "Standardized JLPT/NAT training infrastructure with live remote Japanese mentor sessions, audio pronunciation drills, and mock tests.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1400&q=80",
    centreName: "Nearest Available Centre",
  },
];

// Baseline objectives & programs from official document
const DEFAULT_OBJECTIVES = [
  {
    number: "01",
    title: "Japanese Language for SSW / TITP Candidates (Blue-Collar Jobs)",
    category: "SSW / TITP Trades",
    icon: <Briefcase className="h-6 w-6 text-primary" />,
    description:
      "Practical Japanese training for ITI, diploma and skilled-trade candidates preparing for the Specified Skilled Worker (SSW) and Technical Intern Training Program (TITP) routes.",
    points: [
      "Basic to elementary Japanese (JLPT N5/N4 and JFT-Basic preparation)",
      "Workplace and safety vocabulary for manufacturing, construction, caregiving, hospitality, agriculture and more",
      "Japanese work culture, discipline and daily-life orientation",
    ],
  },
  {
    number: "02",
    title: "Japanese Language for University Students (BCA, B.Tech, B.Sc and more)",
    category: "Colleges & Higher Ed",
    icon: <GraduationCap className="h-6 w-6 text-primary" />,
    description:
      "Structured Japanese language programs tailored to college semesters, opening high-value global recruitment pathways.",
    points: [
      "Structured courses from beginner level to JLPT N3",
      "Flexible timings alongside regular college schedules",
      "Preparation for placements with Japanese companies in India and Japan",
    ],
  },
  {
    number: "03",
    title: "Japanese Language for Professionals (IT and Non-IT)",
    category: "Working Professionals",
    icon: <Building2 className="h-6 w-6 text-primary" />,
    description:
      "Specialized language, technical vocabulary, and cross-cultural communication for software engineers, testers, and corporate executives.",
    points: [
      "Business Japanese, email writing and meeting etiquette",
      "IT-specific communication for engineers, testers and project teams",
      "Weekend and evening batches for working professionals",
      "Preparation for JLPT N3, N2 and above",
    ],
  },
  {
    number: "04",
    title: "Japanese Language for Students Planning Further Study",
    category: "Study in Japan",
    icon: <BookOpen className="h-6 w-6 text-primary" />,
    description:
      "Rigorous academic Japanese language training preparing students for admissions into Japan's top language schools and universities.",
    points: [
      "Preparation for JLPT and NAT-TEST examination certifications",
      "Academic Japanese: reading, writing, listening and spoken fluency",
      "Interview and essay preparation for Japanese language institutes and universities",
    ],
  },
  {
    number: "05",
    title: "Admission Assistance for Japanese Universities",
    category: "University Admissions",
    icon: <Compass className="h-6 w-6 text-primary" />,
    description:
      "Comprehensive bilateral admission counselling, documentation guidance, statement of purpose drafting, and student visa processing.",
    points: [
      "Course and university selection counselling across Japanese institutions",
      "Application, documentation and statement-of-purpose (SOP) support",
      "Guidance on MEXT and private scholarships, visas and pre-departure preparation",
      "Orientation on living in Japan, accommodation and social culture",
    ],
  },
  {
    number: "06",
    title: "Japanese Library and Audio-Visual Classroom",
    category: "Immersive Infrastructure",
    icon: <Library className="h-6 w-6 text-primary" />,
    description:
      "State-of-the-art learning infrastructure housed in every centre for deep interactive and cultural immersion.",
    points: [
      "Japanese library: textbooks, JLPT practice material, graded readers, dictionaries, manga and books on Japanese culture",
      "Audio-visual classroom: listening labs, films, video lessons and interactive tools for immersive learning",
    ],
  },
];

const DEFAULT_WHY_JESDC = [
  {
    title: "Backed by IJCC — Trusted Bilateral Platform",
    desc: "Established under the aegis of Indo-Japan Chamber of Commerce, bridging students directly to accredited institutions, mentors, and corporate networks.",
    icon: <Landmark className="h-6 w-6 text-primary" />,
  },
  {
    title: "End-to-End Pathway in One Place",
    desc: "From introductory Japanese language lessons to exam certifications, career placement, university admissions, and visa support under a single roof.",
    icon: <Layers className="h-6 w-6 text-primary" />,
  },
  {
    title: "Training Built Around Real Jobs in Japan",
    desc: "Curriculum tailored to genuine workplace standards, Specified Skilled Worker (SSW) mandates, and practical Japanese corporate etiquette.",
    icon: <Briefcase className="h-6 w-6 text-primary" />,
  },
  {
    title: "Modern Libraries & Interactive AV Labs",
    desc: "Every centre provides physical library access, graded JLPT materials, listening labs, and cultural workshops for immersive fluency.",
    icon: <Video className="h-6 w-6 text-primary" />,
  },
];

const JESDC_ENROLMENT_PROGRAMS = [
  {
    value: "SSW / TITP (Blue-Collar Jobs)",
    label: "SSW / TITP (Blue-Collar Jobs)",
    matches: ["ssw", "titp", "blue-collar", "worker", "trade"],
  },
  {
    value: "University Students (B.Tech / BCA / BSc)",
    label: "University Students (B.Tech / BCA / BSc)",
    matches: ["university students", "bca", "b.tech", "b.sc", "bachelor", "college"],
  },
  {
    value: "Professionals (IT & Non-IT Engineers)",
    label: "Professionals (IT & Non-IT Engineers)",
    matches: ["professional", "engineers", "non-it", "it"],
  },
  {
    value: "Further Studies & JLPT Preparation",
    label: "Further Studies & JLPT Preparation",
    matches: ["further study", "further studies", "jlpt", "language schools"],
  },
  {
    value: "Japan University Admissions",
    label: "Japan University Admissions",
    matches: ["admission", "universities", "university admission"],
  },
];

const matchProgramValue = (input?: string): string => {
  if (!input) return JESDC_ENROLMENT_PROGRAMS[0].value;
  const lower = input.toLowerCase();
  for (const prog of JESDC_ENROLMENT_PROGRAMS) {
    if (prog.value.toLowerCase() === lower || prog.label.toLowerCase() === lower) {
      return prog.value;
    }
    if (prog.matches.some((m) => lower.includes(m))) {
      return prog.value;
    }
  }
  return JESDC_ENROLMENT_PROGRAMS[0].value;
};

export default function JesdcCentresPage() {
  const { t, language } = useTranslation();
  const { tr, translateBatch } = useAutoTranslate();
  const { toast } = useToast();

  const [cmsPageData, setCmsPageData] = useState<any>(null);
  const [cmsCentres, setCmsCentres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states for Centres directory
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");



  // Modal states
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [selectedCentreForEnquiry, setSelectedCentreForEnquiry] = useState<any>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    centre: "Nearest Available Centre",
    program: JESDC_ENROLMENT_PROGRAMS[0].value,
    message: "",
  });
  const [partnerFormData, setPartnerFormData] = useState({
    institutionName: "",
    contactPerson: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Sanity CMS data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pageData, centresData] = await Promise.all([
          client.fetch(JESDC_PAGE_QUERY),
          client.fetch(JESDC_CENTRES_QUERY),
        ]);
        if (pageData) setCmsPageData(pageData);
        if (Array.isArray(centresData)) {
          setCmsCentres(centresData);
        }
      } catch (err) {
        console.warn("Notice: Loading baseline JESDC data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Effective centres list: Once Sanity CMS data is loaded, Sanity is the authoritative single source of truth.
  // 1. Any centre with hidden === true is strictly EXCLUDED.
  // 2. Any centre deleted from Sanity does not exist in cmsCentres, so it is strictly EXCLUDED.
  // 3. Baseline DEFAULT_CENTRES are ONLY used as fallback before CMS data has finished loading (null) or on network failure.
  const centresList = useMemo(() => {
    if (cmsCentres === null) {
      return DEFAULT_CENTRES;
    }

    return (cmsCentres || [])
      .filter((c: any) => !c.hidden)
      .map((c: any) => {
        const rawImages: string[] = [];
        if (c.imageUrl) rawImages.push(c.imageUrl);
        if (Array.isArray(c.galleryImages)) {
          c.galleryImages.forEach((imgUrl: string) => {
            if (imgUrl && !rawImages.includes(imgUrl)) rawImages.push(imgUrl);
          });
        }
        const effectiveImages =
          rawImages.length > 0
            ? rawImages
            : [getCentreFallbackImage(c.cityName, c.name)];

        return {
          ...c,
          cityName: (c.cityName || "").replace(/^["']|["']$/g, "").trim(),
          stateName: (c.stateName || "").replace(/^["']|["']$/g, "").trim(),
          imageUrl: effectiveImages[0],
          images: effectiveImages,
          programsAvailable:
            Array.isArray(c.programsAvailable) && c.programsAvailable.length > 0
              ? c.programsAvailable
              : [
                  "SSW / TITP Japanese (Blue-Collar)",
                  "Japanese for University Students",
                  "Japanese for Professionals (IT / Non-IT)",
                  "Japanese for Further Studies",
                  "University Admission Assistance",
                ],
          facilities:
            Array.isArray(c.facilities) && c.facilities.length > 0
              ? c.facilities
              : [
                  "Japanese Library",
                  "Audio-Visual Classroom",
                  "Online / Hybrid Classes",
                  "Placement Guidance Cell",
                ],
        };
      })
      .sort((a: any, b: any) => (a.order ?? 50) - (b.order ?? 50));
  }, [cmsCentres]);

  // Unique cities list for filtering
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    centresList.forEach((c) => {
      if (c.cityName) set.add(c.cityName.trim());
    });
    return Array.from(set);
  }, [centresList]);

  // Filtered centres by city and search query
  const filteredCentres = useMemo(() => {
    return centresList.filter((centre) => {
      const matchesCity =
        selectedCity === "all" ||
        centre.cityName?.toLowerCase() === selectedCity.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        centre.name?.toLowerCase().includes(q) ||
        centre.cityName?.toLowerCase().includes(q) ||
        centre.stateName?.toLowerCase().includes(q) ||
        centre.address?.toLowerCase().includes(q) ||
        centre.coordinatorName?.toLowerCase().includes(q);

      return matchesCity && matchesSearch;
    });
  }, [centresList, selectedCity, searchQuery]);

  // Dynamic slides for Top Hero from centresList (supports multiple images per centre)
  const heroSlides = useMemo(() => {
    if (centresList && centresList.length > 0) {
      const slides: any[] = [];
      centresList.forEach((c: any) => {
        const centreImages = c.images && c.images.length > 0 ? c.images : [c.imageUrl];
        centreImages.forEach((img: string) => {
          slides.push({
            title: c.name,
            location: `${c.cityName || "India"}${c.stateName ? ` • ${c.stateName}` : ""}`,
            tag: c.cityName ? `${c.cityName.toUpperCase()} CENTRE` : "JESDC CENTRE",
            description: c.address || "Accredited Japanese Language & Hybrid Skilling Infrastructure",
            image: img,
            centreName: c.name,
          });
        });
      });
      return slides.length > 0 ? slides : SHOWCASE_SLIDES;
    }
    return SHOWCASE_SLIDES;
  }, [centresList]);

  // Dynamic Centres Showcase for slider under directory (supports multiple images per centre)
  const dynamicCentresShowcase = useMemo(() => {
    if (centresList && centresList.length > 0) {
      const showcaseItems: any[] = [];
      centresList.forEach((c: any) => {
        const centreImages = c.images && c.images.length > 0 ? c.images : [c.imageUrl];
        centreImages.forEach((img: string, imgIdx: number) => {
          showcaseItems.push({
            id: `${c._id || c.name}-${imgIdx}`,
            name: c.name,
            cityName: c.cityName || "India",
            stateName: c.stateName || "",
            address: c.address || "",
            imageUrl: img,
            facilities: c.facilities || [],
            googleMapUrl: c.googleMapUrl,
            upcomingBatchDate: c.upcomingBatchDate,
            availableSeats: c.availableSeats,
            centreRaw: c,
          });
        });
      });
      return showcaseItems;
    }
    return [];
  }, [centresList]);

  // Ensure enough items for smooth infinite loop in multi-card carousel
  const sliderItems = useMemo(() => {
    if (dynamicCentresShowcase.length === 0) return [];
    if (dynamicCentresShowcase.length < 5) {
      return [...dynamicCentresShowcase, ...dynamicCentresShowcase, ...dynamicCentresShowcase];
    }
    return dynamicCentresShowcase;
  }, [dynamicCentresShowcase]);

  // Infinite marquee rows (Sunlit Consultants style) - duplicated for seamless loop
  const marqueeCentresRow1 = useMemo(() => {
    if (dynamicCentresShowcase.length === 0) return [];
    return [...dynamicCentresShowcase, ...dynamicCentresShowcase, ...dynamicCentresShowcase, ...dynamicCentresShowcase];
  }, [dynamicCentresShowcase]);

  const marqueeCentresRow2 = useMemo(() => {
    if (dynamicCentresShowcase.length === 0) return [];
    const shifted = dynamicCentresShowcase.length > 1
      ? [...dynamicCentresShowcase.slice(1), dynamicCentresShowcase[0]]
      : dynamicCentresShowcase;
    return [...shifted, ...shifted, ...shifted, ...shifted];
  }, [dynamicCentresShowcase]);

  // Objectives list (CMS or baseline)
  const objectivesList = useMemo(() => {
    if (cmsPageData?.objectives && cmsPageData.objectives.length > 0) {
      return cmsPageData.objectives.map((obj: any, idx: number) => ({
        number: obj.number || String(idx + 1).padStart(2, "0"),
        title: obj.title,
        category: obj.category || "JESDC Program",
        icon: DEFAULT_OBJECTIVES[idx % DEFAULT_OBJECTIVES.length]?.icon || <BookOpen className="h-6 w-6 text-primary" />,
        description: obj.description,
        points: obj.points || [],
      }));
    }
    return DEFAULT_OBJECTIVES;
  }, [cmsPageData]);

  // Dynamically auto-translate all JESDC content (Objectives, Centres, Programs, Why JESDC) into Japanese
  useEffect(() => {
    if (language !== "ja") return;
    const texts: string[] = [];

    // CMS Banners & Headings (if updated in CMS)
    if (cmsPageData?.bannerTitle) texts.push(cmsPageData.bannerTitle);
    if (cmsPageData?.bannerSubtitle) texts.push(cmsPageData.bannerSubtitle);
    if (cmsPageData?.bannerTagline) texts.push(cmsPageData.bannerTagline);
    if (cmsPageData?.bannerDescription) texts.push(cmsPageData.bannerDescription);
    if (cmsPageData?.bannerBadge) texts.push(cmsPageData.bannerBadge);

    // Objectives (01 to 06 and any newly added programs in CMS)
    objectivesList.forEach((obj: any) => {
      if (obj.category) texts.push(obj.category);
      if (obj.title) texts.push(obj.title);
      if (obj.description) texts.push(obj.description);
      if (Array.isArray(obj.points)) {
        obj.points.forEach((pt: string) => {
          if (pt) texts.push(pt);
        });
      }
    });

    // Centres Directory (Delhi, Kolkata, Patna and ANY NEW CENTRE added in CMS)
    centresList.forEach((c: any) => {
      if (c.name) texts.push(c.name);
      if (c.cityName) texts.push(c.cityName);
      if (c.stateName) texts.push(c.stateName);
      if (c.address) texts.push(c.address);
      if (c.coordinatorName) texts.push(c.coordinatorName);
      if (c.timings) texts.push(c.timings);
      if (c.upcomingBatchDate) texts.push(c.upcomingBatchDate);
      if (c.availableSeats) texts.push(c.availableSeats);
      if (Array.isArray(c.programsAvailable)) {
        c.programsAvailable.forEach((p: string) => {
          if (p) texts.push(p);
        });
      }
      if (Array.isArray(c.facilities)) {
        c.facilities.forEach((f: string) => {
          if (f) texts.push(f);
        });
      }
    });

    // Why JESDC
    const whyPoints = cmsPageData?.whyJesdcPoints && cmsPageData.whyJesdcPoints.length > 0
      ? cmsPageData.whyJesdcPoints
      : DEFAULT_WHY_JESDC;
    whyPoints.forEach((w: any) => {
      if (w.title) texts.push(w.title);
      if (w.desc || w.description) texts.push(w.desc || w.description);
    });

    if (texts.length > 0) {
      translateBatch(texts);
    }
  }, [language, objectivesList, centresList, cmsPageData, translateBatch]);

  // Clean dynamic programs: strictly from centres' programsAvailable (or default 5 programs)
  const availableProgramsForModal = useMemo<string[]>(() => {
    // 1. If a specific centre is selected, show only that centre's programs
    if (formData.centre && formData.centre !== "Nearest Available Centre") {
      const active = centresList.find((c: any) => c.name === formData.centre);
      if (active && Array.isArray(active.programsAvailable) && active.programsAvailable.length > 0) {
        return active.programsAvailable.map((p: string) => p.trim()).filter(Boolean);
      }
    }

    // 2. Otherwise collect unique clean programs from all active centres
    const set = new Set<string>();
    centresList.forEach((c: any) => {
      if (Array.isArray(c.programsAvailable)) {
        c.programsAvailable.forEach((p: string) => {
          if (p && p.trim()) set.add(p.trim());
        });
      }
    });

    const list = Array.from(set);
    if (list.length > 0) {
      return list;
    }

    // Default 5 standard programs
    return [
      "SSW / TITP Japanese (Blue-Collar)",
      "Japanese for University Students",
      "Japanese for Professionals (IT / Non-IT)",
      "Japanese for Further Studies",
      "University Admission Assistance",
    ];
  }, [formData.centre, centresList]);

  // Open Enquiry Modal with centre context
  const handleOpenEnquiry = (centre?: any, programTitle?: string) => {
    setSelectedCentreForEnquiry(centre || null);
    const chosenCentreName = centre ? centre.name : (formData.centre || "Nearest Available Centre");

    // Map any full card title to the clean concise program name
    let chosenProg = availableProgramsForModal[0] || "SSW / TITP Japanese (Blue-Collar)";
    if (programTitle) {
      const lower = programTitle.toLowerCase();
      const matched = availableProgramsForModal.find((p: string) => {
        const pLower = p.toLowerCase();
        if (pLower === lower || lower.includes(pLower) || pLower.includes(lower)) return true;
        if (lower.includes("ssw") && pLower.includes("ssw")) return true;
        if (lower.includes("university student") && pLower.includes("student")) return true;
        if (lower.includes("professional") && pLower.includes("professional")) return true;
        if (lower.includes("further study") && pLower.includes("further")) return true;
        if (lower.includes("admission") && pLower.includes("admission")) return true;
        return false;
      });
      if (matched) chosenProg = matched;
    }

    setFormData((prev) => ({
      ...prev,
      centre: chosenCentreName,
      program: chosenProg,
    }));
    setIsEnquiryModalOpen(true);
  };

  // Submit Enquiry to Real Backend API
  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter your name and phone number.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/jesdc-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "enrolment",
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          centre: formData.centre || "Nearest Available Centre",
          program: formData.program || (availableProgramsForModal[0] || "General Consultation"),
          message: formData.message,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit enquiry.");
      }

      setIsEnquiryModalOpen(false);
      toast({
        title: "Enquiry Submitted Successfully!",
        description: `Thank you, ${formData.name}. Your details have been received and our coordinator will reach out shortly.`,
      });

      setFormData({
        name: "",
        phone: "",
        email: "",
        centre: "Nearest Available Centre",
        program: availableProgramsForModal[0] || "General Consultation",
        message: "",
      });
    } catch (err: any) {
      console.error("Enquiry submission failed:", err);
      toast({
        variant: "destructive",
        title: "Submission Notice",
        description: err.message || "Could not submit right now. Please call our helpline or retry.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Partner Request to Real Backend API
  const handleSubmitPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerFormData.institutionName || !partnerFormData.phone) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter your institution name and contact number.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/jesdc-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "partner",
          institutionName: partnerFormData.institutionName,
          contactPerson: partnerFormData.contactPerson,
          phone: partnerFormData.phone,
          email: partnerFormData.email,
          city: partnerFormData.city,
          state: partnerFormData.state,
          message: partnerFormData.message,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit proposal.");
      }

      setIsPartnerModalOpen(false);
      toast({
        title: "Partnership Application Received!",
        description: "The IJCC JESDC Network Council will review your proposal and initiate collaboration.",
      });

      setPartnerFormData({
        institutionName: "",
        contactPerson: "",
        phone: "",
        email: "",
        city: "",
        state: "",
        message: "",
      });
    } catch (err: any) {
      console.error("Partner request submission failed:", err);
      toast({
        variant: "destructive",
        title: "Submission Notice",
        description: err.message || "Could not submit proposal right now. Please retry or contact secretariat.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div suppressHydrationWarning className="min-h-screen bg-background">
      {/* ========================================================
          1. HERO BANNER & INTRO (Synced with IJCC signature style)
          ======================================================== */}
      {/* ========================================================
          1. FULL-SCREEN HERO SLIDER (Edge-to-Edge like Homepage)
          ======================================================== */}
      <section className="relative w-full h-[560px] sm:h-[640px] flex items-center justify-center text-center text-white overflow-hidden bg-black">
        <Carousel
          className="absolute inset-0 w-full h-full bg-black"
          plugins={[
            Autoplay({
              delay: 4500,
            }),
          ]}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent className="h-full ml-0">
            {heroSlides.map((slide, index) => (
              <CarouselItem key={index} className="h-full pl-0 relative bg-black">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover brightness-[0.72] contrast-[1.05] block select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/15" />
                {/* Active Slide Centre Badge at top */}
                <div className="absolute top-6 left-6 z-20 hidden sm:flex items-center gap-2">
                  <span className="px-3.5 py-1 rounded-full bg-primary/95 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                    {slide.tag}
                  </span>
                  <span className="px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/95 text-xs font-medium border border-white/20 inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
                    <span>{slide.location}</span>
                  </span>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white bg-black/40 hover:bg-black/70 border-none" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white bg-black/40 hover:bg-black/70 border-none" />
        </Carousel>

        {/* Hero Content Overlay (Always centered, highly legible & responsive) */}
        <div className="relative z-10 container px-4 sm:px-6">
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {/* Floating Badge */}
            <Badge className="rounded-full bg-accent text-accent-foreground px-4 sm:px-5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold tracking-widest uppercase mb-1 sm:mb-2 shadow-sm">
              {language === 'ja'
                ? tr(cmsPageData?.bannerBadge, "日印教育・技能開発イニシアチブ")
                : (cmsPageData?.bannerBadge || "AN INITIATIVE OF IJCC")}
            </Badge>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-headline tracking-tight leading-tight text-white font-bold drop-shadow-md">
              {language === 'ja'
                ? tr(cmsPageData?.bannerTitle, "JESDC センター")
                : (cmsPageData?.bannerTitle || "JESDC Centres")}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl md:text-2xl font-headline text-white/95 font-medium drop-shadow">
              {language === 'ja'
                ? tr(cmsPageData?.bannerSubtitle, "日本教育・技能開発センター")
                : (cmsPageData?.bannerSubtitle || "Japan Education & Skill Development Centre")}
            </p>

            {/* Tagline */}
            <p className="text-base sm:text-xl md:text-2xl font-headline italic text-accent px-2 drop-shadow">
              "{language === 'ja'
                ? tr(cmsPageData?.bannerTagline, "日本語を学び、技術を磨き、日本での未来を創る")
                : (cmsPageData?.bannerTagline || "Learn Japanese. Build Skills. Create Your Future in Japan.")}"
            </p>

            {/* Description */}
            <p className="max-w-3xl mx-auto text-xs sm:text-sm md:text-base text-white/85 font-sans leading-relaxed pt-1 px-2 sm:px-0 drop-shadow">
              {language === 'ja'
                ? tr(cmsPageData?.bannerDescription, "JESDCは、日本での就労・留学を目指す学生や社会人を対象に、実践的な日本語教育、キャリア指導、大学進学支援を提供するIJCC公認の総合研修ネットワークです。")
                : (cmsPageData?.bannerDescription ||
                  "JESDC is IJCC's network of accredited training centres across India. Each centre offers Japanese language training, career preparation, and visa pathways for students and professionals.")}
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 pt-3 sm:pt-4 w-full">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto rounded-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-md px-6 sm:px-8 transition-transform hover:scale-105"
              >
                <a href="#centres-directory">
                  <MapPin className="mr-2 h-4 w-4" />
                  {language === 'ja' ? "最寄りのセンターを探す" : "Find Nearest Centre"}
                </a>
              </Button>

              <Button
                size="lg"
                variant="secondary"
                onClick={() => handleOpenEnquiry()}
                className="w-full sm:w-auto rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 font-semibold px-6 sm:px-8 transition-transform hover:scale-105 backdrop-blur-sm"
              >
                <Send className="mr-2 h-4 w-4" />
                {language === 'ja' ? "入会・受講相談" : "Enrol / Book Counselling"}
              </Button>

              <Button
                size="lg"
                variant="ghost"
                onClick={() => setIsPartnerModalOpen(true)}
                className="w-full sm:w-auto rounded-full text-white/90 hover:text-white hover:bg-white/10 font-semibold px-6"
              >
                <Building2 className="mr-2 h-4 w-4 text-accent" />
                {language === 'ja' ? "センター開設提携" : "Open a JESDC Centre"} ➔
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. OUR OBJECTIVES & PROGRAMS
          ======================================================== */}
      <section className="py-12 sm:py-20 md:py-24 bg-background">
        <div className="container px-4 sm:px-6">
          <div className="space-y-3 sm:space-y-4 mb-10 sm:mb-16 text-center max-w-3xl mx-auto">
            <div className="inline-block rounded-full bg-muted px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {language === 'ja' ? "包括的な教育・技能プログラム" : "STRUCTURED CAREER PATHWAYS"}
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-headline tracking-tighter text-foreground">
              {language === 'ja'
                ? "目的・プログラム"
                : (cmsPageData?.objectivesTitle || "Our Objectives & Programs")}
            </h2>
            <p className="max-w-[700px] mx-auto text-xs sm:text-base md:text-xl text-muted-foreground leading-relaxed">
              {language === 'ja'
                ? "特定技能(SSW)、大学進学、IT専門職、大学院留学など、多様なニーズに応える体系的な日本語指導"
                : (cmsPageData?.objectivesSubtitle ||
                  "Comprehensive Japanese language pathways tailored for careers, industry and higher studies in Japan.")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {objectivesList.map((prog: any, idx: number) => (
              <Card
                key={idx}
                className="flex flex-col transform transition-transform duration-300 hover:-translate-y-2 h-full border bg-card shadow-xs hover:shadow-md rounded-lg overflow-hidden"
              >
                <CardHeader className="p-5 sm:p-6 pb-4 space-y-2.5 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl sm:text-3xl font-headline font-black text-primary/20">
                      {prog.number}
                    </span>
                    <Badge variant="outline" className="text-xs font-semibold bg-muted text-muted-foreground rounded-full px-3 py-1">
                      {tr(prog.category)}
                    </Badge>
                  </div>
                  <CardTitle className="font-headline text-lg sm:text-xl leading-snug pt-1 text-foreground h-[58px] sm:h-[64px] flex items-start">
                    {tr(prog.title)}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed h-[68px] sm:h-[76px] flex items-start">
                    {tr(prog.description)}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-5 sm:p-6 pt-4 border-t border-border/70 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    {prog.points.map((pt: string, pIdx: number) => (
                      <div key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{tr(pt)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="p-5 sm:p-6 pt-3 border-t bg-muted/20 mt-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, program: matchProgramValue(prog.title) }));
                      setIsEnquiryModalOpen(true);
                    }}
                    className="w-full text-xs font-semibold text-primary hover:text-primary/90 justify-between rounded-full"
                  >
                    <span>{language === 'ja' ? "プログラム詳細・相談" : "Enquire for this Program"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          3. OUR CENTRES DIRECTORY (ONE CARD PER CENTRE + FILTERS)
          ======================================================== */}
      <section id="centres-directory" className="py-12 sm:py-20 md:py-28 container mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-3 mb-8 sm:mb-12">
          <div className="text-xs uppercase tracking-widest text-accent font-bold">
            {language === 'ja' ? "全国トレーニング拠点" : "ACCREDITED PAN-INDIA NETWORK"}
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-headline font-bold uppercase tracking-tight text-foreground">
            {language === 'ja' ? "全国のJESDCセンター" : "Our Centres Directory"}
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground italic px-2">
            {language === 'ja'
              ? "各センターでは同一基準の高品質な日本語教育、AV教室、図書室、進学・就職指導を提供しています。"
              : "Locate an accredited centre near you with modern audio-visual classrooms, libraries, and guidance desks."}
          </p>
          <div className="w-16 h-1 bg-accent mx-auto mt-2 rounded-full" />
        </div>

        {/* Search & Filter Toolbar */}
        <div className="max-w-3xl mx-auto mb-8 sm:mb-12 space-y-3 sm:space-y-4">
          {/* Clean Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={language === 'ja' ? "都市名、センター名、住所で検索..." : "Search by city, centre name, or address..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-10 h-11 sm:h-12 bg-card rounded-full border text-xs sm:text-sm shadow-xs focus-visible:ring-2 focus-visible:ring-primary/20"
            />
            {searchQuery && (
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground font-semibold px-2 py-1 rounded-full hover:bg-muted transition-colors cursor-pointer"
                title="Clear"
              >
                ✕
              </button>
            )}
          </div>

          {/* Clean City Filter Pills */}
          <div suppressHydrationWarning className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setSelectedCity("all")}
              className={cn(
                "px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors cursor-pointer",
                selectedCity === "all"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              {language === 'ja' ? "全都市" : "All Cities"} ({centresList.length})
            </button>
            {availableCities.map((city) => (
              <button
                key={city}
                type="button"
                suppressHydrationWarning
                onClick={() => setSelectedCity(city)}
                className={cn(
                  "px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors cursor-pointer",
                  selectedCity.toLowerCase() === city.toLowerCase()
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                {city}
              </button>
            ))}
          </div>

          {(searchQuery || selectedCity !== "all") && (
            <div suppressHydrationWarning className="text-center pt-1">
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => {
                  setSelectedCity("all");
                  setSearchQuery("");
                }}
                className="text-xs text-primary hover:underline font-semibold cursor-pointer px-4 py-1.5 rounded-full bg-muted/60 hover:bg-muted transition-colors"
              >
                {language === 'ja' ? "フィルターをクリア" : "Reset Filters"}
              </button>
            </div>
          )}
        </div>

        {/* Centres Grid */}
        {filteredCentres.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredCentres.map((centre) => (
              <Card
                key={centre._id}
                className="h-full bg-card border border-border shadow-xs hover:shadow-md transition-shadow rounded-lg flex flex-col justify-between overflow-hidden group"
              >
                {/* Centre Header */}
                <CardHeader className="p-5 sm:p-6 pb-2 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold px-3 py-1">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{tr(centre.cityName) || "India"}</span>
                    </span>
                    {centre.stateName && (
                      <span className="text-[11px] font-mono font-medium text-muted-foreground uppercase">
                        {tr(centre.stateName)}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-bold font-headline leading-tight group-hover:text-primary transition-colors pt-1 min-h-[52px] flex items-center">
                    {tr(centre.name)}
                  </CardTitle>
                </CardHeader>

                {/* Centre Details Body */}
                <CardContent className="p-5 sm:p-6 pt-2 flex flex-col flex-1 space-y-4 text-xs sm:text-sm">
                  {/* Address */}
                  <div className="flex items-start gap-2.5 text-muted-foreground min-h-[40px]">
                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <p className="leading-relaxed line-clamp-2">
                      {tr(centre.address) || (language === 'ja' ? "住所情報を確認中" : "Address details being updated.")}
                    </p>
                  </div>

                  {/* Coordinator & Contact */}
                  <div className="space-y-2 pt-2 border-t">
                    {centre.coordinatorName && (
                      <div className="flex items-center gap-2.5">
                        <Users2 className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="font-semibold text-foreground truncate">
                          {tr(centre.coordinatorName)}
                        </span>
                      </div>
                    )}
                    {centre.phone && (
                      <div className="flex items-center gap-2.5">
                        <Phone className="h-4 w-4 text-emerald-600 shrink-0" />
                        <a
                          href={`tel:${centre.phone.replace(/[^0-9+]/g, "")}`}
                          className="text-foreground hover:text-primary font-medium hover:underline"
                        >
                          {centre.phone}
                        </a>
                      </div>
                    )}
                    {centre.email && (
                      <div className="flex items-center gap-2.5">
                        <Mail className="h-4 w-4 text-primary shrink-0" />
                        <a
                          href={`mailto:${centre.email}`}
                          className="text-foreground hover:text-primary truncate hover:underline"
                        >
                          {centre.email}
                        </a>
                      </div>
                    )}
                    {centre.timings && (
                      <div className="flex items-center gap-2.5 text-muted-foreground">
                        <Clock className="h-4 w-4 shrink-0" />
                        <span>{tr(centre.timings)}</span>
                      </div>
                    )}
                  </div>

                  {/* Programs Available */}
                  {centre.programsAvailable && centre.programsAvailable.length > 0 && (
                    <div className="space-y-2 pt-2 border-t">
                      <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">
                        {language === 'ja' ? "開講プログラム" : "Programs Available"}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {centre.programsAvailable.map((prog: string, pI: number) => (
                          <div
                            key={pI}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-[11px] font-medium text-foreground/90 w-fit"
                          >
                            <Check className="h-3 w-3 text-primary shrink-0" />
                            <span>{tr(prog)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Facilities */}
                  {centre.facilities && centre.facilities.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t">
                      <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">
                        {language === 'ja' ? "設備・環境" : "Facilities"}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {centre.facilities.map((fac: string, fI: number) => (
                          <span
                            key={fI}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/5 text-[10px] font-medium text-primary border border-primary/20"
                          >
                            • {tr(fac)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upcoming Batch & Seats Banner (Always pinned to bottom) */}
                  {(centre.upcomingBatchDate || centre.availableSeats) && (
                    <div className="mt-auto pt-3">
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-amber-600 shrink-0" />
                          <span>
                            {language === 'ja' ? "次回開講日:" : "Batch:"} <strong>{tr(centre.upcomingBatchDate) || (language === 'ja' ? "受付中" : "Enrolling")}</strong>
                          </span>
                        </div>
                        {centre.availableSeats && (
                          <span className="font-semibold text-[11px] bg-background px-2.5 py-0.5 rounded-full border border-amber-500/30">
                            {tr(centre.availableSeats)}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>

                {/* Footer Action Buttons */}
                <CardFooter className="p-4 sm:p-6 pt-3 border-t bg-muted/20 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-auto">
                  <Button
                    size="sm"
                    onClick={() => handleOpenEnquiry(centre)}
                    className="w-full sm:flex-1 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-xs"
                  >
                    <Send className="mr-1.5 h-3.5 w-3.5" />
                    {language === 'ja' ? "受講申込・相談" : "Enquire Now"}
                  </Button>
                  {centre.googleMapUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="w-full sm:w-auto rounded-full text-xs font-medium shrink-0 justify-center"
                    >
                      <a href={centre.googleMapUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                        {language === 'ja' ? "地図" : "Directions"}
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 px-4 bg-muted/20 rounded-lg border border-dashed max-w-xl mx-auto space-y-3">
            <MapPin className="h-10 w-10 mx-auto text-muted-foreground/40" />
            <h3 className="text-base sm:text-lg font-bold text-foreground font-headline">
              {language === 'ja' ? "センターが見つかりませんでした" : "No Centres Match Your Search"}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {language === 'ja'
                ? "都市フィルターをリセットするか、中央ヘルプラインにお問い合わせください。"
                : "Try resetting your city filter or search query, or contact our Central Helpline."}
            </p>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full px-6"
              onClick={() => {
                setSelectedCity("all");
                setSearchQuery("");
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* ========================================================
            3.5. DYNAMIC CENTRES & CAMPUS INFRASTRUCTURE MARQUEE
            (Infinite moving cards like Sunlit Consultants - fully dynamic & bright)
            ======================================================== */}
        <div className="mt-14 sm:mt-20 pt-10 sm:pt-14 border-t overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10 px-4 sm:px-6 max-w-7xl mx-auto">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-bold">
                <Sparkles className="h-3.5 w-3.5" />
                {language === 'ja' ? "施設・キャンパス ライブショーケース" : "ACCREDITED JESDC CENTRES SHOWCASE"}
              </div>
              <h3 className="text-2xl sm:text-4xl font-headline font-bold text-foreground">
                {language === 'ja' ? "JESDC センター＆施設ギャラリー" : "JESDC Centres & Training Infrastructure"}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
                {language === 'ja'
                  ? "全国のJESDCスマート教室、日本語ラボ、ハイブリッド研修施設。ホバーすると一時停止します。"
                  : "Explore our accredited Japanese audio-visual classrooms, libraries, and native training infrastructure across India. Hover over any centre to pause."}
              </p>
            </div>

            {/* Quick Centre Count Badge */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="rounded-full px-4 py-1.5 text-xs font-semibold text-foreground border-border bg-card shadow-xs inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>{centresList.length} {language === 'ja' ? "拠点展開中" : "Active Centres"}</span>
              </Badge>
            </div>
          </div>

          {/* Infinite Marquee Wrapper with soft edge gradients */}
          <div className="relative w-full overflow-hidden space-y-4 sm:space-y-6 py-2">
            {/* Left and Right Edge Gradient Masks for Smooth Fade */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 md:w-44 z-20 bg-gradient-to-r from-background via-background/80 to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 md:w-44 z-20 bg-gradient-to-l from-background via-background/80 to-transparent" />

            {/* ROW 1: Gliding smoothly from right to left */}
            <div className="animate-marquee-infinite flex gap-3 sm:gap-4">
              {marqueeCentresRow1.map((centre, mIdx) => (
                <div
                  key={`row1-${centre.id}-${mIdx}`}
                  className="w-[200px] sm:w-[230px] md:w-[250px] shrink-0 rounded-2xl border border-border/80 bg-card shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group select-none"
                >
                  {/* Clean, Bright Photo */}
                  <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-muted">
                    <img
                      src={centre.imageUrl}
                      alt={centre.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-100 select-none"
                    />
                  </div>

                  {/* Clean Centre Name ONLY */}
                  <div className="p-2.5 sm:p-3 text-center bg-card flex flex-col justify-center min-h-[52px]">
                    <h4 className="text-xs sm:text-sm font-bold font-headline text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {tr(centre.name)}
                    </h4>
                    <span className="text-[11px] text-muted-foreground font-medium flex items-center justify-center gap-1.5 mt-0.5">
                      <MapPin className="h-3 w-3 text-primary shrink-0" />
                      <span>{tr(centre.cityName) || "India"}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* ROW 2: Gliding smoothly in reverse direction (Sunlit Consultants style) */}
            <div className="animate-marquee-infinite-reverse flex gap-3 sm:gap-4">
              {marqueeCentresRow2.map((centre, mIdx) => (
                <div
                  key={`row2-${centre.id}-${mIdx}`}
                  className="w-[200px] sm:w-[230px] md:w-[250px] shrink-0 rounded-2xl border border-border/80 bg-card shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group select-none"
                >
                  {/* Clean, Bright Photo */}
                  <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-muted">
                    <img
                      src={centre.imageUrl}
                      alt={centre.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-100 select-none"
                    />
                  </div>

                  {/* Clean Centre Name ONLY */}
                  <div className="p-2.5 sm:p-3 text-center bg-card flex flex-col justify-center min-h-[52px]">
                    <h4 className="text-xs sm:text-sm font-bold font-headline text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {tr(centre.name)}
                    </h4>
                    <span className="text-[11px] text-muted-foreground font-medium flex items-center justify-center gap-1.5 mt-0.5">
                      <MapPin className="h-3 w-3 text-primary shrink-0" />
                      <span>{tr(centre.cityName) || "India"}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. WHY JESDC? (Harmonized with Home page Key Features)
          ======================================================== */}
      <section className="py-12 sm:py-20 md:py-28 bg-secondary/50 border-y">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 text-center mb-10 sm:mb-16 max-w-3xl mx-auto">
            <div className="inline-block rounded-full bg-muted px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {language === 'ja' ? "JESDCを選ぶ理由" : "DISTINCTIVE ADVANTAGES"}
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-headline tracking-tighter text-foreground">
              {language === 'ja'
                ? "なぜJESDCなのか？"
                : (cmsPageData?.whyJesdcTitle || "Why JESDC?")}
            </h2>
            <p className="max-w-[800px] text-xs sm:text-base md:text-xl text-muted-foreground leading-relaxed">
              {language === 'ja'
                ? "確かな日印二国間ネットワーク、総合支援、本場の就労・留学直結カリキュラム"
                : (cmsPageData?.whyJesdcSubtitle ||
                  "The definitive India-Japan skilling network with accredited corporate ties and visa guidance.")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {(cmsPageData?.whyJesdcPoints && cmsPageData.whyJesdcPoints.length > 0
              ? cmsPageData.whyJesdcPoints
              : DEFAULT_WHY_JESDC
            ).map((item: any, idx: number) => (
              <Card
                key={idx}
                className="flex flex-col transform transition-transform duration-300 hover:-translate-y-2 h-full bg-card shadow-xs hover:shadow-md border rounded-lg p-5 sm:p-6 text-center"
              >
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4 mx-auto">
                  {DEFAULT_WHY_JESDC[idx % DEFAULT_WHY_JESDC.length]?.icon || <Award className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />}
                </div>
                <h3 className="font-headline text-lg sm:text-xl leading-snug font-bold text-foreground mb-2">
                  {tr(item.title)}
                </h3>
                <p className="flex-grow text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {tr(item.desc || item.description)}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          5. PARTNER WITH US — OPEN A JESDC CENTRE
          ======================================================== */}
      <section id="partner-section" className="py-12 sm:py-20 md:py-24 bg-background">
        <div className="container px-4 sm:px-6 max-w-4xl mx-auto">
          <div className="rounded-lg border bg-card p-6 sm:p-10 md:p-12 shadow-sm text-center md:text-left flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 sm:gap-8">
            <div className="space-y-3 max-w-xl text-left">
              <Badge variant="outline" className="text-xs font-semibold text-primary border-primary/20 bg-primary/5 rounded-full px-3 py-1">
                🏛️ Institutional Alliance
              </Badge>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-headline tracking-tight text-foreground font-bold">
                {language === 'ja'
                  ? "提携のご案内 — JESDCセンターを開設する"
                  : (cmsPageData?.openCentreTitle || "Partner with Us — Open a JESDC Centre")}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {language === 'ja'
                  ? "大学、工科大学、各種教育機関の皆様：IJCCの認定ネットワークに参加し、貴校キャンパス内に日本語研修センターを共同開設できます。"
                  : (cmsPageData?.openCentreDescription ||
                    "Colleges, technical institutes, and educational organizations across India can join the accredited JESDC Network to establish Japanese language training centres with curriculum and placement guidance backed by IJCC.")}
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => setIsPartnerModalOpen(true)}
              className="w-full md:w-auto rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 sm:px-8 shrink-0 shadow-md transition-transform hover:scale-105"
            >
              <Building2 className="mr-2 h-4 sm:h-5 w-4 sm:w-5 text-accent" />
              {language === 'ja' ? "開設提携の申請" : "Apply to Open a Centre"}
            </Button>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. CALL TO ACTION & ENROLMENT HELPLINE
          ======================================================== */}
      <section className="py-12 sm:py-20 bg-muted/30 border-t">
        <div className="container px-4 sm:px-6 text-center max-w-3xl mx-auto space-y-5 sm:space-y-6">
          <h2 className="text-2xl sm:text-4xl font-headline tracking-tighter text-foreground font-bold">
            {language === 'ja'
              ? "最寄りのJESDCセンターを見つけて今すぐ受講登録"
              : (cmsPageData?.ctaTitle || "Find your nearest JESDC Centre and enrol today.")}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
            {language === 'ja'
              ? "専門家によるカウンセリング、体験授業、日本でのキャリア形成支援をお気軽にご相談ください。"
              : "Get expert counselling, trial classes, and career guidance for Japan."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <Button
              size="lg"
              onClick={() => handleOpenEnquiry()}
              className="w-full sm:w-auto rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 shadow-md"
            >
              <Send className="mr-2 h-4 w-4 text-accent" />
              {language === 'ja' ? "受講登録する" : "Register Now"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => handleOpenEnquiry()}
              className="w-full sm:w-auto rounded-full px-8 font-semibold"
            >
              <HelpCircle className="mr-2 h-4 w-4 text-primary" />
              {language === 'ja' ? "無料カウンセリングを予約" : "Book a Free Counselling Session"}
            </Button>
          </div>

          {/* Central Helpline & Contact Details */}
          <div className="pt-6 sm:pt-8 border-t mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-10 text-xs sm:text-sm text-muted-foreground font-medium">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <span>
                Central Helpline:{" "}
                <a
                  href={`tel:${(cmsPageData?.centralHelpline || "+91-92679 19281").replace(/[^0-9+]/g, "")}`}
                  className="font-bold text-foreground hover:text-primary transition-colors"
                >
                  {cmsPageData?.centralHelpline || "+91-92679 19281"}
                </a>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <span>
                Email:{" "}
                <a
                  href={`mailto:${cmsPageData?.centralEmail || "info@ijcc.in"}`}
                  className="font-bold text-foreground hover:text-primary transition-colors"
                >
                  {cmsPageData?.centralEmail || "info@ijcc.in"}
                </a>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          MODAL: STUDENT ENROLMENT & COUNSELLING FORM
          ======================================================== */}
      <Dialog open={isEnquiryModalOpen} onOpenChange={setIsEnquiryModalOpen}>
        <DialogContent className="w-[94vw] sm:max-w-lg p-4 sm:p-6 bg-card border border-border shadow-2xl rounded-2xl max-h-[88vh] overflow-y-auto">
          <DialogHeader className="space-y-1 text-left border-b pb-3 sm:pb-4">
            <DialogTitle className="text-lg sm:text-xl font-bold font-headline text-foreground flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary shrink-0" />
              <span>{language === 'ja' ? "JESDC受講・進学相談申込" : "JESDC Enrolment & Counselling"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-normal">
              {selectedCentreForEnquiry
                ? `Enquiring for ${selectedCentreForEnquiry.name}`
                : "Fill in your details to book a free orientation and placement counselling session."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitEnquiry} className="space-y-3.5 sm:space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Your Full Name *</Label>
              <Input
                required
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-10 text-xs sm:text-sm rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Phone / WhatsApp *</Label>
                <Input
                  required
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-10 text-xs sm:text-sm rounded-lg"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Email Address</Label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-10 text-xs sm:text-sm rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Preferred Centre</Label>
                <Select
                  value={formData.centre || "Nearest Available Centre"}
                  onValueChange={(val) => setFormData({ ...formData, centre: val })}
                >
                  <SelectTrigger className="h-10 text-xs sm:text-sm rounded-lg">
                    <SelectValue placeholder="Nearest Available Centre" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999] max-h-60 overflow-y-auto">
                    <SelectItem value="Nearest Available Centre">Nearest Available Centre</SelectItem>
                    {centresList.map((c) => (
                      <SelectItem key={c._id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Program of Interest</Label>
                <Select
                  value={formData.program || (availableProgramsForModal[0] || "General Consultation")}
                  onValueChange={(val) => setFormData({ ...formData, program: val })}
                >
                  <SelectTrigger className="h-10 text-xs sm:text-sm rounded-lg">
                    <SelectValue placeholder="Select Program of Interest" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999] max-h-60 overflow-y-auto">
                    {availableProgramsForModal.map((prog: string) => (
                      <SelectItem key={prog} value={prog}>
                        {prog}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Queries or Career Goals (Optional)</Label>
              <Textarea
                rows={3}
                placeholder="Tell us about your educational background, current Japanese level (if any), or preferred jobs in Japan..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="text-xs sm:text-sm rounded-lg"
              />
            </div>

            <div className="pt-2 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEnquiryModalOpen(false)}
                className="w-full sm:w-auto h-10 px-5 rounded-full text-xs font-medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="w-full sm:w-auto h-10 px-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-xs"
              >
                {isSubmitting ? "Submitting..." : "Submit Enquiry"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================
          MODAL: OPEN A JESDC CENTRE (PARTNERSHIP APPLICATION)
          ======================================================== */}
      <Dialog open={isPartnerModalOpen} onOpenChange={setIsPartnerModalOpen}>
        <DialogContent className="w-[94vw] sm:max-w-lg p-4 sm:p-6 bg-card border border-border shadow-2xl rounded-2xl max-h-[88vh] overflow-y-auto">
          <DialogHeader className="space-y-1 text-left border-b pb-3 sm:pb-4">
            <DialogTitle className="text-lg sm:text-xl font-bold font-headline text-foreground flex items-center gap-2">
              <Building2 className="h-5 w-5 text-accent shrink-0" />
              <span>{language === 'ja' ? "JESDCセンター開設申請" : "Open a JESDC Centre (Institutional Partner)"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-normal">
              Partner with IJCC to establish an accredited Japanese skilling centre in your college or campus.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitPartner} className="space-y-3.5 sm:space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Institute / Organization Name *</Label>
              <Input
                required
                placeholder="e.g. ABC College of Engineering / Skill Academy"
                value={partnerFormData.institutionName}
                onChange={(e) => setPartnerFormData({ ...partnerFormData, institutionName: e.target.value })}
                className="h-10 text-xs sm:text-sm rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Contact Person / Principal *</Label>
                <Input
                  required
                  placeholder="e.g. Dr. A. K. Verma"
                  value={partnerFormData.contactPerson}
                  onChange={(e) => setPartnerFormData({ ...partnerFormData, contactPerson: e.target.value })}
                  className="h-10 text-xs sm:text-sm rounded-lg"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Phone / WhatsApp *</Label>
                <Input
                  required
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={partnerFormData.phone}
                  onChange={(e) => setPartnerFormData({ ...partnerFormData, phone: e.target.value })}
                  className="h-10 text-xs sm:text-sm rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Official Email</Label>
                <Input
                  type="email"
                  placeholder="principal@college.edu.in"
                  value={partnerFormData.email}
                  onChange={(e) => setPartnerFormData({ ...partnerFormData, email: e.target.value })}
                  className="h-10 text-xs sm:text-sm rounded-lg"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">City & State</Label>
                <Input
                  placeholder="e.g. Lucknow, UP"
                  value={partnerFormData.city}
                  onChange={(e) => setPartnerFormData({ ...partnerFormData, city: e.target.value })}
                  className="h-10 text-xs sm:text-sm rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Campus Infrastructure / Expected Enrolment</Label>
              <Textarea
                rows={3}
                placeholder="Briefly describe classroom capacity, student strength, or interest in Japan placements..."
                value={partnerFormData.message}
                onChange={(e) => setPartnerFormData({ ...partnerFormData, message: e.target.value })}
                className="text-xs sm:text-sm rounded-lg"
              />
            </div>

            <div className="pt-2 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsPartnerModalOpen(false)}
                className="w-full sm:w-auto h-10 px-5 rounded-full text-xs font-medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="w-full sm:w-auto h-10 px-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-xs"
              >
                {isSubmitting ? "Submitting..." : "Submit Partner Application"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
