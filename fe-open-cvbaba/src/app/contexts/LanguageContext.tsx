// src/app/contexts/LanguageContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  i18n, 
  LocaleTypes, 
  supportedLanguages, 
  fallbackLng
} from '../i18n/i18n';

interface LanguageContextType {
  language: LocaleTypes;
  setLanguage: (lang: LocaleTypes, mode?: 'client' | 'server') => Promise<void>;
  isLoading: boolean;
  isSyncing: boolean;
  mode: 'client' | 'server'; 
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
  mode?: 'client' | 'server'; 
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children, mode = 'client' }) => {
  const [language, setLanguageState] = useState<LocaleTypes>(fallbackLng);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const validateLanguage = (lang: string): LocaleTypes => {
    return supportedLanguages.includes(lang as LocaleTypes) ? lang as LocaleTypes : fallbackLng;
  };

  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        await i18n.init();

        const detectedLanguage = validateLanguage(i18n.language);

        setLanguageState(detectedLanguage);
      } catch (error) {
        console.error('Failed to initialize language:', error);
        setLanguageState(fallbackLng);
      } finally {
        setIsLoading(false);
      }
    };

    initializeLanguage();
  }, []);

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      const validatedLanguage = validateLanguage(lng);
      setLanguageState(validatedLanguage);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  const setLanguage = useCallback(async (newLanguage: LocaleTypes, mode?: 'client' | 'server') => {
    if (!supportedLanguages.includes(newLanguage)) {
      console.error('Unsupported language:', newLanguage);
      return;
    }

    try {
      setIsSyncing(true);
      localStorage.setItem('preferredLanguage', newLanguage);

      await i18n.changeLanguage(newLanguage);

      if (mode === 'server') {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const value = useMemo(() => ({
    language,
    setLanguage,
    isLoading,
    isSyncing,
    mode
  }), [language, setLanguage, isLoading, isSyncing, mode]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};