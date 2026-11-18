'use client';

import { COLS, type Product } from '@/lib/data';
import { useStore } from '@/context/StoreProvider';
import { Arrow, Icon, Mono, PieceSvg } from './Art';

/** stagger index for data-reveal children */
export const iv = (i: number) => ({ '--i': i }) as React.CSSProperties;

/** Pinned statement: the words light up one by one as you scroll through it. */
export function Manifesto() {
  const { t } = useStore();
  const words = t('manifesto').split(' ');
  return (
    <section className="mf" data-scene="pin" aria-label={t('storyEb')}>
      <div className="mf-stage">
        <Mono className="mf-mono" />
        <div className="wrap mf-in">
          <span className="label mf-eb">{t('storyEb')}</span>
          <p className="mf-txt" style={{ '--n': words.length } as React.CSSProperties}>
            {words.map((w, i) => <span key={i} style={iv(i)}>{w} </span>)}
          </p>
        </div>
      </div>
    </section>
  );
}

export function Craft() {
  const { t } = useStore();
  const craftIcons = [Icon.hand, Icon.gem, Icon.truck];
  return (
    <section className="sec" style={{ paddingTop: 0 }}><div className="wrap">
      <div className="sec-head" data-reveal><h2 className="display d2">{t('craftTitle')}</h2></div>
      <div className="craft">
        {t('craft').map((c, i) => { const I = craftIcons[i]; return <div key={c[0]} data-reveal style={iv(i)}><I /><h3>{c[0]}</h3><p>{c[1]}</p></div>; })}
      </div>
    </div></section>
  );
}

export function Gifting() {
  const { t, act } = useStore();
  return (
    <section className="sec" style={{ paddingTop: 0 }}><div className="wrap split rev">
      <div className="art art-gift" data-scene="view" aria-hidden="true">
        <svg viewBox="0 0 200 220">
          <path d="M58 50 C40 120 30 170 46 196 Q100 214 154 196 C170 170 160 120 142 50 Z" fill="#12BDC1" />
          <path d="M58 50 Q100 64 142 50 L146 64 Q100 80 54 64 Z" fill="#0e9ea2" />
          <path d="M70 66 C64 110 62 160 70 196" stroke="rgba(255,255,255,.18)" strokeWidth={3} fill="none" />
          <path d="M84 60 C70 34 52 30 46 40 M116 60 C130 34 148 30 154 40" stroke="#F6B45B" strokeWidth={4} fill="none" strokeLinecap="round" />
          <circle cx="100" cy="60" r="6" fill="#F6B45B" />
        </svg>
        <Mono />
      </div>
      <div className="txt" data-reveal>
        <span className="label">{t('giftEb')}</span>
        <h2 className="display d2">{t('giftTitle')}</h2>
        <p>{t('giftBody')}</p>
        <button type="button" className="btn btn-p label press" onClick={() => act('pre')}>{t('giftBtn')} <Arrow /></button>
      </div>
    </div></section>
  );
}

/** Closing call to action (replaces the shop's newsletter band). */
export function PreorderBand() {
  const { t, act } = useStore();
  return (
    <section className="letter"><div className="wrap in" data-reveal>
      <div><h2>{t('bandTitle')}</h2><p>{t('bandSub')}</p></div>
      <div className="band-cta">
        <button type="button" className="btn label press" aria-haspopup="dialog" onClick={() => act('pre')}>{t('po')} <Arrow /></button>
      </div>
    </div></section>
  );
}

/** A piece in the rail: the whole card opens the pre-order popup with that piece chosen. */
export function PieceCard({ p }: { p: Product }) {
  const { t, L, money, openPreorder } = useStore();
  const c = COLS[p.col];
  return (
    <article className="card">
      <button type="button" className={`stage ${c.skin}`} aria-haspopup="dialog" aria-label={`${t('po')}: ${L(p.name)}`} onClick={() => openPreorder(p.id)}>
        <PieceSvg p={p} />
        {p.isNew && <span className="new label">{t('isNew')}</span>}
        <span className="qadd" aria-hidden="true"><Icon.gem /><span className="label">{t('po')}</span></span>
      </button>
      <div className="meta">
        <div>
          <span className="label">{L(c.name)} · {L(c.stone)}</span>
          <span className="display d3">{L(p.name)}</span>
        </div>
        <span className="price">{money(p.price)}</span>
      </div>
    </article>
  );
}
