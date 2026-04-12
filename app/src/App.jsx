import { useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import Lenis from 'lenis';

import LandingPage              from './components/LandingPage/LandingPage';
import CollectionPickerOverlay  from './components/CollectionPickerOverlay/CollectionPickerOverlay';
import Header                   from './components/Header/Header';
import Wishlist                 from './components/Wishlist/Wishlist';
import AddWishlistModal         from './components/AddWishlistModal/AddWishlistModal';
import EditCollectionModal      from './components/EditCollectionModal/EditCollectionModal';
import DeleteConfirmationModal  from './components/DeleteConfirmationModal/DeleteConfirmationModal';
import InputModal               from './components/InputModal/InputModal';
import EditWishlistModal        from './components/EditWishlistModal/EditWishlistModal.jsx';

import './App.css';

const API_URL = 'http://localhost:5062';

function App() {
  // ── View state ────────────────────────────────────────────────
  // 'landing' = main menu   |   'main' = collections view
  const [appView, setAppView]                       = useState('landing');
  const [isCollectionPickerOpen, setCollectionPickerOpen] = useState(false);

  // ── Data state ────────────────────────────────────────────────
  const [wishlists,        setWishlists]        = useState([]);
  const [activeWishlistId, setActiveWishlistId] = useState(null);
  const [theme,            setTheme]            = useState('light');

  // ── Modal state ───────────────────────────────────────────────
  const [isModalOpen,            setIsModalOpen]            = useState(false);
  const [targetWishlistId,       setTargetWishlistId]       = useState(null);
  const [isAddWishlistModalOpen, setIsAddWishlistModalOpen] = useState(false);
  const [editingCollection,      setEditingCollection]      = useState(null);
  const [deletingCollection,     setDeletingCollection]     = useState(null);
  const [editingWishlist,        setEditingWishlist]        = useState(null);
  const [deletingWishlist,       setDeletingWishlist]       = useState(null);

  // ── Lenis smooth scroll ───────────────────────────────────────
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 3) });
    const tick  = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  // ── Theme sync ────────────────────────────────────────────────
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // ── Initial data fetch ────────────────────────────────────────
  useEffect(() => {
    const fetchWishlists = async () => {
      try {
        const res  = await fetch(`${API_URL}/api/wishlists`);
        const data = await res.json();
        setWishlists(data);
        if (data.length > 0) setActiveWishlistId(data[0].id);
      } catch (err) {
        console.error('Falha ao buscar dados da API:', err);
      }
    };
    fetchWishlists();
  }, []);

  // ── Navigation helpers ────────────────────────────────────────
  const goToMain = useCallback((wishlistId) => {
    if (wishlistId) setActiveWishlistId(wishlistId);
    setCollectionPickerOpen(false);
    setAppView('main');
  }, []);

  const goToLanding = useCallback(() => setAppView('landing'), []);

  // ── Landing page handlers ─────────────────────────────────────
  const handleLandingNewCollection  = () => setIsAddWishlistModalOpen(true);
  const handleLandingOpenCollection = () => setCollectionPickerOpen(true);
  const handleLandingProfile        = () => { /* TODO: Perfil do usuário */ };
  const handleLandingSettings       = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  // ── Wishlist CRUD ─────────────────────────────────────────────
  const handleAddWishlist = async (artistName, photoFile) => {
    const photoUrl = photoFile ? URL.createObjectURL(photoFile) : '';
    const newWishlist = { id: `wish_${Date.now()}`, artistName, artistPhotoUrl: photoUrl, collections: [] };

    try {
      const res = await fetch(`${API_URL}/api/wishlists`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(newWishlist),
      });
      if (res.ok) {
        const created = await res.json();
        setWishlists(prev => [...prev, created]);
        setIsAddWishlistModalOpen(false);
        goToMain(created.id);
      } else {
        alert('Falha ao criar a coleção.');
      }
    } catch (err) {
      console.error('Erro ao criar coleção:', err);
    }
  };

  const handleEditWishlistName = async (wishlistId, newName) => {
    const w = wishlists.find(w => w.id === wishlistId);
    if (!w) return;
    try {
      const res = await fetch(`${API_URL}/api/wishlists/${wishlistId}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...w, artistName: newName }),
      });
      if (res.ok) {
        setWishlists(prev => prev.map(x => x.id === wishlistId ? { ...x, artistName: newName } : x));
        setEditingWishlist(null);
      } else {
        alert('Falha ao editar a coleção.');
      }
    } catch (err) {
      console.error('Erro ao editar coleção:', err);
    }
  };

  const handleDeleteWishlist = async (wishlistId) => {
    try {
      const res = await fetch(`${API_URL}/api/wishlists/${wishlistId}`, { method: 'DELETE' });
      if (res.ok) {
        const updated = wishlists.filter(w => w.id !== wishlistId);
        setWishlists(updated);
        if (activeWishlistId === wishlistId) {
          setActiveWishlistId(updated.length > 0 ? updated[0].id : null);
        }
        if (updated.length === 0) goToLanding();
      } else {
        alert('Falha ao deletar a coleção.');
      }
    } catch (err) {
      console.error('Erro ao deletar coleção:', err);
    }
    setDeletingWishlist(null);
  };

  // ── Collection CRUD ───────────────────────────────────────────
  const handleAddCollection = (wishlistId) => {
    setTargetWishlistId(wishlistId);
    setIsModalOpen(true);
  };

  const handleConfirmAddCollection = async (collectionName) => {
    if (!targetWishlistId) return;
    const newCollection = { id: `coll_${Date.now()}`, name: collectionName, cards: [] };
    try {
      const res = await fetch(`${API_URL}/api/wishlists/${targetWishlistId}/collections`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(newCollection),
      });
      if (res.ok) {
        const added = await res.json();
        setWishlists(prev => prev.map(w =>
          w.id === targetWishlistId ? { ...w, collections: [...w.collections, added] } : w
        ));
      } else {
        alert('Falha ao adicionar o álbum.');
      }
    } catch (err) {
      console.error('Erro ao adicionar álbum:', err);
    }
    setTargetWishlistId(null);
    setIsModalOpen(false);
  };

  const handleEditCollectionName = async (wishlistId, collectionId, newName) => {
    const w = wishlists.find(w => w.id === wishlistId);
    const c = w?.collections.find(c => c.id === collectionId);
    if (!w || !c) return;
    const updated = { ...c, name: newName };
    try {
      const res = await fetch(`${API_URL}/api/wishlists/${wishlistId}/collections/${collectionId}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(updated),
      });
      if (res.ok) {
        setWishlists(prev => prev.map(w =>
          w.id === wishlistId
            ? { ...w, collections: w.collections.map(c => c.id === collectionId ? updated : c) }
            : w
        ));
        setEditingCollection(null);
      } else {
        alert('Falha ao editar o álbum.');
      }
    } catch (err) {
      console.error('Erro ao editar álbum:', err);
    }
  };

  const handleDeleteCollection = async (wishlistId, collectionId) => {
    try {
      const res = await fetch(`${API_URL}/api/wishlists/${wishlistId}/collections/${collectionId}`, { method: 'DELETE' });
      if (res.ok) {
        setWishlists(prev => prev.map(w =>
          w.id === wishlistId
            ? { ...w, collections: w.collections.filter(c => c.id !== collectionId) }
            : w
        ));
      } else {
        alert('Falha ao deletar o álbum.');
      }
    } catch (err) {
      console.error('Erro ao deletar álbum:', err);
    }
    setDeletingCollection(null);
  };

  // ── Card CRUD ─────────────────────────────────────────────────
  const handleAddCard = async (wishlistId, collectionId, imageFile) => {
    const newCard = { id: `card_${Date.now()}`, imageUrl: URL.createObjectURL(imageFile), owned: true };
    try {
      const res = await fetch(`${API_URL}/api/wishlists/${wishlistId}/collections/${collectionId}/cards`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(newCard),
      });
      if (res.ok) {
        const added = await res.json();
        setWishlists(prev => prev.map(w =>
          w.id === wishlistId
            ? { ...w, collections: w.collections.map(c =>
                c.id === collectionId ? { ...c, cards: [...c.cards, added] } : c
              )}
            : w
        ));
      } else {
        alert('Falha ao adicionar o card.');
      }
    } catch (err) {
      console.error('Erro ao adicionar card:', err);
    }
  };

  const handleToggleCardOwned = (wishlistId, collectionId, cardId) => {
    setWishlists(prev => prev.map(w =>
      w.id === wishlistId
        ? { ...w, collections: w.collections.map(c =>
            c.id === collectionId
              ? { ...c, cards: c.cards.map(card => card.id === cardId ? { ...card, owned: !card.owned } : card) }
              : c
          )}
        : w
    ));
  };

  const activeWishlist = wishlists.find(w => w.id === activeWishlistId);

  // ── Render ────────────────────────────────────────────────────
  return (
    <>
      {/* ── Landing page ──────────────────────────────── */}
      {appView === 'landing' && (
        <LandingPage
          onNewCollection={handleLandingNewCollection}
          onOpenCollection={handleLandingOpenCollection}
          onProfile={handleLandingProfile}
          onSettings={handleLandingSettings}
        />
      )}

      {/* ── Collections / main view ───────────────────── */}
      {appView === 'main' && (
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
            onBackToLanding={goToLanding}
          />
          <main>
            {activeWishlist ? (
              <Wishlist
                key={activeWishlist.id}
                wishlist={activeWishlist}
                onOpenEditModal={(wId, cId) => {
                  const c = wishlists.find(w => w.id === wId)?.collections.find(c => c.id === cId);
                  if (c) setEditingCollection({ wishlistId: wId, ...c });
                }}
                onOpenDeleteModal={(wId, cId) => {
                  const c = wishlists.find(w => w.id === wId)?.collections.find(c => c.id === cId);
                  if (c) setDeletingCollection({ wishlistId: wId, ...c });
                }}
                onAddCollection={handleAddCollection}
                onAddCard={handleAddCard}
                onToggleCardOwned={handleToggleCardOwned}
              />
            ) : (
              <div style={{ textAlign: 'center', marginTop: '60px' }}>
                <h2>Nenhuma coleção encontrada</h2>
                <p>Crie uma nova coleção pelo menu principal.</p>
              </div>
            )}
          </main>
        </>
      )}

      {/* ── Collection picker overlay ─────────────────── */}
      {isCollectionPickerOpen && (
        <CollectionPickerOverlay
          wishlists={wishlists}
          onSelect={goToMain}
          onClose={() => setCollectionPickerOpen(false)}
        />
      )}

      {/* ── Modals ────────────────────────────────────── */}
      {isAddWishlistModalOpen && (
        <AddWishlistModal
          onClose={() => setIsAddWishlistModalOpen(false)}
          onSave={handleAddWishlist}
        />
      )}

      {editingCollection && (
        <EditCollectionModal
          collection={editingCollection}
          onClose={() => setEditingCollection(null)}
          onSave={handleEditCollectionName}
        />
      )}

      {deletingCollection && (
        <DeleteConfirmationModal
          item={deletingCollection}
          itemType="álbum"
          onClose={() => setDeletingCollection(null)}
          onConfirm={() => handleDeleteCollection(deletingCollection.wishlistId, deletingCollection.id)}
        />
      )}

      {editingWishlist && (
        <EditWishlistModal
          wishlist={editingWishlist}
          onClose={() => setEditingWishlist(null)}
          onSave={(newName) => handleEditWishlistName(editingWishlist.id, newName)}
        />
      )}

      {deletingWishlist && (
        <DeleteConfirmationModal
          item={{ name: deletingWishlist.artistName }}
          itemType="coleção"
          onClose={() => setDeletingWishlist(null)}
          onConfirm={() => handleDeleteWishlist(deletingWishlist.id)}
        />
      )}

      <InputModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleConfirmAddCollection}
        title="Adicionar Álbum"
      />
    </>
  );
}

export default App;
