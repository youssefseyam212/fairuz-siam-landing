'use client';

import { COLS, COL_KEYS } from '@/lib/data';
import { useStore } from '@/context/StoreProvider';
import { Arrow, GemSvg, Mono } from '@/components/Art';
import { Craft, Gifting, Manifesto, PreorderBand, iv } from '@/components/Sections';
import { useDocTitle } from '@/lib/useDocTitle';

export function AboutView() {
  const { t, L, act } = useStore();
  useDocTitle(t('titleAbout'));

  return (
    <>
      <section className="wrap ab-head" data-reveal>
        <span className="label">{t('about')}</span>
        <h1 className="display d1">{t('abTitle')}</h1>
        <p>{t('aboutBody')}</p>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}><div className="wrap split">
        <div className="art art-story" data-scene="view" aria-hidden="true"><Mono className="big" /><span className="sq"><Mono /></span></div>
        <div className="txt" data-reveal>
          <span className="label">{t('abNameEb')}</span>
          <h2 className="display d2">{t('abNameTitle')}</h2>
          <p>{t('abNameBody')}</p>
          <button type="button" className="btn btn-p label press" aria-haspopup="dialog" onClick={() => act('pre:any:fayrouz')}>{t('slides')[1].b} <Arrow /></button>
        </div>
      </div></section>

      <Manifesto />

      <section className="sec"><div className="wrap">
        <div className="sec-head" data-reveal><div><h2 className="display d2">{t('abStonesTitle')}</h2><p>{t('abStonesSub')}</p></div></div>
        <div className="ab-stones">
          {COL_KEYS.map((k, i) => {
            const c = COLS[k];
            return (
              <article key={k} className={`ab-stone ${c.skin}`} data-reveal style={iv(i)}>
                <GemSvg cut={c.cut} color={c.gem} className="g" />
                <div>
                  <span className="label">{L(c.stone)}</span>
                  <h3 className="display">{L(c.name)}</h3>
                  <p>{L(c.line)}</p>
                  <button type="button" className="go label press" aria-haspopup="dialog" onClick={() => act('pre:any:' + k)}>{t('po')} <Arrow /></button>
                </div>
              </article>
            );
          })}
        </div>
      </div></section>

      <Craft />
      <Gifting />

      <section className="sec" style={{ paddingTop: 0 }}><div className="wrap">
        <div className="ab-facts" data-reveal>
          <h2 className="display d2">{t('abFactsTitle')}</h2>
          <dl className="specs">
            {t('abFacts').map(([k, v]) => <div key={k} style={{ display: 'contents' }}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </div>
      </div></section>

      <PreorderBand />
    </>
  );
}
