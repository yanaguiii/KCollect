import { useState } from 'react';
import styles from '../common/Modal.module.css';

function AddWishlistModal({ onClose, onSave }) {
  const [artistName, setArtistName] = useState('');
  const [photoFile,  setPhotoFile]  = useState(null);
  const [preview,    setPreview]    = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (artistName.trim() === '') {
      alert('O nome é obrigatório.');
      return;
    }
    onSave(artistName.trim(), photoFile);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Nova Coleção</h2>
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
            <label htmlFor="artistPhoto">Foto de Perfil (opcional)</label>
            <input
              type="file"
              id="artistPhoto"
              accept="image/*"
              onChange={handleFileChange}
            />
            {preview && (
              <img
                src={preview}
                alt="preview"
                style={{
                  marginTop: '10px',
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--accent-color)',
                }}
              />
            )}
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveButton}>
              Criar Coleção
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddWishlistModal;
