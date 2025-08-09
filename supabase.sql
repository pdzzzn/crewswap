-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.duties (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  date timestamp with time zone NOT NULL,
  user_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  pairing text,
  CONSTRAINT duties_pkey PRIMARY KEY (id),
  CONSTRAINT duties_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.flight_legs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  duty_id uuid,
  flight_number text NOT NULL,
  departure_time timestamp with time zone NOT NULL,
  arrival_time timestamp with time zone NOT NULL,
  departure_location text NOT NULL,
  arrival_location text NOT NULL,
  is_deadhead boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT flight_legs_pkey PRIMARY KEY (id),
  CONSTRAINT flight_legs_duty_id_fkey FOREIGN KEY (duty_id) REFERENCES public.duties(id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  type USER-DEFINED NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  swap_request_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT notifications_swap_request_id_fkey FOREIGN KEY (swap_request_id) REFERENCES public.swap_requests(id)
);
CREATE TABLE public.swap_requests (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  sender_id uuid,
  receiver_id uuid,
  sender_duty_id uuid,
  target_duty_id uuid,
  status USER-DEFINED DEFAULT 'PENDING'::"SwapRequestStatus",
  message text,
  response_message text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT swap_requests_pkey PRIMARY KEY (id),
  CONSTRAINT swap_requests_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id),
  CONSTRAINT swap_requests_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(id),
  CONSTRAINT swap_requests_sender_duty_id_fkey FOREIGN KEY (sender_duty_id) REFERENCES public.duties(id),
  CONSTRAINT swap_requests_target_duty_id_fkey FOREIGN KEY (target_duty_id) REFERENCES public.duties(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL,
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  role USER-DEFINED NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  base USER-DEFINED DEFAULT 'PMI'::"EWLBases",
  is_admin boolean DEFAULT false,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);