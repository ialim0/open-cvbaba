// next-i18next.config.js

// Define the supported languages directly here to avoid TypeScript import issues
const supportedLanguages = [
  'en', 'en-US', 'en-GB', 'en-IN', 'fr-FR', 'fr-CA', 'fr-BE', 'fa', 'es-LA', 'es-MX', 'es-ES', 
  'de', 'it', 'th', 'pt', 'pt-PT', 'ro', 'zh-TW', 'zh-CN', 'hi', 'id', 'ar', 'ar-SA', 
  'ja', 'nl', 'no', 'ko', 'ml', 'mr', 'bn', 'ru', 'sw', 'sv', 'tl', 'sr', 'tr', 'uk', 
  'ur', 'uz', 'vi', 'cy', 'lv', 'lt', 'mk', 'ms', 'bs', 'bg', 'ca', 'hr', 'cs', 'da'
];

module.exports = {
    i18n: {
      defaultLocale: 'en-US',
      locales: supportedLanguages, 
    },
    reloadOnPrerender: true,
  };
  