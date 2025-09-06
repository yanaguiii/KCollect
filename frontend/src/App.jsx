import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Wishlist from './components/Wishlist/Wishlist';
import AddWishlistModal from './components/AddWishlistModal/AddWishlistModal';
import EditCollectionModal from './components/EditCollectionModal/EditCollectionModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal/DeleteConfirmationModal';
import InputModal from './components/InputModal/InputModal';
import './App.css';
import EditWishlistModal from "./components/EditWishlistModal/EditWishlistModal.jsx";

const API_URL = "http://localhost:5228"

function App() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetWishlistId, setTargetWishlistId] = useState(null);

  const [wishlists, setWishlists] = useState([]);
  const [activeWishlistId, setActiveWishlistId] = useState(null);

  // Estado para controlar o tema (claro/escuro).
  const [theme, setTheme] = useState('light');

  const [isAddWishlistModalOpen, setIsAddWishlistModalOpen] = useState(false);

  // <<< 2. NOVOS ESTADOS PARA CONTROLAR A EDIÇÃO E EXCLUSÃO >>>
  const [editingCollection, setEditingCollection] = useState(null);
  const [deletingCollection, setDeletingCollection] = useState(null);

  const [editingWishlist, setEditingWishlist] = useState(null);
  const [deletingWishlist, setDeletingWishlist] = useState(null);

  // --- EFEITOS (useEffect) ---
    useEffect(() => {
        // Função assíncrona para buscar os dados
        const fetchWishlists = async () => {
            try {
                const response = await fetch(`${API_URL}/api/wishlists`);
                const data = await response.json();
                setWishlists(data);

                // Lógica para definir a primeira wishlist como ativa
                if (data.length > 0) {
                    setActiveWishlistId(data[0].id);
                }
            } catch (error) {
                console.error("Falha ao buscar dados da API:", error);
            }
        };

        fetchWishlists();
    }, []); // O array vazio [] garante que isso só rode uma vez.




  // --- FUNÇÕES DE MANIPULAÇÃO ---

  // <<< FUNÇÃO ATUALIZADA >>>
  // Esta função agora recebe os dados que vêm do MODAL. Ela não usa mais o prompt().
  const handleAddWishlist = (artistName, photoFile) => {
    let photoUrl = ''; // Começa com uma URL vazia.

    if (photoFile) {
      photoUrl = URL.createObjectURL(photoFile);
    }

    // Cria o novo objeto da wishlist com os dados recebidos.
    const newWishlist = {
      id: `wish_${Date.now()}`,
      artistName: artistName,
      artistPhotoUrl: photoUrl,
      collections: []
    };

    // Atualiza o estado principal com a nova wishlist.
    const updatedWishlists = [...wishlists, newWishlist];
    setWishlists(updatedWishlists);

    // Define a wishlist recém-criada como a ativa.
    setActiveWishlistId(newWishlist.id);

    // Fecha o modal.
    setIsAddWishlistModalOpen(false); // <-- CORRETO
  };

  const handleEditWishlistName = (wishlistId, newName) => {
    const updatedWishlists = wishlists.map(w =>
        w.id === wishlistId ? { ...w, artistName: newName } : w
    );
    setWishlists(updatedWishlists);
    setEditingWishlist(null); // Fecha o modal após salvar
  };

    const handleDeleteWishlist = async (wishlistId) => {
        try {
            // 1. Faz a chamada DELETE para a API
            const response = await fetch(`${API_URL}/api/wishlists/${wishlistId}`, {
                method: 'DELETE',
            });

            // 2. Se a API respondeu com sucesso...
            if (response.ok) {
                // 3. ...aí sim atualizamos o estado local para refletir a mudança na UI.
                const updatedWishlists = wishlists.filter(w => w.id !== wishlistId);
                setWishlists(updatedWishlists);

                if (activeWishlistId === wishlistId) {
                    const newActiveId = updatedWishlists.length > 0 ? updatedWishlists[0].id : null;
                    setActiveWishlistId(newActiveId);
                }
            } else {
                // Se der erro, podemos notificar o usuário
                alert("Falha ao deletar a wishlist.");
            }
        } catch (error) {
            console.error("Erro ao deletar wishlist:", error);
        }

        setDeletingWishlist(null);
    };

  // 3. ADAPTE A FUNÇÃO ANTIGA PARA APENAS ABRIR O MODAL
  const handleAddCollection = (wishlistId) => {
    setTargetWishlistId(wishlistId); // Guarda o ID da wishlist alvo
    setIsModalOpen(true); // Abre o modal
  };

  // 4. CRIE A NOVA FUNÇÃO QUE SERÁ CHAMADA PELO MODAL
  const handleConfirmAddCollection = (collectionName) => {
    if (!targetWishlistId) return; // Segurança

    const newCollection = {
      id: `coll_${Date.now()}`,
      name: collectionName, // O nome vem do input do modal
      cards: [],
    };


    // Lógica para adicionar a coleção na wishlist correta
    const updatedWishlists = wishlists.map((wishlist) => {
      if (wishlist.id === targetWishlistId) {
        return {
          ...wishlist,
          collections: [...wishlist.collections, newCollection],
        };
      }
      return wishlist;
    });

    setWishlists(updatedWishlists);
    setTargetWishlistId(null); // Limpa o ID alvo
  };


  const handleDeleteCollection = (wishlistId, collectionId) => {
    setWishlists(prev => prev.map(w => {
      if (w.id === wishlistId) {
        const updatedCollections = w.collections.filter(c => c.id !== collectionId);
        return { ...w, collections: updatedCollections };
      }
      return w;
    }));
    setDeletingCollection(null); // Fecha o modal após deletar
  };

  const handleEditCollectionName = (wishlistId, collectionId, newName) => {
    setWishlists(prev =>
        // Mapeia cada wishlist
        prev.map(w => {
          // Se não for a wishlist que queremos alterar, retorna ela sem modificações
          if (w.id !== wishlistId) {
            return w;
          }

          // Se for a wishlist correta, mapeia as coleções dentro dela
          const updatedCollections = w.collections.map(c => {
            // Se não for a coleção que queremos alterar, retorna ela sem modificações
            if (c.id !== collectionId) {
              return c;
            }
            // Se for a coleção correta, retorna um NOVO objeto da coleção com o nome atualizado
            return { ...c, name: newName };
          });

          // Retorna um NOVO objeto da wishlist com as coleções atualizadas
          return { ...w, collections: updatedCollections };
        })
    );

    // Fecha o modal de edição após salvar
    setEditingCollection(null);
  };

  // <<< NOVA FUNÇÃO PARA ADICIONAR UM CARD >>>
  const handleAddCard = (wishlistId, collectionId, imageFile) => {
    const imageUrl = URL.createObjectURL(imageFile);
    const newCard = {
      id: `card_${Date.now()}`,
      imageUrl: imageUrl,
      owned: true
    };

    setWishlists(prev => prev.map(w => {
      if (w.id === wishlistId) {
        const updatedCollections = w.collections.map(c => {
          if (c.id === collectionId) {
            return { ...c, cards: [...c.cards, newCard] };
          }
          return c;
        });
        return { ...w, collections: updatedCollections };
      }
      return w;
    }));
  };

  // <<< NOVA FUNÇÃO PARA MARCAR/DESMARCAR UM CARD >>>
  const handleToggleCardOwned = (wishlistId, collectionId, cardId) => {
    setWishlists(prev => prev.map(w => {
      if (w.id === wishlistId) {
        const updatedCollections = w.collections.map(c => {
          if (c.id === collectionId) {
            const updatedCards = c.cards.map(card =>
                card.id === cardId ? { ...card, owned: !card.owned } : card
            );
            return { ...c, cards: updatedCards };
          }
          return c;
        });
        return { ...w, collections: updatedCollections };
      }
      return w;
    }));
  };


  // Encontra a wishlist atualmente ativa para ser exibida.
  const activeWishlist = wishlists.find(w => w.id === activeWishlistId);


  // --- RENDERIZAÇÃO DO COMPONENTE ---

  return (
      <>
        <Header
            theme={theme}
            setTheme={setTheme}
            wishlists={wishlists}
            activeWishlistId={activeWishlistId}
            setActiveWishlistId={setActiveWishlistId}
            onAddWishlist={() => setIsAddWishlistModalOpen(true)}
            onOpenEditWishlistModal={() => setEditingWishlist(activeWishlist)}
            onOpenDeleteWishlistModal={() => setDeletingWishlist(activeWishlist)}
        />
        <main>
          {activeWishlist ? (
              <Wishlist
                  key={activeWishlist.id}
                  wishlist={activeWishlist}
                  onOpenEditModal={(wishlistId, collectionId) => {
                    const collection = wishlists.find(w => w.id === wishlistId)?.collections.find(c => c.id === collectionId);
                    if(collection) setEditingCollection({wishlistId, ...collection});
                  }}
                  onOpenDeleteModal={(wishlistId, collectionId) => {
                    const collection = wishlists.find(w => w.id === wishlistId)?.collections.find(c => c.id === collectionId);
                    if(collection) setDeletingCollection({wishlistId, ...collection});
                  }}

                  onAddCollection={handleAddCollection}
                  onAddCard={handleAddCard}
                  onToggleCardOwned={handleToggleCardOwned}
              />
          ) : (
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h2>Bem-vindo ao K-Collect!</h2>
                <p>Crie sua primeira wishlist clicando no botão "Adicionar Wishlist" no topo.</p>
              </div>
          )}
        </main>

        {/* --- Seção de Modais --- */}

        {/* Modal para adicionar Wishlist (que você já tinha) */}
        {isAddWishlistModalOpen && (
            <AddWishlistModal
                onClose={() => setIsAddWishlistModalOpen(false)}
                onSave={handleAddWishlist}
            />
        )}

        {/* Modal para editar Coleção (que você já tinha) */}
        {editingCollection && (
            <EditCollectionModal
                collection={editingCollection}
                onClose={() => setEditingCollection(null)}
                onSave={handleEditCollectionName}
            />
        )}

        {/* Modal para deletar Coleção */}
        {deletingCollection && (
            <DeleteConfirmationModal
                item={deletingCollection} // Passe o objeto da coleção
                itemType="coleção"        // Diga o tipo
                onClose={() => setDeletingCollection(null)}
                // Passe a função exata a ser executada
                onConfirm={() => handleDeleteCollection(deletingCollection.wishlistId, deletingCollection.id)}
            />
        )}

        {/* Modal para editar a Wishlist */}
        {editingWishlist && (
            <EditWishlistModal // O componente que corrigimos no Passo 2
                wishlist={editingWishlist}
                onClose={() => setEditingWishlist(null)}
                onSave={(newName) => handleEditWishlistName(editingWishlist.id, newName)}
            />
        )}

        {/* Modal para deletar a Wishlist */}
        {deletingWishlist && (
            <DeleteConfirmationModal
                // Passe o objeto da wishlist adaptado
                item={{ name: deletingWishlist.artistName }}
                itemType="wishlist" // Diga o tipo
                onClose={() => setDeletingWishlist(null)}
                // Passe a função exata a ser executada
                onConfirm={() => handleDeleteWishlist(deletingWishlist.id)}
            />
        )}

        {/*
          Ele será controlado pelo estado 'isModalOpen' que criamos.
        */}
        <InputModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleConfirmAddCollection}
            title="Adicionar Nova Coleção"
        />
      </>
  );
}

export default App;