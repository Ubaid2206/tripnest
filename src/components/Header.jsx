import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { user, openAuth, favorites, setWishlistDrawerOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Explore', path: '/' },
    { label: 'Stays', path: '/stays' },
    { label: 'Flights', path: '/flights' },
    { label: 'Experiences', path: '/experiences' },
    { label: 'Packages', path: '/packages' }
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface/90 backdrop-blur-md shadow-[0_1px_8px_rgba(14,42,56,0.05)] border-b border-surface-container/60">
      <div className="h-20 max-w-[1440px] mx-auto px-margin-mobile lg:px-margin flex items-center justify-between gap-space-md">
        
        {/* Brand Logo & Desktop Nav */}
        <div className="flex items-center gap-space-lg shrink-0">
          <Link to="/" className="flex items-center gap-space-sm group">
            <img 
              alt="TripNest Logo" 
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7pqMW6Yx3bBWa26NVl7rznuVbyTwrcZ7UfOsqRckGQVFEptoAf9OCvZ9PCdKTOZS8O7fDr3eKscUFL4FLC9HzLjYEGAxiyK-xvMYqiU2Kw16MxYQYWyU7bpd30FADa49O1ldyuBA6ERVuN5pKHTJs8mk7fHryplDN1UW8wLnNpLCQaGlvuQ6n3qSoe5N6Rw5IL9Cy5SNOZKwKlyLIkBtCoZFftlH0kGlLH3tw_b2p"
            />
            <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-serif">
              TripNest
            </span>
          </Link>

          {/* Desktop Navigation Pills */}
          <nav className="hidden xl:flex items-center gap-space-xs p-1 bg-surface-container-low/80 rounded-full border border-surface-container">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-space-md py-space-xs rounded-full transition-all text-sm font-medium ${
                    isActive
                      ? 'bg-surface-container text-primary font-semibold shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-space-sm sm:gap-space-md">
          {/* Currency / Language */}
          <button 
            type="button"
            className="hidden md:flex items-center gap-space-xs px-space-md py-space-xs rounded-full font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">language</span>
            <span>USD ($)</span>
          </button>

          {/* List Your Property / Host CTA */}
          <Link
            to="/host-dashboard"
            className="hidden lg:inline-flex items-center px-space-md py-space-xs rounded-full font-label-md text-label-md text-secondary border border-secondary/20 hover:text-on-secondary hover:bg-secondary transition-all"
          >
            <span className="material-symbols-outlined text-[16px] mr-1">villa</span>
            List Your Property
          </Link>

          {/* Favorites Button with Counter */}
          <div className="flex items-center gap-1 sm:gap-space-xs">
            <button 
              type="button"
              aria-label="Saved Favorites" 
              onClick={() => setWishlistDrawerOpen(true)}
              className="relative w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:text-secondary hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">favorite</span>
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Notifications */}
            <button 
              type="button"
              aria-label="Notifications" 
              onClick={() => navigate('/profile')}
              className="relative w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-secondary"></span>
            </button>
          </div>

          {/* Profile / Supabase Auth Button */}
          {user ? (
            <Link
              to="/profile"
              className="flex items-center gap-space-xs pl-1 pr-2 py-1 rounded-full bg-surface-container-low hover:bg-surface-container border border-surface-container transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
                {user.email ? user.email.slice(0, 2).toUpperCase() : 'VIP'}
              </div>
              <span className="text-xs font-semibold text-primary hidden sm:inline-block truncate max-w-[100px]">
                {user.user_metadata?.full_name || user.email?.split('@')[0]}
              </span>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => openAuth('signin')}
              className="flex items-center gap-space-xs pl-2 pr-3 py-1.5 rounded-full bg-primary hover:bg-primary-container text-on-primary transition-all text-xs font-semibold shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">account_circle</span>
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-surface-container-lowest border-b border-surface-container p-space-lg shadow-xl animate-fadeIn">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-space-md py-space-sm rounded-xl transition-all text-base font-medium flex items-center justify-between ${
                    isActive
                      ? 'bg-surface-container text-primary font-bold'
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`
                }
              >
                <span>{link.label}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </NavLink>
            ))}
            <Link
              to="/host-dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 px-space-md py-space-sm rounded-xl text-secondary font-semibold bg-secondary-fixed/30 flex items-center justify-between"
            >
              <span>List Your Property</span>
              <span className="material-symbols-outlined text-[18px]">villa</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
