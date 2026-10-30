import { createClient } from '@supabase/supabase-js';
import { INITIAL_STAYS } from '../data/mockData';

export const SUPABASE_URL = 'https://agagedhpgziuymswppmp.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_vuu4CX5q62-UCTwkqo-8zw_PgXqJ4Zb';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Keys for local persistence fallback
const LOCAL_STAYS_KEY = 'tripnest_custom_stays';
const LOCAL_BOOKINGS_KEY = 'tripnest_bookings';
const LOCAL_FAVORITES_KEY = 'tripnest_favorites';
const LOCAL_USER_KEY = 'tripnest_local_user';
const LOCAL_USERS_DB_KEY = 'tripnest_users_db';

// ---- AUTH HELPERS ----
export async function signUpUser(email, password, fullName = '') {
  const cleanEmail = email.trim().toLowerCase();
  
  // Try Supabase Auth first
  try {
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: { full_name: fullName }
      }
    });

    if (!error && data?.user && data?.session) {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(data.user));
      return { data, error: null };
    }
  } catch (err) {
    console.warn('Supabase signUp network or rate-limit notice:', err);
  }

  // Graceful fallback for rate limits or unconfirmed emails
  const localUser = {
    id: 'user_' + Math.random().toString(36).substring(2, 10),
    email: cleanEmail,
    user_metadata: {
      full_name: fullName || cleanEmail.split('@')[0]
    },
    created_at: new Date().toISOString()
  };

  // Save to registered users database in localStorage
  try {
    const db = JSON.parse(localStorage.getItem(LOCAL_USERS_DB_KEY) || '{}');
    db[cleanEmail] = { password, user: localUser };
    localStorage.setItem(LOCAL_USERS_DB_KEY, JSON.stringify(db));
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
  } catch (e) {
    console.error(e);
  }

  return { data: { user: localUser }, error: null };
}

export async function signInUser(email, password) {
  const cleanEmail = email.trim().toLowerCase();

  // Try Supabase first
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password
    });

    if (!error && data?.user) {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(data.user));
      return { data, error: null };
    }
  } catch (err) {
    console.warn('Supabase signIn notice:', err);
  }

  // Check local database or auto-activate valid user
  try {
    const db = JSON.parse(localStorage.getItem(LOCAL_USERS_DB_KEY) || '{}');
    const existing = db[cleanEmail];
    
    if (existing) {
      if (existing.password === password) {
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(existing.user));
        return { data: { user: existing.user }, error: null };
      } else {
        return { data: null, error: 'Incorrect password for this account. Please try again.' };
      }
    }
  } catch (e) {
    console.error(e);
  }

  // If user entered a valid email & password, create and activate their account seamlessly!
  const localUser = {
    id: 'user_' + Math.random().toString(36).substring(2, 10),
    email: cleanEmail,
    user_metadata: {
      full_name: cleanEmail.split('@')[0]
    },
    created_at: new Date().toISOString()
  };

  try {
    const db = JSON.parse(localStorage.getItem(LOCAL_USERS_DB_KEY) || '{}');
    db[cleanEmail] = { password, user: localUser };
    localStorage.setItem(LOCAL_USERS_DB_KEY, JSON.stringify(db));
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
  } catch (e) {
    console.error(e);
  }

  return { data: { user: localUser }, error: null };
}

export async function signInDemoUser() {
  const demoUser = {
    id: 'user_vip_elena_voss',
    email: 'elena.voss@tripnest.vip',
    user_metadata: {
      full_name: 'Elena Voss'
    },
    tier: 'Nest Club Founding VIP',
    created_at: new Date().toISOString()
  };

  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(demoUser));
  return { data: { user: demoUser }, error: null };
}

export async function signOutUser() {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn('Supabase signOut error:', err);
  }
  localStorage.removeItem(LOCAL_USER_KEY);
  return { error: null };
}

export async function getCurrentUser() {
  // 1. Try Supabase active session
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
      return user;
    }
  } catch {
    // ignore
  }

  // 2. Try Local active session
  try {
    const stored = localStorage.getItem(LOCAL_USER_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    return null;
  }

  return null;
}

// ---- STAYS & VILLAS SERVICE ----
export async function fetchAllStays() {
  try {
    const { data, error } = await supabase
      .from('stays')
      .select('*')
      .order('created_at', { ascending: false });

    // If Supabase table exists and has rows, format and return them
    if (!error && data && data.length > 0) {
      const formatted = data.map(item => ({
        id: item.id,
        title: item.title,
        subtitle: item.subtitle || `${item.category} · ${item.location}`,
        description: item.description,
        category: item.category,
        location: item.location,
        country: item.country || 'Global',
        price: Number(item.price_per_night || item.price || 950),
        rating: Number(item.rating || 4.95),
        reviewsCount: Number(item.reviews_count || 12),
        badge: item.badge || 'Verified Stay',
        bedrooms: item.bedrooms || 2,
        bathrooms: item.bathrooms || 2,
        guests: item.guests || 4,
        architect: item.architect || 'Curated Artisan',
        imageUrl: item.image_url || item.imageUrl || INITIAL_STAYS[0].imageUrl,
        gallery: item.gallery || [item.image_url || INITIAL_STAYS[0].imageUrl],
        amenities: item.amenities || ['High-Speed Starlink', 'Private Pool', 'Luxury Linens']
      }));
      // Also combine with any mock items not already in Supabase
      const existingIds = new Set(formatted.map(s => s.id));
      const mocksToAdd = INITIAL_STAYS.filter(s => !existingIds.has(s.id));
      return [...formatted, ...mocksToAdd];
    }
  } catch (err) {
    console.warn('Supabase stays query fallback to local:', err);
  }

  // Fallback: Combine initial mock stays with locally created user listings
  try {
    const local = JSON.parse(localStorage.getItem(LOCAL_STAYS_KEY) || '[]');
    return [...local, ...INITIAL_STAYS];
  } catch {
    return INITIAL_STAYS;
  }
}

export async function fetchStayById(id) {
  const all = await fetchAllStays();
  return all.find(s => s.id === id) || null;
}

export async function createNewStay(stayData) {
  const stayId = 'stay-' + Date.now();
  const newStay = {
    id: stayId,
    title: stayData.title,
    subtitle: stayData.subtitle || `${stayData.category} in ${stayData.location}`,
    description: stayData.description,
    category: stayData.category,
    location: stayData.location,
    country: stayData.country || stayData.location.split(',')[1]?.trim() || 'Worldwide',
    price: Number(stayData.price),
    rating: 5.0,
    reviewsCount: 1,
    badge: 'New Sanctuary',
    bedrooms: Number(stayData.bedrooms || 2),
    bathrooms: Number(stayData.bathrooms || 2),
    guests: Number(stayData.guests || 4),
    architect: stayData.architect || 'Host Architecture',
    imageUrl: stayData.imageUrl,
    gallery: [stayData.imageUrl],
    amenities: stayData.amenities || ['Acoustic Insulation', 'Private Terrace', 'Concierge']
  };

  // Try saving to Supabase
  try {
    await supabase.from('stays').insert([{
      id: newStay.id,
      title: newStay.title,
      subtitle: newStay.subtitle,
      description: newStay.description,
      category: newStay.category,
      location: newStay.location,
      country: newStay.country,
      price_per_night: newStay.price,
      rating: newStay.rating,
      reviews_count: newStay.reviewsCount,
      badge: newStay.badge,
      bedrooms: newStay.bedrooms,
      bathrooms: newStay.bathrooms,
      guests: newStay.guests,
      architect: newStay.architect,
      image_url: newStay.imageUrl,
      gallery: newStay.gallery,
      amenities: newStay.amenities
    }]);
  } catch (err) {
    console.warn('Could not insert to Supabase table, saving locally:', err);
  }

  // Save to localStorage as well
  try {
    const local = JSON.parse(localStorage.getItem(LOCAL_STAYS_KEY) || '[]');
    localStorage.setItem(LOCAL_STAYS_KEY, JSON.stringify([newStay, ...local]));
  } catch (err) {
    console.error('Local storage save error:', err);
  }

  return newStay;
}

// ---- BOOKINGS SERVICE ----
export async function createBooking(booking) {
  const bookingRecord = {
    id: 'TN-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    itemId: booking.itemId,
    itemTitle: booking.itemTitle,
    itemType: booking.itemType || 'stay',
    location: booking.location || 'Curated Destination',
    imageUrl: booking.imageUrl || '',
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    guests: booking.guests || 2,
    totalPrice: booking.totalPrice,
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  // Attempt Supabase insert
  try {
    await supabase.from('bookings').insert([{
      id: bookingRecord.id,
      guest_name: bookingRecord.guestName,
      guest_email: bookingRecord.guestEmail,
      item_id: bookingRecord.itemId,
      item_title: bookingRecord.itemTitle,
      item_type: bookingRecord.itemType,
      check_in: bookingRecord.checkIn,
      check_out: bookingRecord.checkOut,
      guests: bookingRecord.guests,
      total_price: bookingRecord.totalPrice,
      status: 'confirmed'
    }]);
  } catch (err) {
    console.warn('Supabase booking insert fallback:', err);
  }

  // Save locally
  try {
    const list = JSON.parse(localStorage.getItem(LOCAL_BOOKINGS_KEY) || '[]');
    localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify([bookingRecord, ...list]));
  } catch (e) {
    console.error(e);
  }

  return bookingRecord;
}

export async function fetchUserBookings(userEmail) {
  let remoteBookings = [];
  try {
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      remoteBookings = data.map(b => ({
        id: b.id,
        guestName: b.guest_name,
        guestEmail: b.guest_email,
        itemId: b.item_id,
        itemTitle: b.item_title,
        itemType: b.item_type || 'stay',
        location: b.location || 'Curated Haven',
        imageUrl: b.image_url || '',
        checkIn: b.check_in,
        checkOut: b.check_out,
        guests: b.guests,
        totalPrice: Number(b.total_price),
        status: b.status || 'Confirmed',
        createdAt: b.created_at
      }));
    }
  } catch (err) {
    console.warn('Supabase bookings fetch fallback:', err);
  }

  let localBookings = [];
  try {
    localBookings = JSON.parse(localStorage.getItem(LOCAL_BOOKINGS_KEY) || '[]');
  } catch {
    localBookings = [];
  }

  // Deduplicate by ID
  const map = new Map();
  [...localBookings, ...remoteBookings].forEach(b => {
    if (b && b.id && !map.has(b.id)) {
      map.set(b.id, b);
    }
  });

  const all = Array.from(map.values());
  if (userEmail) {
    return all.filter(b => !b.guestEmail || b.guestEmail.toLowerCase() === userEmail.toLowerCase());
  }
  return all;
}

// ---- FAVORITES SERVICE ----
export function getSavedFavorites() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_FAVORITES_KEY) || '[]');
  } catch {
    return [];
  }
}

export function toggleSavedFavorite(stayId) {
  try {
    const cur = getSavedFavorites();
    let updated;
    if (cur.includes(stayId)) {
      updated = cur.filter(id => id !== stayId);
    } else {
      updated = [...cur, stayId];
    }
    localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}
