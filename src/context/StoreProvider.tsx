'use client';

import { scrollToEl } from '@/lib/scroll';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { Lang, Localized } from '@/lib/data';
import { T, type Dict, type DictKey, type ThemeMode } from '@/lib/i18n';
import type { PieceChoice } from '@/lib/preorder';

interface ToastState { msg: string; act?: string; fn?: () => void; on: boolean }

interface Store {
  lang: Lang; setLang: (l: Lang) => void;
  t: <K extends DictKey>(k: K) => Dict[K];
  L: (o: Localized) => string;
  money: (n: number) => string;
  num: (n: number) => string;
  theme: ThemeMode; setTheme: (m: ThemeMode) => void;

  /** Pre-order popup. `pick` preselects a piece ('' | 'any:<collection>' | '<productId>'). */
  preOpen: boolean; prePick: PieceChoice; prePickKey: number;
  openPreorder: (pick?: PieceChoice) => void; closePreorder: () => void;

  toast: (msg: string, act?: string, fn?: () => void) => void;
  hideToast: () => void;
  toastState: ToastState;

  /** Navigation actions: 'home' · 'about' · 'sec:<id>' · 'pre' · 'pre:<pick>' */
  act: (a: string) => void;
  consumePendingSection: () => string | null;
  menuCloseKey: number;
}

const Ctx = createContext<Store | null>(null);

const store = {
  get<V>(k: string, d: V): V { try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as V) : d; } catch { return d; } },
  set(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [lang, setLangState] = useState<Lang>('en');
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [preOpen, setPreOpen] = useState(false);
  const [prePick, setPrePick] = useState<PieceChoice>('');
  const [prePickKey, setPrePickKey] = useState(0);
  const [toastState, setToastState] = useState<ToastState>({ msg: '', on: false });
  const [menuCloseKey, setMenuCloseKey] = useState(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pendingSection = useRef<string | null>(null);

  // Load persisted preferences after mount (avoids hydration mismatch).
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setLangState(store.get<Lang>('fs-lang', 'en'));
    setThemeState(store.get<ThemeMode>('fs-theme', 'system'));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
  }, [theme]);

  const setLang = useCallback((l: Lang) => { setLangState(l); store.set('fs-lang', l); }, []);
  const setTheme = useCallback((m: ThemeMode) => {
    const root = document.documentElement;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.classList.add('theming');
      setTimeout(() => root.classList.remove('theming'), 400);
    }
    setThemeState(m); store.set('fs-theme', m);
  }, []);

  const t = useCallback(<K extends DictKey>(k: K): Dict[K] => T[lang][k], [lang]);
  const L = useCallback((o: Localized) => o[lang], [lang]);
  const money = useCallback((n: number) =>
    new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(n), [lang]);
  const num = useCallback((n: number) => new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US').format(n), [lang]);

  const hideToast = useCallback(() => setToastState((s) => ({ ...s, on: false })), []);
  const toast = useCallback((msg: string, act?: string, fn?: () => void) => {
    setToastState({ msg, act, fn, on: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(hideToast, 4200);
  }, [hideToast]);

  const openPreorder = useCallback((pick?: PieceChoice) => {
    if (pick !== undefined) { setPrePick(pick); setPrePickKey((n) => n + 1); }
    setPreOpen(true);
  }, []);
  const closePreorder = useCallback(() => setPreOpen(false), []);

  const act = useCallback((a: string) => {
    setMenuCloseKey((n) => n + 1);
    const i = a.indexOf(':'), k = i < 0 ? a : a.slice(0, i), v = i < 0 ? '' : a.slice(i + 1);
    if (k === 'home') router.push('/');
    else if (k === 'about') router.push('/about');
    else if (k === 'pre') openPreorder(v);
    else if (k === 'sec') {
      if (pathname === '/') scrollToEl(document.getElementById(v));
      else { pendingSection.current = v; router.push('/'); }
    }
  }, [router, pathname, openPreorder]);

  const consumePendingSection = useCallback(() => { const s = pendingSection.current; pendingSection.current = null; return s; }, []);

  const value = useMemo<Store>(() => ({
    lang, setLang, t, L, money, num, theme, setTheme,
    preOpen, prePick, prePickKey, openPreorder, closePreorder,
    toast, hideToast, toastState, act, consumePendingSection, menuCloseKey,
  }), [lang, setLang, t, L, money, num, theme, setTheme, preOpen, prePick, prePickKey, openPreorder, closePreorder,
    toast, hideToast, toastState, act, consumePendingSection, menuCloseKey]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore must be used inside StoreProvider');
  return s;
}
