'use client';

import React, { useState, useMemo } from 'react';
import LanguageSelector from './ActivityChat/LanguageSelector';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { Languages, X } from 'lucide-react';
import { languageNameByCode, getLanguageDisplayName } from '@/app/config/languages';

const LanguageSwitcher: React.FC = () => {
  const { language } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const currentLanguageName = useMemo(() => {
    return getLanguageDisplayName(language) || "Language";
  }, [language]);

  return (
    <>
      <button
        type="button"
        className="inline-flex items-center gap-2 text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsLangOpen(true)}
      >
        <Languages className="w-4 h-4 text-white" />
        <span>{currentLanguageName}</span>
      </button>

      {isLangOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsLangOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-[92vw] max-w-5xl p-6 sm:p-8">
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsLangOpen(false)}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-6">Choose Language</h3>
            <LanguageSelector 
              mode="client" 
              useFlags={false} 
              inline 
              layout="grid" 
              onLanguageChange={() => setIsLangOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default LanguageSwitcher;
