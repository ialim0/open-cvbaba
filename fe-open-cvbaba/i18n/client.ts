import { useTranslations } from 'next-intl';

export function useTranslation(locale: string, namespace: string) {
  const t = useTranslations(namespace);
  return { t };
}
