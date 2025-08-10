-- Create app_logs table for persistent application logging
create table if not exists public.app_logs (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  level text not null check (level in ('debug','info','warn','error')),
  area text,
  route text,
  message text not null,
  meta jsonb,
  user_id uuid references public.users(id) on delete set null,
  request_id text,
  correlation_id text,
  artifact_type text,
  artifact_path text
);

-- Indexes for common filters
create index if not exists app_logs_created_at_idx on public.app_logs (created_at desc);
create index if not exists app_logs_level_idx on public.app_logs (level);
create index if not exists app_logs_area_idx on public.app_logs (area);
create index if not exists app_logs_route_idx on public.app_logs (route);
create index if not exists app_logs_meta_gin on public.app_logs using gin ((meta));

-- Enable RLS and lock down policies
alter table public.app_logs enable row level security;

-- Admins can read logs
create policy app_logs_select_admin
on public.app_logs for select
to authenticated
using (
  exists (
    select 1 from public.users u
    where u.id = auth.uid() and coalesce(u.is_admin, false) = true
  )
);

-- Only service role can insert logs (server-side)
create policy app_logs_insert_service
on public.app_logs for insert
to service_role
with check (true);

-- Do not allow updates or deletes by default
-- (No policies defined for update/delete)
