/** Languages available for generated CVs and CV translation. */
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

const languageNameByCode: Record<DocumentLanguage, string> = {
  en: 'English',
  fr: 'French',
  es: 'Spanish',
};

export function getLanguageShortName(languageCode: string): string {
  return languageNameByCode[languageCode as DocumentLanguage] || 'English';
}
