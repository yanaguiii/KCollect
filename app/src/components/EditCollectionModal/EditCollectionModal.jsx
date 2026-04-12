import { useState } from 'react';
import styles from '../common/Modal.module.css';

function EditCollectionModal({ collection, onClose, onSave }) {
    // O estado do input começa com o nome atual da coleção
    const [collectionName, setCollectionName] = useState(collection.name);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (collectionName.trim() === '') {
            alert('O nome da coleção é obrigatório.');
            return;
        }
        // Chama a função onSave (que é a handleEditCollectionName do App)
        onSave(collection.wishlistId, collection.id, collectionName);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2>Editar Coleção</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="collectionName">Nome da Coleção</label>
                        <input
                            type="text"
                            id="collectionName"
                            value={collectionName}
                            onChange={(e) => setCollectionName(e.target.value)}
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

export default EditCollectionModal;