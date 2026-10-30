import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { createNewStay } from '../lib/supabaseClient';

export default function HostDashboardPage() {
  const { user, refreshStays, showToast, allStays } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('add'); // 'add', 'listings', 'bookings'

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].key);
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('');
  const [price, setPrice] = useState('1100');
  const [bedrooms, setBedrooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('3');
  const [guests, setGuests] = useState('6');
  const [architect, setArchitect] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuAHO3Yo_mHbbGyUxjdhWkebo95VPquj3_ggy-f8SXFGsq1VaIE4eMaIynO5hvaquJpvan0hN_ftXB3y_zymcTe9h_rJ1Ndk8Nt-Nvm0YhJKmuQO_MtpIcWShNyTp94Q0fG7p_nPnyzt2dfKeIKtmVEvh-O8I1wKEYXdi2T9CXaDZQo0e1kLPPWQVqUIwF1StTbKdFkiA_owziGWx4gyegp-Nc14dtXxcyYAAyXf6ogV');
  const [selectedAmenities, setSelectedAmenities] = useState([
    'Acoustic Soundproofing (Tier 1)',
    'High-speed Starlink Wi-Fi',
    'Private Chef Available'
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preset luxury images for quick picking
  const presetImages = [
    { label: 'Mediterranean Cliffside', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHO3Yo_mHbbGyUxjdhWkebo95VPquj3_ggy-f8SXFGsq1VaIE4eMaIynO5hvaquJpvan0hN_ftXB3y_zymcTe9h_rJ1Ndk8Nt-Nvm0YhJKmuQO_MtpIcWShNyTp94Q0fG7p_nPnyzt2dfKeIKtmVEvh-O8I1wKEYXdi2T9CXaDZQo0e1kLPPWQVqUIwF1StTbKdFkiA_owziGWx4gyegp-Nc14dtXxcyYAAyXf6ogV' },
    { label: 'Kyoto Bamboo Pavilion', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiusWuoAjsf3UFJk9l5xYbu4gvXQNh_QHWwx1Zg66-7EbeZK0CkN8_igZcbQrTEn7rUVCRc_HnrG1Dve38sZovQgAdJ1A8zmCU5ZRbxIqqIanW-pfONVi9EHfcUSwips767kP1vfFVwC-mrbrlBZscDWY_R7fskZ3-Fxblb1dwv0sq705IfsKdANas9OXsgK_vRo_UA6W1xk1YHfZpUDa5uglNH7hfGUnyWLQsFfsK' },
    { label: 'Matterhorn Alpine Chalet', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9VVvE6teQGivnesOM9zDlUGxRVDR-Qvhrn-oPz4A-it1Au7Px_R8Pj35Py67XqVziymijIcBoV_TgWncvqq6Z7zPa-ugUy7kxVBNLa18X63iQy3GhTQaL5UxRVyzntERBgCjhWm6uTod2W8p6cMIe9AzGgX8CkQBR5APCRTAjyUuaboLsm4_Uqv_M0MiV7ALR-WLs1pKwN7JMBjQyPulvxcAkcjLyE2IcvWuTUOhX' },
    { label: 'Bali Jungle Sanctuary', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-y_FwJIGJGUbtNklab6_X_OFEE__zbd2QgYWxSvdUPr9WKfLlFjVQTbx-MNvV-5pPnTwmdqm_BfjV4hJFh73VVwKsKTIwbyqYWPza2-l0Wo0huvZc2L8r4ZU3cEKmT2Mr77jK178Oo_LdEYGW45dnckjL-EeQ693SNV-LRQiZu7KFevgH-Ap55-Ny7Nu7duV08H_rp8kaUFv5FQ5Lrsi8QEZ54Rs_HpEO2lNM0Cea' },
    { label: 'Bordeaux Vineyard Château', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZ8x0c9kLBUlQMA5aeBKomKfpJuOWNUq7r53zwXEoU4Vh9v7gl6klCubqQQnyoHtarpK8ZuzRsw9itzUCQi2DZQ_XIH_hBIwkJ-l-AEKxlb9haLj_-AM3SFN7t7WSgOBRyMYQOFNZRfBCgJ27D10uv7VYtC4NXuErgLBXpYbOkKJvnjMgfUc1AaeDFwQDnkfQbOSfUPFm2Rmd2HwdoUlA64aRSermxTqE-TmdXIR24' },
    { label: 'Nordic Fjord Glass Lodge', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBx7cZJMwdI3mMmkSYF4HFeYtxf96FTVjthNycljcoMB2wuIrwkHn031dvRowCW_erD_ate493bn3rbHYPLMpxnONKjuFny4PoMy0ff4tWPL4lbqmz4Iq9wD8j3uphgMjugPz5AXP1rWN9vmKtZysuGgJqc6gnEmg_ABG5ie8OLrj4u83D6xZH2XK9UwDsdE5oxKsdneW45QIZclDsiJuhbtVQgE8e-k8rpSI_B_ZTH' }
  ];

  const amenityOptions = [
    'Private Infinity Pool',
    'Acoustic Soundproofing (Tier 1)',
    'High-speed Starlink Wi-Fi',
    'Dedicated Michelin Chef Service',
    'Natural Thermal Onsen / Sauna',
    'Private Wine Cellar',
    'Direct Ski-in / Ski-out Access',
    'Helipad or Private Mooring',
    'Organic Farm-to-Table Breakfast',
    'Linen & Cashmere Bedding'
  ];

  const toggleAmenity = (name) => {
    if (selectedAmenities.includes(name)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== name));
    } else {
      setSelectedAmenities([...selectedAmenities, name]);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!title || !location || !price) {
      showToast('Please complete the required property fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createNewStay({
        title,
        subtitle: `${category} · ${location}`,
        description: description || `An extraordinary ${category.toLowerCase()} sanctuary located in ${location}, offering intentional architectural design, acoustic serenity, and bespoke hospitality.`,
        category,
        location,
        country: country || location.split(',')[1]?.trim() || 'Worldwide',
        price: Number(price),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        guests: Number(guests),
        architect: architect || 'Private Architecture Studio',
        imageUrl,
        amenities: selectedAmenities
      });

      await refreshStays();
      showToast(`Sanctuary "${created.title}" successfully published to Supabase!`, 'success');
      navigate(`/stays/${created.id}`);
    } catch (err) {
      showToast('Error publishing sanctuary: ' + err.message, 'error');
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
            <span className="text-secondary font-semibold">Host Portal</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-primary font-bold">
                Host Portal &amp; Sanctuary Listing Studio
              </h1>
              <p className="text-sm text-on-surface-variant mt-1.5 max-w-2xl">
                Publish your private architectural property to the TripNest global network. Live database synchronization via Supabase.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-xs font-semibold text-primary border border-surface-container-high">
                <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
                Supabase Connected
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none mb-8 border-b border-surface-container">
          <button
            onClick={() => setActiveTab('add')}
            className={`pb-3 text-sm font-semibold transition-all relative ${
              activeTab === 'add' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span>Publish New Sanctuary</span>
            {activeTab === 'add' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-secondary rounded-full" />}
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-3 text-sm font-semibold transition-all relative ${
              activeTab === 'listings' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span>Live Properties ({allStays.length})</span>
            {activeTab === 'listings' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-secondary rounded-full" />}
          </button>
        </div>

        {/* Tab 1: Publish New Sanctuary Form */}
        {activeTab === 'add' && (
          <form onSubmit={handlePublish} className="bg-surface-container-lowest p-6 sm:p-10 rounded-3xl shadow-lg border border-surface-container">
            <div className="max-w-4xl space-y-8">
              
              <div>
                <h2 className="text-2xl font-serif font-bold text-primary">Sanctuary Details</h2>
                <p className="text-xs text-on-surface-variant mt-1">Provide architectural specifications for vetting and guest discovery.</p>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
                    Sanctuary Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Villa Fiorita or Kishi Hillside Pavilions"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-surface-container text-sm text-primary placeholder:text-outline-variant focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
                    Architectural Archetype *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-surface-container text-sm text-primary focus:outline-none focus:border-secondary cursor-pointer"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.key} value={c.key}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location & Country */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
                    City / Region &amp; Country *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ravello, Amalfi Coast, Italy"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-surface-container text-sm text-primary placeholder:text-outline-variant focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
                    Nightly Rate (USD $) *
                  </label>
                  <input
                    type="number"
                    required
                    min="100"
                    placeholder="1280"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-surface-container text-sm text-primary placeholder:text-outline-variant focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>

              {/* Capacities */}
              <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-surface-container-low border border-surface-container">
                <div>
                  <label className="block text-[11px] font-bold text-outline uppercase mb-1">Max Guests</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface text-sm font-bold text-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-outline uppercase mb-1">Bedrooms</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface text-sm font-bold text-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-outline uppercase mb-1">Bathrooms</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface text-sm font-bold text-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Architect / Studio */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
                  Architect / Design Studio
                </label>
                <input
                  type="text"
                  placeholder="e.g. Atelier Zaha / Heinz Julen Studio"
                  value={architect}
                  onChange={(e) => setArchitect(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-surface-container text-sm text-primary placeholder:text-outline-variant focus:outline-none focus:border-secondary"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
                  Sanctuary Philosophy &amp; Narrative Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Detail the materials, light, acoustics, and landscape connection..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-surface-container text-sm text-primary placeholder:text-outline-variant focus:outline-none focus:border-secondary"
                />
              </div>

              {/* Image URL & Preset Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
                  Primary High-Resolution Photo URL
                </label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-surface-container text-sm text-primary focus:outline-none focus:border-secondary"
                />
                
                {/* Preset shortcuts */}
                <div className="mt-3">
                  <span className="text-[11px] text-outline block mb-1.5">Or choose a curated architectural photo:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {presetImages.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setImageUrl(img.url)}
                        className={`p-1.5 rounded-xl border text-left text-[10px] font-semibold transition-all ${
                          imageUrl === img.url
                            ? 'border-secondary bg-secondary-fixed/30 text-secondary'
                            : 'border-surface-container bg-surface hover:bg-surface-container'
                        }`}
                      >
                        <img src={img.url} alt={img.label} className="w-full h-12 object-cover rounded-lg mb-1" />
                        <span className="line-clamp-1">{img.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Curated Amenities Checkboxes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-2">
                  Sanctuary Amenities &amp; Services
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {amenityOptions.map((am) => {
                    const checked = selectedAmenities.includes(am);
                    return (
                      <label
                        key={am}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                          checked
                            ? 'bg-secondary-fixed/20 border-secondary/40 text-primary font-semibold'
                            : 'bg-surface border-surface-container text-on-surface-variant hover:bg-surface-container-low'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAmenity(am)}
                          className="accent-secondary w-4 h-4 rounded"
                        />
                        <span>{am}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Publish Submit */}
              <div className="pt-4 border-t border-surface-container flex items-center justify-between">
                <span className="text-xs text-outline">
                  By publishing, you certify that the property complies with TripNest acoustic and fire safety standards.
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 rounded-full bg-secondary hover:bg-on-secondary-container text-on-secondary font-semibold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 group disabled:opacity-50 shrink-0"
                >
                  {isSubmitting ? (
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  ) : (
                    <>
                      <span>Publish Sanctuary</span>
                      <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">cloud_upload</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </form>
        )}

        {/* Tab 2: Live Properties List */}
        {activeTab === 'listings' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allStays.map((stay) => (
                <div
                  key={stay.id}
                  className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-surface-container p-4 flex flex-col justify-between"
                >
                  <div className="flex gap-4">
                    <img
                      src={stay.imageUrl}
                      alt={stay.title}
                      className="w-24 h-24 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-bold text-secondary tracking-wider block">
                        {stay.category}
                      </span>
                      <h4 className="font-serif font-bold text-base text-primary truncate mt-0.5">
                        {stay.title}
                      </h4>
                      <p className="text-xs text-on-surface-variant truncate mt-0.5">
                        {stay.location}
                      </p>
                      <div className="text-xs font-bold text-primary mt-2">
                        ${stay.price.toLocaleString()} <span className="font-normal text-[10px] text-outline">/ night</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[11px] text-green-700 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                      Live in Catalog
                    </span>
                    <Link
                      to={`/stays/${stay.id}`}
                      className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1"
                    >
                      <span>View Sanctuary</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
