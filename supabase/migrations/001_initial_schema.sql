-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE "UserRole" AS ENUM ('CAPTAIN', 'FIRST_OFFICER', 'PURSER', 'CABIN_ATTENDANT');
CREATE TYPE "SwapRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'DENIED', 'CANCELLED');
CREATE TYPE "NotificationType" AS ENUM ('SWAP_REQUEST_RECEIVED', 'SWAP_REQUEST_APPROVED', 'SWAP_REQUEST_DENIED', 'SWAP_REQUEST_CANCELLED');
CREATE TYPE "EWLBases" AS ENUM ('PMI', 'ARN', 'PRG', 'SZG', 'VIE', 'WP_PMI', 'WP_BCN', 'WP_PRG');

-- Users table (extends auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role "UserRole" NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    base "EWLBases" DEFAULT 'PMI',
    is_admin BOOLEAN DEFAULT FALSE
);

-- Duties table
CREATE TABLE public.duties (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    date TIMESTAMPTZ NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    pairing TEXT
);

-- Flight legs table
CREATE TABLE public.flight_legs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    duty_id UUID REFERENCES public.duties(id) ON DELETE CASCADE,
    flight_number TEXT NOT NULL,
    departure_time TIMESTAMPTZ NOT NULL,
    arrival_time TIMESTAMPTZ NOT NULL,
    departure_location TEXT NOT NULL,
    arrival_location TEXT NOT NULL,
    is_deadhead BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Swap requests table
CREATE TABLE public.swap_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    sender_duty_id UUID REFERENCES public.duties(id) ON DELETE CASCADE,
    target_duty_id UUID REFERENCES public.duties(id) ON DELETE CASCADE,
    status "SwapRequestStatus" DEFAULT 'PENDING',
    message TEXT,
    response_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    type "NotificationType" NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    swap_request_id UUID REFERENCES public.swap_requests(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flight_legs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swap_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;