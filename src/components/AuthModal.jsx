import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { signInUser, signUpUser, signInDemoUser } from '../lib/supabaseClient';

export default function AuthModal() {
  const { authModalOpen, authModalMode, setAuthModalMode, closeAuth, setUser, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (authModalMode === 'signin') {
        const { data, error } = await signInUser(email, password);
        if (error) {
          setErrorMsg(error);
        } else {
          setUser(data.user);
          showToast(`Welcome back, ${data.user?.user_metadata?.full_name || data.user?.email}!`, 'success');
          closeAuth();
        }
      } else {
        const { data, error } = await signUpUser(email, password, fullName);
        if (error) {
          setErrorMsg(error);
        } else {
          setUser(data.user);
          showToast(`Account created & logged in as ${data.user?.email}!`, 'success');
          closeAuth();
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const { data } = await signInDemoUser();
      setUser(data.user);
      showToast('Logged in as Elena Voss (VIP Traveler)', 'success');
      closeAuth();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-2xl border border-surface-container text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuth}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-2 mb-2">
          <img 
            alt="TripNest Logo" 
            className="h-7 w-auto object-contain" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7pqMW6Yx3bBWa26NVl7rznuVbyTwrcZ7UfOsqRckGQVFEptoAf9OCvZ9PCdKTOZS8O7fDr3eKscUFL4FLC9HzLjYEGAxiyK-xvMYqiU2Kw16MxYQYWyU7bpd30FADa49O1ldyuBA6ERVuN5pKHTJs8mk7fHryplDN1UW8wLnNpLCQaGlvuQ6n3qSoe5N6Rw5IL9Cy5SNOZKwKlyLIkBtCoZFftlH0kGlLH3tw_b2p"
          />
          <span className="font-headline-sm text-lg text-primary font-serif">TripNest Circle</span>
        </div>

        {/* Tab Selector: Sign In vs Sign Up */}
        <div className="flex rounded-2xl bg-surface-container-low p-1 mt-4 mb-4 border border-surface-container">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('signin');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              authModalMode === 'signin'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('signup');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              authModalMode === 'signup'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Create Account (Sign Up)
          </button>
        </div>

        {/* 1-Click VIP Instant Login Button */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full mb-4 py-2.5 px-4 rounded-xl bg-secondary-fixed/50 hover:bg-secondary-fixed text-on-secondary-fixed text-xs font-bold transition-all border border-secondary/20 flex items-center justify-center gap-2 group"
        >
          <span className="material-symbols-outlined text-[18px] text-secondary">bolt</span>
          <span>⚡ 1-Click VIP Instant Sign-In (Elena Voss)</span>
        </button>

        <div className="relative flex py-1 items-center mb-4">
          <div className="flex-grow border-t border-surface-container"></div>
          <span className="flex-shrink mx-3 text-[11px] text-outline font-semibold uppercase">Or with Email</span>
          <div className="flex-grow border-t border-surface-container"></div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-error-container text-error text-xs font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authModalMode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Elena Cameron"
                className="w-full px-4 py-2.5 rounded-xl bg-surface border border-surface-container text-sm text-primary placeholder:text-outline-variant focus:outline-none focus:border-secondary transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="explorer@tripnest.com"
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-surface-container text-sm text-primary placeholder:text-outline-variant focus:outline-none focus:border-secondary transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={4}
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-surface-container text-sm text-primary placeholder:text-outline-variant focus:outline-none focus:border-secondary transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
            <span>{authModalMode === 'signin' ? 'Sign In to Account' : 'Create Free Account'}</span>
          </button>
        </form>

        {/* Supabase Indicator */}
        <div className="mt-4 pt-4 border-t border-surface-container text-center">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-[11px] text-outline">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Supabase Project: <span className="font-mono text-primary font-semibold">agagedhpgziuymswppmp</span>
          </span>
        </div>
      </div>
    </div>
  );
}
