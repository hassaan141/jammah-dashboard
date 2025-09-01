-- Community Console Database Schema
-- Run this SQL in your Supabase SQL editor

-- Create organization_applications table
CREATE TABLE IF NOT EXISTS public.organization_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_name TEXT NOT NULL,
    organization_type TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    website TEXT,
    facebook TEXT,
    instagram TEXT,
    twitter TEXT,
    prayer_times_url TEXT,
    status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'in_review', 'approved', 'rejected')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create approved organizations table (for quick access)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    website TEXT,
    facebook TEXT,
    instagram TEXT,
    twitter TEXT,
    prayer_times_file_url TEXT,
    location_lat DECIMAL,
    location_lng DECIMAL,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily prayer times table (for fast queries)
CREATE TABLE IF NOT EXISTS public.daily_prayer_times (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    prayer_date DATE NOT NULL,
    fajr_azan TIME,
    fajr_iqamah TIME,
    dhuhr_azan TIME,
    dhuhr_iqamah TIME,
    asr_azan TIME,
    asr_iqamah TIME,
    maghrib_azan TIME,
    maghrib_iqamah TIME,
    isha_azan TIME,
    isha_iqamah TIME,
    jumah_time TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, prayer_date)
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('prayer-times', 'prayer-times', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Public can view prayer times" ON storage.objects
    FOR SELECT USING (bucket_id = 'prayer-times');

CREATE POLICY "Anyone can upload prayer times during application" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'prayer-times');

-- Row Level Security
ALTER TABLE public.organization_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_prayer_times ENABLE ROW LEVEL SECURITY;

-- Policies for organization_applications
CREATE POLICY "Anyone can submit applications" ON public.organization_applications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all applications" ON public.organization_applications
    FOR SELECT USING (auth.email() = 'hassaanfarooqi2000@gmail.com');

CREATE POLICY "Admins can update applications" ON public.organization_applications
    FOR UPDATE USING (auth.email() = 'hassaanfarooqi2000@gmail.com');

-- Policies for organizations (public read, admin write)
CREATE POLICY "Anyone can view approved organizations" ON public.organizations
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage organizations" ON public.organizations
    FOR ALL USING (auth.email() = 'hassaanfarooqi2000@gmail.com');

-- Policies for daily_prayer_times (public read, admin write)
CREATE POLICY "Anyone can view prayer times" ON public.daily_prayer_times
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage prayer times" ON public.daily_prayer_times
    FOR ALL USING (auth.email() = 'hassaanfarooqi2000@gmail.com');

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_daily_prayer_times_org_date ON public.daily_prayer_times(organization_id, prayer_date);
CREATE INDEX IF NOT EXISTS idx_daily_prayer_times_date ON public.daily_prayer_times(prayer_date);
CREATE INDEX IF NOT EXISTS idx_organizations_type ON public.organizations(type);
