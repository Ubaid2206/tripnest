import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CATEGORIES, TESTIMONIALS } from '../data/mockData';

export default function HomePage() {
  const { allStays, favorites, toggleFavorite, showToast } = useApp();
  const navigate = useNavigate();

  // Search console state
  const [activeTab, setActiveTab] = useState('stays');
  const [destination, setDestination] = useState('Amalfi Coast, Italy');
  const [dates, setDates] = useState('Oct 14 – Oct 21, 2025');
  const [guests, setGuests] = useState('2 Guests, 1 Suite');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSubmitted, setInviteSubmitted] = useState(false);

  // Handle main search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (activeTab === 'stays') {
      navigate(`/stays?search=${encodeURIComponent(destination)}`);
    } else if (activeTab === 'flights') {
      navigate(`/flights?to=${encodeURIComponent(destination)}`);
    } else if (activeTab === 'journeys') {
      navigate('/packages');
    } else if (activeTab === 'experiences') {
      navigate('/experiences');
    }
  };

  const handleTrendingClick = (term) => {
    setDestination(term);
    navigate(`/stays?search=${encodeURIComponent(term)}`);
  };

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviteSubmitted(true);
    showToast('Your invitation request has been prioritized with the concierge.', 'success');
    setInviteEmail('');
  };

  // 4 Featured Nests from loaded stays
  const featuredStays = allStays.slice(0, 4);

  return (
    <div className="flex flex-col w-full">
      {/* Immersive Hero Section */}
      <section className="relative w-full pt-28 pb-20 md:pb-28 overflow-hidden bg-primary-container">
        {/* Cinematic Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out" 
          style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBZ8x0c9kLBUlQMA5aeBKomKfpJuOWNUq7r53zwXEoU4Vh9v7gl6klCubqQQnyoHtarpK8ZuzRsw9itzUCQi2DZQ_XIH_hBIwkJ-l-AEKxlb9haLj_-AM3SFN7t7WSgOBRyMYQOFNZRfBCgJ27D10uv7VYtC4NXuErgLBXpYbOkKJvnjMgfUc1AaeDFwQDnkfQbOSfUPFm2Rmd2HwdoUlA64aRSermxTqE-TmdXIR24')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary-container/75 to-surface" />
        
        {/* Ambient radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-secondary/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-[1440px] mx-auto px-margin-mobile lg:px-margin flex flex-col items-center text-center">
          {/* Top Micro Badge */}
          <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-surface-container-lowest/15 backdrop-blur-md text-surface-bright mb-space-lg shadow-sm border border-white/10">
            <span className="material-symbols-outlined text-[16px] text-secondary-fixed">auto_awesome</span>
            <span className="font-label-md text-label-md tracking-wider uppercase text-xs">Curated Portfolios · Season 2025</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display-lg text-display-lg-mobile lg:text-display-lg text-surface-bright max-w-4xl tracking-tight leading-tight font-serif">
            Find Your Sanctuary in the World’s <span className="italic font-normal text-secondary-fixed">Most Inspiring</span> Places
          </h1>
          <p className="mt-space-md font-body-lg text-body-lg text-surface-container-high/90 max-w-2xl font-light">
            Handpicked architectural villas, private alpine hideaways, and slow-crafted journeys curated with unhurried poise and discerning hospitality.
          </p>

          {/* Multi-tab Floating Search Console */}
          <div className="w-full max-w-5xl mt-space-2xl bg-surface-container-lowest/95 backdrop-blur-xl rounded-2xl shadow-2xl p-space-sm sm:p-space-md border border-surface-container transition-all">
            {/* Search Type Tabs */}
            <div className="flex items-center justify-start gap-space-xs pb-space-sm overflow-x-auto scrollbar-none px-space-xs">
              <button 
                type="button"
                onClick={() => setActiveTab('stays')}
                className={`tab-btn flex items-center gap-space-xs px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all ${
                  activeTab === 'stays'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">bed</span>
                <span>Stays &amp; Villas</span>
              </button>

              <button 
                type="button"
                onClick={() => setActiveTab('flights')}
                className={`tab-btn flex items-center gap-space-xs px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all ${
                  activeTab === 'flights'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">flight</span>
                <span>Flights</span>
              </button>

              <button 
                type="button"
                onClick={() => setActiveTab('journeys')}
                className={`tab-btn flex items-center gap-space-xs px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all ${
                  activeTab === 'journeys'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">explore</span>
                <span>Curated Trips</span>
              </button>

              <button 
                type="button"
                onClick={() => setActiveTab('experiences')}
                className={`tab-btn flex items-center gap-space-xs px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all ${
                  activeTab === 'experiences'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">spa</span>
                <span>Experiences</span>
              </button>
            </div>

            {/* Segmented Search Console Inputs */}
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-space-xs bg-surface-container-low rounded-xl p-space-xs items-center mt-space-xs">
              {/* Destination */}
              <div className="md:col-span-4 flex items-center gap-space-sm px-space-md py-space-sm rounded-lg bg-surface hover:bg-surface-container-lowest transition-colors text-left group">
                <span className="material-symbols-outlined text-secondary text-[24px] group-hover:scale-110 transition-transform">location_on</span>
                <div className="min-w-0 flex-1">
                  <span className="block font-label-sm text-label-sm text-outline uppercase tracking-wider text-[10px]">Destination</span>
                  <input 
                    className="w-full bg-transparent font-title-md text-title-md text-primary placeholder:text-outline-variant focus:outline-none truncate text-sm font-semibold" 
                    placeholder="Where to next?" 
                    type="text" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="md:col-span-4 flex items-center gap-space-sm px-space-md py-space-sm rounded-lg bg-surface hover:bg-surface-container-lowest transition-colors text-left group">
                <span className="material-symbols-outlined text-secondary text-[24px] group-hover:scale-110 transition-transform">calendar_today</span>
                <div className="min-w-0 flex-1">
                  <span className="block font-label-sm text-label-sm text-outline uppercase tracking-wider text-[10px]">Check-in / Check-out</span>
                  <input 
                    className="w-full bg-transparent font-title-md text-title-md text-primary placeholder:text-outline-variant focus:outline-none truncate text-sm font-semibold" 
                    placeholder="Select dates" 
                    type="text" 
                    value={dates}
                    onChange={(e) => setDates(e.target.value)}
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="md:col-span-2 flex items-center gap-space-sm px-space-md py-space-sm rounded-lg bg-surface hover:bg-surface-container-lowest transition-colors text-left group">
                <span className="material-symbols-outlined text-secondary text-[24px] group-hover:scale-110 transition-transform">group</span>
                <div className="min-w-0 flex-1">
                  <span className="block font-label-sm text-label-sm text-outline uppercase tracking-wider text-[10px]">Guests</span>
                  <input 
                    className="w-full bg-transparent font-title-md text-title-md text-primary placeholder:text-outline-variant focus:outline-none truncate text-sm font-semibold" 
                    type="text" 
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="md:col-span-2">
                <button 
                  type="submit"
                  className="w-full h-full min-h-[52px] px-space-lg py-space-sm bg-secondary text-on-secondary font-label-md text-label-md rounded-lg flex items-center justify-center gap-space-xs hover:bg-on-secondary-container transition-all shadow-md group font-semibold text-sm"
                >
                  <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform">search</span>
                  <span>Search</span>
                </button>
              </div>
            </form>

            {/* Trending Suggestions */}
            <div className="flex flex-wrap items-center gap-space-xs pt-space-md px-space-xs text-left">
              <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 text-xs">
                <span className="material-symbols-outlined text-[14px] text-secondary">trending_up</span> Trending:
              </span>
              {['Amalfi Coast', 'Kyoto Temples', 'Swiss Chalets', 'Bali Sanctuaries', 'Lofoten Fjords'].map((term) => (
                <button 
                  key={term}
                  type="button"
                  onClick={() => handleTrendingClick(term)}
                  className="px-space-sm py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-colors text-xs"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Curated Categories Row */}
      <section className="w-full py-space-xl bg-surface">
        <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin">
          <div className="flex items-end justify-between mb-space-lg">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary block mb-1 font-bold text-xs">
                Architectural Archetypes
              </span>
              <h2 className="font-headline-md text-headline-md text-primary font-serif">
                Explore by Sanctuary Type
              </h2>
            </div>
            <Link 
              to="/stays"
              className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1"
            >
              <span>View All Categories</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-space-md">
            {CATEGORIES.map((cat) => (
              <Link 
                key={cat.key}
                to={`/stays?category=${encodeURIComponent(cat.key)}`}
                className="group flex flex-col items-center text-center p-space-lg rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all hover:-translate-y-1 shadow-sm border border-surface-container/60"
              >
                <div className="w-14 h-14 rounded-full bg-surface flex items-center justify-center text-primary mb-space-md group-hover:scale-110 group-hover:bg-secondary group-hover:text-on-secondary transition-all shadow-xs">
                  <span className="material-symbols-outlined text-[26px]">{cat.icon}</span>
                </div>
                <span className="font-title-md text-title-md text-primary font-serif font-bold text-sm">
                  {cat.name}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 text-xs">
                  {cat.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Seasonal Destinations (Signature Nests) */}
      <section className="w-full py-space-3xl bg-surface-container-low">
        <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-2xl gap-space-md">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary block mb-1 font-bold text-xs">
                Handpicked Portfolio
              </span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary tracking-tight font-serif">
                Seasonal Signature Nests
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs max-w-xl text-sm">
                Each property adheres to our rigorous acoustic, design, and hospitality standards. Verified private sanctuaries for intentional repose.
              </p>
            </div>
            <Link 
              to="/stays"
              className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-full bg-surface hover:bg-surface-container text-primary font-label-md text-label-md transition-colors shadow-sm self-start md:self-auto border border-surface-container text-xs font-semibold"
            >
              <span>View All 840 Nests</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>

          {/* 4-Card Editorial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
            {featuredStays.map((nest) => {
              const isFav = favorites.includes(nest.id);
              return (
                <article 
                  key={nest.id}
                  className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-surface-container/60"
                >
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-surface-container">
                    <img 
                      src={nest.imageUrl} 
                      alt={nest.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    {/* Overlay Badge */}
                    <div className="absolute top-space-sm left-space-sm flex items-center gap-1.5">
                      <span className="px-space-sm py-1 rounded-full bg-primary/80 backdrop-blur-md text-on-primary font-label-sm text-label-sm uppercase tracking-wider text-[10px] font-bold">
                        {nest.badge}
                      </span>
                    </div>
                    {/* Favorite Button */}
                    <button 
                      type="button"
                      aria-label="Save to favorites" 
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(nest.id);
                      }}
                      className={`absolute top-space-sm right-space-sm w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                        isFav
                          ? 'bg-secondary text-white shadow-md'
                          : 'bg-surface-container-lowest/80 text-primary hover:text-secondary hover:scale-110'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-[20px] ${isFav ? 'material-symbols-filled' : ''}`}>
                        favorite
                      </span>
                    </button>
                  </div>

                  <div className="p-space-lg flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm mb-1 text-xs">
                        <span className="flex items-center gap-1 truncate">
                          <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                          {nest.location}
                        </span>
                        <span className="flex items-center gap-1 font-title-md text-title-md text-primary font-bold">
                          <span className="material-symbols-outlined text-[16px] text-secondary-container material-symbols-filled">star</span>
                          {nest.rating}
                        </span>
                      </div>
                      <Link to={`/stays/${nest.id}`}>
                        <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors font-serif font-bold text-lg">
                          {nest.title}
                        </h3>
                      </Link>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-1 text-xs">
                        {nest.subtitle}
                      </p>
                    </div>

                    <div className="pt-space-md mt-space-md border-t border-surface-container-low flex items-baseline justify-between">
                      <div>
                        <span className="font-label-sm text-label-sm text-outline block text-[10px]">From</span>
                        <div className="font-title-lg text-title-lg text-primary font-semibold text-base">
                          ${nest.price.toLocaleString()} <span className="font-body-sm text-body-sm text-on-surface-variant font-normal text-xs">/ night</span>
                        </div>
                      </div>
                      <Link 
                        to={`/stays/${nest.id}`}
                        className="font-label-md text-label-md text-secondary group-hover:translate-x-1 transition-transform inline-flex items-center text-xs font-semibold"
                      >
                        Reserve →
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Curated Experiences & Handcrafted Journeys Spotlight */}
      <section className="w-full py-space-3xl bg-surface">
        <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin">
          <div className="relative rounded-3xl bg-primary text-on-primary overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              {/* Text Column */}
              <div className="lg:col-span-6 p-space-xl md:p-space-3xl flex flex-col z-10">
                <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-surface-container-lowest/15 backdrop-blur-md text-secondary-fixed w-max mb-space-md text-xs">
                  <span className="material-symbols-outlined text-[16px]">travel_explore</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider">All-Inclusive Bespoke Travel</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-surface-bright tracking-tight font-serif">
                  Handcrafted Multi-Day Journeys
                </h2>
                <p className="mt-space-md font-body-lg text-body-lg text-primary-fixed-dim/90 font-light text-sm sm:text-base">
                  Beyond just a place to sleep. Embark on seamless itineraries guided by local cultural historians, personal winemakers, and private marine captains.
                </p>

                {/* Key Highlight Checkpoints */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md mt-space-2xl pt-space-lg border-t border-primary-container">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-secondary-fixed mb-1">
                      <span className="material-symbols-outlined text-[20px]">verified</span>
                      <span className="font-title-md text-title-md font-bold text-sm">100% Verified</span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-primary-container text-xs">Audited in-person every 90 days.</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-secondary-fixed mb-1">
                      <span className="material-symbols-outlined text-[20px]">sync_saved_locally</span>
                      <span className="font-title-md text-title-md font-bold text-sm">Flexible Policy</span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-primary-container text-xs">Full refunds up to 14 days before.</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-secondary-fixed mb-1">
                      <span className="material-symbols-outlined text-[20px]">headset_mic</span>
                      <span className="font-title-md text-title-md font-bold text-sm">24/7 Concierge</span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-primary-container text-xs">Dedicated host on WhatsApp &amp; phone.</span>
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="mt-space-2xl flex flex-wrap items-center gap-space-md">
                  <Link 
                    to="/packages"
                    className="px-space-xl py-space-sm bg-secondary text-on-secondary font-label-md text-label-md rounded-full hover:bg-on-secondary-container transition-all shadow-lg flex items-center gap-space-xs text-xs font-semibold"
                  >
                    <span>Explore 2025 Expeditions</span>
                    <span className="material-symbols-outlined text-[18px]">east</span>
                  </Link>
                  <Link 
                    to="/experiences"
                    className="px-space-lg py-space-sm text-surface-bright font-label-md text-label-md hover:text-secondary-fixed transition-colors text-xs"
                  >
                    View Single-Day Experiences →
                  </Link>
                </div>
              </div>

              {/* Visual Column */}
              <div className="lg:col-span-6 relative h-[420px] lg:h-[620px] w-full overflow-hidden">
                <div 
                  className="w-full h-full bg-cover bg-center" 
                  style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBx7cZJMwdI3mMmkSYF4HFeYtxf96FTVjthNycljcoMB2wuIrwkHn031dvRowCW_erD_ate493bn3rbHYPLMpxnONKjuFny4PoMy0ff4tWPL4lbqmz4Iq9wD8j3uphgMjugPz5AXP1rWN9vmKtZysuGgJqc6gnEmg_ABG5ie8OLrj4u83D6xZH2XK9UwDsdE5oxKsdneW45QIZclDsiJuhbtVQgE8e-k8rpSI_B_ZTH')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-primary via-transparent to-transparent" />
                
                {/* Floating Journey Card */}
                <div className="absolute bottom-space-lg right-space-lg bg-surface-container-lowest/90 backdrop-blur-md p-space-lg rounded-2xl shadow-xl max-w-xs text-primary hidden sm:block border border-white/20">
                  <div className="flex items-center gap-space-sm mb-space-xs">
                    <span className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                      <span className="material-symbols-outlined text-[18px]">sailing</span>
                    </span>
                    <div>
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline block text-[10px]">Featured Journey</span>
                      <span className="font-title-md text-title-md font-bold text-sm">Aegean Archipelago (7 Days)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-space-sm pt-space-xs border-t border-surface-container font-body-sm text-body-sm text-xs">
                    <span className="text-on-surface-variant">Small groups (Max 6)</span>
                    <span className="font-semibold text-secondary">$4,250 / guest</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition: Why Choose TripNest */}
      <section className="w-full py-space-3xl bg-surface-container-low">
        <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin">
          <div className="text-center max-w-2xl mx-auto mb-space-2xl">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary block mb-1 font-bold text-xs">
              The TripNest Standard
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary tracking-tight font-serif">
              Travel Elevated with Certainty
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs text-sm">
              We exist to eliminate the unpredictability of luxury travel. Every detail is vetted through our uncompromising filter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-xl">
            {/* Pillar 1 */}
            <div className="bg-surface-container-lowest p-space-2xl rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group border border-surface-container">
              <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center text-secondary mb-space-lg group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                <span className="material-symbols-outlined text-[32px]">checklist_rtl</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-space-sm font-serif font-bold text-lg">
                Hand-Vetted Stays
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                Each property undergoes an unannounced 50-point physical inspection assessing acoustic insulation, thread counts, kitchen amenities, and host responsiveness.
              </p>
              <div className="mt-space-lg pt-space-md border-t border-surface-container-low flex items-center text-primary font-label-md text-label-md text-xs font-semibold">
                <span>Read our vetting criteria</span>
                <span className="material-symbols-outlined text-[18px] ml-1">chevron_right</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-surface-container-lowest p-space-2xl rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group border border-surface-container">
              <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center text-secondary mb-space-lg group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                <span className="material-symbols-outlined text-[32px]">price_check</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-space-sm font-serif font-bold text-lg">
                Transparent Luxury
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                No surprise check-out fees, hidden cleaning charges, or opaque commissions. The nightly rate you see in your preliminary search is the exact final investment.
              </p>
              <div className="mt-space-lg pt-space-md border-t border-surface-container-low flex items-center text-primary font-label-md text-label-md text-xs font-semibold">
                <span>Our price integrity pledge</span>
                <span className="material-symbols-outlined text-[18px] ml-1">chevron_right</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-surface-container-lowest p-space-2xl rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group border border-surface-container">
              <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center text-secondary mb-space-lg group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                <span className="material-symbols-outlined text-[32px]">map</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-space-sm font-serif font-bold text-lg">
                Personalized Itineraries
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                Paired with resident destination insiders who build slow-travel itineraries, secure reservations at unlisted trattorias, and coordinate private transport.
              </p>
              <div className="mt-space-lg pt-space-md border-t border-surface-container-low flex items-center text-primary font-label-md text-label-md text-xs font-semibold">
                <span>Meet our specialists</span>
                <span className="material-symbols-outlined text-[18px] ml-1">chevron_right</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Traveler Stories / Editorial Testimonials */}
      <section className="w-full py-space-3xl bg-surface">
        <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-2xl">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary block mb-1 font-bold text-xs">
                Dispatches from the Field
              </span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary tracking-tight font-serif">
                Traveler Reflections
              </h2>
            </div>
            <div className="flex items-center gap-space-xs mt-space-md md:mt-0 text-sm">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Overall guest satisfaction:</span>
              <span className="inline-flex items-center gap-1 font-title-md text-title-md text-primary font-bold">
                <span className="material-symbols-outlined text-secondary text-[20px] material-symbols-filled">star</span>
                4.96 / 5.0
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            {TESTIMONIALS.map((t, idx) => (
              <blockquote 
                key={idx}
                className="bg-surface-container-low p-space-2xl rounded-2xl flex flex-col justify-between relative shadow-sm border border-surface-container/60"
              >
                <div>
                  <div className="flex items-center gap-1 text-secondary-container mb-space-md">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[18px] material-symbols-filled">star</span>
                    ))}
                  </div>
                  <p className="font-headline-sm text-headline-sm text-primary italic font-serif leading-relaxed text-base">
                    "{t.quote}"
                  </p>
                </div>
                <div className="pt-space-lg mt-space-lg border-t border-surface-container flex items-center justify-between">
                  <div className="flex items-center gap-space-sm">
                    <div className={`w-11 h-11 rounded-full ${t.color} text-on-primary font-title-md text-title-md flex items-center justify-center font-bold text-sm`}>
                      {t.initials}
                    </div>
                    <div>
                      <span className="font-title-md text-title-md text-primary block leading-tight font-bold text-sm">
                        {t.name}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                        {t.location}
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center text-secondary" title="Verified Nest Booking">
                    <span className="material-symbols-outlined text-[20px]">verified</span>
                  </span>
                </div>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Private Members Circle / Club Invite Banner */}
      <section className="w-full pb-space-3xl bg-surface">
        <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin">
          <div className="relative rounded-3xl bg-surface-container-high p-space-xl sm:p-space-3xl overflow-hidden shadow-lg flex flex-col lg:flex-row items-center justify-between gap-space-2xl border border-surface-container">
            {/* Ambient decorative geometry */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />
            
            <div className="max-w-xl text-left z-10">
              <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-surface text-secondary mb-space-md shadow-sm text-xs font-semibold">
                <span className="material-symbols-outlined text-[16px]">stars</span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider">Private Members Circle</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary tracking-tight font-serif">
                Join The Nest Club
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-sm text-sm sm:text-base">
                Receive exclusive 48-hour early access to new villa drops, complimentary room upgrades, and invitations to private opening salons worldwide.
              </p>
            </div>

            <div className="w-full lg:w-auto lg:min-w-[420px] z-10">
              {inviteSubmitted ? (
                <div className="p-4 rounded-2xl bg-surface text-secondary font-medium text-sm flex items-center gap-2 border border-secondary/20">
                  <span className="material-symbols-outlined text-green-700">check_circle</span>
                  <span>Your VIP application has been received. Our concierge will reach out.</span>
                </div>
              ) : (
                <form onSubmit={handleInviteSubmit} className="flex flex-col sm:flex-row gap-space-xs p-1.5 rounded-2xl sm:rounded-full bg-surface shadow-md border border-surface-container">
                  <input 
                    className="w-full px-space-lg py-space-sm rounded-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none text-sm" 
                    placeholder="Enter your private email" 
                    required 
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                  <button 
                    className="shrink-0 px-space-xl py-space-sm bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md rounded-full transition-all shadow-sm text-xs font-semibold" 
                    type="submit"
                  >
                    Request Invite
                  </button>
                </form>
              )}
              <p className="font-body-sm text-body-sm text-outline mt-space-xs px-space-sm text-center sm:text-left text-xs">
                Strictly curated. Zero spam. Unsubscribe at any moment.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
