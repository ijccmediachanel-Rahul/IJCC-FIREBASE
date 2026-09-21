export interface StatePolicy {
  id: string;
  title: string;
  state: string;
  stateId: 'haryana' | 'gujarat' | 'madhya-pradesh' | 'tripura';
  category: string;
  description: string;
  filePath: string;
  size: string;
  year: string;
  featured?: boolean;
}

export interface StateMedia {
  title: string;
  type: 'video' | 'qr';
  url: string;
  description?: string;
}

export const STATE_POLICIES: StatePolicy[] = [
  // HARYANA
  {
    id: "haryana-make-in-haryana-2026",
    title: "Make In Haryana Industrial Policy 2026",
    state: "Haryana",
    stateId: "haryana",
    category: "Industrial & Manufacturing",
    description: "The flagship industrial blueprint for Haryana focusing on high-growth manufacturing, mega-infrastructure, plug-and-play facilities, and Ease of Doing Business.",
    filePath: "/policies/haryana/1. Make In Haryana Industrial Policy 2026.pdf",
    size: "122.3 MB",
    year: "2026",
    featured: true
  },
  {
    id: "haryana-pharma-medical-devices-2026",
    title: "Haryana Pharmaceutical & Medical Devices Manufacturing Policy 2026",
    state: "Haryana",
    stateId: "haryana",
    category: "Healthcare & Pharma",
    description: "Incentives, land concessions, and capital subsidies for pharmaceutical hubs, bulk drug parks, and medical equipment manufacturing clusters.",
    filePath: "/policies/haryana/2.Haryana Pharmaceutical and Medical Devices Manufacturing Policy 2026.pdf",
    size: "20.9 MB",
    year: "2026",
    featured: true
  },
  {
    id: "haryana-it-ites-ai-2026",
    title: "Haryana IT/ITeS, AI & Emerging Technologies Policy 2026",
    state: "Haryana",
    stateId: "haryana",
    category: "IT, AI & Emerging Tech",
    description: "Strategic roadmap for artificial intelligence, software innovation, cloud computing, and tech startups in Gurugram, Panchkula, and Faridabad.",
    filePath: "/policies/haryana/3.Haryana ITITeS AI and Emerging Technologies Policy 2026.pdf",
    size: "65.6 MB",
    year: "2026",
    featured: true
  },
  {
    id: "haryana-data-centre-2026",
    title: "New Haryana Data Centre Policy 2026",
    state: "Haryana",
    stateId: "haryana",
    category: "Infrastructure & Tech",
    description: "Framework promoting hyperscale and edge data centre parks, power tariff subsidies, and dual-grid electricity connectivity.",
    filePath: "/policies/haryana/4. New Haryana Data Centre Policy 2026.pdf",
    size: "15.7 MB",
    year: "2026"
  },
  {
    id: "haryana-gcc-2026",
    title: "Haryana Global Capability Centres (GCC) Policy 2026",
    state: "Haryana",
    stateId: "haryana",
    category: "Corporate & Services",
    description: "Special incentives for Fortune 500 multinationals and global enterprises establishing Global In-house & Capability Centers in Haryana.",
    filePath: "/policies/haryana/5.Haryana Global Capability Centres (GCC) Policy 2026.pdf",
    size: "24.5 MB",
    year: "2026",
    featured: true
  },
  {
    id: "haryana-toys-sports-2026",
    title: "Haryana Toys & Sports Equipment Manufacturing Policy 2026",
    state: "Haryana",
    stateId: "haryana",
    category: "Manufacturing",
    description: "Cluster development, testing laboratories, and duty exemptions for domestic and export toy and sporting goods manufacturing.",
    filePath: "/policies/haryana/6. Haryana Toys and Sports Equipment Manufacturing Policy 2026.pdf",
    size: "47.4 MB",
    year: "2026"
  },
  {
    id: "haryana-esdm-2026",
    title: "Haryana Electronics System Design & Manufacturing (ESDM) Policy 2026",
    state: "Haryana",
    stateId: "haryana",
    category: "Electronics & Hardware",
    description: "Comprehensive package for semiconductor assembly, PCB design, mobile hardware, and consumer electronics plants.",
    filePath: "/policies/haryana/7. Haryana Electronics System Design & Manufacturing (ESDM) Policy 2026.pdf",
    size: "39.8 MB",
    year: "2026",
    featured: true
  },
  {
    id: "haryana-avgc-xr-2026",
    title: "Haryana AVGC-XR Policy 2026 (Animation, VFX, Gaming, XR)",
    state: "Haryana",
    stateId: "haryana",
    category: "Media & Digital",
    description: "Incentives for animation studios, virtual reality developers, VFX post-production houses, and esports ecosystems.",
    filePath: "/policies/haryana/8.Haryana AVGC-XR Policy 2026.pdf",
    size: "31.3 MB",
    year: "2026"
  },
  {
    id: "haryana-e-waste-recycling-2026",
    title: "Haryana Electronics Waste Recycling Policy 2026",
    state: "Haryana",
    stateId: "haryana",
    category: "Sustainability & CleanTech",
    description: "Circular economy guidelines, urban mining subsidies, and recycling unit standards for sustainable e-waste processing.",
    filePath: "/policies/haryana/9. Haryana Electronics Waste Recycling Policy 2026.pdf",
    size: "94.8 MB",
    year: "2026"
  },
  {
    id: "haryana-agri-food-2026",
    title: "Haryana Agri-Business & Food Processing Policy 2026",
    state: "Haryana",
    stateId: "haryana",
    category: "Agri-Business & Food",
    description: "Cold chain infrastructure, agro-processing clusters, post-harvest logistics, and export incentives for food processing units.",
    filePath: "/policies/haryana/10. Haryana Agri-Business & Food Processing Policy 2026.pdf",
    size: "47.2 MB",
    year: "2026"
  },
  {
    id: "haryana-compendium-2026",
    title: "Haryana Policy Compendium (All Policies Master Guide)",
    state: "Haryana",
    stateId: "haryana",
    category: "Compendium",
    description: "Consolidated master compendium of all official state industrial, tech, infrastructure, and fiscal schemes in one document.",
    filePath: "/policies/haryana/11. Haryana Policy Compendium.pdf",
    size: "32.5 MB",
    year: "2026",
    featured: true
  },
  {
    id: "haryana-edge",
    title: "The Haryana Edge: Investment Overview & Competitive Advantage",
    state: "Haryana",
    stateId: "haryana",
    category: "Investment Guide",
    description: "Factsheet on Haryana strategic location surrounding New Delhi (NCR), connectivity corridors (KMP, DMIC), and industrial clusters.",
    filePath: "/policies/haryana/13.Haryana Edge.pdf",
    size: "11.5 MB",
    year: "2026"
  },
  {
    id: "hsiidc-brochure",
    title: "HSIIDC Industrial Infrastructure & Parks Brochure",
    state: "Haryana",
    stateId: "haryana",
    category: "Industrial Land & Plots",
    description: "Official catalogue of industrial model townships (IMT Manesar, IMT Sohna, IMT Kharkhoda), plug-and-play facilities, and land allotment.",
    filePath: "/policies/haryana/HSIIDC NEW BROCHURE- Final.pdf",
    size: "21.0 MB",
    year: "2026"
  },
  {
    id: "haryana-launch-agenda",
    title: "Haryana Policy Launch Agenda & Framework Highlights",
    state: "Haryana",
    stateId: "haryana",
    category: "Executive Summary",
    description: "Keynotes, administrative milestones, and implementation timelines for Haryana 2026 policies.",
    filePath: "/policies/haryana/Haryana Policy Launch Agenda - Final - 29.05.2026.pdf",
    size: "0.4 MB",
    year: "2026"
  },

  // GUJARAT
  {
    id: "gujarat-viksit-industrial-policy-2026",
    title: "Viksit Gujarat Industrial Policy 2026",
    state: "Gujarat",
    stateId: "gujarat",
    category: "Industrial & Manufacturing",
    description: "Comprehensive policy framework for Viksit Gujarat, covering capital investment subsidies, export assistance, ESG standards, and GIFT City integration.",
    filePath: "/policies/gujarat/Viksit Gujarat Industrial Policy 2026.pdf",
    size: "59.1 MB",
    year: "2026",
    featured: true
  },
  {
    id: "gujarat-industrial-leaflet",
    title: "Gujarat Industrial Advantage & Key Incentives Leaflet",
    state: "Gujarat",
    stateId: "gujarat",
    category: "Investment Guide",
    description: "Quick reference leaflet on port-led industrialization, DMIC presence, power surplus status, and fiscal incentives for foreign investors.",
    filePath: "/policies/gujarat/02 Gujarat Industiral Leaflet_R02.pdf",
    size: "5.3 MB",
    year: "2026"
  },

  // MADHYA PRADESH
  {
    id: "mp-semiconductor-policy-2025",
    title: "Madhya Pradesh Semiconductor Policy 2025",
    state: "Madhya Pradesh",
    stateId: "madhya-pradesh",
    category: "Semiconductor & Electronics",
    description: "State policy for silicon fabs, compound semiconductors, ATMP, OSAT facilities, and fabless chip design units, including top-up incentives over India Semiconductor Mission (ISM).",
    filePath: "/policies/madhya-pradesh/Semiconductor-Policy-2025_compressed.pdf",
    size: "20.0 MB",
    year: "2025-2026",
    featured: true
  },
  {
    id: "mp-ipp-scheme-2025",
    title: "Madhya Pradesh Industrial Promotion Policy (IPP) Scheme 2025",
    state: "Madhya Pradesh",
    stateId: "madhya-pradesh",
    category: "Incentives & Schemes",
    description: "Official notification detailing financial assistance, land rebate schemes, power tariffs, and employment assistance for large & mega projects in MP.",
    filePath: "/policies/madhya-pradesh/Notification-with-IPP-Scheme-2025.pdf",
    size: "1.3 MB",
    year: "2025-2026",
    featured: true
  },

  // TRIPURA
  {
    id: "tripura-compendium-of-policies",
    title: "Tripura Compendium of Industrial & Sectoral Policies",
    state: "Tripura",
    stateId: "tripura",
    category: "Compendium",
    description: "Comprehensive compendium containing all state industrial, environmental, sectoral, and land allocation policies for Northeast India.",
    filePath: "/policies/tripura/Tripura - Compendium of Policies.pdf",
    size: "42.0 MB",
    year: "2024-2026",
    featured: true
  },
  {
    id: "tripura-industrial-investment-policy-2024",
    title: "Tripura Industrial Investment Policy 2024 (TIIP 2024)",
    state: "Tripura",
    stateId: "tripura",
    category: "Industrial & Manufacturing",
    description: "Latest notification and policy on capital investment subsidies, interest subvention, and GST reimbursement for industries setting up in Tripura.",
    filePath: "/policies/tripura/TIIP2024/Tripura Industrial Investment Policy 2024.pdf.pdf",
    size: "8.7 MB",
    year: "2024-2026",
    featured: true
  },
  {
    id: "tripura-incentive-scheme-tiipis-2022",
    title: "Tripura Incentive Scheme - TIIPIS 2022 Book",
    state: "Tripura",
    stateId: "tripura",
    category: "Incentives & Subsidies",
    description: "Operational guidelines and subsidy structure for enterprises under the Tripura Industrial Investment Promotion Incentive Scheme (TIIPIS).",
    filePath: "/policies/tripura/TIIPIS 2022/Tripura Incentive Scheme - TIIPIS_2022.pdf",
    size: "24.2 MB",
    year: "2022-2026"
  },
  {
    id: "tripura-ev-policy-2022",
    title: "Tripura Electric Vehicle (EV) Policy 2022",
    state: "Tripura",
    stateId: "tripura",
    category: "Clean Mobility & EV",
    description: "Roadmap for EV adoption, charging infrastructure mandates, battery swapping hubs, and fleet conversion incentives in Tripura.",
    filePath: "/policies/tripura/Tripura EV policy 2022/Tripura - EV Policy Gazette notification_compressed_compressed_compressed.pdf",
    size: "1.5 MB",
    year: "2022-2026"
  },
  {
    id: "tripura-it-ites-policy-2022",
    title: "Tripura IT & ITeS Policy 2022",
    state: "Tripura",
    stateId: "tripura",
    category: "IT, AI & Emerging Tech",
    description: "Incentives for IT parks, software exports, BPOs, and digital skill training centers leveraging high-speed internet gateway via Bangladesh.",
    filePath: "/policies/tripura/Tripura IT-ITes policy 2022/Tripura - IT_ITES_Policy_2022 (1).pdf",
    size: "0.6 MB",
    year: "2022-2026"
  },
  {
    id: "tripura-startup-policy-2024",
    title: "Tripura Startup Policy 2024",
    state: "Tripura",
    stateId: "tripura",
    category: "Startups & Innovation",
    description: "Seed funding, incubation grants, patent assistance, and acceleration support for innovative ventures in Northeast India.",
    filePath: "/policies/tripura/Tripura Startup Policy 2024/Tripura - Start-Up Policy-2024.pdf",
    size: "0.2 MB",
    year: "2024-2026"
  },
  {
    id: "tripura-data-center-policy-2021",
    title: "Tripura Data Center Policy 2021",
    state: "Tripura",
    stateId: "tripura",
    category: "Infrastructure & Tech",
    description: "Special provisions for data storage hubs, green energy concessions, and optical fiber connectivity to Southeast Asia.",
    filePath: "/policies/tripura/Tripura data Center policy 2021/Tripura_Data_Centre_Policy_2021_0_compressed.pdf",
    size: "0.4 MB",
    year: "2021-2026"
  },
  {
    id: "tripura-integrated-logistics-policy-2022",
    title: "Tripura Integrated Logistics Policy 2022",
    state: "Tripura",
    stateId: "tripura",
    category: "Logistics & Warehousing",
    description: "Development of Multi-Modal Logistics Parks (MMLPs), inland container depots, and transit routes connecting Chittagong Port.",
    filePath: "/policies/tripura/Tripura Integrated Logistic policy 2022/Tripura_Integrated_Logistics_Policy_2022 (1).pdf",
    size: "5.8 MB",
    year: "2022-2026"
  },
  {
    id: "tripura-industrial-land-allotment-2024",
    title: "Tripura Industrial Land Allotment Policy 2024",
    state: "Tripura",
    stateId: "tripura",
    category: "Industrial Land & Plots",
    description: "Official guideline by TIDC for transparent land lease, plug-and-play shed allocation, and industrial zone zoning.",
    filePath: "/policies/tripura/Tripura Industria Land allotment Guideline 2024/TIDCL- Industrial Land allotment Policy-2024_compressed.pdf",
    size: "0.4 MB",
    year: "2024-2026"
  },
  {
    id: "tripura-tourism-policy-2025",
    title: "Tripura Tourism Policy & Homestays Framework",
    state: "Tripura",
    stateId: "tripura",
    category: "Tourism & Hospitality",
    description: "Eco-tourism, spiritual circuits, heritage hotel development subsidies, and homestay financial assistance guidelines.",
    filePath: "/policies/tripura/Tripura Tourism Policy 2020-2025/Tripura Tourism Policy.pdf",
    size: "0.6 MB",
    year: "2020-2025"
  },
  {
    id: "tripura-women-entrepreneurship-policy",
    title: "Tripura Women Entrepreneurship Policy",
    state: "Tripura",
    stateId: "tripura",
    category: "MSME & Inclusion",
    description: "Enhanced capital subsidies, micro-credit access, and dedicated reservation of industrial plots for women-led enterprises.",
    filePath: "/policies/tripura/Tripura Women Entrepreneurship Policy/Women entrepreneurship policy Tripura .pdf",
    size: "20.8 MB",
    year: "2023-2026"
  },
  {
    id: "tripura-agarwood-policy-2021",
    title: "Tripura Agarwood Policy",
    state: "Tripura",
    stateId: "tripura",
    category: "Agri-Business & Forestry",
    description: "Commercial cultivation, distillation processing, export guidelines, and market linkage for Tripura world-renowned agarwood sector.",
    filePath: "/policies/tripura/Tripura agarwood policy 2021/Tripura Agarwood Policy Final (1).pdf",
    size: "20.3 MB",
    year: "2021-2026"
  },
  {
    id: "tripura-cgd-policy-2022",
    title: "Tripura City Gas Distribution (CGD) Policy 2022",
    state: "Tripura",
    stateId: "tripura",
    category: "Energy & Infrastructure",
    description: "Piped Natural Gas (PNG) and Compressed Natural Gas (CNG) network expansion and right-of-way permissions across the state.",
    filePath: "/policies/tripura/Tripura City gas distribution policy 2022/Tripura - CGD Policy_compressed_compressed_compressed.pdf",
    size: "0.9 MB",
    year: "2022-2026"
  },
  {
    id: "tripura-unnati-scheme",
    title: "UNNATI 2024 Scheme - North East Industrial Development",
    state: "Tripura",
    stateId: "tripura",
    category: "Government Schemes",
    description: "Uttar Poorva Transformative Industrialization Scheme (UNNATI) providing extensive central & state incentives for industrial units.",
    filePath: "/policies/tripura/Tripura Policies & Schemes/UNNATI Scheme.pdf",
    size: "11.0 MB",
    year: "2024-2026"
  },
  {
    id: "tripura-mineral-policy-2025",
    title: "Tripura State Minor Mineral Policy 2025",
    state: "Tripura",
    stateId: "tripura",
    category: "Mining & Resources",
    description: "Regulatory procedures, lease concessions, and environmental compliance for minor minerals in Tripura.",
    filePath: "/policies/tripura/Tripura State Minor Mineral Policy 2025/Tripura State Minor Mineral Policy,2025.pdf",
    size: "31.7 MB",
    year: "2025-2026"
  }
];

export const TRIPURA_MEDIA: StateMedia[] = [
  {
    title: "Tripura Film - Investment Promotion Video",
    type: "video",
    url: "/policies/tripura/Tripura Film - Investment Promotion Video 1.mp4",
    description: "Official promotional film showcasing Tripura's infrastructure, peaceful business environment, and export potential."
  }
];

export const TRIPURA_QR_CODES = [
  {
    title: "Tripura Industrial Land Allotment 2024",
    url: "/policies/tripura/Policy QR Codes/TIDCL Industrial Land Allotment Policy 2024.png"
  },
  {
    title: "Tripura Agarwood Policy",
    url: "/policies/tripura/Policy QR Codes/Tripura Agarwood Policy.png"
  },
  {
    title: "Tripura EV Policy",
    url: "/policies/tripura/Policy QR Codes/Tripura EV Policy.png"
  },
  {
    title: "Tripura Tourism Policy",
    url: "/policies/tripura/Policy QR Codes/Tripura Tourism Policy.png"
  },
  {
    title: "Tripura Vehicle Scrapping Policy",
    url: "/policies/tripura/Policy QR Codes/Tripura Vehicle Scrapping Policy.png"
  }
];

export const STATE_METADATA = [
  {
    id: "haryana",
    name: "Haryana",
    tagline: "Automotive, ESDM, IT & GCC Powerhouse of North India",
    capital: "Chandigarh / Gurugram",
    highlight: "Surrounding New Delhi on 3 sides; host to 400+ Fortune 500 companies; major hubs in Gurugram, Faridabad, IMT Manesar, and Kharkhoda.",
    badge: "15 Policies & Guides",
    count: 14
  },
  {
    id: "gujarat",
    name: "Gujarat",
    tagline: "India Leading Industrial & Maritime Investment Destination",
    capital: "Gandhinagar / Ahmedabad",
    highlight: "1600 km coastline, GIFT City international financial center, robust petrochemical, automotive, and clean energy clusters.",
    badge: "Viksit Gujarat 2026",
    count: 2
  },
  {
    id: "madhya-pradesh",
    name: "Madhya Pradesh",
    tagline: "Heart of India - Emerging Semiconductor & Green Hub",
    capital: "Bhopal / Indore",
    highlight: "Central logistics connectivity, state-of-the-art Semiconductor Policy 2025, abundant green power and industrial land banks.",
    badge: "Semiconductor Hub",
    count: 2
  },
  {
    id: "tripura",
    name: "Tripura",
    tagline: "Gateway to Northeast India & Southeast Asian Corridors",
    capital: "Agartala",
    highlight: "Strategic proximity to Chittagong port, UNNATI scheme incentives, clean natural gas, rubber, agarwood, and logistics advantages.",
    badge: "Gateway to SE Asia",
    count: 15
  }
];
