-- Enable pg_cron extension for scheduled jobs (Supabase uses the 'extensions' schema)
create extension if not exists pg_cron with schema extensions;

-- Function to purge logs older than 30 days
create or replace function public.purge_app_logs_30d()
returns void
language sql
security definer
as $$
  delete from public.app_logs
  where created_at < now() - interval '30 days';
$$;

-- Schedule a daily job at 03:15 UTC to purge old logs.
-- If the job already exists, this SELECT will no-op due to the WHERE NOT EXISTS clause.
select
  cron.schedule(
    'purge_app_logs_30d_daily',
    '15 3 * * *',
    $$select public.purge_app_logs_30d();$$
  )
where not exists (
  select 1 from cron.job where jobname = 'purge_app_logs_30d_daily'
);
