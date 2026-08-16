// Shared language configuration for the entire application
// This includes all languages available in the resume form and app settings

export interface LanguageOption {
  value: string;
  language: string;
  region: string;
  flagCode?: string; // For flag display
}

// Complete list of supported languages (from resume form)
export const languageOptions: LanguageOption[] = [
  { value: 'en', language: 'English', region: 'English', flagCode: 'en' },
  { value: 'en-US', language: 'English (US)', region: 'English (US)', flagCode: 'en' },
  { value: 'en-GB', language: 'English (UK)', region: 'English (UK)', flagCode: 'en' },
  { value: 'en-IN', language: 'English (India)', region: 'English (India)', flagCode: 'en' },
  { value: 'fr-FR', language: 'Français (France)', region: 'French (France)', flagCode: 'fr' },
  { value: 'fr-CA', language: 'Français (Canada)', region: 'French (Canada)', flagCode: 'fr' },
  { value: 'fr-BE', language: 'Français (Belgique)', region: 'French (Belgium)', flagCode: 'fr' },
  { value: 'fa-IR', language: 'فارسی', region: 'Persian', flagCode: 'fa' },
  { value: 'es-LA', language: 'Español (Latinoamérica)', region: 'Spanish (Latin America)', flagCode: 'es' },
  { value: 'es-MX', language: 'Español (México)', region: 'Spanish (Mexico)', flagCode: 'es' },
  { value: 'es-ES', language: 'Español (España)', region: 'Spanish (Spain)', flagCode: 'es' },
  { value: 'de-DE', language: 'Deutsch', region: 'German', flagCode: 'de' },
  { value: 'it-IT', language: 'Italiano', region: 'Italian', flagCode: 'it' },
  { value: 'th-TH', language: 'ภาษาไทย', region: 'Thai', flagCode: 'th' },
  { value: 'pt-BR', language: 'Português (Brasil)', region: 'Portuguese (Brazil)', flagCode: 'pt' },
  { value: 'pt-PT', language: 'Português (Portugal)', region: 'Portuguese (Portugal)', flagCode: 'pt' },
  { value: 'ro-RO', language: 'Română', region: 'Romanian', flagCode: 'ro' },
  { value: 'zh-TW', language: '繁體中文', region: 'Traditional Chinese', flagCode: 'zh' },
  { value: 'zh-CN', language: '简体中文', region: 'Simplified Chinese', flagCode: 'zh' },
  { value: 'hi-IN', language: 'हिन्दी', region: 'Hindi', flagCode: 'hi' },
  { value: 'id-ID', language: 'Bahasa Indonesia', region: 'Indonesian', flagCode: 'id' },
  { value: 'ar-AE', language: 'العربية', region: 'Arabic', flagCode: 'ar' },
  { value: 'ar-SA', language: 'العربية (السعودية)', region: 'Arabic (Saudi Arabia)', flagCode: 'ar' },
  { value: 'ja-JP', language: '日本語', region: 'Japanese', flagCode: 'ja' },
  { value: 'nl-NL', language: 'Nederlands', region: 'Dutch', flagCode: 'nl' },
  { value: 'no-NO', language: 'Norsk', region: 'Norwegian', flagCode: 'no' },
  { value: 'ko-KR', language: '한국어', region: 'Korean', flagCode: 'ko' },
  { value: 'ml-IN', language: 'മലയാളം', region: 'Malayalam', flagCode: 'ml' },
  { value: 'mr-IN', language: 'मराठी', region: 'Marathi', flagCode: 'mr' },
  { value: 'bn-IN', language: 'বাংলা', region: 'Bengali', flagCode: 'bn' },
  { value: 'ru-RU', language: 'Русский', region: 'Russian', flagCode: 'ru' },
  { value: 'sw-KE', language: 'Kiswahili (Kenya)', region: 'Swahili (Kenya)', flagCode: 'ke' },
  { value: 'sw-TZ', language: 'Kiswahili (Tanzania)', region: 'Swahili (Tanzania)', flagCode: 'tz' },
  { value: 'sv-SE', language: 'Svenska', region: 'Swedish', flagCode: 'sv' },
  { value: 'tl-PH', language: 'Tagalog', region: 'Tagalog', flagCode: 'tl' },
  { value: 'sr-RS', language: 'Српски', region: 'Serbian', flagCode: 'sr' },
  { value: 'tr-TR', language: 'Türkçe', region: 'Turkish', flagCode: 'tr' },
  { value: 'uk-UA', language: 'Українська', region: 'Ukrainian', flagCode: 'uk' },
  { value: 'ur-PK', language: 'اردو', region: 'Urdu', flagCode: 'ur' },
  { value: 'uz-UZ', language: "O'zbek tili", region: 'Uzbek', flagCode: 'uz' },
  { value: 'vi-VN', language: 'Tiếng Việt', region: 'Vietnamese', flagCode: 'vi' },
  { value: 'cy-GB', language: 'Cymraeg', region: 'Welsh', flagCode: 'cy' },
  { value: 'lv-LV', language: 'Latviešu', region: 'Latvian', flagCode: 'lv' },
  { value: 'lt-LT', language: 'Lietuvių', region: 'Lithuanian', flagCode: 'lt' },
  { value: 'mk-MK', language: 'Македонски', region: 'Macedonian', flagCode: 'mk' },
  { value: 'ms-MY', language: 'Bahasa Melayu', region: 'Malay', flagCode: 'ms' },
  { value: 'bs-BA', language: 'Bosanski', region: 'Bosnian', flagCode: 'bs' },
  { value: 'bg-BG', language: 'Български', region: 'Bulgarian', flagCode: 'bg' },
  { value: 'ca-ES', language: 'Català', region: 'Catalan', flagCode: 'ca' },
  { value: 'hr-HR', language: 'Hrvatski', region: 'Croatian', flagCode: 'hr' },
  { value: 'cs-CZ', language: 'Čeština', region: 'Czech', flagCode: 'cs' },
  { value: 'da-DK', language: 'Dansk', region: 'Danish', flagCode: 'da' },
  // African Languages (Google STT chirp/chirp_2 models)
  { value: 'am-ET', language: 'አማርኛ', region: 'Amharic (Ethiopia)', flagCode: 'et' },
  { value: 'yo-NG', language: 'Yorùbá', region: 'Yoruba (Nigeria)', flagCode: 'ng' },
  { value: 'zu-ZA', language: 'isiZulu', region: 'Zulu (South Africa)', flagCode: 'za' },
  { value: 'xh-ZA', language: 'isiXhosa', region: 'Xhosa (South Africa)', flagCode: 'za' },
  { value: 'af-ZA', language: 'Afrikaans', region: 'Afrikaans (South Africa)', flagCode: 'za' },
  { value: 'ha-NG', language: 'Hausa', region: 'Hausa (Nigeria)', flagCode: 'ng' },
  { value: 'ig-NG', language: 'Igbo', region: 'Igbo (Nigeria)', flagCode: 'ng' },
  { value: 'ak-GH', language: 'Twi', region: 'Twi (Ghana)', flagCode: 'gh' },
  { value: 'wo-SN', language: 'Wolof', region: 'Wolof (Senegal)', flagCode: 'sn' },
  { value: 'so-SO', language: 'Soomaali', region: 'Somali (Somalia)', flagCode: 'so' },
  { value: 'so-KE', language: 'Soomaali (Kenya)', region: 'Somali (Kenya)', flagCode: 'ke' },
  { value: 'rw-RW', language: 'Kinyarwanda', region: 'Kinyarwanda (Rwanda)', flagCode: 'rw' },
  { value: 'om-ET', language: 'Oromoo', region: 'Oromo (Ethiopia)', flagCode: 'et' },
  { value: 'lg-UG', language: 'Luganda', region: 'Ganda (Uganda)', flagCode: 'ug' },
  { value: 'sn-ZW', language: 'chiShona', region: 'Shona (Zimbabwe)', flagCode: 'zw' },
  { value: 'st-ZA', language: 'Sesotho', region: 'Sotho (South Africa)', flagCode: 'za' },
  { value: 'ti-ET', language: 'ትግርኛ', region: 'Tigrinya (Ethiopia)', flagCode: 'et' },
  { value: 'tn-ZA', language: 'Setswana', region: 'Tswana (South Africa)', flagCode: 'za' },
  { value: 'kea-CV', language: 'Kabuverdianu', region: 'Kabuverdianu (Cape Verde)', flagCode: 'cv' },
];

// Type for all supported languages
export type LocaleTypes = (typeof languageOptions)[number]['value'];

// Extract all supported language codes for the i18n system
export const supportedLanguages: LocaleTypes[] = languageOptions.map(lang => lang.value);

// Default/fallback language
export const fallbackLng: LocaleTypes = 'en-US';

// Language name mapping for display purposes
export const languageNameByCode: Record<string, string> = languageOptions.reduce((acc, lang) => {
  acc[lang.value] = lang.language;
  return acc;
}, {} as Record<string, string>);

// Helper function to get flag code for a language
export function getFlagCode(languageCode: string): string {
  const language = languageOptions.find(lang => lang.value === languageCode);
  if (language?.flagCode) {
    return language.flagCode;
  }

  // Fallback: use the base language code
  const base = languageCode.split('-')[0];
  return base;
}

// Helper function to get language display name
export function getLanguageDisplayName(languageCode: string): string {
  return languageNameByCode[languageCode] || languageCode;
}

// Helper function to get language name without variation (e.g., "Français" instead of "Français (Belgique)")
export function getLanguageShortName(languageCode: string): string {
  const fullName = languageNameByCode[languageCode] || languageCode;
  // Remove anything in parentheses
  return fullName.replace(/\s*\([^)]*\)\s*$/, '').trim();
}

// Helper function to validate if a language is supported
export function isLanguageSupported(languageCode: string): languageCode is LocaleTypes {
  return supportedLanguages.includes(languageCode as LocaleTypes);
}

// Helper function to get the base language code (e.g., 'en' from 'en-US')
export function getBaseLanguage(languageCode: string): string {
  return languageCode.split('-')[0];
}

// Group languages by base language for better organization
export function getLanguagesByBase(): Record<string, LanguageOption[]> {
  return languageOptions.reduce((acc, lang) => {
    const base = getBaseLanguage(lang.value);
    if (!acc[base]) {
      acc[base] = [];
    }
    acc[base].push(lang);
    return acc;
  }, {} as Record<string, LanguageOption[]>);
}

export const uiLanguageOptions: LanguageOption[] = languageOptions.filter(lang =>
  lang.value.startsWith('en') || lang.value.startsWith('fr')
);