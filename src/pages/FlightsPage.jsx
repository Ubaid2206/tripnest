import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FLIGHTS_DATA } from '../data/mockData';
import { createBooking } from '../lib/supabaseClient';

export default function FlightsPage() {
  const { user, showToast } = useApp();
  const [searchParams] = useSearchParams();

  const [fromCity, setFromCity] = useState('New York (JFK)');
  const [toCity, setToCity] = useState(searchParams.get('to') || 'Naples / Amalfi (NAP)');
  const [flightDate, setFlightDate] = useState('2025-10-14');
  const [selectedClass, setSelectedClass] = useState('All'); // All, Private Charter, Commercial Luxury
  
  // Booking modal state
  const [bookingFlight, setBookingFlight] = useState(null);
  const [passengerName, setPassengerName] = useState(user?.user_metadata?.full_name || '');
  const [passengerEmail, setPassengerEmail] = useState(user?.email || '');
  const [passengersCount, setPassengersCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  const filteredFlights = FLIGHTS_DATA.filter((flight) => {
    if (selectedClass !== 'All' && flight.type !== selectedClass) {
      return false;
    }
    return true;
  });

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!passengerEmail) {
      showToast('Please enter an email address for your e-ticket.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const record = await createBooking({
        guestName: passengerName || 'Luxury Passenger',
        guestEmail: passengerEmail,
        itemId: bookingFlight.id,
        itemTitle: `${bookingFlight.airline} (${bookingFlight.flightNumber})`,
        itemType: 'flight',
        location: `${bookingFlight.from} → ${bookingFlight.to}`,
        checkIn: flightDate,
        checkOut: flightDate,
        guests: passengersCount,
        totalPrice: bookingFlight.price * passengersCount
      });

      setBookingSuccess(record);
      showToast('First Class flight suite reserved successfully!', 'success');
    } catch (err) {
      showToast('Flight reservation failed: ' + err.message, 'error');
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
            <span className="text-secondary font-semibold">Flights &amp; Charters</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-primary font-bold">
                Aviation &amp; Private Air Charters
              </h1>
              <p className="text-sm text-on-surface-variant mt-1.5 max-w-2xl">
                Seamless long-haul first-class staterooms and private jet charters connecting global capitals to our private sanctuaries.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed shrink-0 self-start md:self-auto">
              Direct Airside Chauffeur Included
            </span>
          </div>
        </div>

        {/* Search Console */}
        <div className="bg-surface-container-lowest p-5 rounded-3xl shadow-sm border border-surface-container mb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* From City */}
            <div className="md:col-span-3 px-4 py-2.5 rounded-xl bg-surface border border-surface-container">
              <span className="block text-[10px] uppercase font-bold text-outline">Departing From</span>
              <input
                type="text"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                placeholder="City or Airport (e.g. JFK)"
                className="w-full bg-transparent text-sm font-semibold text-primary focus:outline-none"
              />
            </div>

            {/* To Destination */}
            <div className="md:col-span-3 px-4 py-2.5 rounded-xl bg-surface border border-surface-container">
              <span className="block text-[10px] uppercase font-bold text-outline">Arriving At</span>
              <input
                type="text"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                placeholder="Destination (e.g. Naples)"
                className="w-full bg-transparent text-sm font-semibold text-primary focus:outline-none"
              />
            </div>

            {/* Departure Date */}
            <div className="md:col-span-3 px-4 py-2.5 rounded-xl bg-surface border border-surface-container">
              <span className="block text-[10px] uppercase font-bold text-outline">Flight Date</span>
              <input
                type="date"
                value={flightDate}
                onChange={(e) => setFlightDate(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-primary focus:outline-none cursor-pointer"
              />
            </div>

            {/* Filter Mode Selector */}
            <div className="md:col-span-3 px-4 py-2.5 rounded-xl bg-surface border border-surface-container">
              <span className="block text-[10px] uppercase font-bold text-outline">Charter Mode</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-primary focus:outline-none cursor-pointer"
              >
                <option value="All">All Luxury Aviation</option>
                <option value="Private Charter">Private Jet Charters Only</option>
                <option value="Commercial Luxury">Commercial First Class Suites</option>
              </select>
            </div>
          </div>
        </div>

        {/* Flight Results */}
        <div className="space-y-6">
          {filteredFlights.map((flight) => (
            <div
              key={flight.id}
              className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-md transition-all border border-surface-container flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Left Route & Flight Info */}
              <div className="space-y-4 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-surface-container text-xs font-bold text-primary">
                    {flight.airline}
                  </span>
                  <span className="text-xs font-mono text-outline">{flight.flightNumber}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold">
                    {flight.type}
                  </span>
                  <span className="text-xs text-on-surface-variant font-medium">
                    Aircraft: <strong>{flight.aircraft}</strong>
                  </span>
                </div>

                {/* Itinerary Visualization */}
                <div className="grid grid-cols-3 items-center max-w-lg pt-2">
                  <div>
                    <span className="text-2xl font-serif font-bold text-primary block">{flight.departure}</span>
                    <span className="text-xs font-medium text-on-surface-variant truncate block">{flight.from}</span>
                  </div>

                  <div className="flex flex-col items-center px-4">
                    <span className="text-[11px] font-semibold text-outline mb-1">{flight.duration}</span>
                    <div className="w-full flex items-center gap-1">
                      <div className="h-0.5 flex-1 bg-surface-container-high"></div>
                      <span className="material-symbols-outlined text-[16px] text-secondary">flight</span>
                      <div className="h-0.5 flex-1 bg-surface-container-high"></div>
                    </div>
                    <span className="text-[10px] text-secondary font-bold mt-1">{flight.stops}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-serif font-bold text-primary block">{flight.arrival}</span>
                    <span className="text-xs font-medium text-on-surface-variant truncate block">{flight.to}</span>
                  </div>
                </div>

                {/* Amenities Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {flight.amenities.map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-[11px] text-on-surface-variant px-2.5 py-1 rounded-lg bg-surface-container-low">
                      <span className="material-symbols-outlined text-[14px] text-secondary">check</span>
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Price & Booking Action */}
              <div className="lg:border-l lg:border-surface-container lg:pl-8 flex flex-col justify-between items-start lg:items-end shrink-0 pt-4 lg:pt-0 border-t border-surface-container lg:border-t-0">
                <div className="text-left lg:text-right mb-4">
                  <span className="text-[10px] text-outline uppercase tracking-wider block">{flight.classType}</span>
                  <div className="text-3xl font-serif font-bold text-primary">
                    ${flight.price.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-on-surface-variant">All taxes, champagne &amp; chauffeur included</span>
                </div>

                <button
                  onClick={() => setBookingFlight(flight)}
                  className="px-6 py-3 rounded-full bg-secondary hover:bg-on-secondary-container text-on-secondary text-xs font-semibold transition-all shadow-md flex items-center gap-2"
                >
                  <span>Book Flight Suite</span>
                  <span className="material-symbols-outlined text-[16px]">east</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Flight Booking Modal */}
        {bookingFlight && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/70 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-2xl border border-surface-container text-left relative">
              <button
                onClick={() => setBookingFlight(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline hover:text-primary"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>

              <span className="text-xs uppercase font-bold text-secondary tracking-widest block mb-1">
                Aviation Booking
              </span>
              <h3 className="text-xl font-serif font-bold text-primary">
                {bookingFlight.airline}
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {bookingFlight.from} → {bookingFlight.to} · {bookingFlight.classType}
              </p>

              <form onSubmit={handleBookSubmit} className="mt-5 space-y-3.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-outline mb-1">
                    Primary Passenger
                  </label>
                  <input
                    type="text"
                    required
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    placeholder="e.g. Marcus Thorne"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-surface-container text-xs text-primary focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-outline mb-1">
                    E-Ticket Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={passengerEmail}
                    onChange={(e) => setPassengerEmail(e.target.value)}
                    placeholder="marcus@thorne.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-surface-container text-xs text-primary focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-outline mb-1">
                    Passengers Count
                  </label>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface border border-surface-container">
                    <span className="text-xs font-semibold text-primary">{passengersCount} Stateroom Seat(s)</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPassengersCount(Math.max(1, passengersCount - 1))}
                        className="w-6 h-6 rounded-full bg-surface-container text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{passengersCount}</span>
                      <button
                        type="button"
                        onClick={() => setPassengersCount(Math.min(4, passengersCount + 1))}
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
                    ${(bookingFlight.price * passengersCount).toLocaleString()}
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
                    <span>Confirm Flight Suite Reservation</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {bookingSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/70 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-2xl border border-surface-container text-left">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[28px]">flight_takeoff</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-primary">Flight Suite Confirmed</h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Your flight reservation has been saved into Supabase. E-tickets &amp; airport chauffeur voucher have been issued.
              </p>

              <div className="mt-4 p-4 rounded-2xl bg-surface-container-low space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-outline">Ticket Reference:</span>
                  <span className="font-mono font-bold text-primary">{bookingSuccess.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Route:</span>
                  <span className="font-semibold text-primary">{bookingSuccess.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Total Paid:</span>
                  <span className="font-bold text-secondary">${bookingSuccess.totalPrice.toLocaleString()}</span>
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
                    setBookingSuccess(null);
                    setBookingFlight(null);
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
