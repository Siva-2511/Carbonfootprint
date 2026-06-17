import { useState, useEffect, useCallback } from 'react';
import { useStore } from '../core/store';

type Translations = Record<string, string>;
const cache: Partial<Record<string, Translations>> = {};

/** i18n hook. Reads language from settings store, loads JSON, returns t() lookup. */
export function useTranslation() {
  const language = useStore((s) => s.settings.language);
  const [translations, setTranslations] = useState<Translations>(() => {
    const lang = language || 'en';
    return cache[lang] || {};
  });

  useEffect(() => {
    const lang = language || 'en';
    if (cache[lang] && Object.keys(translations).length > 0) {
      return;
    }
    fetch(`/translations/${lang}.json`)
      .then((r) => (r.ok ? r.json() : fetch('/translations/en.json').then((r2) => r2.json())))
      .then((data: Translations) => {
        cache[lang] = data;
        setTranslations(data);
      })
      .catch(() => setTranslations({}));
  }, [language, translations]);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      return translations[key] ?? fallback ?? key;
    },
    [translations]
  );

  return { t };
}
