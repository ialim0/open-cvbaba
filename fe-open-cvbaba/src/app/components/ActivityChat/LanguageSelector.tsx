import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { LocaleTypes, languageOptions, uiLanguageOptions, getFlagCode, getLanguageShortName } from '@/app/config/languages';

interface Language {
  code: LocaleTypes;
  name: string;
}

const CUSTOM_FLAG_PATH = '/images/flags/';

function getFlagAssetCode(code: LocaleTypes): string {
  return getFlagCode(code);
}

interface LanguageSelectorProps {
  mode?: 'client' | 'server';
  useFlags?: boolean; // when false, show text-only selector
  inline?: boolean; // when true, render options directly without dropdown button
  layout?: 'dropdown' | 'grid';
  dropdownAlign?: 'left' | 'right' | 'center';
  onLanguageChange?: () => void; // callback triggered after a language is successfully selected
  scope?: 'ui' | 'content';
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  mode: forcedMode,
  useFlags = true,
  inline = false,
  layout = 'dropdown',
  dropdownAlign = 'left',
  onLanguageChange,
  scope = 'content'
}) => {
  const { language, setLanguage, isLoading, isSyncing, mode: contextMode } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentMode = forcedMode || contextMode;

  const languages: Language[] = (scope === 'ui' ? uiLanguageOptions : languageOptions).map(lang => ({
    code: lang.value as LocaleTypes,
    name: getLanguageShortName(lang.value)
  }));

  useEffect(() => {
    if (inline) return; // no outside handler needed when inline
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [inline]);

  const selectedLanguage = useMemo(() => {
    const found = languages.find((lang) => lang.code === language);
    if (found) return found;
    if (language === 'en' || language.startsWith('en')) {
      return languages.find((l) => l.code === 'en-US') || languages[0];
    }
    if (language === 'fr' || language.startsWith('fr')) {
      return languages.find((l) => l.code === 'fr-FR') || languages[0];
    }
    if (language === 'es' || language.startsWith('es')) {
      return languages.find((l) => l.code === 'es-AR') || languages[0];
    }
    if (language === 'pt' || language.startsWith('pt')) {
      return languages.find((l) => l.code === 'pt-PT') || languages[0];
    }
    if (language === 'zh' || language.startsWith('zh')) {
      return languages.find((l) => l.code === 'zh-CN') || languages[0];
    }
    return languages[0];
  }, [language, languages]);

  const sortedLanguages = useMemo(() => {
    const selected = languages.find(lang => lang.code === language);
    const others = languages.filter(lang => lang.code !== language);
    const sortedOthers = others.sort((a, b) => a.name.localeCompare(b.name));
    return selected ? [selected, ...sortedOthers] : sortedOthers;
  }, [language, languages]);

  const handleLanguageChange = useCallback(
    async (code: LocaleTypes) => {
      if (code === language || isSyncing) return;

      try {
        await setLanguage(code, currentMode);
        setIsOpen(false);
        onLanguageChange?.();
      } catch (error) {
        console.error('Failed to change language:', error);
      }
    },
    [language, setLanguage, currentMode, isSyncing, onLanguageChange]
  );

  const getDropdownClasses = () => {
    const baseClasses = "absolute z-50 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg w-44";
    if (dropdownAlign === 'right') return `${baseClasses} right-0`;
    if (dropdownAlign === 'left') return `${baseClasses} left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0`;
    return `${baseClasses} left-1/2 -translate-x-1/2`;
  };

  const optionItem = (code: LocaleTypes, name: string) => (
    <li key={code} role="option" aria-selected={language === code} aria-disabled={isSyncing}>
      <button
        type="button"
        onClick={() => !isSyncing && handleLanguageChange(code)}
        disabled={isSyncing}
        className={`w-full text-left px-4 py-2 rounded-full text-sm ${language === code ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100' : 'text-gray-800 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100'} ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {useFlags ? (
          <span className="inline-flex items-center">
            <img src={`${CUSTOM_FLAG_PATH}${getFlagAssetCode(code)}.svg`} alt={`${name} flag`} className="w-5 h-5 mr-2" />
            {name}
          </span>
        ) : (
          <span>{name}</span>
        )}
      </button>
    </li>
  );

  const renderLanguageOptions = useMemo(() => {
    if (layout === 'grid') {
      return (
        <ul role="listbox" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full">
          {sortedLanguages.map(({ code, name }) => optionItem(code, name))}
        </ul>
      );
    }

    return (
      <ul role="listbox" className="w-44">
        {sortedLanguages.map(({ code, name }) => (
          <li
            key={code}
            className={`flex items-center px-4 py-2 cursor-pointer w-full ${isSyncing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100'} ${language === code ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100' : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300'}`}
            onClick={() => !isSyncing && handleLanguageChange(code)}
            aria-selected={language === code}
            aria-disabled={isSyncing}
          >
            <div className="flex items-center w-full">
              {useFlags ? (
                <img
                  src={`${CUSTOM_FLAG_PATH}${code}.svg`}
                  alt={`${name} flag`}
                  className="w-8 h-8 object-contain flex-shrink-0"
                />
              ) : null}
              <span className={`${useFlags ? 'ml-3' : ''} text-sm text-gray-700 dark:text-gray-300`}>{name}</span>
            </div>
          </li>
        ))}
      </ul>
    );
  }, [layout, language, isSyncing, useFlags, handleLanguageChange, sortedLanguages]);

  if (isLoading) {
    return (
      <div className="w-14 h-12 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (inline) {
    return (
      <div ref={dropdownRef} className="bg-white dark:bg-gray-900">
        {renderLanguageOptions}
      </div>
    );
  }

  return (
    <div className={`relative ${useFlags ? 'w-full max-w-[48px]' : 'w-auto'} mx-auto`} ref={dropdownRef}>
      <button
        type="button"
        className={`flex items-center justify-center space-x-1 rounded-lg p-2 ${useFlags ? 'w-full' : 'px-3'} ${isSyncing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        onClick={() => !isSyncing && setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        disabled={isSyncing}
      >
        {useFlags ? (
          <img
            src={`${CUSTOM_FLAG_PATH}${getFlagAssetCode(selectedLanguage.code)}.svg`}
            alt={`${selectedLanguage.name} flag`}
            className={`w-8 h-8 ${isSyncing ? 'opacity-50' : ''}`}
          />
        ) : (
          <span className="text-sm text-gray-700 dark:text-gray-300 min-w-[80px] text-left">{selectedLanguage.name}</span>
        )}
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isOpen && (
        <ul
          className={getDropdownClasses()}
          role="listbox"
        >
          {sortedLanguages.map(({ code, name }) => (
            <li
              key={code}
              className={`flex items-center px-4 py-2 cursor-pointer w-full
                ${isSyncing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100'}
                ${language === code ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100' : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300'}`}
              onClick={() => !isSyncing && handleLanguageChange(code)}
              aria-selected={language === code}
              aria-disabled={isSyncing}
            >
              <div className="flex items-center w-full">
                {useFlags ? (
                  <img
                    src={`${CUSTOM_FLAG_PATH}${getFlagAssetCode(code)}.svg`}
                    alt={`${name} flag`}
                    className="w-8 h-8 object-contain flex-shrink-0"
                  />
                ) : null}
                <span className={`${useFlags ? 'ml-3' : ''} text-sm text-gray-700 dark:text-gray-300`}>{name}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default React.memo(LanguageSelector);