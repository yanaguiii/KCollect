import { useState } from 'react';
import styles from '../common/Modal.module.css';

// 1. Mude a prop de 'collection' para 'wishlist'
function EditWishlistModal({ wishlist, onClose, onSave }) {
    // 2. Use 'artistName' da wishlist, não 'name' da coleção
    const [artistName, setArtistName] = useState(wishlist.artistName);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (artistName.trim() === '') {
            alert('O nome do artista é obrigatório.');
            return;
        }
        // 3. Chame onSave apenas com o novo nome. O App.jsx já sabe o ID.
        onSave(artistName);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                {/* 4. Mude os textos para refletir a edição da Wishlist */}
                <h2>Editar Wishlist</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="artistName">Nome do Artista / Grupo</label>
                        <input
                            type="text"
                            id="artistName"
                            value={artistName}
                            onChange={(e) => setArtistName(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formActions}>
                        <button type="button" className={styles.cancelButton} onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className={styles.saveButton}>
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditWishlistModal;