'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { COLS, COL_KEYS, METALS, PRODUCTS, byId, type CollectionKey, type Metal } from '@/lib/data';
import { RING_SIZES, isEmail, normalizePhone, pieceIsRing, type FieldError, type PreorderResult } from '@/lib/preorder';
import { useStore } from '@/context/StoreProvider';
import { GemSvg, Icon, Mono, PieceSvg } from './Art';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';
const PREVIEW = process.env.NEXT_PUBLIC_PREVIEW === 'true';
const SEEN = 'fs-pre'; // sessionStorage: the popup already opened by itself this session

interface Form { piece: string; metal: Metal; size: string; name: string; phone: string; email: string; note: string }
const empty = (piece = ''): Form => ({ piece, metal: 'gold', size: '', name: '', phone: '', email: '', note: '' });

/** Art beside the form: follows the chosen piece. */
function PreArt({ piece }: { piece: string }) {
  const { L, t } = useStore();
  const p = byId[piece];
  const col: CollectionKey = p ? p.col : piece.startsWith('any:') ? (piece.slice(4) as CollectionKey) : 'fayrouz';
  const c = COLS[col];
  return (
    <div className={`pre-art ${c.skin}`} aria-hidden="true">
      <Mono className="pre-bigmono" />
      <div className="pre-stage" key={piece}>
        {p ? <PieceSvg p={p} /> : <GemSvg cut={c.cut} color={c.gem} className="pre-gem" />}
      </div>
      <div className="pre-cap">
        <span className="label">{L(c.name)} · {L(c.stone)}</span>
        <span className="display">{p ? L(p.name) : t('poTitle')}</span>
      </div>
    </div>
  );
}

export function PreorderModal() {
  const { t, L, lang, money, preOpen, prePick, prePickKey, openPreorder, closePreorder } = useStore();
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(empty);
  const [bad, setBad] = useState<FieldError[]>([]);
  const [busy, setBusy] = useState(false);
  const [fail, setFail] = useState('');
  const [done, setDone] = useState<(PreorderResult & { phone: string; preview?: boolean }) | null>(null);
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  // Open by itself once per session, after the brand intro has finished.
  useEffect(() => {
    try { if (sessionStorage.getItem(SEEN)) return; } catch { return; }
    const root = document.documentElement;
    let timer = 0;
    const go = () => { timer = window.setTimeout(() => openPreorder(), 1400); };
    if (!root.classList.contains('intro-play')) { go(); return () => clearTimeout(timer); }
    const mo = new MutationObserver(() => { if (!root.classList.contains('intro-play')) { mo.disconnect(); go(); } });
    mo.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => { mo.disconnect(); clearTimeout(timer); };
  }, [openPreorder]);

  // A button asked for a specific piece: start a fresh form with it selected.
  useEffect(() => {
    if (!prePickKey) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    setForm((f) => ({ ...f, piece: prePick, size: '' }));
    setDone(null); setBad([]); setFail('');
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [prePick, prePickKey]);

  // mount → animate in; animate out → unmount
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (preOpen) {
      try { sessionStorage.setItem(SEEN, '1'); } catch { /* ignore */ }
      returnTo.current = document.activeElement as HTMLElement | null;
      setShown(true);
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
      setTimeout(() => panelRef.current?.focus({ preventScroll: true }), 60);
    } else if (shown) {
      setOpen(false);
      document.body.style.overflow = '';
      const tm = setTimeout(() => { setShown(false); returnTo.current?.focus?.({ preventScroll: true }); }, 380);
      return () => clearTimeout(tm);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preOpen]);

  const close = () => { closePreorder(); if (done) setTimeout(() => { setDone(null); setForm(empty()); }, 400); };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.stopPropagation(); close(); return; }
    if (e.key !== 'Tab' || !panelRef.current) return;
    const f = panelRef.current.querySelectorAll<HTMLElement>('button:not([disabled]),input,select,textarea,[href]');
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (bad.length) setBad((b) => b.filter((x) => x !== k));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: FieldError[] = [];
    if (form.name.trim().length < 2) errs.push('name');
    if (!normalizePhone(form.phone)) errs.push('phone');
    if (form.email.trim() && !isEmail(form.email.trim())) errs.push('email');
    setBad(errs); setFail('');
    if (errs.length) { panelRef.current?.querySelector<HTMLElement>(`#pre-${errs[0]}`)?.focus(); return; }

    // GitHub Pages preview: no server, so nothing is saved — show a clearly labelled sample code.
    if (PREVIEW) { setDone({ code: 'FS-DEMO-0000', percent: 10, existing: false, phone: form.phone.trim(), preview: true }); return; }

    setBusy(true);
    try {
      const res = await fetch(`${BASE}/api/preorders`, {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...form, size: pieceIsRing(form.piece) && form.size ? Number(form.size) : null, lang }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setDone({ ...(data as PreorderResult), phone: form.phone.trim() });
      else if (res.status === 400 && Array.isArray(data.fields)) setBad(data.fields);
      else setFail(res.status === 429 ? t('poRate') : t('poErr'));
    } catch {
      setFail(t('poErr'));
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    if (!done) return;
    try { await navigator.clipboard.writeText(done.code); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* ignore */ }
  };

  if (!shown) return null;
  const isRing = pieceIsRing(form.piece);
  const err = (k: FieldError) => bad.includes(k);
  const msgs: Partial<Record<FieldError, string>> = { name: t('eName'), phone: t('ePhone'), email: t('eEmail') };
  const fieldMsg = (k: FieldError) => err(k) && <span className="msg" id={`pre-${k}-msg`}>{msgs[k]}</span>;

  return (
    <div className={`pre${open ? ' open' : ''}`} data-lenis-prevent>
      <div className="pre-scrim" onClick={close} />
      <div className="pre-panel" role="dialog" aria-modal="true" aria-labelledby="pre-title" tabIndex={-1} ref={panelRef} onKeyDown={onKeyDown}>
        <button type="button" className="xbtn press pre-x" aria-label={t('poClose')} onClick={close}><Icon.close /></button>
        <PreArt piece={form.piece} />

        <div className="pre-body">
          {done ? (
            <div className="pre-done" aria-live="polite">
              <Mono className="pre-done-mono" />
              <h2 className="display" id="pre-title">{t('poDoneTitle')}</h2>
              <p>{t('poDoneBody')(done.phone)}</p>
              <div className="pre-code">
                <span className="label">{t('poCodeLabel')}</span>
                <div className="pre-code-row">
                  <output className="pre-code-val" dir="ltr">{done.code}</output>
                  <button type="button" className="pill press label" onClick={copy}>{copied ? t('poCopied') : t('poCopy')}</button>
                </div>
                <p>{t('poCodeBody')(done.percent)}</p>
              </div>
              {done.existing && <p className="muted">{t('poExisting')}</p>}
              {done.preview && <p className="pre-fail">{t('poPreview')}</p>}
              <button type="button" className="cta label press" onClick={close}>{t('poDoneBtn')}</button>
            </div>
          ) : (
            <>
              <header className="pre-head">
                <span className="label">{t('poEb')}</span>
                <h2 className="display" id="pre-title">{t('poTitle')}</h2>
                <p>{t('poSub')}</p>
              </header>

              <form className="pre-form" noValidate onSubmit={onSubmit}>
                <div className="field">
                  <label htmlFor="pre-piece">{t('poPiece')}</label>
                  <select id="pre-piece" value={form.piece} onChange={(e) => { set('piece', e.target.value); set('size', ''); }}>
                    <option value="">{t('poHelp')}</option>
                    {COL_KEYS.map((k) => (
                      <optgroup key={k} label={`${L(COLS[k].name)} · ${L(COLS[k].stone)}`}>
                        <option value={`any:${k}`}>{t('poAny')(L(COLS[k].name))}</option>
                        {PRODUCTS.filter((p) => p.col === k).map((p) => (
                          <option key={p.id} value={p.id}>{L(p.name)} · {money(p.price)}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div className="pre-row">
                  <fieldset>
                    <legend className="label">{t('poMetal')}</legend>
                    <div className="opts">
                      {(['gold', 'silver'] as Metal[]).map((m) => (
                        <label className="opt" key={m}>
                          <input type="radio" name="pre-metal" value={m} checked={form.metal === m} onChange={() => set('metal', m)} />
                          <span><i className="swatch" style={{ background: METALS[m].base }} />{t(m)}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  {isRing && (
                    <div className="field pre-size">
                      <label htmlFor="pre-size">{t('poSize')}</label>
                      <select id="pre-size" value={form.size} onChange={(e) => set('size', e.target.value)}>
                        <option value="">{t('poSizeUnsure')}</option>
                        {RING_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  )}
                </div>

                <div className="fields">
                  <div className={`field full${err('name') ? ' bad' : ''}`}>
                    <label htmlFor="pre-name">{t('fullName')}</label>
                    <input id="pre-name" autoComplete="name" value={form.name} onChange={(e) => set('name', e.target.value)}
                      aria-invalid={err('name')} aria-describedby={err('name') ? 'pre-name-msg' : undefined} />
                    {fieldMsg('name')}
                  </div>
                  <div className={`field${err('phone') ? ' bad' : ''}`}>
                    <label htmlFor="pre-phone">{t('phone')}</label>
                    <input id="pre-phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" placeholder="010 1234 5678" value={form.phone}
                      onChange={(e) => set('phone', e.target.value)} aria-invalid={err('phone')} aria-describedby={err('phone') ? 'pre-phone-msg' : undefined} />
                    {fieldMsg('phone')}
                  </div>
                  <div className={`field${err('email') ? ' bad' : ''}`}>
                    <label htmlFor="pre-email">{t('email')}</label>
                    <input id="pre-email" type="email" autoComplete="email" dir="ltr" value={form.email}
                      onChange={(e) => set('email', e.target.value)} aria-invalid={err('email')} aria-describedby={err('email') ? 'pre-email-msg' : undefined} />
                    {fieldMsg('email')}
                  </div>
                  <div className="field full">
                    <label htmlFor="pre-note">{t('poNote')}</label>
                    <textarea id="pre-note" rows={2} maxLength={600} value={form.note} onChange={(e) => set('note', e.target.value)} />
                  </div>
                </div>

                {fail && <p className="pre-fail" role="alert">{fail}</p>}
                <button type="submit" className="cta label press" disabled={busy} aria-busy={busy}>
                  {busy ? t('poSending') : <>{t('poSend')} <span className="flip" aria-hidden="true">→</span></>}
                </button>
                <p className="pre-privacy">{t('poPrivacy')}</p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
