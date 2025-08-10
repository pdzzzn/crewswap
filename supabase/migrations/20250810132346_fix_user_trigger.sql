-- Harden handle_new_user to bypass RLS via definer and avoid blocking auth creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  -- Attempt to create companion row; never block auth.users insert
  begin
    insert into public.users (id, email, name, role)
    values (
      new.id,
      new.email,
      coalesce(new.raw_user_meta_data->>'name', 'Unknown'),
      coalesce((new.raw_user_meta_data->>'role')::"UserRole", 'CABIN_ATTENDANT')
    )
    on conflict (id) do nothing;
  exception when others then
    -- Log but do not raise; auth creation should proceed regardless
    raise notice 'handle_new_user failed for %: %', new.id, sqlerrm;
  end;
  return new;
end;
$$;

-- Ensure the definer is postgres so RLS is bypassed in Supabase hosted
alter function public.handle_new_user() owner to postgres;
