
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
  Facebook,
  MapPin
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useAutoTranslate } from "@/hooks/use-auto-translate";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { MEMBERS_QUERY, CHAPTERS_QUERY, ABOUT_PAGE_QUERY, SITE_SETTINGS_QUERY, THINK_TANK_MEMBERS_QUERY } from "@/sanity/lib/queries";
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
  const [cmsChapters, setCmsChapters] = useState<any[]>([]);
  const [cmsThinkTankMembers, setCmsThinkTankMembers] = useState<any[]>([]);
  const [cmsAbout, setCmsAbout] = useState<any>(null);
  const [siteSettings, setSiteSettings] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersData, chaptersData, aboutData, settingsData, thinkTankData] = await Promise.all([
          client.fetch(MEMBERS_QUERY),
          client.fetch(CHAPTERS_QUERY),
          client.fetch(ABOUT_PAGE_QUERY),
          client.fetch(SITE_SETTINGS_QUERY),
          client.fetch(THINK_TANK_MEMBERS_QUERY)
        ]);
        setCmsMembers(membersData || []);
        setCmsChapters(chaptersData || []);
        setCmsAbout(aboutData);
        if (settingsData) setSiteSettings(settingsData);
        setCmsThinkTankMembers(thinkTankData || []);
      } catch (error) {
        console.error("Failed to fetch from Sanity", error);
      }
    };
    fetchData();
  }, []);

  // Dynamically auto-translate any newly added CMS member names, roles, and bios
  useEffect(() => {
    if (language !== 'ja') return;
    const textsToTranslate: string[] = [];
    (cmsMembers || []).forEach((m) => {
      if (m.name) textsToTranslate.push(m.name);
      if (m.role) textsToTranslate.push(m.role);
      if (m.bio) textsToTranslate.push(m.bio);
    });
    (cmsChapters || []).forEach((c) => {
      if (c.title) textsToTranslate.push(c.title);
      if (c.subtitle) textsToTranslate.push(c.subtitle);
      if (c.members) {
        c.members.forEach((m: any) => {
          if (m?.name) textsToTranslate.push(m.name);
          if (m?.role) textsToTranslate.push(m.role);
          if (m?.bio) textsToTranslate.push(m.bio);
        });
      }
    });
    if (textsToTranslate.length > 0) {
      translateBatch(textsToTranslate);
    }
  }, [cmsMembers, cmsChapters, language, translateBatch]);

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

  // Baseline members to guarantee zero-latency initial render with exact production data
  const DEFAULT_APEX_MEMBERS = [
    { id: "team-rahulMishra", name: "Mr. Rahul Mishra", role: "Chairman, IJCC", bio: "Mr.Rahul Mishra is the Chairman of the Indo-Japan Chamber of Commerce (IJCC), Vice President of SEWA...", imageUrl: "https://cdn.sanity.io/images/4j8vl1ls/production/7bc38781a556b18333a9c0ef7bfe57e50657bb2c-888x800.jpg" },
    { id: "team-gajendraBadgujar", name: "Mr. Gajendra Badgujar", role: "Vice-Chairman (Strategy)", bio: "Mr. Gajendra Badgujar is a seasoned professional with extensive experience in international trade and strategic alliances...", imageUrl: "https://cdn.sanity.io/images/4j8vl1ls/production/998afdc62f91e384a46cdb08450164235386d2d3-500x478.jpg" },
    { id: "team-prakashYadav", name: "Mr. Prakash Yadav", role: "Vice-Chairman (Corporate)", bio: "Strategic leadership and corporate initiatives across bilateral corridors.", imageUrl: "https://cdn.sanity.io/images/4j8vl1ls/production/631f2d948b42e392cb228e277e6fe89aa362e994-502x481.jpg" },
    { id: "team-neelamRamaiah", name: "Dr. Neelam Ramaiah", role: "Vice-Chairman (Education)", bio: "Leading educational exchanges and institutional partnerships between India and Japan.", imageUrl: "https://cdn.sanity.io/images/4j8vl1ls/production/29bf3019d9902ccd76ff39d930db38c968810a11-190x247.png" },
    { id: "cbd809aa-a3b7-4cf0-8617-63f2d99ff04d", name: "Dr. Krishan Kumar Kataria", role: "Vice-Chairman – Skill Development & Technical Education", bio: "Dr. Krishan Kumar Kataria is a visionary leader with over 35 years in the public sector...", imageUrl: "https://cdn.sanity.io/images/4j8vl1ls/production/72fbda1d333940ddaf1f0a6d92e61cafad3d8747-413x531.jpg" },
    { id: "team-sushilKumarChauhan", name: "Mr. Sushil Kumar Chauhan", role: "Vice-Chairman – Manufacturing Excellence, TQM & Industry Collaboration", bio: "Former executive at Honda Cars India with 32+ years in automotive manufacturing and Japanese TQM...", imageUrl: "https://cdn.sanity.io/images/4j8vl1ls/production/5c307387d826c638cd645afb89c1638537b7fed6-181x156.png" },
    { id: "team-krishnanNarayanan", name: "Mr. Krishnan Narayanan, Ph.D.", role: "Executive Director – Human Capital & Workforce Strategy", bio: "25+ years in financial services technology, formerly at Citibank Tokyo and UBS Japan...", imageUrl: "https://cdn.sanity.io/images/4j8vl1ls/production/43929a4e71fc20d7e35bec3bdc301f802afa8f1e-289x335.jpg" },
    { id: "30fd728e-5d09-43aa-8190-b25ae46d982a", name: "Mr. C V Kamesh", role: "Vice Chairman – Cultural Affairs & Exchange", bio: "CEO at Ganesa Natyalaya with 30+ years in cultural diplomacy and promotion of performing arts...", imageUrl: "https://cdn.sanity.io/images/4j8vl1ls/production/de057b35a8ccaa21571e6a4fbface7ccb511c7bb-1200x1600.jpg" },
    { id: "ccd4282b-ea6a-4bb5-8aa7-46acf71f18e8", name: "Mr. Palash Sen", role: "Principal Consultant – Corporate Relations & Business Development", bio: "33+ years of expertise in corporate relations, market entry, and industry partnerships...", imageUrl: "https://cdn.sanity.io/images/4j8vl1ls/production/f69346e8d13c4426e995b74b3e36a32c9cd33383-760x939.jpg" },
    { id: "team-parijatTiwari", name: "Mr. Parijat Tiwari", role: "Sr. Consultant (Indo-Japan Bilateral Trade & Economic Relations)", bio: "Trilingual expert with nearly 29 years experience in Japanese business culture, interpretation, and trade...", imageUrl: "https://cdn.sanity.io/images/4j8vl1ls/production/052ab2cce2fad220fd46c38258fda4dd93ed44ce-243x235.png" },
    { id: "team-nidhi", name: "Ms. Nidhi Puri", role: "Corporate Tax & Transfer Pricing Lead", bio: "Advising cross-border ventures on international tax structures and compliance.", imageUrl: "https://cdn.sanity.io/images/4j8vl1ls/production/5e8fd12c7e2a34a280194f8a63187c7b8ae31ba5-376x376.jpg" },
    { id: "team-mukeshRanjan", name: "Mr. Mukesh Ranjan", role: "Director — HR & Strategy", bio: "Leading human resources strategy and cross-cultural organizational development.", imageUrl: "https://cdn.sanity.io/images/4j8vl1ls/production/3ec803996e3dbb9cb81b39bbc9922c06c0003f53-480x480.png" },
    { id: "team-yokoTorii", name: "Ms. Yoko Torii", role: "International Programme Coordinator", bio: "Coordinating student and professional exchange initiatives between Japan and India.", imageUrl: "https://cdn.sanity.io/images/4j8vl1ls/production/d9ae227b5af67725de5c923b37383a813613b738-481x519.jpg" },
    { id: "team-dhruvHans", name: "Mr. Dhruv (Hans Dhruv)", role: "Programme Coordinator", bio: "Youth engagement and technology-driven bilateral initiatives.", imageUrl: "https://cdn.sanity.io/images/4j8vl1ls/production/b6045875a2d0aa09d07a4e7790d0c4bc92685746-378x508.jpg" }
  ];

  const DEFAULT_JAPAN_MEMBERS = [
    { id: "c7170645-6f43-4eca-94bd-372085cc29ab", name: "Mr. Jishnu Madhavan", role: "Chairman Japan Chapter", bio: "Mr. Jishnu Madhavan is an accomplished business leader and serial entrepreneur with over 20 years of experience in Japan...", imageUrl: "https://cdn.sanity.io/images/4j8vl1ls/production/2f540c471978cd55688536fd02135caa4660f69a-382x355.png" }
  ];

  const FALLBACK_MEMBER_IMAGES: Record<string, string> = {
    "team-rahulMishra": "https://cdn.sanity.io/images/4j8vl1ls/production/7bc38781a556b18333a9c0ef7bfe57e50657bb2c-888x800.jpg",
    "team-gajendraBadgujar": "https://cdn.sanity.io/images/4j8vl1ls/production/998afdc62f91e384a46cdb08450164235386d2d3-500x478.jpg",
    "team-prakashYadav": "https://cdn.sanity.io/images/4j8vl1ls/production/631f2d948b42e392cb228e277e6fe89aa362e994-502x481.jpg",
    "team-neelamRamaiah": "https://cdn.sanity.io/images/4j8vl1ls/production/29bf3019d9902ccd76ff39d930db38c968810a11-190x247.png",
    "cbd809aa-a3b7-4cf0-8617-63f2d99ff04d": "https://cdn.sanity.io/images/4j8vl1ls/production/72fbda1d333940ddaf1f0a6d92e61cafad3d8747-413x531.jpg",
    "team-sushilKumarChauhan": "https://cdn.sanity.io/images/4j8vl1ls/production/5c307387d826c638cd645afb89c1638537b7fed6-181x156.png",
    "team-krishnanNarayanan": "https://cdn.sanity.io/images/4j8vl1ls/production/43929a4e71fc20d7e35bec3bdc301f802afa8f1e-289x335.jpg",
    "30fd728e-5d09-43aa-8190-b25ae46d982a": "https://cdn.sanity.io/images/4j8vl1ls/production/de057b35a8ccaa21571e6a4fbface7ccb511c7bb-1200x1600.jpg",
    "ccd4282b-ea6a-4bb5-8aa7-46acf71f18e8": "https://cdn.sanity.io/images/4j8vl1ls/production/f69346e8d13c4426e995b74b3e36a32c9cd33383-760x939.jpg",
    "team-parijatTiwari": "https://cdn.sanity.io/images/4j8vl1ls/production/052ab2cce2fad220fd46c38258fda4dd93ed44ce-243x235.png",
    "team-nidhi": "https://cdn.sanity.io/images/4j8vl1ls/production/5e8fd12c7e2a34a280194f8a63187c7b8ae31ba5-376x376.jpg",
    "team-mukeshRanjan": "https://cdn.sanity.io/images/4j8vl1ls/production/3ec803996e3dbb9cb81b39bbc9922c06c0003f53-480x480.png",
    "team-yokoTorii": "https://cdn.sanity.io/images/4j8vl1ls/production/d9ae227b5af67725de5c923b37383a813613b738-481x519.jpg",
    "team-dhruvHans": "https://cdn.sanity.io/images/4j8vl1ls/production/b6045875a2d0aa09d07a4e7790d0c4bc92685746-378x508.jpg",
    "team-muazAhmed": "https://cdn.sanity.io/images/4j8vl1ls/production/a4b12808c53e066b8130be183e72367d2b814735-1080x1105.jpg",
    "team-naveen": "https://cdn.sanity.io/images/4j8vl1ls/production/49a944ba742eb55bc43029193796d1ae3ff0e719-204x247.jpg",
    "team-vinod": "https://cdn.sanity.io/images/4j8vl1ls/production/b5a593e87fc4b78ae6eb19ba604d53896aa334a1-180x190.png",
    "team-maushumi": "https://cdn.sanity.io/images/4j8vl1ls/production/fc8ebc64cfb6e4e892d95e0c52bbcb7206d96ff6-200x200.jpg",
    "8c082daa-bf57-497f-b692-840381b9d539": "https://cdn.sanity.io/images/4j8vl1ls/production/0d9dbeb419b9a51870a3e0ca005facec41c1c968-536x465.png",
    "c7170645-6f43-4eca-94bd-372085cc29ab": "https://cdn.sanity.io/images/4j8vl1ls/production/2f540c471978cd55688536fd02135caa4660f69a-382x355.png",
  };

  // Helper to format member data consistently
  const formatMember = (m: any) => {
    const mId = m._id || m.id;
    return {
      id: mId,
      name: pickLang(m, 'name'),
      role: pickLang(m, 'role'),
      bio: pickLang(m, 'bio'),
      imageUrl: m.imageUrl || FALLBACK_MEMBER_IMAGES[mId] || '',
      order: m.order ?? 50,
    };
  };

  // 1. Resolve Apex Board Members (National Leadership)
  const apexLeadership = (() => {
    if (cmsMembers.length > 0) {
      return cmsMembers
        .filter((m) => {
          if (m.hidden) return false;
          const cat = (m.category || '').toLowerCase();
          return cat === 'board' || cat.includes('apex') || (cat.includes('board') && !cat.includes('advisory'));
        })
        .map(formatMember)
        .sort((a, b) => (a.order ?? 50) - (b.order ?? 50));
    }
    return DEFAULT_APEX_MEMBERS.map(formatMember);
  })();

  // 2. Resolve UP Chapter Members
  const upMembers = (() => {
    const defaultUP = {
      id: "team-muazAhmed",
      name: "Mr. Muaz Ahmed",
      role: "Uttar Pradesh State Coordinator",
      bio: "Mr. Muaz Ahmed is a results-driven professional with experience in sales and regional hospitality management, leading industrial partnerships and Japanese investment facilitation across Uttar Pradesh.",
      imageUrl: "https://cdn.sanity.io/images/4j8vl1ls/production/a4b12808c53e066b8130be183e72367d2b814735-1080x1105.jpg",
      order: 10,
    };

    if (cmsMembers.length > 0) {
      return cmsMembers
        .filter((m) => {
          if (m.hidden) return false;
          const cat = (m.category || '').toLowerCase();
          const refTitle = (m.chapterRef?.title || '').toLowerCase();
          return cat === 'up chapter team' || cat.includes('uttar pradesh') || cat === 'up' || refTitle.includes('up') || refTitle.includes('uttar pradesh');
        })
        .map(formatMember)
        .sort((a, b) => (a.order ?? 50) - (b.order ?? 50));
    }

    return [formatMember(defaultUP)];
  })();

  // 3. Resolve Bihar Chapter Members
  const biharMembers = (() => {
    const defaultBihar = [
      {
        id: "team-naveen",
        name: "Mr. Naveen Verma",
        role: "Chairman, RERA Bihar (Retd. IAS)",
        bio: "Chairman of RERA Bihar and former senior civil servant fostering regional bilateral ties.",
        imageUrl: "https://cdn.sanity.io/images/4j8vl1ls/production/49a944ba742eb55bc43029193796d1ae3ff0e719-204x247.jpg",
        order: 10,
      },
      {
        id: "team-vinod",
        name: "Dr. Vinod K. Yadavendu",
        role: "Ex Member, Bihar Legislative Assembly",
        bio: "Former Member of the Bihar Legislative Assembly supporting educational and cultural Indo-Japan initiatives.",
        imageUrl: "https://cdn.sanity.io/images/4j8vl1ls/production/b5a593e87fc4b78ae6eb19ba604d53896aa334a1-180x190.png",
        order: 20,
      },
    ];

    if (cmsMembers.length > 0) {
      return cmsMembers
        .filter((m) => {
          if (m.hidden) return false;
          const cat = (m.category || '').toLowerCase();
          const refTitle = (m.chapterRef?.title || '').toLowerCase();
          return cat === 'bihar chapter team' || cat.includes('bihar') || refTitle.includes('bihar');
        })
        .map(formatMember)
        .sort((a, b) => (a.order ?? 50) - (b.order ?? 50));
    }

    return defaultBihar.map(formatMember);
  })();

  // 4. Resolve Assam Chapter Members
  const assamMembers = (() => {
    const defaultAssam = [
      {
        id: "team-maushumi",
        name: "Dr. Maushumi Barooah",
        role: "Ex. Director, Assam Technical Education Board",
        bio: "Leading state coordination, technical skilling and institutional partnerships in Assam.",
        imageUrl: "https://cdn.sanity.io/images/4j8vl1ls/production/fc8ebc64cfb6e4e892d95e0c52bbcb7206d96ff6-200x200.jpg",
        order: 10,
      },
    ];

    if (cmsMembers.length > 0) {
      return cmsMembers
        .filter((m) => {
          if (m.hidden) return false;
          const cat = (m.category || '').toLowerCase();
          const refTitle = (m.chapterRef?.title || '').toLowerCase();
          return cat === 'assam chapter team' || cat.includes('assam') || refTitle.includes('assam');
        })
        .map(formatMember)
        .sort((a, b) => (a.order ?? 50) - (b.order ?? 50));
    }

    return defaultAssam.map(formatMember);
  })();

  // 5. Resolve Gujarat Chapter Members
  const gujaratMembers = (() => {
    const defaultGujarat = [
      {
        id: "8c082daa-bf57-497f-b692-840381b9d539",
        name: "Ms. Dipti Chitale",
        role: "Gujarat State Coordinator",
        bio: "Facilitating bilateral trade and Japanese manufacturing investments in Gujarat.",
        imageUrl: "https://cdn.sanity.io/images/4j8vl1ls/production/0d9dbeb419b9a51870a3e0ca005facec41c1c968-536x465.png",
        order: 10,
      },
    ];

    if (cmsMembers.length > 0) {
      return cmsMembers
        .filter((m) => {
          if (m.hidden) return false;
          const cat = (m.category || '').toLowerCase();
          const refTitle = (m.chapterRef?.title || '').toLowerCase();
          return cat === 'gujarat chapter team' || cat.includes('gujarat') || refTitle.includes('gujarat');
        })
        .map(formatMember)
        .sort((a, b) => (a.order ?? 50) - (b.order ?? 50));
    }

    return defaultGujarat.map(formatMember);
  })();

  // 6. Resolve Japan Chapter Members
  const japanMembers = (() => {
    if (cmsMembers.length > 0) {
      return cmsMembers
        .filter((m) => {
          if (m.hidden) return false;
          const cat = (m.category || '').toLowerCase();
          const refTitle = (m.chapterRef?.title || '').toLowerCase();
          return cat === 'japan chapter team' || cat.includes('japan') || refTitle.includes('japan');
        })
        .map(formatMember)
        .sort((a, b) => (a.order ?? 50) - (b.order ?? 50));
    }

    return DEFAULT_JAPAN_MEMBERS.map(formatMember);
  })();

  // 6.5. Resolve IJCC Think Tank Members (Isolated from chapters)
  const thinkTankMembers = (() => {
    const list: any[] = [];
    const seen = new Set<string>();

    (cmsThinkTankMembers || []).forEach((m: any) => {
      if (!m.hidden && !seen.has(m._id)) {
        seen.add(m._id);
        list.push(formatMember(m));
      }
    });

    (cmsMembers || []).forEach((m: any) => {
      if (m.hidden) return;
      const cat = (m.category || '').toLowerCase();
      if ((cat.includes('think tank') || cat.includes('thinktank')) && !seen.has(m._id)) {
        seen.add(m._id);
        list.push(formatMember(m));
      }
    });

    return list.sort((a, b) => (a.order ?? 50) - (b.order ?? 50));
  })();

  const shouldShowThinkTank = thinkTankMembers.length > 0;

  // 7. Resolve Dynamic Custom CMS Chapters (e.g. Kolkata Chapter, or newly added state chapters)
  const customChapters = (() => {
    const defaultChapterKeys = ['up', 'uttar pradesh', 'bihar', 'assam', 'gujarat', 'apex', 'japan', 'think tank', 'thinktank'];
    return (cmsChapters || [])
      .filter((c: any) => {
        if (c.hidden) return false;
        const titleNorm = (c.title || '').toLowerCase();
        return !defaultChapterKeys.some((k) => titleNorm.includes(k));
      })
      .map((c: any) => {
        const membersList: any[] = [];
        const seen = new Set<string>();

        // (i) Direct members from chapter's members array
        if (Array.isArray(c.members)) {
          c.members.forEach((m: any) => {
            if (m && !m.hidden) {
              // Exclude demo member Nitin that was removed from CMS
              if (m.name?.toLowerCase().includes('nitin') && (m.bio?.toLowerCase().includes('demo') || m._type === 'chapterMember')) {
                return;
              }
              const mId = m._id || m.name;
              if (!seen.has(mId)) {
                seen.add(mId);
                membersList.push(formatMember(m));
              }
            }
          });
        }

        // (ii) Members from cmsMembers referencing this chapter
        cmsMembers.forEach((m: any) => {
          if (m.hidden) return;
          const refId = m.chapterRef?._id;
          const refTitle = m.chapterRef?.title?.toLowerCase();
          const matches =
            refId === c._id ||
            (refTitle && refTitle === c.title?.toLowerCase()) ||
            (m.category && m.category.toLowerCase().includes(c.title?.toLowerCase()));

          if (matches && !seen.has(m._id)) {
            seen.add(m._id);
            membersList.push(formatMember(m));
          }
        });

        const tabTitle = c.title.replace(/chapter.*team|chapter/i, '').trim() + " Chapter";

        return {
          id: c._id,
          tabTitle: tabTitle.trim() || c.title,
          title: c.title.toUpperCase(),
          subtitle: c.subtitle || "Regional Leadership & State Coordination",
          region: c.region || 'india-state',
          order: c.order ?? 50,
          members: membersList.sort((a, b) => (a.order ?? 50) - (b.order ?? 50)),
        };
      })
      .filter((c: any) => c.members && c.members.length > 0)
      .sort((a: any, b: any) => (a.order ?? 50) - (b.order ?? 50));
  })();

  const customIndiaStateChapters = customChapters.filter((c) => c.region !== 'japan' && c.region !== 'japan-sub');
  const customJapanChapters = customChapters.filter((c) => c.region === 'japan' || c.region === 'japan-sub');

  const shouldShowUP = upMembers.length > 0;
  const shouldShowBihar = biharMembers.length > 0;
  const shouldShowAssam = assamMembers.length > 0;
  const shouldShowGujarat = gujaratMembers.length > 0;
  const shouldShowJapan = japanMembers.length > 0 || customJapanChapters.length > 0;
  const hasAnyStateChapters = shouldShowUP || shouldShowBihar || shouldShowAssam || shouldShowGujarat || customIndiaStateChapters.length > 0;

  // Red Card Component matching the live website theme exactly
  const renderRedCard = (member: any) => {
    const hasBio = !!member.bio;
    const cardContent = (
      <Card className="h-full bg-white/5 border-white/10 text-center space-y-4 group hover:bg-white/10 transition-all cursor-pointer transform hover:-translate-y-1 rounded-2xl flex flex-col justify-between p-6">
        <CardHeader className="p-0">
          <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white/20 bg-white/10 flex items-center justify-center">
            {member.imageUrl ? (
              <Image
                src={member.imageUrl}
                alt={member.name}
                fill
                unoptimized
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <Users2 className="h-12 w-12 text-white/50" />
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0 space-y-2 flex-1 flex flex-col justify-between">
          <div className="space-y-1">
            <h4 className="text-xl font-bold text-white leading-snug">{member.name}</h4>
            <div className="text-accent font-medium text-sm leading-relaxed">{member.title || member.role}</div>
            {member.bio && (
              <p className="text-xs text-primary-foreground/60 line-clamp-2 pt-2">
                {member.bio.substring(0, 100)}...
              </p>
            )}
          </div>
          {hasBio && (
            <div className="pt-4 text-accent text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1 group-hover:underline">
              {t('view_bio') || 'VIEW FULL BIO'} <ArrowRight className="h-3 w-3" />
            </div>
          )}
        </CardContent>
      </Card>
    );

    if (!hasBio) {
      return <div key={member.id} className="h-full">{cardContent}</div>;
    }

    return (
      <Dialog key={member.id}>
        <DialogTrigger asChild>
          {cardContent}
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="flex flex-col items-center text-center space-y-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/10 bg-primary/5 flex items-center justify-center">
              {member.imageUrl ? (
                <Image src={member.imageUrl} alt={member.name} fill unoptimized className="object-cover" />
              ) : (
                <Users2 className="h-12 w-12 text-primary/30" />
              )}
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-3xl font-headline text-primary">{member.name}</DialogTitle>
              <div className="text-accent font-bold uppercase tracking-tighter">{member.title || member.role}</div>
            </div>
          </DialogHeader>
          <div className="mt-6 border-t pt-6 max-h-[50vh] overflow-y-auto pr-4 text-justify whitespace-pre-wrap">
            <p className="text-muted-foreground leading-relaxed">
              {member.bio}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const getChapterTitle = (ch: any) => {
    if (language === 'ja') {
      const titlesJa: Record<string, string> = {
        up: "ウッタル・プラデーシュ支部チーム",
        bihar: "ビハール支部チーム",
        assam: "アッサム支部チーム",
        gujarat: "グジャラート支部チーム",
        japan: "日本支部チーム",
      };
      if (ch.baseKey && titlesJa[ch.baseKey]) return titlesJa[ch.baseKey];
      return tr(ch.title);
    }
    return ch.title;
  };

  const getChapterSubtitle = (ch: any) => {
    if (language === 'ja' && ch.subtitle) {
      return tr(ch.subtitle);
    }
    return ch.subtitle;
  };

  const advisors = cmsMembers
    .filter((m) => {
      if (m.hidden) return false;
      if (m.category !== 'Advisory') return false;
      if (['team-naveen', 'team-vinod', 'team-maushumi'].includes(m._id)) return false;
      return true;
    })
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
          <Accordion type="single" collapsible suppressHydrationWarning className="w-full space-y-4">
            {verticalsList.map((v: any) => (
              <AccordionItem key={v.id} value={v.id} suppressHydrationWarning className="border rounded-2xl px-6 bg-white overflow-hidden shadow-sm">
                <AccordionTrigger suppressHydrationWarning className="hover:no-underline py-6">
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

      {/* Leadership & Chapters Section */}
      <section className="bg-primary py-24 text-primary-foreground">
        <div className="container space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-headline uppercase tracking-tight">
              {language === 'ja' ? t('about_leadership_title') : (cmsAbout?.leadershipTitle || "LEADERSHIP & GOVERNANCE")}
            </h2>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto italic">
              {language === 'ja' ? t('about_leadership_subtitle') : (cmsAbout?.leadershipSubtitle || "Guided by a distinguished board with expertise spanning trade, academia, diplomacy, hospitality and law.")}
            </p>
          </div>

          {/* Chapters Content */}
          <div className="space-y-28">
            {/* ========================================================
                1. MAIN CHAPTER: INDIA CHAPTER TEAM
                ======================================================== */}
            <div className="space-y-16">
              {/* Main Title: INDIA CHAPTER TEAM */}
              <div className="text-center space-y-3">
                <div className="text-xs uppercase tracking-widest text-accent font-bold">
                  {language === 'ja' ? "全国統括および州支部" : "NATIONAL & REGIONAL LEADERSHIP"}
                </div>
                <h3 className="text-4xl sm:text-5xl font-headline tracking-wide uppercase font-bold text-white">
                  {language === 'ja' ? "インド本部・支部" : "INDIA CHAPTER TEAM"}
                </h3>
                <div className="w-24 h-1 bg-accent mx-auto mt-2" />
              </div>

              {/* 1A. Apex Board / Governing Council */}
              <div className="space-y-8">
                <div className="text-center space-y-2 mb-8">
                  <h4 className="text-2xl sm:text-3xl font-headline font-bold text-white uppercase tracking-wide">
                    {language === 'ja' ? "最高執行評議会" : "Apex Governing Council"}
                  </h4>
                  <p className="text-sm sm:text-base text-primary-foreground/75 italic">
                    {language === 'ja' ? "最高執行評議会および中央理事会" : "Apex Governing Council & Central Board"}
                  </p>
                  <div className="w-16 h-0.5 bg-accent/60 mx-auto mt-2" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {apexLeadership.map(renderRedCard)}
                </div>
              </div>

              {/* 1B. Sub-title: STATE CHAPTER TEAMS (Sub chapters under India Chapter Team) */}
              {hasAnyStateChapters && (
                <div className="space-y-16 pt-12 border-t border-white/15">
                  <div className="text-center space-y-2 mb-12">
                    <h4 className="text-3xl sm:text-4xl font-headline font-bold text-accent uppercase tracking-wide">
                      {language === 'ja' ? "州支部チーム" : "STATE CHAPTER TEAMS"}
                    </h4>
                    <p className="text-sm sm:text-base text-primary-foreground/75 italic">
                      {language === 'ja' ? "各州における地域リーダーシップおよび産業連携" : "Regional Leadership & State Coordination across India"}
                    </p>
                    <div className="w-20 h-0.5 bg-accent mx-auto mt-2" />
                  </div>

                  {/* State Chapters Grid / Sections */}
                  <div className="space-y-16">
                    {/* UP Chapter Team */}
                    {shouldShowUP && (
                      <div className="space-y-8 bg-white/[0.03] p-6 sm:p-10 rounded-3xl border border-white/10">
                        <div className="text-center space-y-2 mb-8">
                          <h5 className="text-2xl sm:text-3xl font-headline tracking-wide uppercase font-bold text-white">
                            {language === 'ja' ? "ウッタル・プラデーシュ支部チーム" : "UP CHAPTER TEAM"}
                          </h5>
                          <p className="text-sm sm:text-base text-primary-foreground/75 italic">
                            Regional Leadership & State Coordination
                          </p>
                          <div className="w-16 h-0.5 bg-accent mx-auto mt-2" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                          {upMembers.map(renderRedCard)}
                        </div>
                      </div>
                    )}

                    {/* Bihar Chapter Team */}
                    {shouldShowBihar && (
                      <div className="space-y-8 bg-white/[0.03] p-6 sm:p-10 rounded-3xl border border-white/10">
                        <div className="text-center space-y-2 mb-8">
                          <h5 className="text-2xl sm:text-3xl font-headline tracking-wide uppercase font-bold text-white">
                            {language === 'ja' ? "ビハール支部チーム" : "BIHAR CHAPTER TEAM"}
                          </h5>
                          <p className="text-sm sm:text-base text-primary-foreground/75 italic">
                            Regional Leadership & State Coordination
                          </p>
                          <div className="w-16 h-0.5 bg-accent mx-auto mt-2" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                          {biharMembers.map(renderRedCard)}
                        </div>
                      </div>
                    )}

                    {/* Assam Chapter Team */}
                    {shouldShowAssam && (
                      <div className="space-y-8 bg-white/[0.03] p-6 sm:p-10 rounded-3xl border border-white/10">
                        <div className="text-center space-y-2 mb-8">
                          <h5 className="text-2xl sm:text-3xl font-headline tracking-wide uppercase font-bold text-white">
                            {language === 'ja' ? "アッサム支部チーム" : "ASSAM CHAPTER TEAM"}
                          </h5>
                          <p className="text-sm sm:text-base text-primary-foreground/75 italic">
                            Regional Leadership & State Coordination
                          </p>
                          <div className="w-16 h-0.5 bg-accent mx-auto mt-2" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                          {assamMembers.map(renderRedCard)}
                        </div>
                      </div>
                    )}

                    {/* Gujarat Chapter Team */}
                    {shouldShowGujarat && (
                      <div className="space-y-8 bg-white/[0.03] p-6 sm:p-10 rounded-3xl border border-white/10">
                        <div className="text-center space-y-2 mb-8">
                          <h5 className="text-2xl sm:text-3xl font-headline tracking-wide uppercase font-bold text-white">
                            {language === 'ja' ? "グジャラート支部チーム" : "GUJARAT CHAPTER TEAM"}
                          </h5>
                          <p className="text-sm sm:text-base text-primary-foreground/75 italic">
                            Regional Leadership & State Coordination
                          </p>
                          <div className="w-16 h-0.5 bg-accent mx-auto mt-2" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                          {gujaratMembers.map(renderRedCard)}
                        </div>
                      </div>
                    )}

                    {/* Dynamic CMS State Chapters (e.g. Kolkata Chapter) */}
                    {customIndiaStateChapters.map((ch) => (
                      <div key={ch.id} className="space-y-8 bg-white/[0.03] p-6 sm:p-10 rounded-3xl border border-white/10">
                        <div className="text-center space-y-2 mb-8">
                          <h5 className="text-2xl sm:text-3xl font-headline tracking-wide uppercase font-bold text-white">
                            {ch.title}
                          </h5>
                          <p className="text-sm text-primary-foreground/75 italic">
                            {ch.subtitle}
                          </p>
                          <div className="w-16 h-0.5 bg-accent mx-auto mt-2" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                          {ch.members && ch.members.length > 0 ? (
                            ch.members.map(renderRedCard)
                          ) : (
                            <div className="col-span-full text-center py-8 text-white/60 bg-white/5 rounded-2xl border border-dashed border-white/10">
                              <Users2 className="h-8 w-8 mx-auto text-white/30 mb-2" />
                              <p className="text-sm font-medium">
                                {language === 'ja'
                                  ? "この支部の役員・リーダーシップ任命は近日発表されます。"
                                  : "Regional leadership appointments for this chapter will be announced shortly."}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ========================================================
                2. MAIN CHAPTER: JAPAN CHAPTER TEAM
                ======================================================== */}
            {shouldShowJapan && (
              <div className="space-y-8 pt-12 border-t border-white/15">
                <div className="text-center space-y-2 mb-10">
                  <div className="text-xs uppercase tracking-widest text-accent font-bold">
                    {language === 'ja' ? "日本本部" : "HEADQUARTERS & REGIONAL OPERATIONS"}
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-headline tracking-wide uppercase font-bold text-white">
                    {language === 'ja' ? "日本支部チーム" : "JAPAN CHAPTER TEAM"}
                  </h3>
                  <p className="text-sm sm:text-base text-primary-foreground/75 italic">
                    {language === 'ja' ? "東京本部および地域運営統括" : "Tokyo Headquarters & Regional Operations"}
                  </p>
                  <div className="w-16 h-0.5 bg-accent mx-auto mt-2" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {japanMembers.map(renderRedCard)}
                </div>

                {/* Any Japan Sub-Chapters */}
                {customJapanChapters.map((ch) => (
                  <div key={ch.id} className="space-y-8 bg-white/[0.03] p-6 sm:p-10 rounded-3xl border border-white/10 mt-12">
                    <div className="text-center space-y-2 mb-8">
                      <h5 className="text-2xl sm:text-3xl font-headline tracking-wide uppercase font-bold text-white">
                        {ch.title}
                      </h5>
                      <p className="text-sm text-primary-foreground/75 italic">
                        {ch.subtitle}
                      </p>
                      <div className="w-16 h-0.5 bg-accent mx-auto mt-2" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {ch.members && ch.members.length > 0 ? (
                        ch.members.map(renderRedCard)
                      ) : (
                        <div className="col-span-full text-center py-8 text-white/60 bg-white/5 rounded-2xl border border-dashed border-white/10">
                          <Users2 className="h-8 w-8 mx-auto text-white/30 mb-2" />
                          <p className="text-sm font-medium">
                            Regional leadership appointments for this chapter will be announced shortly.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ========================================================
                3. IJCC THINK TANK (Bilateral Policy & Research Advisory)
                Only rendered if members > 0 and not explicitly hidden
                ======================================================== */}
            {shouldShowThinkTank && (
              <div className="space-y-8 pt-12 border-t border-white/15">
                <div className="text-center space-y-2 mb-10">
                  <div className="text-xs uppercase tracking-widest text-accent font-bold">
                    {language === 'ja' ? "研究・戦略・政策提言" : "RESEARCH, STRATEGY & POLICY ADVISORY"}
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-headline tracking-wide uppercase font-bold text-white">
                    {language === 'ja' ? "IJCC シンクタンク" : (cmsAbout?.thinkTankTitle || "IJCC THINK TANK")}
                  </h3>
                  <p className="text-sm sm:text-base text-primary-foreground/75 italic">
                    {language === 'ja'
                      ? "日印政策提言、戦略的研究および二国間イノベーションワーキンググループ"
                      : (cmsAbout?.thinkTankSubtitle || "Strategic Policy, Bilateral Research & Innovation Working Group")}
                  </p>
                  <div className="w-16 h-0.5 bg-accent mx-auto mt-2" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {thinkTankMembers.map(renderRedCard)}
                </div>
              </div>
            )}
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
