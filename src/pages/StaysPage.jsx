import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';

export default function StaysPage() {
  const { allStays, loadingStays, favorites, toggleFavorite } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [maxPrice, setMaxPrice] = useState(3000);
  const [sortBy, setSortBy] = useState('featured'); // featured, price-asc, price-desc, rating

  // Filter and sort stays
  const filteredStays = useMemo(() => {
    return allStays.filter((stay) => {
      // Category filter
      if (selectedCategory !== 'All' && stay.category !== selectedCategory) {
        return false;
      }
      // Price filter
      if (stay.price > maxPrice) {
        return false;
      }
      // Keyword search (title, location, country, description, amenities)
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesTitle = stay.title.toLowerCase().includes(q);
        const matchesLocation = stay.location.toLowerCase().includes(q);
        const matchesCountry = (stay.country || '').toLowerCase().includes(q);
        const matchesDesc = (stay.description || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesLocation && !matchesCountry && !matchesDesc) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // default featured
    });
  }, [allStays, selectedCategory, maxPrice, searchTerm, sortBy]);

  const handleCategorySelect = (catKey) => {
    setSelectedCategory(catKey);
    const newParams = new URLSearchParams(searchParams);
    if (catKey === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', catKey);
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setMaxPrice(3000);
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <div className="w-full min-h-screen bg-surface pt-24 pb-20">
      <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin">
        
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-2">
            <Link to="/" className="hover:text-primary transition-colors">TripNest</Link>
            <span>/</span>
            <span className="text-secondary font-semibold">Stays &amp; Villas</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-primary font-bold">
                Curated Stays &amp; Private Villas
              </h1>
              <p className="text-sm text-on-surface-variant mt-1.5 max-w-2xl">
                Acoustically vetted architectural hideaways, cliffside retreats, and historic palazzos. Reserve directly with transparent pricing.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-surface-container text-primary shrink-0 self-start md:self-auto border border-surface-container-high">
              {filteredStays.length} Sanctuaries Available
            </span>
          </div>
        </div>

        {/* Filter Bar Console */}
        <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl shadow-sm border border-surface-container mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-5 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-surface border border-surface-container">
              <span className="material-symbols-outlined text-secondary text-[20px]">search</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by city, country or villa name..."
                className="w-full bg-transparent text-sm text-primary placeholder:text-outline-variant focus:outline-none font-medium"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="text-outline hover:text-primary">
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            {/* Price Slider */}
            <div className="md:col-span-4 flex items-center gap-3 px-3.5 py-2 rounded-xl bg-surface border border-surface-container">
              <span className="material-symbols-outlined text-secondary text-[20px]">payments</span>
              <div className="flex-1">
                <div className="flex justify-between text-[11px] font-semibold text-outline mb-1">
                  <span>Max Price / Night</span>
                  <span className="text-primary">${maxPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="3000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-secondary h-1.5 bg-surface-container rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-surface border border-surface-container">
              <span className="material-symbols-outlined text-secondary text-[20px]">sort</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-primary focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated (Highest Score)</option>
              </select>
            </div>
          </div>

          {/* Category Chips Scrollbar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-surface-container">
            <button
              type="button"
              onClick={() => handleCategorySelect('All')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                selectedCategory === 'All'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
              }`}
            >
              All Sanctuaries
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => handleCategorySelect(cat.key)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                  selectedCategory === cat.key
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stays Grid */}
        {loadingStays ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined animate-spin text-[36px] text-secondary">progress_activity</span>
            <p className="mt-3 text-sm text-on-surface-variant">Gathering verified sanctuaries...</p>
          </div>
        ) : filteredStays.length === 0 ? (
          <div className="text-center py-24 bg-surface-container-lowest rounded-3xl border border-surface-container p-8">
            <span className="material-symbols-outlined text-[48px] text-outline">search_off</span>
            <h3 className="text-xl font-serif font-bold text-primary mt-3">No Sanctuaries Matched Your Search</h3>
            <p className="text-xs text-on-surface-variant mt-1.5 max-w-md mx-auto">
              Try adjusting your destination keyword, increasing your price range, or clearing filters.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-6 px-5 py-2.5 rounded-full bg-secondary text-on-secondary text-xs font-semibold hover:bg-on-secondary-container transition-colors shadow-xs"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStays.map((nest) => {
              const isFav = favorites.includes(nest.id);
              return (
                <article
                  key={nest.id}
                  className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-surface-container/60"
                >
                  {/* Photo Container */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-surface-container">
                    <img
                      src={nest.imageUrl}
                      alt={nest.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    
                    {/* Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-primary/80 backdrop-blur-md text-on-primary font-label-sm uppercase tracking-wider text-[10px] font-bold">
                        {nest.badge || nest.category}
                      </span>
                    </div>

                    {/* Bookmark Toggle */}
                    <button
                      type="button"
                      aria-label="Save to favorites"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(nest.id);
                      }}
                      className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                        isFav
                          ? 'bg-secondary text-white shadow-md'
                          : 'bg-surface-container-lowest/80 text-primary hover:text-secondary hover:scale-110'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-[19px] ${isFav ? 'material-symbols-filled' : ''}`}>
                        favorite
                      </span>
                    </button>
                  </div>

                  {/* Information Box */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-on-surface-variant text-xs mb-1">
                        <span className="flex items-center gap-1 truncate font-medium">
                          <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                          {nest.location}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-primary">
                          <span className="material-symbols-outlined text-[16px] text-secondary-container material-symbols-filled">star</span>
                          {nest.rating}
                        </span>
                      </div>

                      <Link to={`/stays/${nest.id}`}>
                        <h3 className="font-serif font-bold text-base text-primary group-hover:text-secondary transition-colors line-clamp-1">
                          {nest.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-on-surface-variant mt-1 line-clamp-1">
                        {nest.subtitle}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-outline mt-2 pt-2 border-t border-surface-container">
                        <span>{nest.guests} Guests</span>
                        <span>·</span>
                        <span>{nest.bedrooms} Bedrooms</span>
                        <span>·</span>
                        <span>{nest.bathrooms} Baths</span>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-surface-container flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-outline block">From</span>
                        <div className="font-semibold text-primary text-sm">
                          ${nest.price.toLocaleString()} <span className="font-normal text-xs text-on-surface-variant">/ night</span>
                        </div>
                      </div>
                      <Link
                        to={`/stays/${nest.id}`}
                        className="text-xs font-semibold text-secondary group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5"
                      >
                        <span>Reserve</span>
                        <span className="material-symbols-outlined text-[14px]">east</span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
