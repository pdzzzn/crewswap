-- Grant execute on RPC to authenticated and anon (so both client and server can call)
GRANT EXECUTE ON FUNCTION public.batch_create_swap_requests(jsonb, text, boolean) TO authenticated, anon;
