// src/components/Wishlist/Wishlist.jsx
import { useState } from 'react';
import Collection from '../Collection/Collection';
import styles from './Wishlist.module.css';

// 1. A lista de props agora inclui a função onAddCollection vinda do App
function Wishlist({
                      wishlist,
                      onAddCollection,
                      onOpenEditModal,
                      onOpenDeleteModal,
                      onAddCard,
                      onToggleCardOwned
                  }) {
    const [openMenuId, setOpenMenuId] = useState(null);

    // 2. A função 'addCollection' que existia aqui foi REMOVIDA.

    return (
        <div className={styles.wishlistContainer}>
            <div className={styles.header}>
                <div className={styles.artistInfo}>
                    {wishlist.artistPhotoUrl && (
                        <img
                            src={wishlist.artistPhotoUrl}
                            alt={wishlist.artistName}
                            className={styles.artistPhoto}
                        />
                    )}
                    <h2>{wishlist.artistName}</h2>
                </div>

                {/* 3. O botão agora chama a função que veio via props, passando o ID da wishlist atual */}
                <button onClick={() => onAddCollection(wishlist.id)} className={styles.actionButton}>
                    Adicionar Coleção
                </button>
            </div>

            <div>
                {wishlist.collections.length > 0 ? (
                    wishlist.collections.map(collection => (
                        <Collection
                            key={collection.id}
                            collection={collection}
                            wishlistId={wishlist.id}
                            onOpenEditModal={onOpenEditModal}
                            onOpenDeleteModal={onOpenDeleteModal}
                            onAddCard={onAddCard}
                            onToggleCardOwned={onToggleCardOwned}
                            isMenuOpen={openMenuId === collection.id}
                            onToggleMenu={() => setOpenMenuId(openMenuId === collection.id ? null : collection.id)}
                        />
                    ))
                ) : (
                    <p className={styles.emptyMessage}>Esta wishlist ainda não tem coleções. Adicione uma!</p>
                )}
            </div>
        </div>
    );
}

export default Wishlist;