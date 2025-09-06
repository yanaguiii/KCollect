// src/components/Collection/Collection.jsx

import Photocard from '../Photocard/Photocard';
import styles from './Collection.module.css';

// 1. A lista de props que o componente recebe de seu pai (Wishlist.jsx)
function Collection({
                        collection,
                        wishlistId,
                        isMenuOpen,
                        onToggleMenu,
                        onAddCard,
                        onToggleCardOwned,
                        onOpenEditModal,
                        onOpenDeleteModal,
                    }) {

    // --- Funções "ponte" que lidam com a interação do usuário ---

    // Esta função é chamada quando o usuário seleciona uma imagem no input.
    const handleAddCard = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (!file) return;

        // Ela apenas chama a função 'onAddCard' que veio do App.jsx,
        // passando os dados necessários para o "chefe".
        onAddCard(wishlistId, collection.id, file);
    };

    const handleEdit = () => {
        // Apenas pede para o App abrir o modal de edição para esta coleção
        onOpenEditModal(wishlistId, collection.id);
        onToggleMenu(); // Fecha o menu dropdown
    };

    const handleDelete = () => {
        // Apenas pede para o App abrir o modal de exclusão para esta coleção
        onOpenDeleteModal(wishlistId, collection.id);
        onToggleMenu(); // Fecha o menu dropdown
    };

    // --- Renderização do componente ---

    return (
        <div className={styles.collection}>
            <div className={styles.collectionHeader}>
                <h3>{collection.name}</h3>

                <button className={styles.menuButton} onClick={onToggleMenu}>
                    ✏️
                </button>

                {/* O menu dropdown só aparece se a prop 'isMenuOpen' for verdadeira */}
                {isMenuOpen && (
                    <div className={styles.dropdownMenu}>
                        <button onClick={handleEdit}>Editar Nome</button>
                        <button onClick={handleDelete} className={styles.deleteButton}>Excluir Coleção</button>
                    </div>
                )}
            </div>

            <div className={styles.gridContainer}>
                {collection.cards.map(card => (
                    <Photocard
                        key={card.id}
                        card={card}
                        // A ação de clique no card chama DIRETAMENTE a função que veio lá do App.jsx,
                        // passando todos os IDs necessários para encontrar o card correto.
                        onToggleOwned={() => onToggleCardOwned(wishlistId, collection.id, card.id)}
                    />
                ))}
                {/* O botão de adicionar card, que na verdade é um <label> */}
                <label className={styles.addCardButton}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAddCard}
                        style={{ display: 'none' }}
                    />
                    +
                </label>
            </div>
        </div>
    );
}

export default Collection;