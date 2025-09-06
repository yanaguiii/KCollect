import styles from '../common/Modal.module.css';

// 1. Receba props mais genéricas: 'item' e 'itemType'
function DeleteConfirmationModal({ item, itemType, onClose, onConfirm }) {

    // 2. A função de confirmar AGORA APENAS CHAMA onConfirm.
    // A lógica de qual item deletar fica toda no App.jsx!
    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2>Confirmar Exclusão</h2>
                <p>
                    {/* 3. Use as props genéricas para montar a mensagem */}
                    Tem certeza que deseja excluir a {itemType} <strong>"{item.name}"</strong>?
                    <br />
                    Esta ação não pode ser desfeita.
                </p>
                <div className={styles.formActions}>
                    <button type="button" className={styles.cancelButton} onClick={onClose}>
                        Cancelar
                    </button>
                    <button type="button" className={styles.saveButton} style={{backgroundColor: '#e53e3e'}} onClick={handleConfirm}>
                        Sim, Excluir
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmationModal;