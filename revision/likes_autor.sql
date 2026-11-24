-- BORRADOR: ejecutar solamente tras revisar el esquema y las políticas.
begin;
create or replace function public.gyste_post_likers_v1(p_post_id uuid)
returns table(display_name text)
language sql stable security definer set search_path = ''
as $$
 select coalesce(nullif(p.display_name::text,''),'Miembro de Gyste')
 from public.reactions r
 left join public.gyste_profiles p on p.user_id=r.user_id
 where r.post_id=p_post_id and auth.uid() is not null
 and exists(select 1 from public.posts po where po.id=p_post_id and po.user_id=auth.uid())
 order by r.created_at desc limit 100;
$$;
revoke all on function public.gyste_post_likers_v1(uuid) from public, anon, authenticated;
grant execute on function public.gyste_post_likers_v1(uuid) to authenticated;
commit;
-- Probar propietario, tercero y anónimo, contador y retirada de reacción.
