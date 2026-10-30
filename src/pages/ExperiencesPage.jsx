import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { EXPERIENCES_DATA } from '../data/mockData';
import { createBooking } from '../lib/supabaseClient';

export default function ExperiencesPage() {
  const { user, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookingExp, setBookingExp] = useState(null);
  
  const [expDate, setExpDate] = useState('2025-10-16');
  const [guestCount, setGuestCount] = useState(2);
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestName, setGuestName] = useState(user?.user_metadata?.full_name || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBooking, setSuccessBooking] = useState(null);

  const categories = ['All', 'Marine & Sailing', 'Heritage & Mindfulness', 'Alpine & Aviation', 'Wellness & Culinary'];

  const filtered = EXPERIENCES_DATA.filter((exp) => {
    if (selectedCategory !== 'All' && exp.category !== selectedCategory) return false;
    return true;
  });

  const handleBook = async (e) => {
    e.preventDefault();
    if (!guestEmail) {
      showToast('Please provide your email address.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const record = await createBooking({
        guestName: guestName || 'TripNest Guest',
        guestEmail: guestEmail,
        itemId: bookingExp.id,
        itemTitle: bookingExp.title,
        itemType: 'experience',
        location: bookingExp.location,
        checkIn: expDate,
        checkOut: expDate,
        guests: guestCount,
        totalPrice: bookingExp.price * guestCount
      });

      setSuccessBooking(record);
      showToast('Experience reserved successfully!', 'success');
    } catch (err) {
      showToast('Booking failed: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-surface pt-24 pb-20">
      <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin">
        
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-2">
            <Link to="/" className="hover:text-primary transition-colors">TripNest</Link>
            <span>/</span>
            <span className="text-secondary font-semibold">Experiences</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-primary font-bold">
                Bespoke Single-Day Encounters
              </h1>
              <p className="text-sm text-on-surface-variant mt-1.5 max-w-2xl">
                Led by cultural historians, master artisans, and resident maritime captains. Ultra-small private groups with intimate access.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-surface-container text-primary shrink-0 self-start md:self-auto border border-surface-container-high">
              Private Vetted Guides
            </span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant border border-surface-container'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((exp) => (
            <article
              key={exp.id}
              className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-surface-container flex flex-col sm:flex-row"
            >
              <div className="sm:w-2/5 relative h-56 sm:h-auto overflow-hidden">
                <img
                  src={exp.imageUrl}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-primary/80 backdrop-blur-md text-on-primary text-[10px] font-bold uppercase tracking-wider">
                    {exp.badge}
                  </span>
                </div>
              </div>

              <div className="sm:w-3/5 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-on-surface-variant mb-1">
                    <span className="flex items-center gap-1 font-medium truncate">
                      <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                      {exp.location}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-primary">
                      <span className="material-symbols-outlined text-[16px] text-secondary-container material-symbols-filled">star</span>
                      {exp.rating}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-primary mt-1">
                    {exp.title}
                  </h3>

                  <p className="text-xs text-on-surface-variant mt-2 line-clamp-3 leading-relaxed">
                    {exp.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-4 text-[11px] text-outline">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {exp.duration}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">groups</span>
                      {exp.groupSize}
                    </span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-surface-container flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-outline block">Investment</span>
                    <div className="font-semibold text-primary text-base">
                      ${exp.price.toLocaleString()} <span className="font-normal text-xs text-on-surface-variant">/ guest</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setBookingExp(exp)}
                    className="px-4 py-2 rounded-full bg-secondary hover:bg-on-secondary-container text-on-secondary text-xs font-semibold transition-all shadow-xs flex items-center gap-1"
                  >
                    <span>Reserve</span>
                    <span className="material-symbols-outlined text-[14px]">east</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Experience Reservation Modal */}
        {bookingExp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/70 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-2xl border border-surface-container text-left relative">
              <button
                onClick={() => setBookingExp(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline hover:text-primary"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>

              <span className="text-xs uppercase font-bold text-secondary tracking-widest block mb-1">
                Experience Reservation
              </span>
              <h3 className="text-xl font-serif font-bold text-primary">
                {bookingExp.title}
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {bookingExp.location} · {bookingExp.duration}
              </p>

              <form onSubmit={handleBook} className="mt-5 space-y-3.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-outline mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-surface-container text-xs text-primary focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-outline mb-1">
                    Primary Guest Name
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Elena Voss"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-surface-container text-xs text-primary focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-outline mb-1">
                    Confirmation Email
                  </label>
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="elena@voss-studio.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-surface-container text-xs text-primary focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-outline mb-1">
                    Number of Guests
                  </label>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface border border-surface-container">
                    <span className="text-xs font-semibold text-primary">{guestCount} Guest(s)</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                        className="w-6 h-6 rounded-full bg-surface-container text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{guestCount}</span>
                      <button
                        type="button"
                        onClick={() => setGuestCount(Math.min(6, guestCount + 1))}
                        className="w-6 h-6 rounded-full bg-surface-container text-xs font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-low text-xs flex justify-between items-baseline pt-3">
                  <span className="text-outline">Total Investment</span>
                  <span className="font-serif font-bold text-secondary text-base">
                    ${(bookingExp.price * guestCount).toLocaleString()}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-secondary text-on-secondary text-xs font-semibold hover:bg-on-secondary-container transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  ) : (
                    <span>Confirm Experience Reservation</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Experience Success Modal */}
        {successBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/70 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-2xl border border-surface-container text-left">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[28px]">spa</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-primary">Experience Reserved</h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Your bespoke experience has been registered into Supabase. Your private host will connect via WhatsApp 48 hours prior.
              </p>

              <div className="mt-4 p-4 rounded-2xl bg-surface-container-low space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-outline">Reference:</span>
                  <span className="font-mono font-bold text-primary">{successBooking.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Experience:</span>
                  <span className="font-semibold text-primary">{successBooking.itemTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Date:</span>
                  <span className="font-semibold text-primary">{successBooking.checkIn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Total Paid:</span>
                  <span className="font-bold text-secondary">${successBooking.totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Link
                  to="/profile"
                  className="flex-1 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold text-center hover:bg-primary-container transition-colors"
                >
                  View in Profile
                </Link>
                <button
                  onClick={() => {
                    setSuccessBooking(null);
                    setBookingExp(null);
                  }}
                  className="px-5 py-2.5 rounded-full bg-surface-container text-primary text-xs font-semibold"
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
