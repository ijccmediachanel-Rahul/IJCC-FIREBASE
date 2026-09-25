
"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Handshake,
  GraduationCap,
  Globe,
  Zap,
  Scale,
  Building2,
  Target,
  Users,
  Briefcase,
  Lightbulb,
  Building,
  Landmark,
  Users2,
  University,
  CheckCircle2,
  Calendar,
  Layers,
  Database,
  SearchCode,
  ArrowRight,
  Sparkles,
  Sprout,
  Cpu,
  Trophy,
  Instagram,
  Linkedin,
  Facebook
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useAutoTranslate } from "@/hooks/use-auto-translate";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { MEMBERS_QUERY, ABOUT_PAGE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";

const verticals = [
  { id: "01", icon: <Handshake className="h-6 w-6" />, titleKey: "vertical_01_title", descKey: "vertical_01_desc", points: ["vertical_01_p1", "vertical_01_p2", "vertical_01_p3", "vertical_01_p4", "vertical_01_p5", "vertical_01_p6"] },
  { id: "02", icon: <University className="h-6 w-6" />, titleKey: "vertical_02_title", descKey: "vertical_02_desc", points: ["vertical_02_p1", "vertical_02_p2", "vertical_02_p3", "vertical_02_p4", "vertical_02_p5"] },
  { id: "03", icon: <Users2 className="h-6 w-6" />, titleKey: "vertical_03_title", descKey: "vertical_03_desc", points: ["vertical_03_p1", "vertical_03_p2", "vertical_03_p3", "vertical_03_p4", "vertical_03_p5"] },
  { id: "04", icon: <Lightbulb className="h-6 w-6" />, titleKey: "vertical_04_title", descKey: "vertical_04_desc", points: ["vertical_04_p1", "vertical_04_p2", "vertical_04_p3", "vertical_04_p4", "vertical_04_p5"] },
  { id: "05", icon: <Zap className="h-6 w-6" />, titleKey: "vertical_05_title", descKey: "vertical_05_desc", points: ["vertical_05_p1", "vertical_05_p2", "vertical_05_p3", "vertical_05_p4"] },
  { id: "06", icon: <Scale className="h-6 w-6" />, titleKey: "vertical_06_title", descKey: "vertical_06_desc", points: ["vertical_06_p1", "vertical_06_p2", "vertical_06_p3", "vertical_06_p4"] },
  { id: "07", icon: <Building2 className="h-6 w-6" />, titleKey: "vertical_07_title", descKey: "vertical_07_desc", points: ["vertical_07_p1", "vertical_07_p2", "vertical_07_p3", "vertical_07_p4", "vertical_07_p5"] },
  { id: "08", icon: <Sprout className="h-6 w-6" />, titleKey: "vertical_08_title", descKey: "vertical_08_desc", points: ["vertical_08_p1", "vertical_08_p2", "vertical_08_p3", "vertical_08_p4", "vertical_08_p5"] },
  { id: "09", icon: <Target className="h-6 w-6" />, titleKey: "vertical_09_title", descKey: "vertical_09_desc", points: ["vertical_09_p1", "vertical_09_p2", "vertical_09_p3", "vertical_09_p4", "vertical_09_p5"] },
  { id: "10", icon: <Database className="h-6 w-6" />, titleKey: "vertical_10_title", descKey: "vertical_10_desc", points: ["vertical_10_p1", "vertical_10_p2", "vertical_10_p3", "vertical_10_p4", "vertical_10_p5"] },
  { id: "11", icon: <Cpu className="h-6 w-6" />, titleKey: "vertical_11_title", descKey: "vertical_11_desc", points: ["vertical_11_p1", "vertical_11_p2", "vertical_11_p3", "vertical_11_p4", "vertical_11_p5"] },
  { id: "12", icon: <SearchCode className="h-6 w-6" />, titleKey: "vertical_12_title", descKey: "vertical_12_desc", points: ["vertical_12_p1", "vertical_12_p2", "vertical_12_p3", "vertical_12_p4", "vertical_12_p5"] }
];

export default function AboutPage() {
  const { t, language } = useTranslation();
  const { tr, translateBatch } = useAutoTranslate();
  const [cmsMembers, setCmsMembers] = useState<any[]>([]);
  const [cmsAbout, setCmsAbout] = useState<any>(null);
  const [siteSettings, setSiteSettings] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersData, aboutData, settingsData] = await Promise.all([
          client.fetch(MEMBERS_QUERY),
          client.fetch(ABOUT_PAGE_QUERY),
          client.fetch(SITE_SETTINGS_QUERY)
        ]);
        setCmsMembers(membersData);
        setCmsAbout(aboutData);
        if (settingsData) setSiteSettings(settingsData);
      } catch (error) {
        console.error("Failed to fetch from Sanity", error);
      }
    };
    fetchData();
  }, []);

  // Dynamically auto-translate any newly added CMS member names, roles, and bios
  useEffect(() => {
    if (language !== 'ja' || !cmsMembers || cmsMembers.length === 0) return;
    const textsToTranslate: string[] = [];
    cmsMembers.forEach((m) => {
      if (m.name) textsToTranslate.push(m.name);
      if (m.role) textsToTranslate.push(m.role);
      if (m.bio) textsToTranslate.push(m.bio);
    });
    if (textsToTranslate.length > 0) {
      translateBatch(textsToTranslate);
    }
  }, [cmsMembers, language, translateBatch]);

  // Team Japanese translations map
  const MEMBER_JA_MAP: Record<string, { name: string; role: string; bio?: string }> = {
    // Board Members
    "team-rahulMishra": { name: "ラフル・ミシュラ氏", role: "IJCC会長" },
    "c7170645-6f43-4eca-94bd-372085cc29ab": {
      name: "ジシュヌ・マダヴァン氏",
      role: "日本支部長",
      bio: "ジシュヌ・マダヴァン氏は、日本での20年以上の経験を持つ熟練したビジネスリーダーであり連続起業家です。"
    },
    "team-gajendraBadgujar": { name: "ガジェンドラ・バドグジャール氏", role: "副会長（戦略担当）" },
    "team-prakashYadav": { name: "プラカシュ・ヤダブ氏", role: "副会長（企業担当）" },
    "team-neelamRamaiah": { name: "ニーラム・ラマイア博士", role: "副会長（教育担当）" },
    "cbd809aa-a3b7-4cf0-8617-63f2d99ff04d": {
      name: "クリシャン・クマール・カタリア博士",
      role: "副会長（スキル開発・技術教育担当）",
      bio: "クリシャン・クマール・カタリア博士は、公共部門において35年以上の実績を持つ先見的なリーダーです。"
    },
    "team-sushilKumarChauhan": {
      name: "スシル・クマール・チャウハン氏",
      role: "副会長（製造エクセレンス・TQM・日印産業連携担当）",
      bio: "スシル・チャウハン氏は、グローバルな自動車製造において32年以上の豊富な経験を持つ戦略コンサルタントであり、ホンダ・カーズ・インディアで29年間の輝かしいキャリアを有します。TQM、TPM、リーン手法といった日本の経営哲学をシームレスに統合し、インドの製造現場を世界水準へと引き上げてきた実績を誇ります。"
    },
    "team-krishnanNarayanan": {
      name: "クリシュナン・ナラヤナン博士",
      role: "常務理事（人的資本・労働力戦略担当）",
      bio: "クリシュナン博士は、金融サービス技術分野で25年以上の経験を持つテクノロジーおよび教育起業家であり、シティバンク東京（副社長）、UBSインベストメント・バンク・ジャパン（ディレクター）などの要職を歴任しました。現在、Nihon EdutechのCEOを務めています。"
    },
    "30fd728e-5d09-43aa-8190-b25ae46d982a": {
      name: "C・V・カメシュ氏",
      role: "副会長（文化事業・交流担当）",
      bio: "Ganesa Natyalaya CEOであるC・V・カメシュ氏は、30年以上にわたる業界を超えたリーダーシップを持ち、インドと日本の文化交流および芸術振興に尽力しています。"
    },
    "team-parijatTiwari": {
      name: "パリジャット・ティワリ氏",
      role: "シニアコンサルタント（日印二国間貿易・経済関係担当）",
      bio: "パリジャット氏は、日本語通訳、企業事業開発、ITシステム分析において29年近くの経験を持つトライリンガルの専門家です。英語、ヒンディー語、日本語に堪能で、日立インディアでの11年間の勤務を経て、数多くの日本企業とインド市場を結ぶ架け橋となっています。"
    },
    "team-nidhi": { name: "ニディ・プリ氏", role: "法人税・移転価格リード" },
    "team-mukeshRanjan": { name: "ムケシュ・ランジャン氏", role: "人事・戦略ディレクター" },
    "team-yokoTorii": { name: "鳥居 陽子氏", role: "国際プログラム・コーディネーター" },
    "team-dhruvHans": { name: "ドゥルヴ氏", role: "プログラム・コーディネーター" },
    "team-muazAhmed": { name: "ムアズ・アフメド氏", role: "地域コーディネーター" },
    "team-surajitKalita": { name: "スラジット・カリタ氏", role: "共同創設者 兼 副会長" },

    // Advisory Board Members
    "team-tomoyuki": { name: "岩間 智行氏", role: "ヤクルト・インド 取締役" },
    "team-naveen": { name: "ナヴィーン・ヴェルマ氏", role: "RERAビハール州会長 (元IAS)" },
    "team-randeep": { name: "ランディープ・ラクワル博士", role: "筑波大学 教授" },
    "team-kenichiro": { name: "岩堀 健一郎氏", role: "顧問、笹川平和財団" },
    "team-supratic": { name: "スプラティック・グプタ博士", role: "IITデリー 教授" },
    "team-markus": { name: "マーカス氏", role: "アサヒ・トラベル・ジャパン 代表取締役" },
    "team-anil": { name: "アニル・K・カンデルワル氏", role: "元東中央鉄道 総支配人" },
    "team-lctrivedi": {
      name: "L・C・トリヴェディ氏",
      role: "元インド鉄道総支配人（アペックス・グレード）",
      bio: "ラリット・チャンドラ・トリヴェディ氏は、インド鉄道で約40年にわたるリーダーシップを発揮した最高幹部の一人であり、東中央鉄道の総支配人（最高職位アペックス・グレード）を務めました。"
    },
    "team-jatinder": { name: "ジャティンダー・カンナ博士", role: "教育・文化政策立案者" },
    "team-maushumi": { name: "モウシュミ・バルア博士", role: "元アッサム州技術教育局長" },
    "team-rajesh": { name: "ラジェシュ・メータ氏", role: "サンデー・ガーディアン 編集者" },
    "team-vinod": { name: "ヴィノド・K・ヤダヴェンドゥ博士", role: "元ビハール州議会議員" },
    "team-pdsharma": { name: "P・D・シャルマ氏", role: "インド最高裁判所 上級弁護士" },
    "team-anjali": { name: "アンジャリ・シャルマ氏", role: "インド最高裁判所 弁護士" },
    "team-raj": { name: "ラジ氏", role: "諮問委員" },
  };

  const MEMBER_NAME_MATCHERS: Array<{
    match: (name: string) => boolean;
    data: { name: string; role: string; bio?: string };
  }> = [
    { match: (n) => /rahul/i.test(n) && /mishra/i.test(n), data: { name: "ラフル・ミシュラ氏", role: "IJCC会長" } },
    { match: (n) => /jishnu/i.test(n) || /madhavan/i.test(n), data: { name: "ジシュヌ・マダヴァン氏", role: "日本支部長", bio: "ジシュヌ・マダヴァン氏は、日本での20年以上の経験を持つ熟練したビジネスリーダーであり連続起業家です。" } },
    { match: (n) => /gajendra/i.test(n) || /badgujar/i.test(n), data: { name: "ガジェンドラ・バドグジャール氏", role: "副会長（戦略担当）" } },
    { match: (n) => /prakash/i.test(n) && /yadav/i.test(n), data: { name: "プラカシュ・ヤダブ氏", role: "副会長（企業担当）" } },
    { match: (n) => /neelam/i.test(n) || /ramaiah/i.test(n), data: { name: "ニーラム・ラマイア博士", role: "副会長（教育担当）" } },
    { match: (n) => /kataria/i.test(n), data: { name: "クリシャン・クマール・カタリア博士", role: "副会長（スキル開発・技術教育担当）", bio: "クリシャン・クマール・カタリア博士は、公共部門において35年以上の実績を持つ先見的なリーダーです。" } },
    { match: (n) => /sushil/i.test(n) || /chauhan/i.test(n), data: { name: "スシル・クマール・チャウハン氏", role: "副会長（製造エクセレンス・TQM・日印産業連携担当）", bio: "スシル・チャウハン氏は、グローバルな自動車製造において32年以上の豊富な経験を持つ戦略コンサルタントであり、ホンダ・カーズ・インディアで29年間の輝かしいキャリアを有します。" } },
    { match: (n) => /krishnan/i.test(n) || /narayanan/i.test(n), data: { name: "クリシュナン・ナラヤナン博士", role: "常務理事（人的資本・労働力戦略担当）", bio: "クリシュナン博士は、金融サービス技術分野で25年以上の経験を持つテクノロジーおよび教育起業家であり、シティバンク東京（副社長）、UBSインベストメント・バンク・ジャパン（ディレクター）などの要職を歴任しました。" } },
    { match: (n) => /kamesh/i.test(n), data: { name: "C・V・カメシュ氏", role: "副会長（文化事業・交流担当）", bio: "Ganesa Natyalaya CEOであるC・V・カメシュ氏は、30年以上にわたる業界を超えたリーダーシップを持ち、インドと日本の文化交流および芸術振興に尽力しています。" } },
    { match: (n) => /parijat/i.test(n) || /tiwari/i.test(n), data: { name: "パリジャット・ティワリ氏", role: "シニアコンサルタント（日印二国間貿易・経済関係担当）", bio: "パリジャット氏は、日本語通訳、企業事業開発、ITシステム分析において29年近くの経験を持つトライリンガルの専門家です。" } },
    { match: (n) => /nidhi/i.test(n) || /puri/i.test(n), data: { name: "ニディ・プリ氏", role: "法人税・移転価格リード" } },
    { match: (n) => /mukesh/i.test(n) || /ranjan/i.test(n), data: { name: "ムケシュ・ランジャン氏", role: "人事・戦略ディレクター" } },
    { match: (n) => /yoko/i.test(n) || /torii/i.test(n), data: { name: "鳥居 陽子氏", role: "国際プログラム・コーディネーター" } },
    { match: (n) => /dhruv/i.test(n) || /hans/i.test(n), data: { name: "ドゥルヴ氏", role: "プログラム・コーディネーター" } },
    { match: (n) => /muaz/i.test(n) || /ahmed/i.test(n), data: { name: "ムアズ・アフメド氏", role: "地域コーディネーター" } },
    { match: (n) => /surajit/i.test(n) || /kalita/i.test(n), data: { name: "スラジット・カリタ氏", role: "共同創設者 兼 副会長" } },
    // Advisory
    { match: (n) => /tomoyuki/i.test(n) || /iwama/i.test(n), data: { name: "岩間 智行氏", role: "ヤクルト・インド 取締役" } },
    { match: (n) => /naveen/i.test(n) || /verma/i.test(n), data: { name: "ナヴィーン・ヴェルマ氏", role: "RERAビハール州会長 (元IAS)" } },
    { match: (n) => /randeep/i.test(n) || /rakwal/i.test(n), data: { name: "ランディープ・ラクワル博士", role: "筑波大学 教授" } },
    { match: (n) => /kenichiro/i.test(n) || /iwahori/i.test(n), data: { name: "岩堀 健一郎氏", role: "顧問、笹川平和財団" } },
    { match: (n) => /supratic/i.test(n) || /gupta/i.test(n), data: { name: "スプラティック・グプタ博士", role: "IITデリー 教授" } },
    { match: (n) => /markus/i.test(n), data: { name: "マーカス氏", role: "アサヒ・トラベル・ジャパン 代表取締役" } },
    { match: (n) => /khandelwal/i.test(n), data: { name: "アニル・K・カンデルワル氏", role: "元東中央鉄道 総支配人" } },
    { match: (n) => /trivedi/i.test(n), data: { name: "L・C・トリヴェディ氏", role: "元インド鉄道総支配人（アペックス・グレード）", bio: "ラリット・チャンドラ・トリヴェディ氏は、インド鉄道で約40年にわたるリーダーシップを発揮した最高幹部の一人であり、東中央鉄道の総支配人を務めました。" } },
    { match: (n) => /jatinder/i.test(n) || /khanna/i.test(n), data: { name: "ジャティンダー・カンナ博士", role: "教育・文化政策立案者" } },
    { match: (n) => /maushumi/i.test(n) || /barooah/i.test(n), data: { name: "モウシュミ・バルア博士", role: "元アッサム州技術教育局長" } },
    { match: (n) => /rajesh/i.test(n) || /mehta/i.test(n), data: { name: "ラジェシュ・メータ氏", role: "サンデー・ガーディアン 編集者" } },
    { match: (n) => /yadavendu/i.test(n) || /vinod/i.test(n), data: { name: "ヴィノド・K・ヤダヴェンドゥ博士", role: "元ビハール州議会議員" } },
    { match: (n) => /pdsharma/i.test(n) || /p\.\s*d\.\s*sharma/i.test(n) || (/sharma/i.test(n) && /p/i.test(n)), data: { name: "P・D・シャルマ氏", role: "インド最高裁判所 上級弁護士" } },
    { match: (n) => /anjali/i.test(n), data: { name: "アンジャリ・シャルマ氏", role: "インド最高裁判所 弁護士" } },
    { match: (n) => /^raj\b/i.test(n.trim()), data: { name: "ラジ氏", role: "諮問委員" } },
    {
      match: (n) => /palash/i.test(n) || /sen/i.test(n),
      data: {
        name: "パラッシュ・セン氏",
        role: "プリンシパルコンサルタント – 企業関係および事業開発",
        bio: "パラッシュ・セン氏は、企業関係、事業開発、業界提携において33年以上の豊富な経験を有しています。"
      }
    },
  ];

  const pickLang = (m: any, base: 'name' | 'role' | 'bio') => {
    if (language === 'ja') {
      if (m[`${base}_ja`]) return m[`${base}_ja`];

      // 1. Check MEMBER_JA_MAP by _id
      if (m._id && MEMBER_JA_MAP[m._id]) {
        const item = MEMBER_JA_MAP[m._id];
        const val = base === 'bio' ? item.bio : item[base];
        if (val) return val;
      }

      // 2. Check MEMBER_NAME_MATCHERS by m.name or m._id
      const rawName = m.name || m._id || '';
      const matched = MEMBER_NAME_MATCHERS.find((matcher) => matcher.match(rawName));
      if (matched) {
        const val = base === 'bio' ? matched.data.bio : matched.data[base];
        if (val) return val;
      }

      // 3. Dynamic auto-translation hook cache
      if (m[base]) {
        const translated = tr(m[base]);
        if (translated && translated !== m[base]) return translated;
      }

      // 4. Fallback to locale dictionary keys
      const normalizedName = (m.name || '').replace(/^(Mr\.|Ms\.|Dr\.)\s*/i, '').replace(/[^a-zA-Z]/g, '');
      const teamKey = `team_${normalizedName}_${base === 'role' ? 'title' : base}`;
      const teamVal = t(teamKey);
      if (teamVal && teamVal !== teamKey) return teamVal;

      const teamKeyAlt = `team_${normalizedName}_${base}`;
      const teamValAlt = t(teamKeyAlt);
      if (teamValAlt && teamValAlt !== teamKeyAlt) return teamValAlt;

      const advKey = `advisor_${normalizedName.toLowerCase()}_${base}`;
      const advVal = t(advKey);
      if (advVal && advVal !== advKey) return advVal;

      // 5. Final fallback to dynamic auto-translation
      if (m[base]) {
        return tr(m[base]);
      }
    }
    return m[base];
  };

  const leadership = cmsMembers
    .filter((m) => m.category === 'Board')
    .map((m) => ({
      id: m._id,
      imageUrl: m.imageUrl,
      name: pickLang(m, 'name'),
      title: pickLang(m, 'role'),
      bio: pickLang(m, 'bio'),
    }));

  const advisors = cmsMembers
    .filter((m) => m.category === 'Advisory')
    .map((m) => ({
      id: m._id,
      imageUrl: m.imageUrl,
      name: pickLang(m, 'name'),
      role: pickLang(m, 'role'),
      bio: pickLang(m, 'bio'),
    }));

  // ---- CMS-driven content (falls back to built-in text when CMS is empty) ----
  const verticalsList = (cmsAbout?.verticals?.length && language !== 'ja'
    ? cmsAbout.verticals.map((v: any, i: number) => ({
        id: String(i + 1).padStart(2, '0'),
        icon: (verticals[i] || verticals[0]).icon,
        title: v.title,
        description: v.description,
        points: v.points || [],
      }))
    : verticals.map((v) => ({
        id: v.id,
        icon: v.icon,
        title: t(v.titleKey),
        description: t(v.descKey),
        points: v.points.map((p) => t(p)),
      })));

  const factIcons = [
    <Calendar key="f1" className="text-primary h-5 w-5" />,
    <Layers key="f2" className="text-primary h-5 w-5" />,
    <Handshake key="f3" className="text-primary h-5 w-5" />,
    <Users key="f4" className="text-primary h-5 w-5" />,
    <Building2 key="f5" className="text-primary h-5 w-5" />,
  ];
  const defaultFacts = [
    { label: t('about_facts_est'), value: "2025" },
    { label: t('about_facts_verts'), value: "12" },
    { label: t('about_facts_mous'), value: "5" },
    { label: t('about_facts_msme_members'), value: "16,000+" },
    { label: t('about_facts_corp_members'), value: "36,000+" },
  ];
  const factsList = ((language === 'ja' || !cmsAbout?.facts?.length) ? defaultFacts : cmsAbout.facts).map((f: any, i: number) => ({
    label: f.label,
    value: f.value,
    icon: factIcons[i % factIcons.length],
  }));

  const objectiveIcons = [
    <Briefcase key="o1" className="h-6 w-6 text-primary" />,
    <GraduationCap key="o2" className="h-6 w-6 text-primary" />,
    <Users2 key="o3" className="h-6 w-6 text-primary" />,
    <Zap key="o4" className="h-6 w-6 text-primary" />,
    <Sparkles key="o5" className="h-6 w-6 text-primary" />,
    <Scale key="o6" className="h-6 w-6 text-primary" />,
    <Building2 key="o7" className="h-6 w-6 text-primary" />,
    <Sprout key="o8" className="h-6 w-6 text-primary" />,
    <Target key="o9" className="h-6 w-6 text-primary" />,
    <Database key="o10" className="h-6 w-6 text-primary" />,
    <Cpu key="o11" className="h-6 w-6 text-primary" />,
    <SearchCode key="o12" className="h-6 w-6 text-primary" />,
  ];
  const defaultObjectives = Array.from({ length: 12 }, (_, i) => {
    const n = String(i + 1).padStart(2, '0');
    return { id: n, title: t(`obj_${n}_title`), desc: t(`obj_${n}_desc`) };
  });
  const objectivesList = ((language === 'ja' || !cmsAbout?.objectives?.length) ? defaultObjectives : cmsAbout.objectives).map((o: any, i: number) => ({
    id: o.id || String(i + 1).padStart(2, '0'),
    icon: objectiveIcons[i % objectiveIcons.length],
    title: o.title,
    desc: o.description || o.desc,
  }));

  const benefitIcons = [
    <Globe key="b1" className="h-8 w-8 text-primary" />,
    <GraduationCap key="b2" className="h-8 w-8 text-primary" />,
    <Scale key="b3" className="h-8 w-8 text-primary" />,
    <Sparkles key="b4" className="h-8 w-8 text-primary" />,
  ];
  const defaultBenefits = ["01", "02", "03", "04"].map((n) => ({
    id: n,
    title: t(`ben_${n}_title`),
    points: [1, 2, 3, 4].map((p) => t(`ben_${n}_p${p}`)),
  }));
  const benefitsList = ((language === 'ja' || !cmsAbout?.benefits?.length) ? defaultBenefits : cmsAbout.benefits).map((b: any, i: number) => ({
    id: b.id || String(i + 1).padStart(2, '0'),
    icon: benefitIcons[i % benefitIcons.length],
    title: b.title,
    points: b.points || [],
  }));

  const defaultMouPartners = [
    { id: "spolto", name: language === 'ja' ? "スポルト (Spolto)" : "Spolto", desc: t('mou_spolto_desc') },
    { id: "nihon", name: language === 'ja' ? "日本エデュテック (Nihon Edutech)" : "Nihon Edutech", desc: t('mou_nihon_desc') },
    { id: "iia", name: language === 'ja' ? "インド産業協会 (IIA)" : "Indian Industries Association (IIA)", desc: t('mou_iia_desc') },
    { id: "wadhwani", name: language === 'ja' ? "ワドワニ財団 (Wadhwani Foundation)" : "Wadhwani Foundation", desc: t('mou_wadhwani_desc') },
    { id: "sem", name: language === 'ja' ? "SEM — スマート・エデュケーション・メソッド" : "SEM — Smart Education Method", desc: t('mou_sem_desc') },
    { id: "alliances", name: language === 'ja' ? "JETRO | FICCI | CII | AIMA（日印機関提携）" : "JETRO | FICCI | CII | AIMA", desc: t('mou_alliances_desc') },
  ];
  const mouList = ((language === 'ja' || !cmsAbout?.mouPartners?.length) ? defaultMouPartners : cmsAbout.mouPartners).map((p: any, i: number) => ({
    id: p.id || `mou-${i}`,
    name: p.name,
    desc: p.description || p.desc,
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="container relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <Badge className="bg-accent text-accent-foreground px-4 py-1 text-sm font-bold tracking-widest uppercase mb-4">
              {language === 'ja' ? t('about_hero_badge') : (cmsAbout?.heroBadge || t('about_hero_badge'))}
            </Badge>
            <h1 className="text-5xl font-headline tracking-tight lg:text-7xl leading-tight">
              {language === 'ja' ? t('about_hero_title') : (cmsAbout?.heroTitle || t('about_hero_title'))}
            </h1>
            <p className="text-2xl font-headline italic text-accent">
              "{language === 'ja' ? t('about_hero_tagline') : (cmsAbout?.heroTagline || t('about_hero_tagline'))}"
            </p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-primary-foreground/80 font-medium">
              {verticalsList.map((v: any, i: number) => (
                <span key={v.id}>{i > 0 ? ' • ' : ''}{v.title}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="container py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <h2 className="text-4xl font-headline text-primary border-b-4 border-accent/30 pb-2 inline-block">
              {language === 'ja' ? t('about_intro_title') : (cmsAbout?.pageTitle || t('about_intro_title'))}
            </h2>
            <div className="prose prose-lg text-muted-foreground max-w-none space-y-6">
              {cmsAbout?.introduction && language !== 'ja' ? (
                cmsAbout.introduction.split(/\n\n+/).map((para: string, i: number) => (
                  <p key={i}>{para}</p>
                ))
              ) : (
                <>
                  <p>{t('about_intro_p1')}</p>
                  <p dangerouslySetInnerHTML={{ __html: t('about_intro_p2') }} />
                </>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mt-12">
              <Card className="bg-primary/5 border-none shadow-none text-left">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2 text-primary uppercase tracking-wider">
                    <Target className="h-5 w-5" /> {language === 'ja' ? t('about_mission_title') : (cmsAbout?.missionTitle || t('about_mission_title'))}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm leading-relaxed prose-sm prose-p:my-1">
                  {cmsAbout?.mission && language !== 'ja' ? (
                    <PortableText value={cmsAbout.mission} />
                  ) : (
                    t('about_mission_desc')
                  )}
                </CardContent>
              </Card>
              <Card className="bg-accent/5 border-none shadow-none text-left">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2 text-accent uppercase tracking-wider">
                    <Globe className="h-5 w-5" /> {language === 'ja' ? t('about_vision_title') : (cmsAbout?.visionTitle || t('about_vision_title'))}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm leading-relaxed prose-sm prose-p:my-1">
                  {cmsAbout?.visionDescription && language !== 'ja' ? (
                    cmsAbout.visionDescription.split(/\n\n+/).map((para: string, i: number) => (
                      <p key={i} className="my-1">{para}</p>
                    ))
                  ) : cmsAbout?.history ? (
                    <PortableText value={cmsAbout.history} />
                  ) : (
                    t('about_vision_desc')
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="bg-muted/30 p-8 rounded-3xl space-y-8">
            <h3 className="text-2xl font-headline text-primary">{language === 'ja' ? t('about_facts_title') : (cmsAbout?.factsTitle || t('about_facts_title'))}</h3>
            <div className="grid grid-cols-2 gap-8">
              {factsList.map((stat: any, i: number) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    {stat.icon} {stat.label}
                  </div>
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                </div>
              ))}
            </div>
            <div className="pt-8 border-t border-muted-foreground/20 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{language === 'ja' ? t('about_facts_type_label') : (cmsAbout?.orgTypeLabel || t('about_facts_type_label'))}:</span>
                <span className="font-bold">{language === 'ja' ? t('about_facts_type_val') : (cmsAbout?.orgTypeValue || t('about_facts_type_val'))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{language === 'ja' ? t('about_facts_hq_label') : (cmsAbout?.hqLabel || t('about_facts_hq_label'))}:</span>
                <span className="font-bold">{language === 'ja' ? t('about_facts_hq_val') : (cmsAbout?.hqValue || t('about_facts_hq_val'))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{language === 'ja' ? t('about_facts_web_label') : (cmsAbout?.websiteLabel || t('about_facts_web_label'))}:</span>
                <span className="font-bold">{cmsAbout?.websiteValue || "www.ijcc.in"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Objectives */}
      <section className="bg-muted/30 py-24">
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-headline text-primary">{language === 'ja' ? t('about_objectives_title') : (cmsAbout?.objectivesTitle || t('about_objectives_title'))}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto italic">{language === 'ja' ? t('about_objectives_subtitle') : (cmsAbout?.objectivesSubtitle || t('about_objectives_subtitle'))}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {objectivesList.map((obj: any) => (
              <Card key={obj.id} className="group border-none shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <div className="text-primary/20 text-3xl font-bold group-hover:text-primary/40 transition-colors">{obj.id}</div>
                  <div className="bg-primary/5 p-2 rounded-lg">{obj.icon}</div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <CardTitle className="text-lg">{obj.title}</CardTitle>
                  <p className="text-sm text-muted-foreground leading-relaxed">{obj.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Organisation Verticals */}
      <section className="container py-24">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-headline text-primary uppercase tracking-tight">{language === 'ja' ? t('about_verts_title') : (cmsAbout?.verticalsTitle || t('about_verts_title'))}</h2>
            <p className="text-muted-foreground">{language === 'ja' ? t('about_verts_subtitle') : (cmsAbout?.verticalsSubtitle || t('about_verts_subtitle'))}</p>
          </div>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {verticalsList.map((v: any) => (
              <AccordionItem key={v.id} value={v.id} className="border rounded-2xl px-6 bg-white overflow-hidden shadow-sm">
                <AccordionTrigger className="hover:no-underline py-6">
                  <div className="flex items-center gap-4 text-left">
                    <div className="bg-primary text-white font-bold h-8 w-8 rounded-full flex items-center justify-center shrink-0">
                      {v.id}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-primary shrink-0">{v.icon}</div>
                      <span className="text-xl font-headline">{v.title}</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-8 pt-2 pl-12">
                  <div className="space-y-4">
                    {v.description && <p className="text-primary font-semibold">{v.description}</p>}
                    {v.points && v.points.length > 0 && (
                      <ul className="flex flex-col gap-y-3">
                        {v.points.map((point: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-muted-foreground text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="bg-primary py-24 text-primary-foreground">
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-headline uppercase tracking-tight">{language === 'ja' ? t('about_leadership_title') : (cmsAbout?.leadershipTitle || t('about_leadership_title'))}</h2>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto italic">
              {language === 'ja' ? t('about_leadership_subtitle') : (cmsAbout?.leadershipSubtitle || t('about_leadership_subtitle'))}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadership.map((member) => (
              <Dialog key={member.id}>
                <DialogTrigger asChild>
                  <Card className="bg-white/5 border-white/10 text-center space-y-4 group hover:bg-white/10 transition-all cursor-pointer transform hover:-translate-y-1">
                    <CardHeader>
                      <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white/20 bg-white/10 flex items-center justify-center">
                        {member.imageUrl ? (
                          <Image src={member.imageUrl} alt={member.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <Users2 className="h-12 w-12 text-white/50" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <h4 className="text-xl font-bold text-white">{member.name}</h4>
                      <div className="text-accent font-medium text-sm">{member.title}</div>
                      <p className="text-xs text-primary-foreground/60 line-clamp-2 pt-2">{member.bio?.substring(0, 100)}...</p>
                      <div className="pt-4 text-accent text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                        {t('view_bio')} <ArrowRight className="h-3 w-3" />
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader className="flex flex-col items-center text-center space-y-4">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/10 bg-primary/5 flex items-center justify-center">
                      {member.imageUrl ? (
                        <Image src={member.imageUrl} alt={member.name} fill className="object-cover" />
                      ) : (
                        <Users2 className="h-12 w-12 text-primary/30" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <DialogTitle className="text-3xl font-headline text-primary">{member.name}</DialogTitle>
                      <div className="text-accent font-bold uppercase tracking-tighter">{member.title}</div>
                    </div>
                  </DialogHeader>
                  <div className="mt-6 border-t pt-6 max-h-[50vh] overflow-y-auto pr-4 text-justify whitespace-pre-wrap">
                    <p className="text-muted-foreground leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </section>

      {/* Advisory Board */}
      <section className="container py-24">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-headline text-primary uppercase tracking-tight">{language === 'ja' ? t('about_advisory_title') : (cmsAbout?.advisoryTitle || t('about_advisory_title'))}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{language === 'ja' ? t('about_advisory_subtitle') : (cmsAbout?.advisorySubtitle || t('about_advisory_subtitle'))}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advisors.map((advisor) => {
            const hasBio = !!advisor.bio;
            const cardContent = (
              <Card className={`flex flex-row items-center gap-4 p-4 rounded-2xl bg-muted/30 border-none shadow-sm ${hasBio ? 'hover:bg-muted transition-colors cursor-pointer' : ''}`}>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border-2 border-accent overflow-hidden">
                  {advisor.imageUrl ? (
                    <Image src={advisor.imageUrl} alt={advisor.name} width={64} height={64} className="object-cover w-full h-full" />
                  ) : (
                    <Users2 className="h-8 w-8 text-primary/30" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg text-primary">{advisor.name}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest leading-tight">{advisor.role}</div>
                  {hasBio && (
                    <div className="mt-2 text-accent text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                      {t('view_bio')} <ArrowRight className="h-3 w-3" />
                    </div>
                  )}
                </div>
              </Card>
            );

            if (!hasBio) return <div key={advisor.id}>{cardContent}</div>;

            return (
              <Dialog key={advisor.id}>
                <DialogTrigger asChild>
                  {cardContent}
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader className="flex flex-col items-center text-center space-y-4">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/10 bg-primary/5 flex items-center justify-center">
                      {advisor.imageUrl ? (
                        <Image src={advisor.imageUrl} alt={advisor.name} fill className="object-cover" />
                      ) : (
                        <Users2 className="h-12 w-12 text-primary/30" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <DialogTitle className="text-3xl font-headline text-primary">{advisor.name}</DialogTitle>
                      <div className="text-accent font-bold uppercase tracking-tighter">{advisor.role}</div>
                    </div>
                  </DialogHeader>
                  <div className="mt-6 border-t pt-6 max-h-[50vh] overflow-y-auto pr-4 text-justify whitespace-pre-wrap">
                    <p className="text-muted-foreground leading-relaxed">
                      {advisor.bio}
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      </section>

      {/* Membership Benefits */}
      <section className="bg-muted/30 py-24">
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-headline text-primary uppercase tracking-tight">{language === 'ja' ? t('about_benefits_title') : (cmsAbout?.benefitsTitle || t('about_benefits_title'))}</h2>
            <p className="text-muted-foreground">{language === 'ja' ? t('about_benefits_subtitle') : (cmsAbout?.benefitsSubtitle || t('about_benefits_subtitle'))}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefitsList.map((benefit: any) => (
              <Card key={benefit.id} className="border-none shadow-xl hover:-translate-y-2 transition-transform">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">{benefit.icon}</div>
                  <CardTitle className="text-lg uppercase tracking-tight">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {benefit.points.map((point: string, j: number) => (
                      <li key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" /> {point}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* MoU Partners */}
      <section className="container py-24">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-headline text-primary uppercase tracking-tight">{language === 'ja' ? t('about_mou_title') : (cmsAbout?.mouTitle || t('about_mou_title'))}</h2>
          <p className="text-muted-foreground">{language === 'ja' ? t('about_mou_subtitle') : (cmsAbout?.mouSubtitle || t('about_mou_subtitle'))}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {mouList.map((partner: any) => (
            <Card key={partner.id} className="bg-primary/5 border-none text-center p-6 group hover:bg-primary transition-colors">
              <CardTitle className="text-xl font-headline mb-4 group-hover:text-white">{partner.name}</CardTitle>
              <CardDescription className="text-sm group-hover:text-white/80">{partner.desc}</CardDescription>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact & Connect Footer */}
      <section className="bg-muted py-16">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
            <div className="space-y-4">
              <h3 className="text-3xl font-headline text-primary">{language === 'ja' ? t('about_footer_title') : (cmsAbout?.connectTitle || t('about_footer_title'))}</h3>
              <p className="text-muted-foreground">{language === 'ja' ? t('about_footer_subtitle') : (cmsAbout?.connectSubtitle || t('about_footer_subtitle'))}</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-8">
              {[
                { label: language === 'ja' ? "ウェブサイト" : "Website", icon: <Globe className="h-6 w-6" />, href: "/" },
                { label: language === 'ja' ? "リンクトイン" : "LinkedIn", icon: <Linkedin className="h-6 w-6" />, href: siteSettings?.linkedinUrl || "https://www.linkedin.com/company/indo-japan-chamber-of-commerce/" },
                { label: language === 'ja' ? "インスタグラム" : "Instagram", icon: <Instagram className="h-6 w-6" />, href: siteSettings?.instagramUrl || "https://www.instagram.com/ijccindia?igsh=YW41MzJzNDY2M25y" },
                { label: language === 'ja' ? "フェイスブック" : "Facebook", icon: <Facebook className="h-6 w-6" />, href: siteSettings?.facebookUrl || "https://www.facebook.com/people/Indo-Japan-Chamber-of-Commerce/61573931145126/" },
              ].map((link, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{link.label}</div>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-full bg-white shadow-sm text-primary hover:bg-primary hover:text-white transition-all duration-300 border-2 border-primary/5 hover:scale-110"
                  >
                    {link.icon}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
