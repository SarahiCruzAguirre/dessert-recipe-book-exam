"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import es from "../locales/es.json";
import en from "../locales/en.json";

type Locale = "es" | "en";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, variables?: Record<string, string>) => string;
}

const dictionaries = { es, en };

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Locale;
    if (saved === "es" || saved === "en") {
      Promise.resolve().then(() => {
        setLocaleState(saved);
      });
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("lang", newLocale);
    document.cookie = `lang=${newLocale}; path=/; max-age=31536000`;
  };

  const t = (key: string, variables?: Record<string, string>) => {
    const dict = dictionaries[locale] as unknown as Record<string, unknown>;
    const parts = key.split(".");
    let value: unknown = dict;

    for (const part of parts) {
      if (value && typeof value === "object" && part in (value as Record<string, unknown>)) {
        value = (value as Record<string, unknown>)[part];
      } else {
        return key;
      }
    }

    if (typeof value !== "string") {
      return key;
    }

    let result = value;
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        result = result.replace(new RegExp(`{${k}}`, "g"), v);
      });
    }

    return result;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
