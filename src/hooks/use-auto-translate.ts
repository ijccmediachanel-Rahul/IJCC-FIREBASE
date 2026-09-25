"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "@/hooks/use-translation";

const STORAGE_KEY = "ijcc_auto_translations_v1";

function getLocalCache(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setLocalCache(cache: Record<string, string>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // quota exceeded or private mode
  }
}

export function useAutoTranslate() {
  const { language } = useTranslation();
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const inFlightRef = useRef<Set<string>>(new Set());

  // Initialize from localStorage on mount
  useEffect(() => {
    setTranslations(getLocalCache());
  }, []);

  const translateBatch = useCallback(
    async (texts: string[]) => {
      if (language !== "ja" || !texts || texts.length === 0) return;

      const cache = getLocalCache();
      const needed = texts.filter(
        (t) =>
          typeof t === "string" &&
          t.trim().length > 0 &&
          !cache[t] &&
          !inFlightRef.current.has(t) &&
          // Don't translate if already in Japanese
          !/[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/.test(t)
      );

      if (needed.length === 0) return;

      needed.forEach((t) => inFlightRef.current.add(t));

      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texts: needed, target: "ja" }),
        });

        if (!res.ok) return;
        const data = await res.json();
        const incoming = data.translations || {};

        if (Object.keys(incoming).length > 0) {
          const updated = { ...getLocalCache(), ...incoming };
          setLocalCache(updated);
          setTranslations((prev) => ({ ...prev, ...incoming }));
        }
      } catch (err) {
        console.warn("Auto-translate batch failed:", err);
      } finally {
        needed.forEach((t) => inFlightRef.current.delete(t));
      }
    },
    [language]
  );

  const tr = useCallback(
    (text: string | null | undefined, fallback?: string): string => {
      if (!text) return fallback || "";
      if (language !== "ja") return text;
      // If already contains Japanese characters, return as is
      if (/[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/.test(text)) {
        return text;
      }
      return translations[text] || fallback || text;
    },
    [language, translations]
  );

  return { tr, translateBatch, translations, isJa: language === "ja" };
}
