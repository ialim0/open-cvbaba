/** Languages available for generated documents and document translation. */
export interface LanguageOption {
  value: 'en' | 'fr' | 'es';
  language: string;
  region: string;
  flagCode: 'en' | 'fr' | 'es';
}

export const languageOptions: LanguageOption[] = [
  { value: 'en', language: 'English', region: 'English', flagCode: 'en' },
  { value: 'fr', language: 'French', region: 'French', flagCode: 'fr' },
  { value: 'es', language: 'Spanish', region: 'Spanish', flagCode: 'es' },
];

export type DocumentLanguage = LanguageOption['value'];
export type LocaleTypes = 'en';

/** The website has one deliberately fixed interface language. */
export const supportedLanguages: LocaleTypes[] = ['en'];
export const fallbackLng: LocaleTypes = 'en';

const languageNameByCode: Record<DocumentLanguage, string> = {
  en: 'English',
  fr: 'French',
  es: 'Spanish',
};

export function getFlagCode(languageCode: string): string {
  return languageCode.split('-')[0];
}

export function getLanguageDisplayName(languageCode: string): string {
  return languageNameByCode[languageCode as DocumentLanguage] || 'English';
}

export function getLanguageShortName(languageCode: string): string {
  return getLanguageDisplayName(languageCode);
}

export function isLanguageSupported(languageCode: string): languageCode is LocaleTypes {
  return languageCode === 'en';
}

export function getBaseLanguage(languageCode: string): string {
  return languageCode.split('-')[0];
}
