-- TripNest Supabase Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/agagedhpgziuymswppmp/sql)

-- 1. Create Stays / Properties table
CREATE TABLE IF NOT EXISTS public.stays (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  country TEXT NOT NULL,
  price_per_night NUMERIC NOT NULL,
  rating NUMERIC DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  image_url TEXT NOT NULL,
  gallery TEXT[] DEFAULT '{}',
  bedrooms INTEGER DEFAULT 1,
  bathrooms INTEGER DEFAULT 1,
  guests INTEGER DEFAULT 2,
  badge TEXT,
  amenities TEXT[] DEFAULT '{}',
  architect TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for stays
ALTER TABLE public.stays ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read stays
CREATE POLICY "Public can view all stays" 
  ON public.stays FOR SELECT 
  USING (true);

-- Allow authenticated users to insert stays (Host Dashboard)
CREATE POLICY "Authenticated users can create stays" 
  ON public.stays FOR INSERT 
  WITH CHECK (true);

-- 2. Create Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  item_id TEXT NOT NULL,
  item_title TEXT NOT NULL,
  item_type TEXT DEFAULT 'stay', -- 'stay', 'flight', 'journey', 'experience'
  check_in DATE,
  check_out DATE,
  guests INTEGER DEFAULT 1,
  total_price NUMERIC NOT NULL,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow public insert and read
CREATE POLICY "Allow public booking creation" 
  ON public.bookings FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow read bookings" 
  ON public.bookings FOR SELECT 
  USING (true);

-- 3. Create Favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  stay_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_email, stay_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read favorites" 
  ON public.favorites FOR SELECT 
  USING (true);

CREATE POLICY "Allow insert favorites" 
  ON public.favorites FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow delete favorites" 
  ON public.favorites FOR DELETE 
  USING (true);
