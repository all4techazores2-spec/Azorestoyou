import React from 'react';
import { Language } from '../types';
import { translateText } from './autoTranslate';

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'INPUT', 'TEXTAREA', 'NOSCRIPT']);
const HAS_WORDS = /[a-zA-ZÀ-ÿ]{2,}/; // ignora nós só com números, símbolos, emojis, datas/horas

function shouldSkip(node: Text): boolean {
  const value = node.nodeValue || '';
  if (!value.trim() || !HAS_WORDS.test(value)) return true;
  let el = node.parentElement;
  while (el) {
    if (SKIP_TAGS.has(el.tagName) || el.hasAttribute('data-no-translate')) return true;
    el = el.parentElement;
  }
  return false;
}

type Settled = { lang: Language; text: string };

/**
 * Traduz automaticamente, em tempo real, todo o texto visível dentro de `containerRef`
 * sempre que `lang` muda. Guarda o texto original (fonte PT) de cada nó para poder
 * traduzir sempre a partir da fonte e evitar degradação ao trocar de idioma repetidamente.
 *
 * Distingue mutações que a própria função escreveu (ecos, a ignorar) de mutações
 * genuínas do React (novo conteúdo, ex: mudar de mês/dia num calendário) — sem isto,
 * qualquer atualização legítima de texto feita pelo React era revertida para o valor
 * visto da primeira vez, "prendendo" o ecrã ao conteúdo inicial.
 */
export function useAutoTranslate(containerRef: React.RefObject<HTMLElement>, lang: Language) {
  const originalsRef = React.useRef(new WeakMap<Text, string>());
  const lastWrittenRef = React.useRef(new WeakMap<Text, Settled>());
  const langRef = React.useRef(lang);
  langRef.current = lang;

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const settleNode = (node: Text, settledLang: Language, text: string) => {
      if (node.nodeValue !== text) node.nodeValue = text;
      lastWrittenRef.current.set(node, { lang: settledLang, text });
    };

    const applyToNode = (node: Text) => {
      if (shouldSkip(node)) return;
      const currentValue = node.nodeValue || '';
      const targetLang = langRef.current;
      const lastWritten = lastWrittenRef.current.get(node);

      // Eco da nossa própria última escrita para este idioma: nada a fazer.
      if (lastWritten && lastWritten.lang === targetLang && lastWritten.text === currentValue) return;

      // O DOM ainda mostra o que escrevemos antes (possivelmente noutro idioma) e não uma
      // mudança genuína de conteúdo -> mantém a fonte PT já guardada, não a substitui.
      const domIsOurPriorWrite = !!lastWritten && currentValue === lastWritten.text;
      let original = originalsRef.current.get(node);
      if (!domIsOurPriorWrite || original === undefined) {
        original = currentValue;
        originalsRef.current.set(node, original);
      }

      if (targetLang === 'pt') {
        settleNode(node, 'pt', original);
        return;
      }

      translateText(original, targetLang).then(translated => {
        if (langRef.current !== targetLang || !node.isConnected) return;
        if (originalsRef.current.get(node) !== original) return; // fonte mudou entretanto
        settleNode(node, targetLang, translated);
      });
    };

    const walk = (root: Node) => {
      if (root.nodeType === Node.TEXT_NODE) { applyToNode(root as Text); return; }
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let n: Node | null;
      while ((n = walker.nextNode())) applyToNode(n as Text);
    };

    walk(container);

    const observer = new MutationObserver(mutations => {
      for (const m of mutations) {
        if (m.type === 'characterData' && m.target.nodeType === Node.TEXT_NODE) {
          applyToNode(m.target as Text);
        } else if (m.type === 'childList') {
          m.addedNodes.forEach(added => walk(added));
        }
      }
    });
    observer.observe(container, { childList: true, subtree: true, characterData: true });

    return () => observer.disconnect();
  }, [lang, containerRef]);
}
