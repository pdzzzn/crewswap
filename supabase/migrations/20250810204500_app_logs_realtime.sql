-- Enable Supabase Realtime on app_logs so client subscriptions receive INSERT events
-- This adds the table to the default realtime publication
alter publication supabase_realtime add table public.app_logs;
