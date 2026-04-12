import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Wishlist from './components/Wishlist/Wishlist';
import AddWishlistModal from './components/AddWishlistModal/AddWishlistModal';
import EditCollectionModal from './components/EditCollectionModal/EditCollectionModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal/DeleteConfirmationModal';
import InputModal from './components/InputModal/InputModal';
import './App.css';
import EditWishlistModal from "./components/EditWishlistModal/EditWishlistModal.jsx";

const API_URL = "http://localhost:5062"

function App() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetWishlistId, setTargetWishlistId] = useState(null);
  const [wishlists, setWishlists] = useState([]);
  const [activeWishlistId, setActiveWishlistId] = useState(null);
  const [theme, setTheme] = useState('light');
  const [isAddWishlistModalOpen, setIsAddWishlistModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [deletingCollection, setDeletingCollection] = useState(null);
  const [editingWishlist, setEditingWishlist] = useState(null);
  const [deletingWishlist, setDeletingWishlist] = useState(null);

  
  
  // --- EFEITOS (useEffect) ---

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);
    
    
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
    
  const handleAddWishlist = async (artistName, photoFile) => {
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

      try {
          // 2. Faça a chamada POST para a API
          const response = await fetch(`${API_URL}/api/wishlists`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(newWishlist),
          });

          if (response.ok) {
              // 3. Se deu certo, adicione a nova wishlist (retornada pela API) ao estado local
              const createdWishlist = await response.json();
              setWishlists([...wishlists, createdWishlist]);
              setActiveWishlistId(createdWishlist.id);
              setIsAddWishlistModalOpen(false);
          } else {
              alert("Falha ao criar a wishlist.");
          }
      } catch (error) {
          console.error("Erro ao criar wishlist:", error);
      }
  };

    const handleEditWishlistName = async (wishlistId, newName) => { // 1. Transforme em async
                                                                    // Encontra a wishlist que estamos editando para enviar o objeto completo
        const wishlistToUpdate = wishlists.find(w => w.id === wishlistId);
        if (!wishlistToUpdate) return;

        const updatedWishlistData = { ...wishlistToUpdate, artistName: newName };

        try {
            // 2. Faça a chamada PUT para a API
            const response = await fetch(`${API_URL}/api/wishlists/${wishlistId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedWishlistData),
            });

            if (response.ok) {
                // 3. Se deu certo, atualize o estado local
                const updatedWishlists = wishlists.map(w =>
                    w.id === wishlistId ? { ...w, artistName: newName } : w
                );
                setWishlists(updatedWishlists);
                setEditingWishlist(null); // Fecha o modal
            } else {
                alert("Falha ao editar a wishlist.");
            }
        } catch (error) {
            console.error("Erro ao editar wishlist:", error);
        }
    };
  
  
    const handleDeleteWishlist = async (wishlistId) => {
        try {
            // 1. Faz a chamada DELETE para a API
            const response = await fetch(`${API_URL}/api/wishlists/${wishlistId}`, {
                method: 'DELETE',
            });

            // 2. Se a API respondeu com sucesso...
            if (response.ok) {
                // 3. aí sim atualizamos o estado local para refletir a mudança na UI.
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


  const handleAddCollection = async (wishlistId) => {
      setTargetWishlistId(wishlistId); // Guarda o ID da wishlist alvo
      setIsModalOpen(true); // Abre o modal
  };


  const handleConfirmAddCollection = async (collectionName) => {
      if(!targetWishlistId) return;

      const newCollection = {
          id: `coll_${Date.now()}`,
          name: collectionName,
          cards: [],
      };
      try{
          const response = await fetch(`${API_URL}/api/wishlists/${targetWishlistId}/collections`, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify(newCollection),
          });
          if (response.ok) {
              const addedCollection = await response.json();
              const updatedWishlists = wishlists.map((wishlist) => {
                  if (wishlist.id === targetWishlistId) {
                      return{
                          ...wishlist,
                          collections: [...wishlist.collections, addedCollection],
                      };
                  }
                  return wishlist;
              });
              setWishlists(updatedWishlists);
          }else{
              alert("Falha ao adicionar a coleção.");
          }
      }catch(error) {
          console.error("Erro ao adicionar coleção:", error);
      }
      setTargetWishlistId(null);
      setIsModalOpen(false);
  };


  const handleDeleteCollection = async(wishlistId, collectionId) => {
    try{
        const response = await fetch(`${API_URL}/api/wishlists/${wishlistId}/collections/${collectionId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            setWishlists(prev => prev.map(w => {
                if(w.id === wishlistId) {
                    const updatedCollections = w.collections.filter(c => c.id !== collectionId);
                    return { ...w, collections: updatedCollections };
                }
                return w;
            }));
        } else {
            alert("Falha ao deletar coleção");
        }
    }catch(error) {
        console.error("Erro ao deletar coleção:", error);
    }
    setDeletingCollection(null);
  };

  const handleEditCollectionName = async (wishlistId, collectionId, newName) => {
    const wishlist = wishlists.find(w => w.id === wishlistId);
    if (!wishlist) return;
 
    const collectionToUpdate = wishlist.collections.find(c => c.id === collectionId);
    if (!collectionToUpdate) return;
    
    const updatedCollection = {...collectionToUpdate, name: newName};
    
    try{
        const response = await fetch(`${API_URL}/api/wishlists/${wishlistId}/collections/${collectionId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updatedCollection),
        });
        
        if(response.ok){
            setWishlists(prev => prev.map(w => {
                if(w.id === wishlistId) {
                    const updatedCollections = w.collections.map(c => {
                        if(c.id === collectionId) {
                            return updatedCollection;
                        }
                        return c;
                    });
                    return { ...w, collections: updatedCollections };
                    
                }
                return w;
            }));
        } else{
            alert("Falha ao editar o nome da coleção");
        }
    }catch(error) {
        console.error("Erro ao editar nome da coleção:", error);
    }
    
    setEditingCollection(null);
  };

    const handleAddCard = async (wishlistId, collectionId, imageFile) => { // 1. Torna a função async
                                                                           // A criação da URL da imagem continua sendo feita no frontend por enquanto.
        const imageUrl = URL.createObjectURL(imageFile);

        // Cria o objeto do novo card para enviar à API
        const newCard = {
            id: `card_${Date.now()}`,
            imageUrl: imageUrl,
            owned: true
        };

        try {
            // 2. Faz a chamada POST para o endpoint de cards que criamos
            const response = await fetch(`${API_URL}/api/wishlists/${wishlistId}/collections/${collectionId}/cards`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCard),
            });

            if (response.ok) {
                // 3. Se a API confirmou, atualiza o estado local do React para exibir o novo card
                const addedCard = await response.json();
                setWishlists(prev => prev.map(w => {
                    if (w.id === wishlistId) {
                        const updatedCollections = w.collections.map(c => {
                            if (c.id === collectionId) {
                                // Adiciona o card retornado pela API à coleção correta
                                return { ...c, cards: [...c.cards, addedCard] };
                            }
                            return c;
                        });
                        return { ...w, collections: updatedCollections };
                    }
                    return w;
                }));
            } else {
                alert("Falha ao adicionar o card.");
            }
        } catch (error) {
            console.error("Erro ao adicionar card:", error);
        }
    };


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