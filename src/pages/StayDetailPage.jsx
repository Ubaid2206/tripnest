import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { fetchStayById, createBooking } from '../lib/supabaseClient';

export default function StayDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, openAuth, showToast, isFavorite, toggleFavorite } = useApp();

  const [stay, setStay] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking states
  const [checkIn, setCheckIn] = useState('2025-10-14');
  const [checkOut, setCheckOut] = useState('2025-10-21');
  const [guestsCount, setGuestsCount] = useState(2);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchStayById(id);
      setStay(data);
      setLoading(false);
    }
    loadData();
  }, [id]);

  useEffect(() => {
    if (user) {
      setGuestEmail(user.email || '');
      setGuestName(user.user_metadata?.full_name || user.email?.split('@')[0] || '');
    }
  }, [user]);

  // Calculate nights & pricing
  const calculateDays = () => {
    try {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return isNaN(diffDays) || diffDays <= 0 ? 1 : diffDays;
    } catch {
      return 7;
    }
  };

  const nights = calculateDays();
  const baseRate = stay?.price || 1280;
  const subtotal = nights * baseRate;
  const hospitalityFee = Math.round(subtotal * 0.08); // 8% transparent concierge & acoustic audit fee
  const totalPrice = subtotal + hospitalityFee;

  const handleReserve = async (e) => {
    e.preventDefault();
    if (!guestEmail) {
      showToast('Please provide your email to receive booking credentials.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const record = await createBooking({
        guestName: guestName || 'TripNest Explorer',
        guestEmail: guestEmail,
        itemId: stay.id,
        itemTitle: stay.title,
        itemType: 'stay',
        location: stay.location,
        imageUrl: stay.imageUrl,
        checkIn: checkIn,
        checkOut: checkOut,
        guests: guestsCount,
        totalPrice: totalPrice
      });

      setConfirmedBooking(record);
      showToast('Sanctuary reserved successfully!', 'success');
    } catch (err) {
      showToast('Failed to save reservation: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-surface">
        <span className="material-symbols-outlined animate-spin text-[36px] text-secondary">progress_activity</span>
        <p className="mt-3 text-sm text-on-surface-variant font-serif">Retrieving sanctuary dossier...</p>
      </div>
    );
  }

  if (!stay) {
    return (
      <div className="w-full min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-surface text-center px-4">
        <span className="material-symbols-outlined text-[48px] text-outline">location_off</span>
        <h2 className="text-2xl font-serif font-bold text-primary mt-2">Sanctuary Not Found</h2>
        <p className="text-sm text-on-surface-variant mt-1">The retreat you are looking for is currently offline or archived.</p>
        <Link to="/stays" className="mt-4 px-5 py-2 rounded-full bg-primary text-on-primary text-xs font-semibold">
          Return to Stays
        </Link>
      </div>
    );
  }

  const isFav = isFavorite(stay.id);

  return (
    <div className="w-full min-h-screen bg-surface pt-24 pb-20">
      <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin">
        
        {/* Navigation Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <Link to="/" className="hover:text-primary transition-colors">TripNest</Link>
            <span>/</span>
            <Link to="/stays" className="hover:text-primary transition-colors">Stays</Link>
            <span>/</span>
            <span className="text-secondary font-semibold">{stay.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(stay.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                isFav
                  ? 'bg-secondary text-white border-secondary'
                  : 'bg-surface-container-low text-primary border-surface-container hover:bg-surface-container'
              }`}
            >
              <span className={`material-symbols-outlined text-[16px] ${isFav ? 'material-symbols-filled' : ''}`}>
                favorite
              </span>
              <span>{isFav ? 'Saved to Wishlist' : 'Save Sanctuary'}</span>
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                showToast('Link copied to clipboard', 'info');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-primary border border-surface-container hover:bg-surface-container text-xs font-semibold transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">share</span>
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Header Title Area */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold uppercase tracking-wider">
              {stay.badge || stay.category}
            </span>
            <span className="text-xs text-on-surface-variant">
              Architectural Archetype: <strong className="text-primary">{stay.category}</strong>
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-serif font-bold text-primary tracking-tight">
            {stay.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs sm:text-sm text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-secondary text-[18px]">location_on</span>
              <strong className="text-primary">{stay.location}</strong>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 font-bold text-primary">
              <span className="material-symbols-outlined text-secondary-container text-[18px] material-symbols-filled">star</span>
              {stay.rating} ({stay.reviewsCount} verified audits)
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-outline">
              <span className="material-symbols-outlined text-[18px]">architecture</span>
              Designed by {stay.architect}
            </span>
          </div>
        </div>

        {/* Photo Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 rounded-3xl overflow-hidden shadow-lg mb-12 h-[340px] sm:h-[460px] md:h-[540px]">
          {/* Main Large Hero Image */}
          <div className="md:col-span-8 h-full overflow-hidden group">
            <img
              src={stay.imageUrl}
              alt={stay.title}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
            />
          </div>

          {/* Secondary Stacked Images */}
          <div className="hidden md:grid md:col-span-4 grid-rows-2 gap-3 h-full">
            <div className="overflow-hidden group">
              <img
                src={stay.gallery[1] || stay.imageUrl}
                alt="Gallery preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="overflow-hidden group">
              <img
                src={stay.gallery[2] || stay.gallery[0] || stay.imageUrl}
                alt="Interior detail"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>

        {/* Content Layout: Details (Left 7 cols) & Booking Console (Right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Property Dossier */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Quick Spec Ribbon */}
            <div className="grid grid-cols-4 gap-4 p-5 rounded-2xl bg-surface-container-low border border-surface-container text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-outline block">Capacity</span>
                <span className="text-sm font-bold text-primary">{stay.guests} Guests</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-outline block">Bedrooms</span>
                <span className="text-sm font-bold text-primary">{stay.bedrooms} Suites</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-outline block">Bathrooms</span>
                <span className="text-sm font-bold text-primary">{stay.bathrooms} Baths</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-outline block">Acoustics</span>
                <span className="text-sm font-bold text-secondary">Tier 1 Silent</span>
              </div>
            </div>

            {/* Architectural Overview */}
            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-3">
                Architectural Poise &amp; Sanctuary Overview
              </h2>
              <p className="text-sm leading-relaxed text-on-surface-variant font-light">
                {stay.description}
              </p>
            </div>

            {/* 50-Point Inspection Vetting Standards */}
            <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-secondary text-[24px]">verified</span>
                <h3 className="text-lg font-serif font-bold text-primary">TripNest Certified Audit</h3>
              </div>
              <p className="text-xs text-on-surface-variant mb-4">
                This property completed its unannounced on-site acoustic and hospitality inspection within the last 90 days.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-surface-container-low text-center">
                  <span className="text-xs text-outline block">Acoustics</span>
                  <span className="text-base font-bold text-primary">{stay.inspectionScores?.acoustics || '100%'}</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low text-center">
                  <span className="text-xs text-outline block">Cleanliness</span>
                  <span className="text-base font-bold text-primary">{stay.inspectionScores?.cleanliness || '99%'}</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low text-center">
                  <span className="text-xs text-outline block">Hospitality</span>
                  <span className="text-base font-bold text-primary">{stay.inspectionScores?.hospitality || '100%'}</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low text-center">
                  <span className="text-xs text-outline block">Amenities</span>
                  <span className="text-base font-bold text-primary">{stay.inspectionScores?.amenities || '98%'}</span>
                </div>
              </div>
            </div>

            {/* Curated Amenities List */}
            <div>
              <h3 className="text-xl font-serif font-bold text-primary mb-4">
                Curated Amenities &amp; Services
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stay.amenities?.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-surface-container/60">
                    <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
                    <span className="text-xs font-semibold text-primary">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Host & Architect Profile */}
            <div className="p-6 rounded-2xl bg-surface-container-low border border-surface-container flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center font-serif text-lg font-bold shrink-0">
                TN
              </div>
              <div>
                <h4 className="text-sm font-bold text-primary">Curated by TripNest Private Hosts</h4>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Dedicated 24/7 host assigned upon reservation. Direct WhatsApp coordination, private airport chauffeuring, and table reservations included.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Booking Console */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-xl border border-surface-container">
              
              <div className="flex items-baseline justify-between pb-5 border-b border-surface-container">
                <div>
                  <span className="text-xs text-outline block">Nightly Investment</span>
                  <div className="text-2xl font-bold font-serif text-primary">
                    ${stay.price.toLocaleString()} <span className="text-xs font-normal text-on-surface-variant font-sans">/ night</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-primary">
                  <span className="material-symbols-outlined text-secondary-container material-symbols-filled text-[18px]">star</span>
                  <span>{stay.rating}</span>
                  <span className="text-outline font-normal">({stay.reviewsCount})</span>
                </div>
              </div>

              {/* Reservation Form */}
              <form onSubmit={handleReserve} className="mt-5 space-y-4">
                
                {/* Dates Selector */}
                <div className="grid grid-cols-2 gap-2 p-2 rounded-2xl bg-surface border border-surface-container">
                  <div className="p-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-outline mb-0.5">
                      Check-In
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      required
                      className="w-full bg-transparent text-xs font-semibold text-primary focus:outline-none cursor-pointer"
                    />
                  </div>
                  <div className="p-2 border-l border-surface-container">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-outline mb-0.5">
                      Check-Out
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      required
                      className="w-full bg-transparent text-xs font-semibold text-primary focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Guests Selector */}
                <div className="p-3 rounded-2xl bg-surface border border-surface-container">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-outline mb-1">
                    Guests (Max {stay.guests})
                  </label>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary">{guestsCount} Guests, 1 Villa Suite</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                        className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-primary font-bold hover:bg-surface-container-high"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{guestsCount}</span>
                      <button
                        type="button"
                        onClick={() => setGuestsCount(Math.min(stay.guests, guestsCount + 1))}
                        className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-primary font-bold hover:bg-surface-container-high"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Guest Credentials */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-outline mb-1">
                    Primary Guest Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Elena Voss"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-surface-container text-xs text-primary placeholder:text-outline-variant focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-outline mb-1">
                    Confirmation Email (Saved to Supabase)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="elena@voss-studio.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-surface-container text-xs text-primary placeholder:text-outline-variant focus:outline-none focus:border-secondary"
                  />
                </div>

                {/* Price Breakdown Calculation */}
                <div className="pt-4 border-t border-surface-container space-y-2 text-xs">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>${baseRate.toLocaleString()} × {nights} nights</span>
                    <span className="font-semibold text-primary">${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <span>Concierge &amp; Acoustic Guarantee</span>
                      <span className="material-symbols-outlined text-[14px] text-outline" title="Includes 24/7 dedicated local host & audit guarantee">info</span>
                    </span>
                    <span className="font-semibold text-primary">${hospitalityFee.toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t border-surface-container flex justify-between items-baseline text-sm font-bold">
                    <span className="text-primary font-serif">Total Investment</span>
                    <span className="text-secondary font-serif text-lg">${totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Action Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-3 py-3.5 rounded-xl bg-secondary hover:bg-on-secondary-container text-on-secondary font-semibold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  ) : (
                    <>
                      <span>Reserve Sanctuary</span>
                      <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">east</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-outline text-center mt-2">
                  No hidden fees. Full refund eligible up to 14 days before arrival.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {confirmedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/70 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-lg bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-2xl border border-surface-container text-left">
              <div className="w-14 h-14 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[32px]">check_circle</span>
              </div>
              <span className="text-xs uppercase font-bold text-secondary tracking-widest block mb-1">
                Reservation Confirmed
              </span>
              <h3 className="text-2xl font-serif font-bold text-primary">
                Your Sanctuary Awaits
              </h3>
              <p className="text-xs text-on-surface-variant mt-1.5">
                Saved directly to Supabase Database. A confirmation dossier has been prepared.
              </p>

              <div className="mt-5 p-4 rounded-2xl bg-surface-container-low space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-outline">Booking Reference:</span>
                  <span className="font-mono font-bold text-primary">{confirmedBooking.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Sanctuary:</span>
                  <span className="font-semibold text-primary">{confirmedBooking.itemTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Dates:</span>
                  <span className="font-semibold text-primary">{confirmedBooking.checkIn} → {confirmedBooking.checkOut}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Total Paid:</span>
                  <span className="font-bold text-secondary text-sm">${confirmedBooking.totalPrice?.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Link
                  to="/profile"
                  className="flex-1 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold text-center hover:bg-primary-container transition-colors shadow-xs"
                >
                  View in My Reservations
                </Link>
                <button
                  onClick={() => setConfirmedBooking(null)}
                  className="px-5 py-2.5 rounded-full bg-surface-container text-primary text-xs font-semibold hover:bg-surface-container-high transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
