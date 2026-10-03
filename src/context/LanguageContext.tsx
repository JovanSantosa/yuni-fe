"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import idMessages from "@/locales/id.json";
import zhMessages from "@/locales/zh-TW.json";
import enMessages from "@/locales/en.json";
import viMessages from "@/locales/vi.json";
import thMessages from "@/locales/th.json";

export type Locale = "id" | "zh-TW" | "en" | "vi" | "th";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string, fallback?: string) => string;
}

const messagesMap: Record<Locale, any> = {
  id: idMessages,
  "zh-TW": zhMessages,
  en: enMessages,
  vi: viMessages,
  th: thMessages,
};

const LanguageContext = createContext<LanguageContextType>({
  locale: "id",
  setLocale: () => {},
  t: (path: string) => path,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("id");

  useEffect(() => {
    // Detect saved locale or browser preference
    const saved = Cookies.get("yuni_locale") || localStorage.getItem("yuni_locale");
    if (saved && (saved === "id" || saved === "zh-TW" || saved === "en" || saved === "vi" || saved === "th")) {
      setLocaleState(saved as Locale);
    } else {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.includes("zh") || browserLang.includes("tw")) {
        setLocaleState("zh-TW");
      } else if (browserLang.includes("vi")) {
        setLocaleState("vi");
      } else if (browserLang.includes("th")) {
        setLocaleState("th");
      } else if (browserLang.includes("en")) {
        setLocaleState("en");
      }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    Cookies.set("yuni_locale", newLocale, { expires: 365, path: "/" });
    localStorage.setItem("yuni_locale", newLocale);
  };

  const t = (path: string, fallback?: string): string => {
    const keys = path.split(".");
    let current: any = messagesMap[locale];

    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        // Fallback to Indonesian if key not found
        let fallbackCurrent: any = messagesMap["id"];
        for (const fKey of keys) {
          if (fallbackCurrent && typeof fallbackCurrent === "object" && fKey in fallbackCurrent) {
            fallbackCurrent = fallbackCurrent[fKey];
          } else {
            return fallback || path;
          }
        }
        return typeof fallbackCurrent === "string" ? fallbackCurrent : fallback || path;
      }
    }

    return typeof current === "string" ? current : fallback || path;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
