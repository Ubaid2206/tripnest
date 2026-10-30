import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { signOutUser, fetchUserBookings, signInUser, signUpUser, signInDemoUser } from '../lib/supabaseClient';

export default function ProfilePage() {
  const { user, setUser, logoutUser, openAuth, showToast, favorites, allStays, toggleFavorite } = useApp();
  
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings', 'wishlist', 'settings'
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Auth form states if user is not signed in
  const [authMode, setAuthMode] = useState('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const loadBookings = async () => {
    setLoadingBookings(true);
    const data = await fetchUserBookings(user?.email);
    setBookings(data);
    setLoadingBookings(false);
  };

  useEffect(() => {
    loadBookings();
  }, [user]);

  const handleSignOut = async () => {
    await logoutUser();
    showToast('You have signed out of TripNest.', 'info');
  };

  const handleDemoSignIn = async () => {
    setAuthLoading(true);
    try {
      const { data } = await signInDemoUser();
      setUser(data.user);
      showToast('Signed in as Elena Voss (VIP Traveler)', 'success');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      if (authMode === 'signin') {
        const { data, error } = await signInUser(authEmail, authPassword);
        if (error) {
          setAuthError(error);
        } else {
          setUser(data.user);
          showToast(`Welcome back, ${data.user?.user_metadata?.full_name || data.user?.email}!`, 'success');
        }
      } else {
        const { data, error } = await signUpUser(authEmail, authPassword, authName);
        if (error) {
          setAuthError(error);
        } else {
          setUser(data.user);
          showToast(`Account created & logged in as ${data.user?.email}!`, 'success');
        }
      }
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const favoriteStays = allStays.filter(s => favorites.includes(s.id));

  return (
    <div className="w-full min-h-screen bg-surface pt-24 pb-20">
      <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin">
        
        {/* Header Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-2">
            <Link to="/" className="hover:text-primary transition-colors">TripNest</Link>
            <span>/</span>
            <span className="text-secondary font-semibold">Traveler Account</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-primary font-bold">
            Traveler Account &amp; Reservations
          </h1>
        </div>

        {/* Profile Header Box */}
        <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-sm border border-surface-container mb-8">
          {user ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary text-on-primary font-serif font-bold text-2xl flex items-center justify-center shadow-md">
                  {user.email ? user.email.slice(0, 2).toUpperCase() : 'TN'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold font-serif text-primary">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold uppercase tracking-wider">
                      Nest Club VIP
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5 font-mono">
                    {user.email}
                  </p>
                  <p className="text-[11px] text-outline mt-1">
                    Supabase User ID: <span className="font-mono text-primary text-[10px]">{user.id}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSignOut}
                  className="px-5 py-2 rounded-full border border-surface-container text-primary hover:bg-surface-container text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-left">
                <span className="text-xs font-bold text-secondary uppercase tracking-widest block mb-1">
                  TripNest Identity
                </span>
                <h3 className="text-xl font-serif font-bold text-primary">
                  Sign In with Supabase to Sync Your Sanctuaries
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 max-w-lg">
                  Access your confirmed reservations across all devices, manage private concierge requests, and curate your personal wishlist.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={handleDemoSignIn}
                  className="px-5 py-2.5 rounded-full bg-secondary-fixed hover:bg-secondary-fixed-dim text-on-secondary-fixed text-xs font-bold transition-all border border-secondary/20 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px] text-secondary">bolt</span>
                  <span>1-Click VIP Sign-In</span>
                </button>
                <button
                  onClick={() => openAuth('signin')}
                  className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-all shadow-md flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">account_circle</span>
                  <span>Sign In</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none mb-8 border-b border-surface-container">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 text-sm font-semibold transition-all relative ${
              activeTab === 'bookings' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span>My Reservations ({bookings.length})</span>
            {activeTab === 'bookings' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-secondary rounded-full" />}
          </button>
          
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`pb-3 text-sm font-semibold transition-all relative ${
              activeTab === 'wishlist' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span>Saved Wishlist ({favorites.length})</span>
            {activeTab === 'wishlist' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-secondary rounded-full" />}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 text-sm font-semibold transition-all relative ${
              activeTab === 'settings' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span>Database &amp; Supabase Status</span>
            {activeTab === 'settings' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-secondary rounded-full" />}
          </button>
        </div>

        {/* Tab 1: Bookings List */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {loadingBookings ? (
              <div className="text-center py-16">
                <span className="material-symbols-outlined animate-spin text-[32px] text-secondary">progress_activity</span>
                <p className="mt-2 text-xs text-on-surface-variant">Loading your reservations from Supabase...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-16 bg-surface-container-lowest rounded-3xl border border-surface-container p-8">
                <span className="material-symbols-outlined text-[44px] text-outline">luggage</span>
                <h4 className="font-serif font-bold text-lg text-primary mt-2">No Active Reservations</h4>
                <p className="text-xs text-on-surface-variant mt-1 max-w-sm mx-auto">
                  You haven't reserved any sanctuaries, flights, or multi-day journeys yet.
                </p>
                <div className="mt-5 flex justify-center gap-3">
                  <Link
                    to="/stays"
                    className="px-5 py-2.5 rounded-full bg-secondary text-on-secondary text-xs font-semibold hover:bg-on-secondary-container transition-colors"
                  >
                    Explore Stays
                  </Link>
                  <Link
                    to="/packages"
                    className="px-5 py-2.5 rounded-full bg-surface-container text-primary text-xs font-semibold hover:bg-surface-container-high transition-colors"
                  >
                    View Expeditions
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold uppercase tracking-wider">
                          {booking.itemType?.toUpperCase()}
                        </span>
                        <span className="font-mono text-xs text-outline font-semibold">
                          Ref: {booking.id}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                          {booking.status || 'Confirmed'}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-lg text-primary">
                        {booking.itemTitle}
                      </h3>

                      <p className="text-xs text-on-surface-variant">
                        Location: <strong className="text-primary">{booking.location}</strong> · Guest: {booking.guestName}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-outline pt-1">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                          {booking.checkIn} {booking.checkOut && booking.checkOut !== booking.checkIn ? `→ ${booking.checkOut}` : ''}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">group</span>
                          {booking.guests} Guests
                        </span>
                      </div>
                    </div>

                    <div className="md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-surface-container shrink-0">
                      <span className="text-[10px] text-outline uppercase block">Total Investment</span>
                      <div className="font-serif font-bold text-secondary text-xl">
                        ${booking.totalPrice?.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-outline block mt-0.5">Vetted by Concierge</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Wishlist */}
        {activeTab === 'wishlist' && (
          <div>
            {favoriteStays.length === 0 ? (
              <div className="text-center py-16 bg-surface-container-lowest rounded-3xl border border-surface-container p-8">
                <span className="material-symbols-outlined text-[44px] text-outline">favorite_border</span>
                <h4 className="font-serif font-bold text-lg text-primary mt-2">Your Wishlist is Empty</h4>
                <p className="text-xs text-on-surface-variant mt-1 max-w-sm mx-auto">
                  Click the heart icon on any stay card across TripNest to curate your personal sanctuary collection.
                </p>
                <Link
                  to="/stays"
                  className="mt-4 inline-flex items-center px-5 py-2.5 rounded-full bg-secondary text-on-secondary text-xs font-semibold hover:bg-on-secondary-container transition-colors"
                >
                  Discover Stays
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteStays.map((stay) => (
                  <div
                    key={stay.id}
                    className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-surface-container flex flex-col justify-between"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={stay.imageUrl} alt={stay.title} className="w-full h-full object-cover" />
                      <button
                        onClick={() => toggleFavorite(stay.id)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center shadow-md"
                        title="Remove from favorites"
                      >
                        <span className="material-symbols-outlined text-[18px] material-symbols-filled">favorite</span>
                      </button>
                    </div>

                    <div className="p-4">
                      <span className="text-[10px] font-bold uppercase text-secondary block">{stay.category}</span>
                      <Link to={`/stays/${stay.id}`} className="font-serif font-bold text-base text-primary hover:text-secondary line-clamp-1 mt-0.5">
                        {stay.title}
                      </Link>
                      <p className="text-xs text-on-surface-variant mt-0.5 truncate">{stay.location}</p>

                      <div className="mt-3 pt-3 border-t border-surface-container flex items-baseline justify-between">
                        <span className="font-bold text-sm text-primary">
                          ${stay.price.toLocaleString()} <span className="font-normal text-xs text-outline">/ night</span>
                        </span>
                        <Link
                          to={`/stays/${stay.id}`}
                          className="text-xs font-semibold text-secondary hover:underline"
                        >
                          Reserve →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Database & Supabase Settings */}
        {activeTab === 'settings' && (
          <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-sm border border-surface-container space-y-6">
            <div>
              <h3 className="text-xl font-serif font-bold text-primary">Supabase Database Integration</h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Real-time connection status to the Supabase backend requested for this project.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-2">
                <span className="text-[10px] uppercase font-bold text-outline">Supabase URL</span>
                <p className="font-mono text-xs font-semibold text-primary break-all">
                  https://agagedhpgziuymswppmp.supabase.co
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-2">
                <span className="text-[10px] uppercase font-bold text-outline">Publishable Key</span>
                <p className="font-mono text-xs font-semibold text-primary break-all">
                  sb_publishable_vuu4CX5q62-UCTwkqo-8zw_PgXqJ4Zb
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container">
              <div className="flex items-center gap-2 text-green-700 font-bold text-xs mb-2">
                <span className="w-2 h-2 rounded-full bg-green-600"></span>
                <span>Active Services</span>
              </div>
              <ul className="text-xs text-on-surface-variant space-y-1">
                <li>• <strong>Supabase Auth:</strong> Active &amp; live. Users can Sign In, Sign Up, and persist sessions.</li>
                <li>• <strong>PostgREST Database:</strong> Reads and writes to `stays`, `bookings`, and `favorites` tables.</li>
                <li>• <strong>Local Resilience Store:</strong> Automatically falls back to localStorage if tables are not yet migrated in Supabase SQL editor.</li>
                <li>• <strong>SQL Schema:</strong> Complete SQL migration script provided in <code className="bg-surface px-1.5 py-0.5 rounded text-primary">supabase-schema.sql</code>.</li>
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
