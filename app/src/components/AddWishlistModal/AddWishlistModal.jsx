import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from './AddWishlistModal.module.css';

function AddWishlistModal({ onClose, onSave }) {
  const [artistName, setArtistName] = useState('');
  const [photoFile,  setPhotoFile]  = useState(null);
  const [preview,    setPreview]    = useState(null);
  const [error,      setError]      = useState('');

  const overlayRef  = useRef(null);
  const panelRef    = useRef(null);
  const fileRef     = useRef(null);

  // ── Entrance animation ──────────────────────────────────────
  useLayoutEffect(() => {
    gsap.set(overlayRef.current, { opacity: 0 });
    gsap.set(panelRef.current,   { opacity: 0, y: 28, scale: 0.95 });

    const tl = gsap.timeline();
    tl.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    tl.to(panelRef.current,   { opacity: 1, y: 0, scale: 1, duration: 0.48, ease: 'expo.out' }, '-=0.14');

    return () => tl.kill();
  }, []);

  // ── Animated close ──────────────────────────────────────────
  const handleClose = () => {
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(panelRef.current,   { opacity: 0, y: 20, scale: 0.96, duration: 0.22, ease: 'power2.in' });
    tl.to(overlayRef.current, { opacity: 0, duration: 0.2,  ease: 'power2.in' }, '-=0.1');
  };

  // ── Handlers ────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (artistName.trim() === '') {
      setError('O nome é obrigatório.');
      // Shake the input
      gsap.fromTo(
        panelRef.current.querySelector('input[type="text"]'),
        { x: -6 },
        { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' }
      );
      return;
    }
    onSave(artistName.trim(), photoFile);
  };

  return (
    <div className={styles.overlay} ref={overlayRef} onClick={handleClose}>
      <div className={styles.panel} ref={panelRef} onClick={(e) => e.stopPropagation()}>

        {/* Close button */}
        <button className={styles.closeBtn} onClick={handleClose} aria-label="Fechar">✕</button>

        {/* Title */}
        <div className={styles.titleRow}>
          <span className={styles.accent}>✦</span>
          <h2 className={styles.title}>Nova Coleção</h2>
          <span className={styles.accent}>✦</span>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* Photo upload */}
          <div className={styles.photoSection}>
            <button
              type="button"
              className={styles.photoBtn}
              onClick={() => fileRef.current.click()}
              aria-label="Adicionar foto de perfil"
            >
              {preview ? (
                <img src={preview} alt="preview" className={styles.photoImg} />
              ) : (
                <div className={styles.photoPlaceholder}>
                  <span className={styles.photoIcon}>+</span>
                  <span className={styles.photoHint}>Foto de perfil</span>
                </div>
              )}
              <div className={styles.photoHoverOverlay}>
                <span>Alterar</span>
              </div>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>

          {/* Name input */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="artistName">
              Nome do Artista / Grupo
            </label>
            <input
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              type="text"
              id="artistName"
              value={artistName}
              onChange={(e) => { setArtistName(e.target.value); setError(''); }}
              placeholder="Ex: LE SSERAFIM"
              autoComplete="off"
              autoFocus
            />
            {error && <p className={styles.errorMsg}>{error}</p>}
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitBtn}>
              Criar Coleção
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddWishlistModal;
