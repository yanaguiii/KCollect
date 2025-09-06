import { useState } from 'react';
import styles from '../common/Modal.module.css';

// Adicionamos a nova prop 'label' para o texto do campo de input
function InputModal({ isOpen, onClose, onSubmit, title, label }) {
    const [inputValue, setInputValue] = useState('');

    if (!isOpen) {
        return null;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue && inputValue.trim() !== '') {
            onSubmit(inputValue.trim());
            setInputValue('');
            onClose();
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2>{title}</h2>
                <form onSubmit={handleSubmit}>
                    {/* Estrutura de formGroup e label adicionada para consistência */}
                    <div className={styles.formGroup}>
                        <label htmlFor="modalInput">{label}</label>
                        <input
                            type="text"
                            id="modalInput"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ex: FEARLESS"
                            required
                            autoFocus
                        />
                    </div>
                    {/* formActions e nomes de classe dos botões padronizados */}
                    <div className={styles.formActions}>
                        <button type="button" className={styles.cancelButton} onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className={styles.saveButton}>
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default InputModal;