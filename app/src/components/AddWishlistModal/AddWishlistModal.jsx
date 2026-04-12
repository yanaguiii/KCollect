import { useState } from 'react';
import styles from '../common/Modal.module.css';

function AddWishlistModal({ onClose, onSave }) {
    const [artistName, setArtistName] = useState('');
    const [photoFile, setPhotoFile] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (artistName.trim() === '') {
            alert('O nome do artista é obrigatório.');
            return;
        }
        // Chama a função onSave que foi passada pelo App.jsx, enviando os dados para lá
        onSave(artistName, photoFile);
    };

    const handleFileChange = (event) => {
        setPhotoFile(event.target.files[0]);
    };

    return (
        // O Fundo escurecido. Clicar aqui fecha o modal.
        <div className={styles.modalOverlay} onClick={onClose}>
            {/* O conteúdo do modal. Clicar aqui dentro NÃO fecha. */}
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2>Criar Nova Wishlist</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="artistName">Nome do Artista / Grupo</label>
                        <input
                            type="text"
                            id="artistName"
                            value={artistName}
                            onChange={(e) => setArtistName(e.target.value)}
                            placeholder="Ex: LE SSERAFIM"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="artistPhoto">Foto de Perfil (Opcional)</label>
                        <input
                            type="file"
                            id="artistPhoto"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className={styles.formActions}>
                        <button type="button" className={styles.cancelButton} onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className={styles.saveButton}>
                            Salvar Wishlist
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddWishlistModal;