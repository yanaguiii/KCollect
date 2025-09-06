import styles from './Header.module.css';

function Header({ theme, setTheme, wishlists, activeWishlistId, setActiveWishlistId, onAddWishlist, onOpenEditWishlistModal, onOpenDeleteWishlistModal }) {
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <header className={styles.header}>
            <div className={styles.leftSection}>
                <h1 className={styles.title}>K-Collect</h1>
                <select
                    className={styles.wishlistSelector}
                    value={activeWishlistId || ''}
                    onChange={(e) => setActiveWishlistId(e.target.value)}
                    disabled={wishlists.length === 0}
                >
                    {/* Adiciona uma opção default se nada estiver selecionado */}
                    {wishlists.length === 0 && <option>Nenhuma wishlist</option>}
                    {wishlists.map(w => (
                        <option key={w.id} value={w.id}>{w.artistName}</option>
                    ))}
                </select>

                {activeWishlistId && (
                    <div className={styles.wishlistActions}>
                        <button className={`${styles.actionButton} ${styles.editButton}`} onClick={onOpenEditWishlistModal}>Editar</button>
                        <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={onOpenDeleteWishlistModal}>Remover</button>
                    </div>
                )}

                <button className={styles.actionButton} onClick={onAddWishlist}>Adicionar Wishlist</button>
            </div>
            <div className={styles.rightSection}>
                <button className={styles.themeButton} onClick={toggleTheme}>
                    Mudar para tema {theme === 'light' ? 'Escuro' : 'Claro'}
                </button>
            </div>
        </header>
    );
}
export default Header;