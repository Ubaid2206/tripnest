import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  supabase, 
  getCurrentUser, 
  fetchAllStays, 
  getSavedFavorites, 
  toggleSavedFavorite,
  signOutUser
} from '../lib/supabaseClient';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signin'); // 'signin' or 'signup'
  
  const [wishlistDrawerOpen, setWishlistDrawerOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  
  const [allStays, setAllStays] = useState([]);
  const [loadingStays, setLoadingStays] = useState(true);
  
  const [toast, setToast] = useState(null); // { message, type }

  // Check auth state & listen for changes
  useEffect(() => {
    async function initAuth() {
      const cur = await getCurrentUser();
      setUser(cur);
      setLoadingUser(false);
    }
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        const local = await getCurrentUser();
        setUser(local);
      }
      setLoadingUser(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Load favorites
  useEffect(() => {
    setFavorites(getSavedFavorites());
  }, []);

  // Load stays
  const loadStays = async () => {
    setLoadingStays(true);
    const data = await fetchAllStays();
    setAllStays(data);
    setLoadingStays(false);
  };

  useEffect(() => {
    loadStays();
  }, []);

  const openAuth = (mode = 'signin') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuth = () => {
    setAuthModalOpen(false);
  };

  const loginUser = (userData) => {
    setUser(userData);
  };

  const logoutUser = async () => {
    await signOutUser();
    setUser(null);
  };

  const handleToggleFavorite = (stayId) => {
    const updated = toggleSavedFavorite(stayId);
    setFavorites(updated);
    const isNowFav = updated.includes(stayId);
    showToast(isNowFav ? 'Added to your private wishlist' : 'Removed from wishlist', 'info');
  };

  const isFav = (stayId) => favorites.includes(stayId);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser: loginUser,
        logoutUser,
        loadingUser,
        authModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuth,
        closeAuth,
        wishlistDrawerOpen,
        setWishlistDrawerOpen,
        favorites,
        toggleFavorite: handleToggleFavorite,
        isFavorite: isFav,
        allStays,
        loadingStays,
        refreshStays: loadStays,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
