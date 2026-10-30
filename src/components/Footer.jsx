import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useApp();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    showToast('Thank you for subscribing to The Travel Dispatch.', 'success');
    setEmail('');
  };

  return (
    <footer className="w-full bg-surface-container-low text-on-surface-variant border-t border-surface-container">
      <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin pt-space-3xl pb-space-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-space-xl mb-space-3xl">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-space-md">
            <div className="flex items-center gap-space-sm">
              <img 
                alt="TripNest Logo" 
                className="h-8 w-auto object-contain" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7pqMW6Yx3bBWa26NVl7rznuVbyTwrcZ7UfOsqRckGQVFEptoAf9OCvZ9PCdKTOZS8O7fDr3eKscUFL4FLC9HzLjYEGAxiyK-xvMYqiU2Kw16MxYQYWyU7bpd30FADa49O1ldyuBA6ERVuN5pKHTJs8mk7fHryplDN1UW8wLnNpLCQaGlvuQ6n3qSoe5N6Rw5IL9Cy5SNOZKwKlyLIkBtCoZFftlH0kGlLH3tw_b2p"
              />
              <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-serif">
                TripNest
              </span>
            </div>
            <p className="font-body-md text-body-md max-w-sm text-on-surface-variant">
              Crafting warm, unhurried sanctuaries and intentional itineraries for the modern explorer. Deliberate travel, curated with architectural poise.
            </p>
            <div className="flex items-center gap-space-md pt-space-xs">
              <button 
                type="button"
                aria-label="Travel Guides" 
                className="w-9 h-9 rounded-full bg-surface flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">menu_book</span>
              </button>
              <button 
                type="button"
                aria-label="Concierge" 
                className="w-9 h-9 rounded-full bg-surface flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">support_agent</span>
              </button>
              <button 
                type="button"
                aria-label="Global Network" 
                className="w-9 h-9 rounded-full bg-surface flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">public</span>
              </button>
            </div>
          </div>

          {/* Top Destinations */}
          <div className="lg:col-span-2 space-y-space-md">
            <h4 className="font-label-md text-label-md uppercase tracking-wider text-primary font-bold">
              Top Destinations
            </h4>
            <ul className="space-y-space-sm font-body-sm text-body-sm">
              <li><Link to="/stays?search=Amalfi" className="hover:text-primary transition-colors">Amalfi Coast, Italy</Link></li>
              <li><Link to="/stays?search=Kyoto" className="hover:text-primary transition-colors">Kyoto Heritage, Japan</Link></li>
              <li><Link to="/stays?search=Bali" className="hover:text-primary transition-colors">Ubud Valley, Bali</Link></li>
              <li><Link to="/stays?search=Zermatt" className="hover:text-primary transition-colors">Zermatt, Switzerland</Link></li>
              <li><Link to="/stays?search=Lofoten" className="hover:text-primary transition-colors">Lofoten, Norway</Link></li>
            </ul>
          </div>

          {/* Curations */}
          <div className="lg:col-span-2 space-y-space-md">
            <h4 className="font-label-md text-label-md uppercase tracking-wider text-primary font-bold">
              Curations
            </h4>
            <ul className="space-y-space-sm font-body-sm text-body-sm">
              <li><Link to="/stays?category=Beachfront+Villas" className="hover:text-primary transition-colors">Coastal Sanctuaries</Link></li>
              <li><Link to="/stays?category=Alpine+Retreats" className="hover:text-primary transition-colors">Alpine Architecture</Link></li>
              <li><Link to="/stays?category=Heritage+Palaces" className="hover:text-primary transition-colors">Historic Palaces</Link></li>
              <li><Link to="/stays?category=Secluded+Cabins" className="hover:text-primary transition-colors">Secluded Cabins</Link></li>
              <li><Link to="/stays?category=Wine+Country" className="hover:text-primary transition-colors">Boutique Vineyard Stays</Link></li>
            </ul>
          </div>

          {/* Newsletter Dispatch */}
          <div className="lg:col-span-4 space-y-space-md">
            <h4 className="font-label-md text-label-md uppercase tracking-wider text-primary font-bold">
              The Travel Dispatch
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Receive quarterly destination monographs, private opening invites, and architectural essays.
            </p>
            {subscribed ? (
              <div className="p-space-md rounded-2xl bg-surface-container text-secondary font-medium text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-green-700">check_circle</span>
                <span>You are on our private dispatch list.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-space-xs">
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address" 
                  required
                  className="flex-1 px-space-md py-space-sm rounded-full bg-surface text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-[0_1px_8px_rgba(14,42,56,0.04)]"
                />
                <button 
                  type="submit"
                  className="px-space-lg py-space-sm bg-secondary text-on-secondary font-label-md text-label-md rounded-full hover:bg-on-secondary-container transition-colors shadow-[0_2px_12px_rgba(160,64,28,0.2)] shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-space-xl border-t border-surface-container flex flex-col md:flex-row items-center justify-between gap-space-md font-body-sm text-body-sm text-outline">
          <p>© 2025 TripNest Travel Inc. Unhurried luxury worldwide · Powered by Supabase</p>
          <div className="flex items-center gap-space-lg">
            <a href="#" className="hover:text-on-surface transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-on-surface transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-on-surface transition-colors">Price Integrity Pledge</a>
            <a href="#" className="hover:text-on-surface transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
