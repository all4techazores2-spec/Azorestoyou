import { Language } from '../types';

// MyMemory é um serviço público e gratuito de tradução (sem chave de API para uso ligeiro).
const LANG_MAP: Record<Language, string> = {
  pt: 'pt', en: 'en', es: 'es', it: 'it', de: 'de', hi: 'hi',
};

const CACHE_KEY = 'autoTranslateCacheV1';
const memCache: Record<string, string> = (() => {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}'); } catch { return {}; }
})();

let saveTimer: ReturnType<typeof setTimeout> | null = null;
const persistCache = () => {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(memCache)); } catch { /* quota cheia, ignorar */ }
  }, 500);
};

const pending: Record<string, Promise<string>> = {};

export async function translateText(text: string, targetLang: Language): Promise<string> {
  if (!text || targetLang === 'pt') return text;
  const key = `${targetLang}:${text}`;
  if (memCache[key]) return memCache[key];
  if (pending[key]) return pending[key];

  const target = LANG_MAP[targetLang] || 'en';
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=pt|${target}`;

  const promise = fetch(url)
    .then(r => r.json())
    .then(data => {
      const translated = data?.responseData?.translatedText;
      const isValid = typeof translated === 'string' && data.responseStatus === 200 && !/MYMEMORY WARNING/i.test(translated);
      const result = isValid ? translated : text;
      memCache[key] = result;
      persistCache();
      return result;
    })
    .catch(() => text)
    .finally(() => { delete pending[key]; });

  pending[key] = promise;
  return promise;
}