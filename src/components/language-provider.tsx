"use client";

import React, { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import en from '@/locales/en.json';
import ja from '@/locales/ja.json';

export type Language = 'en' | 'ja';

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  l: (cmsValue: any, key: string, cmsJaValue?: any) => string;
}

const translations = { en, ja };

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ijcc_language') as Language;
      if (saved && (saved === 'en' || saved === 'ja')) {
        setLanguageState(saved);
      }
    } catch {
      // localStorage may fail in private mode
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('ijcc_language', lang);
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback((key: string): string => {
    const activeDict = translations[language] as Record<string, any>;
    const text = activeDict?.[key];
    if (text !== undefined && text !== '') return text;
    const fallbackDict = translations.en as Record<string, any>;
    return fallbackDict?.[key] !== undefined ? fallbackDict[key] : key;
  }, [language]);

  const l = useCallback((cmsValue: any, key: string, cmsJaValue?: any): string => {
    if (language === 'ja') {
      if (cmsJaValue) return cmsJaValue;
      const jaText = (ja as Record<string, any>)[key];
      if (jaText && jaText !== key) return jaText;
      return cmsValue || (en as Record<string, any>)[key] || key;
    }
    return cmsValue || (en as Record<string, any>)[key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, l }}>
      {children}
    </LanguageContext.Provider>
  );
};
