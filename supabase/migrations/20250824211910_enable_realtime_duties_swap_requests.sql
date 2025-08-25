-- Enable Supabase Realtime on duties and swap_requests tables
-- Adds tables to the default realtime publication with guard for re-runs

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.duties;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END$$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.swap_requests;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END$$;
