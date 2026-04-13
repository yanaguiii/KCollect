import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import styles from './CollectionPickerOverlay.module.css';

// ── System default backgrounds ──────────────────────────────────
// Add real images later: { id:'img-1', label:'Name', value:'/backgrounds/bg1.jpg', isImage:true }
export const SYSTEM_BACKGROUNDS = [
  { id: 'g1', label: 'Roxo',       value: 'linear-gradient(135deg,#6B0AC9 0%,#C850C0 100%)' },
  { id: 'g2', label: 'Noite',      value: 'linear-gradient(135deg,#0d0d2b 0%,#2d1b69 100%)' },
  { id: 'g3', label: 'Rosa Neon',  value: 'linear-gradient(135deg,#ff416c 0%,#c850c0 100%)' },
  { id: 'g4', label: 'Oceano',     value: 'linear-gradient(135deg,#0f2027 0%,#2193b0 100%)' },
  { id: 'g5', label: 'Pôr do Sol', value: 'linear-gradient(135deg,#f7971e 0%,#ffd200 100%)' },
  { id: 'g6', label: 'Cereja',     value: 'linear-gradient(135deg,#eb3349 0%,#f45c43 100%)' },
  { id: 'g7', label: 'Floresta',   value: 'linear-gradient(135deg,#134e5e 0%,#71b280 100%)' },
  { id: 'g8', label: 'Índigo',     value: 'linear-gradient(135deg,#373b44 0%,#4286f4 100%)' },
];

const STORAGE_KEY = 'kcollect_backgrounds';
function loadBackgrounds() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}
function saveBackgrounds(map) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}
// Returns inline style for a card that has a saved background.
// Returns null when no bg is set → the card shows as pure glass.
function resolvedBgStyle(raw) {
  if (!raw) return null;
  if (raw.startsWith('url(')) return { backgroundImage: raw, backgroundSize: 'cover', backgroundPosition: 'center' };
  return { background: raw };
}

// ── Carousel helpers ────────────────────────────────────────────
const stepX = () => Math.min(window.innerWidth * 0.38, 500);

// Returns GSAP props for a card at `offset` positions from the active card.
function cardProps(offset) {
  const abs = Math.abs(offset);
  return {
    x:             offset * stepX(),
    y:             0,                       // resting vertical position
    scale:         1 - Math.min(abs, 2) * 0.16,
    opacity:       abs === 0 ? 1 : abs === 1 ? 0.52 : 0,
    filter:        `blur(${abs === 0 ? 0 : abs * 2}px)`,
    zIndex:        abs === 0 ? 10 : abs === 1 ? 4 : 0,
    pointerEvents: abs <= 1 ? 'auto' : 'none',
  };
}

function CollectionPickerOverlay({ wishlists, onSelect, onClose }) {
  const overlayRef     = useRef(null);
  const topBarRef      = useRef(null);
  const bottomBarRef   = useRef(null);
  const cardRefs       = useRef([]);
  const entranceTlRef  = useRef(null);
  const currentIdxRef  = useRef(0);          // always-current, avoids stale closure

  const [currentIndex, setCurrentIndex] = useState(0);
  const [backgrounds,  setBackgrounds]  = useState(loadBackgrounds);
  const [bgPickerOpen, setBgPickerOpen] = useState(false);
  const pickerRef = useRef(null);

  // ── Center + position all cards ─────────────────────────────
  const positionAll = useCallback((index, animate) => {
    wishlists.forEach((_, i) => {
      const el = cardRefs.current[i];
      if (!el) return;
      const props = cardProps(i - index);
      if (animate) {
        gsap.to(el, { ...props, duration: 0.48, ease: 'power3.out', overwrite: true });
      } else {
        gsap.set(el, props);
      }
    });
  }, [wishlists]);

  // ── Entrance animation ────────────────────────────────────────
  // Cards start below their resting position and float up.
  // The overlay tint fades in before the cards appear.
  useLayoutEffect(() => {
    const overlay  = overlayRef.current;
    const topBar   = topBarRef.current;
    const btmBar   = bottomBarRef.current;

    // ① Start everything invisible
    gsap.set(overlay, { opacity: 0 });
    gsap.set([topBar, btmBar], { opacity: 0, y: 12 });

    // ② Centre every card (GSAP owns the transform; CSS has no transform)
    cardRefs.current.forEach((el) => {
      if (el) gsap.set(el, { left: '50%', top: '50%', xPercent: -50, yPercent: -50 });
    });

    // ③ Set final coverflow positions instantly (opacity, x, scale…)
    positionAll(0, false);

    // ④ Override y so cards are below their destination
    cardRefs.current.forEach((el) => { if (el) gsap.set(el, { y: 72 }); });

    // ⑤ Build entrance timeline
    const tl = gsap.timeline();
    entranceTlRef.current = tl;

    // Overlay tint in
    tl.to(overlay, { opacity: 1, duration: 0.3, ease: 'power2.out' });

    // Visible cards float up — expo.out gives the smoothest deceleration
    const visibleEls = wishlists
      .map((_, i) => cardRefs.current[i])
      .filter((el, i) => el && Math.abs(i) <= 1);   // cards within ±1 of index 0

    tl.to(
      visibleEls,
      { y: 0, duration: 0.68, ease: 'expo.out', stagger: 0.055 },
      '-=0.14',
    );

    // UI chrome in
    tl.to([topBar, btmBar], { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, '-=0.5');

    return () => tl.kill();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Navigate ─────────────────────────────────────────────────
  const goTo = useCallback((next) => {
    const idx = Math.max(0, Math.min(wishlists.length - 1, next));
    if (idx === currentIdxRef.current) return;

    // Kill entrance if still running and snap everything to y:0
    if (entranceTlRef.current) {
      entranceTlRef.current.kill();
      entranceTlRef.current = null;
      cardRefs.current.forEach((el) => { if (el) gsap.set(el, { y: 0 }); });
    }

    currentIdxRef.current = idx;
    setCurrentIndex(idx);
    positionAll(idx, true);
    setBgPickerOpen(false);
  }, [wishlists.length, positionAll]);

  // ── Animated close ────────────────────────────────────────────
  const handleClose = useCallback(() => {
    if (entranceTlRef.current) {
      entranceTlRef.current.kill();
      entranceTlRef.current = null;
    }

    const idx = currentIdxRef.current;
    const visibleEls = wishlists
      .map((_, i) => cardRefs.current[i])
      .filter((el, i) => el && Math.abs(i - idx) <= 1);

    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(visibleEls,      { y: 72, opacity: 0, duration: 0.3, ease: 'power2.in', stagger: 0.04 });
    tl.to(overlayRef.current, { opacity: 0, duration: 0.25, ease: 'power2.in' }, '-=0.18');
  }, [onClose, wishlists]);

  // ── Keyboard navigation ────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  goTo(currentIndex - 1);
      if (e.key === 'ArrowRight') goTo(currentIndex + 1);
      if (e.key === 'Escape')     handleClose();
      if (e.key === 'Enter' && wishlists[currentIndex]) onSelect(wishlists[currentIndex].id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentIndex, goTo, handleClose, wishlists, onSelect]);

  // ── Close bg-picker on outside click ─────────────────────────
  useEffect(() => {
    if (!bgPickerOpen) return;
    const onDown = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) setBgPickerOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [bgPickerOpen]);

  // ── Background helpers ────────────────────────────────────────
  const applyBg = (id, v) => {
    const u = { ...backgrounds, [id]: v };
    setBackgrounds(u);
    saveBackgrounds(u);
    setBgPickerOpen(false);
  };
  const handleUpload = (id, file) => applyBg(id, `url(${URL.createObjectURL(file)})`);

  const active = wishlists[currentIndex];

  // ── Render ───────────────────────────────────────────────────
  return (
    // Clicking the backdrop (not the content) closes the overlay
    <div className={styles.overlay} ref={overlayRef} onClick={handleClose}>

      {/* ── Top bar ────────────────────────────────────── */}
      <div
        className={styles.topBar}
        ref={topBarRef}
        onClick={(e) => e.stopPropagation()}
      >
        <span className={styles.counter}>
          {wishlists.length > 0 ? `${currentIndex + 1} / ${wishlists.length}` : ''}
        </span>
        <h2 className={styles.title}>Suas Coleções</h2>
        <button className={styles.closeBtn} onClick={handleClose} aria-label="Fechar">✕</button>
      </div>

      {/* ── Carousel area ──────────────────────────────── */}
      <div className={styles.carouselArea}>

        {/* Arrows — stop propagation so they don't close the overlay */}
        <button
          className={`${styles.arrow} ${styles.arrowLeft} ${currentIndex === 0 ? styles.arrowHidden : ''}`}
          onClick={(e) => { e.stopPropagation(); goTo(currentIndex - 1); }}
          aria-label="Anterior"
        >‹</button>

        {/* Cards — absolutely positioned and centred via GSAP */}
        {wishlists.length === 0 ? (
          <p className={styles.empty}>Nenhuma coleção ainda.</p>
        ) : (
          wishlists.map((wishlist, i) => {
            const savedBg = backgrounds[wishlist.id];
            const bgInline = resolvedBgStyle(savedBg); // null → pure glass

            return (
              <div
                key={wishlist.id}
                className={styles.card}
                ref={(el) => (cardRefs.current[i] = el)}
                style={bgInline || undefined}            // undefined → CSS glass default
                onClick={(e) => {
                  e.stopPropagation();
                  if (i !== currentIndex) goTo(i);
                }}
                role={i !== currentIndex ? 'button' : undefined}
                aria-label={i !== currentIndex ? `Selecionar ${wishlist.artistName}` : undefined}
              >
                {/* Bottom gradient so text stays legible over any background */}
                <div className={styles.cardOverlay} />

                <div className={styles.cardContent}>
                  {wishlist.artistPhotoUrl && (
                    <img
                      src={wishlist.artistPhotoUrl}
                      alt={wishlist.artistName}
                      className={styles.artistPhoto}
                    />
                  )}
                  <h3 className={styles.artistName}>{wishlist.artistName}</h3>
                  <p className={styles.collCount}>
                    {wishlist.collections.length}{' '}
                    {wishlist.collections.length === 1 ? 'álbum' : 'álbuns'}
                  </p>
                </div>
              </div>
            );
          })
        )}

        <button
          className={`${styles.arrow} ${styles.arrowRight} ${currentIndex >= wishlists.length - 1 ? styles.arrowHidden : ''}`}
          onClick={(e) => { e.stopPropagation(); goTo(currentIndex + 1); }}
          aria-label="Próximo"
        >›</button>
      </div>

      {/* ── Bottom action bar ───────────────────────────── */}
      {active && (
        <div
          className={styles.bottomBar}
          ref={bottomBarRef}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.actionRow}>
            <button className={styles.openBtn} onClick={() => onSelect(active.id)}>
              Abrir Coleção
            </button>

            {/* Background picker */}
            <div className={styles.bgWrapper} ref={pickerRef}>
              <button
                className={`${styles.bgBtn} ${bgPickerOpen ? styles.bgBtnActive : ''}`}
                onClick={() => setBgPickerOpen((o) => !o)}
                title="Alterar background"
                aria-label="Alterar background"
              >🎨</button>

              {bgPickerOpen && (
                <div className={styles.bgPicker}>
                  <p className={styles.bgPickerLabel}>Fundo da coleção</p>
                  <div className={styles.swatchGrid}>
                    {SYSTEM_BACKGROUNDS.map((bg) => (
                      <button
                        key={bg.id}
                        className={styles.swatch}
                        style={{ background: bg.value }}
                        title={bg.label}
                        onClick={() => applyBg(active.id, bg.value)}
                      />
                    ))}
                  </div>
                  <label className={styles.uploadLabel}>
                    📁 Upload do PC
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => e.target.files[0] && handleUpload(active.id, e.target.files[0])}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Dot indicators */}
          {wishlists.length > 1 && (
            <div className={styles.dots}>
              {wishlists.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ''}`}
                  onClick={() => goTo(i)}
                  aria-label={`Coleção ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CollectionPickerOverlay;
