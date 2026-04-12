import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './LandingPage.module.css';

const MENU_ITEMS = [
  { label: 'Nova Coleção',   icon: '✦', key: 'new'      },
  { label: 'Abrir Coleção',  icon: '◎', key: 'open'     },
  { label: 'Meu Perfil',     icon: '♡', key: 'profile'  },
  { label: 'Configurações',  icon: '⚙', key: 'settings' },
];

function LandingPage({ onNewCollection, onOpenCollection, onProfile, onSettings }) {
  const titleRef   = useRef(null);
  const taglineRef = useRef(null);
  const menuRef    = useRef(null);
  const orbRef     = useRef(null);

  const handlers = {
    new:      onNewCollection,
    open:     onOpenCollection,
    profile:  onProfile,
    settings: onSettings,
  };

  useEffect(() => {
    // Pulsing orb background
    gsap.to(orbRef.current, {
      scale: 1.18,
      duration: 4.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    // Entrance sequence
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: -24 },
      { opacity: 1, y: 0, duration: 0.75 }
    )
      .fromTo(
        taglineRef.current,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.55 },
        '-=0.45'
      )
      .fromTo(
        Array.from(menuRef.current.children),
        { opacity: 0, y: 28, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.5 },
        '-=0.25'
      );

    return () => tl.kill();
  }, []);

  return (
    <div className={styles.landing}>
      {/* Ambient orb */}
      <div className={styles.orb} ref={orbRef} />
      {/* Subtle grain texture */}
      <div className={styles.grain} />

      <div className={styles.content}>
        {/* Wordmark */}
        <div ref={titleRef} className={styles.brandRow}>
          <span className={styles.brandAccent}>✦</span>
          <h1 className={styles.brand}>K Collect</h1>
          <span className={styles.brandAccent}>✦</span>
        </div>

        {/* Tagline */}
        <p ref={taglineRef} className={styles.tagline}>
          Sua coleção de photocards
        </p>

        {/* Menu buttons */}
        <nav ref={menuRef} className={styles.menu}>
          {MENU_ITEMS.map(({ label, icon, key }) => (
            <button
              key={key}
              className={styles.menuBtn}
              onClick={handlers[key]}
            >
              <span className={styles.btnIcon}>{icon}</span>
              <span className={styles.btnLabel}>{label}</span>
              <span className={styles.btnArrow}>→</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default LandingPage;
