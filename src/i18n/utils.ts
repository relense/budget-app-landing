import { ui, defaultLang, type Lang, type UiKey } from './ui';

export type { Lang };

export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  if (first === 'pt-pt') return 'pt-pt';
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t<K extends UiKey>(key: K): (typeof ui)[Lang][K] {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

// Given the pathname of an `en` (unprefixed) page, returns the equivalent `/pt-pt/...` path,
// and vice versa. Used for the hreflang alternate links and the first-visit language redirect.
export function getAlternatePath(pathname: string, lang: Lang): string {
  if (lang === 'en') {
    return `/pt-pt${pathname}`.replace(/\/+$/, '') + '/';
  }
  return pathname.replace(/^\/pt-pt/, '') || '/';
}

export const htmlLang: Record<Lang, string> = {
  en: 'en',
  'pt-pt': 'pt-PT',
};
