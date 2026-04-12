import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import styles from './CollectionPickerOverlay.module.css';

// ── System default backgrounds ──────────────────────────────────
// To add real images: { id:'img-1', label:'Name', value:'/backgrounds/bg1.jpg', isImage:true }
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
function bgStyle(raw) {
  if (!raw)             return { background: SYSTEM_BACKGROUNDS[0].value };
  if (raw.startsWith('url(')) return { backgroundImage: raw, backgroundSize: 'cover', backgroundPosition: 'center' };
  return { background: raw };
}

// ── Carousel step distance (responsive) ────────────────────────
const stepX = () => Math.min(window.innerWidth * 0.4, 520);

// ── Per-card GSAP props based on distance from active ──────────
function cardGsapProps(offset) {
  const abs = Math.abs(offset);
  return {
    x:            offset * stepX(),
    scale:        1 - Math.min(abs, 2) * 0.16,
    opacity:      abs === 0 ? 1 : abs === 1 ? 0.48 : 0,
    filter:       `blur(${abs <= 1 ? abs * 2.5 : 6}px)`,
    zIndex:       abs === 0 ? 10 : abs === 1 ? 4 : 0,
    pointerEvents: abs <= 1 ? 'auto' : 'none',
  };
}

function CollectionPickerOverlay({ wishlists, onSelect, onClose }) {
  const overlayRef = useRef(null);
  const cardRefs   = useRef([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [backgrounds,  setBackgrounds]  = useState(loadBackgrounds);
  const [bgPickerOpen, setBgPickerOpen] = useState(false);
  const pickerRef = useRef(null);

  // ── Position all cards (instant or animated) ─────────────────
  const positionAll = useCallback((index, animate) => {
    wishlists.forEach((_, i) => {
      const el = cardRefs.current[i];
      if (!el) return;
      const props = cardGsapProps(i - index);
      animate
        ? gsap.to(el,  { ...props, duration: 0.52, ease: 'power3.out', overwrite: 'auto' })
        : gsap.set(el, props);
    });
  }, [wishlists]);

  // ── Initial render: set positions then fade overlay in ───────
  useLayoutEffect(() => {
    gsap.set(overlayRef.current, { opacity: 0 });
    positionAll(0, false);
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.38, ease: 'power2.out' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Navigate ─────────────────────────────────────────────────
  const goTo = useCallback((next) => {
    const idx = Math.max(0, Math.min(wishlists.length - 1, next));
    setCurrentIndex(idx);
    positionAll(idx, true);
    setBgPickerOpen(false);
  }, [wishlists.length, positionAll]);

  // ── Keyboard navigation ───────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  goTo(currentIndex - 1);
      if (e.key === 'ArrowRight') goTo(currentIndex + 1);
      if (e.key === 'Escape')     handleClose();
      if (e.key === 'Enter' && wishlists[currentIndex]) {
        onSelect(wishlists[currentIndex].id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, goTo]);

  // ── Close bg-picker when clicking outside ─────────────────────
  useEffect(() => {
    if (!bgPickerOpen) return;
    const onDown = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setBgPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [bgPickerOpen]);

  // ── Animated close ────────────────────────────────────────────
  const handleClose = () => {
    gsap.to(overlayRef.current, {
      opacity: 0, duration: 0.25, ease: 'power2.in', onComplete: onClose,
    });
  };

  // ── Background helpers ────────────────────────────────────────
  const getBg     = (id)    => backgrounds[id] || SYSTEM_BACKGROUNDS[0].value;
  const applyBg   = (id, v) => {
    const u = { ...backgrounds, [id]: v };
    setBackgrounds(u);
    saveBackgrounds(u);
    setBgPickerOpen(false);
  };
  const handleUpload = (id, file) => applyBg(id, `url(${URL.createObjectURL(file)})`);

  const active = wishlists[currentIndex];

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className={styles.overlay} ref={overlayRef}>

      {/* ── Top bar ─────────────────────────────────── */}
      <div className={styles.topBar}>
        <p className={styles.topLabel}>
          {wishlists.length > 0 ? `${currentIndex + 1} / ${wishlists.length}` : ''}
        </p>
        <h2 className={styles.topTitle}>Suas Coleções</h2>
        <button className={styles.closeBtn} onClick={handleClose} aria-label="Fechar">✕</button>
      </div>

      {/* ── Carousel area ────────────────────────────── */}
      <div className={styles.carouselArea}>
        {/* Left arrow */}
        <button
          className={`${styles.arrow} ${styles.arrowLeft} ${currentIndex === 0 ? styles.arrowHidden : ''}`}
          onClick={() => goTo(currentIndex - 1)}
          aria-label="Anterior"
          tabIndex={currentIndex === 0 ? -1 : 0}
        >
          ‹
        </button>

        {/* Cards track */}
        <div className={styles.track}>
          {wishlists.length === 0 ? (
            <div className={styles.empty}>Nenhuma coleção ainda.</div>
          ) : (
            wishlists.map((wishlist, i) => (
              <div
                key={wishlist.id}
                className={styles.card}
                ref={(el) => (cardRefs.current[i] = el)}
                style={bgStyle(getBg(wishlist.id))}
                onClick={() => i !== currentIndex && goTo(i)}
                role={i !== currentIndex ? 'button' : undefined}
                aria-label={i !== currentIndex ? `Ir para ${wishlist.artistName}` : undefined}
              >
                <div className={styles.cardGlow} />
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
            ))
          )}
        </div>

        {/* Right arrow */}
        <button
          className={`${styles.arrow} ${styles.arrowRight} ${currentIndex === wishlists.length - 1 ? styles.arrowHidden : ''}`}
          onClick={() => goTo(currentIndex + 1)}
          aria-label="Próximo"
          tabIndex={currentIndex === wishlists.length - 1 ? -1 : 0}
        >
          ›
        </button>
      </div>

      {/* ── Bottom bar ───────────────────────────────── */}
      {active && (
        <div className={styles.bottomBar}>
          <div className={styles.actionRow}>
            {/* Open button */}
            <button
              className={styles.openBtn}
              onClick={() => onSelect(active.id)}
            >
              Abrir Coleção
            </button>

            {/* Background picker */}
            <div className={styles.bgWrapper} ref={pickerRef}>
              <button
                className={`${styles.bgBtn} ${bgPickerOpen ? styles.bgBtnActive : ''}`}
                onClick={() => setBgPickerOpen(o => !o)}
                title="Alterar background"
                aria-label="Alterar background"
              >
                🎨
              </button>

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
