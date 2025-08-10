create policy "users_insert_self"
on "public"."users"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "users_select_self"
on "public"."users"
as permissive
for select
to public
using ((auth.uid() = id));


create policy "users_update_self"
on "public"."users"
as permissive
for update
to public
using ((auth.uid() = id))
with check ((auth.uid() = id));



