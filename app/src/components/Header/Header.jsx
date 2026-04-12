import styles from './Header.module.css';

function Header({
  theme,
  setTheme,
  wishlists,
  activeWishlistId,
  setActiveWishlistId,
  onAddWishlist,
  onOpenEditWishlistModal,
  onOpenDeleteWishlistModal,
  onBackToLanding,
}) {
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        {/* Back to landing */}
        <button
          className={styles.backBtn}
          onClick={onBackToLanding}
          title="Voltar ao menu"
          aria-label="Voltar ao menu"
        >
          ←
        </button>

        <h1 className={styles.title}>K Collect</h1>

        <select
          className={styles.wishlistSelector}
          value={activeWishlistId || ''}
          onChange={(e) => setActiveWishlistId(e.target.value)}
          disabled={wishlists.length === 0}
        >
          {wishlists.length === 0 && <option>Nenhuma coleção</option>}
          {wishlists.map(w => (
            <option key={w.id} value={w.id}>{w.artistName}</option>
          ))}
        </select>

        {activeWishlistId && (
          <div className={styles.wishlistActions}>
            <button
              className={`${styles.actionButton} ${styles.editButton}`}
              onClick={onOpenEditWishlistModal}
            >
              Editar
            </button>
            <button
              className={`${styles.actionButton} ${styles.deleteButton}`}
              onClick={onOpenDeleteWishlistModal}
            >
              Remover
            </button>
          </div>
        )}

        <button className={styles.actionButton} onClick={onAddWishlist}>
          + Nova Coleção
        </button>
      </div>

      <div className={styles.rightSection}>
        <button className={styles.themeButton} onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Escuro' : '☀️ Claro'}
        </button>
      </div>
    </header>
  );
}

export default Header;
