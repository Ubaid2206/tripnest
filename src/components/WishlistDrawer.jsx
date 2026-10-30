import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function WishlistDrawer() {
  const { wishlistDrawerOpen, setWishlistDrawerOpen, favorites, toggleFavorite, allStays } = useApp();

  if (!wishlistDrawerOpen) return null;

  const favoriteStays = allStays.filter(s => favorites.includes(s.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-primary/40 backdrop-blur-xs transition-opacity" 
        onClick={() => setWishlistDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface-container-lowest shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-surface-container flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[24px]">favorite</span>
              <h3 className="font-serif text-xl font-bold text-primary">Saved Sanctuaries</h3>
              <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold">
                {favorites.length}
              </span>
            </div>
            <button
              onClick={() => setWishlistDrawerOpen(false)}
              className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {favoriteStays.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-4 text-outline">
                  <span className="material-symbols-outlined text-[32px]">favorite_border</span>
                </div>
                <h4 className="font-serif text-lg text-primary font-semibold">Your wishlist is empty</h4>
                <p className="text-xs text-on-surface-variant mt-1.5 max-w-xs mx-auto">
                  Click the heart icon on any stay or villa card to bookmark it for your future journeys.
                </p>
                <Link
                  to="/stays"
                  onClick={() => setWishlistDrawerOpen(false)}
                  className="mt-6 inline-flex items-center px-4 py-2 rounded-full bg-secondary text-on-secondary text-xs font-semibold hover:bg-on-secondary-container transition-colors"
                >
                  Explore Stays Catalog
                </Link>
              </div>
            ) : (
              favoriteStays.map(stay => (
                <div 
                  key={stay.id} 
                  className="group flex gap-4 p-3 rounded-2xl bg-surface hover:bg-surface-container-low border border-surface-container transition-all"
                >
                  <img
                    src={stay.imageUrl}
                    alt={stay.title}
                    className="w-24 h-24 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-on-surface-variant mb-0.5">
                        <span className="truncate">{stay.location}</span>
                        <button
                          onClick={() => toggleFavorite(stay.id)}
                          className="text-outline hover:text-secondary p-1"
                          title="Remove from favorites"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                      <Link
                        to={`/stays/${stay.id}`}
                        onClick={() => setWishlistDrawerOpen(false)}
                        className="font-serif font-bold text-sm text-primary hover:text-secondary transition-colors line-clamp-1"
                      >
                        {stay.title}
                      </Link>
                    </div>
                    <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-surface-container">
                      <span className="text-xs font-bold text-primary">
                        ${stay.price.toLocaleString()} <span className="font-normal text-[10px] text-outline">/ night</span>
                      </span>
                      <Link
                        to={`/stays/${stay.id}`}
                        onClick={() => setWishlistDrawerOpen(false)}
                        className="text-[11px] font-semibold text-secondary hover:underline inline-flex items-center gap-0.5"
                      >
                        <span>Reserve</span>
                        <span className="material-symbols-outlined text-[12px]">east</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {favoriteStays.length > 0 && (
            <div className="p-6 border-t border-surface-container bg-surface-container-low">
              <Link
                to="/stays"
                onClick={() => setWishlistDrawerOpen(false)}
                className="w-full py-2.5 rounded-full bg-primary text-on-primary font-semibold text-xs flex items-center justify-center gap-2 hover:bg-primary-container transition-colors shadow-xs"
              >
                <span>Browse More Stays</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
