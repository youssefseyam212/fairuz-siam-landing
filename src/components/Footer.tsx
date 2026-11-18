'use client';

import { COLS, COL_KEYS } from '@/lib/data';
import { useStore } from '@/context/StoreProvider';
import { Icon, Logotype } from './Art';

export function Footer() {
  const { t, L, act } = useStore();
  const col = (h: string, items: [string, string][]) => (
    <>
      <h2 className="label">{h}</h2>
      <ul>{items.map(([l, a]) => <li key={l}><button type="button" onClick={() => act(a)}>{l}</button></li>)}</ul>
    </>
  );
  const svcIcons = [Icon.hand, Icon.gem, Icon.truck];

  return (
    <footer className="foot">
      <div className="wrap">
        <ul className="trust">
          {t('svc').map((s, i) => { const I = svcIcons[i]; return <li key={s}><I /><span>{s}</span></li>; })}
        </ul>
        <div className="fgrid" data-reveal>
          <div className="fbrand">
            <Logotype />
            <p className="label worn">{t('worn')}</p>
            <p className="closing">{t('closing')}</p>
            <p>{t('atelierLoc')}</p>
          </div>
          <div className="fcol">{col(t('fExplore'), [[t('home'), 'home'], [t('about'), 'about'], [t('collections'), 'sec:collections'], [t('pieces'), 'sec:pieces']])}</div>
          <div className="fcol">{col(t('po'), COL_KEYS.map((k) => [L(COLS[k].name), 'pre:any:' + k] as [string, string]))}</div>
          <div className="fcol">
            <h2 className="label">{t('fVisit')}</h2>
            <p className="fvisit">{t('fVisitBody')}</p>
          </div>
        </div>
        <div className="base"><span>{t('copy')}</span><span>{t('credit')}</span></div>
      </div>
    </footer>
  );
}
