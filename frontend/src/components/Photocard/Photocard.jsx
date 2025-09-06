// src/components/Photocard/Photocard.jsx
import styles from './Photocard.module.css';

function Photocard({ card, onToggleOwned }) {
    return (
        // Adicionamos a classe 'owned' ao container principal se for possuído
        <div
            className={`${styles.cardContainer} ${card.owned ? styles.owned : ''}`}
            onClick={onToggleOwned}
        >
            <img
                src={card.imageUrl}
                alt="Photocard"
                className={styles.cardImage}
            />
        </div>
    );
}

export default Photocard;