'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { COLS, COL_KEYS } from '@/lib/data';
import { THEMES, TLBL } from '@/lib/i18n';
import { useStore } from '@/context/StoreProvider';
import { Icon, MiniGem, Mono, Logotype } from './Art';

export function Header() {
  const { t, L, lang, setLang, theme, setTheme, toast, hideToast, act, menuCloseKey } = useStore();
  const pathname = usePathname();
  const onAbout = pathname.replace(/\/$/, '') === '/about';

  const [scrolled, setScrolled] = useState(false);
  const [menuShown, setMenuShown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const mCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 4);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const openMenu = () => {
    setMenuShown(true);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(() => setMenuOpen(true)));
    setTimeout(() => mCloseRef.current?.focus({ preventScroll: true }), 80);
  };
  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = '';
    setTimeout(() => setMenuShown(false), 420);
  };

  // close the menu on navigation / action
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (menuShown) closeMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, menuCloseKey]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMenuOpen((o) => { if (o) { document.body.style.overflow = ''; setTimeout(() => setMenuShown(false), 420); } return false; });
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const cycleTheme = () => {
    const next = THEMES[(THEMES.indexOf(theme) + 1) % 3];
    setTheme(next);
    toast(TLBL[lang][next]);
  };
  const toggleLang = () => { hideToast(); setLang(lang === 'en' ? 'ar' : 'en'); };
  const ThemeIcon = Icon[theme];

  return (
    <>
      <a className="skip label" href="#app">{t('skip')}</a>
      <aside className="announce label" aria-label={lang === 'ar' ? 'إعلان' : 'Announcement'}>{t('announce')}</aside>
      <header className={`hdr${scrolled ? ' scrolled' : ''}`} id="hdr">
        <div className="wrap bar">
          <div className="hl">
            <button className="iconbtn menubtn press" type="button" aria-label={t('menu')} onClick={openMenu}><Icon.menu /></button>
            <nav className="nav" aria-label="Main">
              <button type="button" className="label" onClick={() => act('sec:collections')}>{t('collections')}</button>
              <button type="button" className="label" onClick={() => act('sec:pieces')}>{t('pieces')}</button>
              <Link className="label navlink" href="/about" aria-current={onAbout ? 'page' : undefined}>{t('about')}</Link>
            </nav>
          </div>
          <Link className="home press" href="/" aria-label="Fairuz Siam">
            <Mono /><Logotype />
          </Link>
          <div className="tools">
            <button className="pill press themebtn" id="themeBtn" type="button" aria-label={TLBL[lang][theme]} title={TLBL[lang][theme]} onClick={cycleTheme}><ThemeIcon /></button>
            <button className="pill press label" id="langBtn" type="button" aria-label={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'} onClick={toggleLang}>
              {lang === 'ar' ? 'EN' : <span className="ar">عربي</span>}
            </button>
            <button className="bagbtn prebtn press" type="button" aria-haspopup="dialog" onClick={() => act('pre')}>
              <Icon.gem />
              <span className="label">{t('po')}</span>
            </button>
          </div>
        </div>
      </header>

      <div className={`msheet${menuOpen ? ' open' : ''}`} hidden={!menuShown}>
        <div className="mscrim" onClick={closeMenu} />
        <aside className="mpanel" role="dialog" aria-modal="true" aria-label={t('menu')}>
          {menuShown && (
            <>
              <div className="mtop"><Mono /><button type="button" className="xbtn press" ref={mCloseRef} aria-label={t('closeMenu')} onClick={closeMenu}><Icon.close /></button></div>
              <div className="mbig">
                <button type="button" onClick={() => act('home')}>{t('home')}</button>
                <button type="button" onClick={() => act('sec:collections')}>{t('collections')}</button>
                <button type="button" onClick={() => act('sec:pieces')}>{t('pieces')}</button>
                <button type="button" onClick={() => act('about')}>{t('about')}</button>
              </div>
              <div><p className="label muted" style={{ margin: '0 0 10px' }}>{t('po')}</p><div className="mgrid">
                {COL_KEYS.map((k) => <button type="button" key={k} className={COLS[k].skin} onClick={() => act('pre:any:' + k)}><MiniGem c={COLS[k]} />{L(COLS[k].name)}</button>)}
              </div></div>
              <button type="button" className="cta label press" onClick={() => act('pre')}>{t('po')} <span className="flip" aria-hidden="true">→</span></button>
              <div className="mrow">
                <button type="button" className="pill press" style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={cycleTheme}>
                  <span style={{ width: 18, height: 18, display: 'grid' }}><ThemeIcon /></span><span>{TLBL[lang][theme].split(': ')[1]}</span>
                </button>
                <button type="button" className="pill press label" onClick={() => { closeMenu(); toggleLang(); }}>
                  {lang === 'ar' ? 'English' : <span className="ar">العربية</span>}
                </button>
              </div>
            </>
          )}
        </aside>
      </div>
    </>
  );
}
