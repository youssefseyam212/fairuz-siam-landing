'use client';

import { useEffect } from 'react';

/**
 * Keep the browser-tab title in the visitor's language.
 * Server metadata is English-only (the language lives in localStorage), and Next streams its
 * <title> after hydration, so re-apply ours whenever something else rewrites it.
 */
export function useDocTitle(title: string) {
  useEffect(() => {
    const apply = () => { if (document.title !== title) document.title = title; };
    apply();
    const mo = new MutationObserver(apply);
    mo.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => mo.disconnect();
  }, [title]);
}
