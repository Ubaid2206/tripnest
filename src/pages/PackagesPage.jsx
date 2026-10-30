import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PACKAGES_DATA } from '../data/mockData';
import { createBooking } from '../lib/supabaseClient';

export default function PackagesPage() {
  const { user, showToast } = useApp();
  const [activePackage, setActivePackage] = useState(PACKAGES_DATA[0]);
  const [bookingJourney, setBookingJourney] = useState(null);

  const [startDate, setStartDate] = useState('2025-10-18');
  const [guests, setGuests] = useState(2);
  const [guestName, setGuestName] = useState(user?.user_metadata?.full_name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBooking, setSuccessBooking] = useState(null);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!guestEmail) {
      showToast('Please provide your email address.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const record = await createBooking({
        guestName: guestName || 'Expedition Guest',
        guestEmail: guestEmail,
        itemId: bookingJourney.id,
        itemTitle: bookingJourney.title,
        itemType: 'journey',
        location: bookingJourney.location,
        checkIn: startDate,
        checkOut: startDate,
        guests: guests,
        totalPrice: bookingJourney.price * guests
      });

      setSuccessBooking(record);
      showToast('Expedition journey reserved successfully!', 'success');
    } catch (err) {
      showToast('Reservation failed: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-surface pt-24 pb-20">
      <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin">
        
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-2">
            <Link to="/" className="hover:text-primary transition-colors">TripNest</Link>
            <span>/</span>
            <span className="text-secondary font-semibold">Curated Expeditions</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-primary font-bold">
                Handcrafted Multi-Day Expeditions
              </h1>
              <p className="text-sm text-on-surface-variant mt-1.5 max-w-2xl">
                All-inclusive deliberate journeys. Private marine vessels, secluded architectural ryokans, and high alpine passes curated with seamless concierge continuity.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed shrink-0 self-start md:self-auto">
              Fully Inclusive · Maximum 6 Guests
            </span>
          </div>
        </div>

        {/* Expedition Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none mb-10 border-b border-surface-container">
          {PACKAGES_DATA.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setActivePackage(pkg)}
              className={`pb-3 text-sm font-semibold transition-all relative shrink-0 ${
                activePackage.id === pkg.id
                  ? 'text-secondary font-bold'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span>{pkg.title}</span>
              {activePackage.id === pkg.id && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-secondary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Selected Expedition Showcase */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-10 shadow-lg border border-surface-container">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Visual & Summary */}
            <div className="lg:col-span-7 space-y-6">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] shadow-md">
                <img
                  src={activePackage.imageUrl}
                  alt={activePackage.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-primary/80 backdrop-blur-md text-on-primary text-xs font-bold uppercase tracking-wider">
                    {activePackage.badge}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-on-surface-variant mb-1">
                  <span className="flex items-center gap-1 font-semibold text-secondary">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    {activePackage.location}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-primary">
                    <span className="material-symbols-outlined text-[16px] text-secondary-container material-symbols-filled">star</span>
                    {activePackage.rating} (Verified Expedition)
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary">
                  {activePackage.title}
                </h2>

                <p className="text-sm text-on-surface-variant mt-3 leading-relaxed">
                  {activePackage.description}
                </p>
              </div>

              {/* Day-by-Day Itinerary Accordions */}
              <div className="pt-4 border-t border-surface-container">
                <h3 className="text-lg font-serif font-bold text-primary mb-4">
                  Day-by-Day Expedition Itinerary
                </h3>

                <div className="space-y-3">
                  {activePackage.itinerary.map((step, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-surface-container-low border border-surface-container/60">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[11px] font-bold">
                          {step.day}
                        </span>
                        <h4 className="text-xs font-bold text-primary">{step.title}</h4>
                      </div>
                      <p className="text-xs text-on-surface-variant pl-1 leading-relaxed">
                        {step.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Inclusions & Booking Card */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Inclusions Card */}
              <div className="p-6 rounded-2xl bg-surface-container-low border border-surface-container">
                <h4 className="text-sm font-serif font-bold text-primary mb-3">
                  Everything Included in Your Journey
                </h4>
                <div className="space-y-2.5">
                  {activePackage.inclusions.map((inc, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-on-surface-variant">
                      <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">check_circle</span>
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Reserve Box */}
              <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-surface-container shadow-sm">
                <div className="flex items-baseline justify-between pb-4 border-b border-surface-container">
                  <div>
                    <span className="text-[10px] text-outline block uppercase tracking-wider">All-Inclusive</span>
                    <div className="text-3xl font-serif font-bold text-primary">
                      ${activePackage.price.toLocaleString()} <span className="text-xs font-sans text-on-surface-variant font-normal">/ guest</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-secondary block">{activePackage.duration}</span>
                    <span className="text-[10px] text-outline">{activePackage.groupSize}</span>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="p-3 rounded-xl bg-surface-container-low text-xs flex items-center justify-between">
                    <span className="text-outline">Flexible cancellation:</span>
                    <span className="font-semibold text-primary">100% refund up to 14 days</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-low text-xs flex items-center justify-between">
                    <span className="text-outline">Concierge continuity:</span>
                    <span className="font-semibold text-primary">24/7 dedicated host</span>
                  </div>
                </div>

                <button
                  onClick={() => setBookingJourney(activePackage)}
                  className="w-full mt-6 py-3.5 rounded-full bg-secondary hover:bg-on-secondary-container text-on-secondary text-xs sm:text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2 group"
                >
                  <span>Reserve Expedition Journey</span>
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">east</span>
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* Expedition Reservation Modal */}
        {bookingJourney && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/70 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-2xl border border-surface-container text-left relative">
              <button
                onClick={() => setBookingJourney(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline hover:text-primary"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>

              <span className="text-xs uppercase font-bold text-secondary tracking-widest block mb-1">
                Expedition Booking
              </span>
              <h3 className="text-xl font-serif font-bold text-primary">
                {bookingJourney.title}
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {bookingJourney.duration} · {bookingJourney.location}
              </p>

              <form onSubmit={handleBook} className="mt-5 space-y-3.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-outline mb-1">
                    Expedition Departure Date
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-surface-container text-xs text-primary focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-outline mb-1">
                    Primary Traveler Name
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Marcus Thorne"
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
                    placeholder="marcus@thorne.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-surface-container text-xs text-primary focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-outline mb-1">
                    Travelers Count
                  </label>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface border border-surface-container">
                    <span className="text-xs font-semibold text-primary">{guests} Guests (Private Staterooms)</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="w-6 h-6 rounded-full bg-surface-container text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{guests}</span>
                      <button
                        type="button"
                        onClick={() => setGuests(Math.min(6, guests + 1))}
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
                    ${(bookingJourney.price * guests).toLocaleString()}
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
                    <span>Confirm Expedition Reservation</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {successBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/70 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-2xl border border-surface-container text-left">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[28px]">explore</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-primary">Expedition Confirmed</h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Your journey has been saved into Supabase. A destination specialist will connect with you to review your preferences.
              </p>

              <div className="mt-4 p-4 rounded-2xl bg-surface-container-low space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-outline">Reference:</span>
                  <span className="font-mono font-bold text-primary">{successBooking.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Journey:</span>
                  <span className="font-semibold text-primary">{successBooking.itemTitle}</span>
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
                    setBookingJourney(null);
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
