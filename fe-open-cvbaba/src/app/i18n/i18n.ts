// src/i18n/i18n.ts
import i18next, { i18n as I18nInstance, InitOptions } from 'i18next';
import { initReactI18next, useTranslation as useTranslationAlias } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { supportedLanguages, fallbackLng, LocaleTypes } from '../config/languages';

// Re-export for backward compatibility
export { supportedLanguages, fallbackLng };
export type { LocaleTypes };

// Available namespaces for the application
export const namespaces = ['common', 'activity', 'settings', 'templates'] as const;
export type Namespace = (typeof namespaces)[number];
export const defaultNamespace: Namespace = 'common';

const isServer = typeof window === 'undefined';

const defaultOptions: InitOptions = {
  supportedLngs: supportedLanguages,
  fallbackLng,
  fallbackNS: defaultNamespace,
  defaultNS: defaultNamespace,
  debug: process.env.NODE_ENV === 'development',
};

export const i18nInstance = i18next
  .use(initReactI18next)
  .use(
    resourcesToBackend((language: string, namespace: string) =>
      import(`../../../public/locales/${language}/${namespace}.json`).catch(() => {
        const base = language.split('-')[0];
        return import(`../../../public/locales/${base}/${namespace}.json`);
      })
    )
  );

i18nInstance.init(defaultOptions);

export function useTranslation(ns: string = defaultNamespace) {
  const translation = useTranslationAlias(ns);
  return translation;
}

export function formatLanguage(lang: string): LocaleTypes {
  // Prefer full region tag if supported, otherwise fall back to base language
  if (supportedLanguages.includes(lang as LocaleTypes)) {
    return lang as LocaleTypes;
  }
  const base = lang.split('-')[0];
  return (supportedLanguages.includes(base as LocaleTypes) ? base : fallbackLng) as LocaleTypes;
}

export { i18nInstance as i18n };