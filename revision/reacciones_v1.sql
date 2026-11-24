-- BORRADOR: revisar RLS, privilegios, constraint único y triggers de contador antes de aplicar.
-- El contador histórico posts.likes pasa a representar el total de reacciones, no un saldo.
begin;
alter table public.reactions add column if not exists reaction_type text not null default 'like';
alter table public.reactions add constraint gyste_reaction_type_v1 check (reaction_type in ('like','love','laugh','sad','dislike'));
create policy "gyste_reactions_update_own_v1" on public.reactions for update to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);
grant update (reaction_type) on public.reactions to authenticated;
-- No elimina ni sustituye likes existentes ni modifica triggers de contador.
create or replace function public.gyste_post_likers_v2(p_post_id uuid)
returns table(display_name text,reaction_type text)
language sql stable security definer set search_path=''
as $$
 select coalesce(nullif(p.display_name::text,''),'Miembro de Gyste'),r.reaction_type
 from public.reactions r left join public.gyste_profiles p on p.user_id=r.user_id
 where r.post_id=p_post_id and auth.uid() is not null
 and exists(select 1 from public.posts po where po.id=p_post_id and po.user_id=auth.uid())
 order by r.created_at desc limit 100;
$$;
revoke all on function public.gyste_post_likers_v2(uuid) from public,anon,authenticated;
grant execute on function public.gyste_post_likers_v2(uuid) to authenticated;
commit;
-- Antes de producción: comprobar RLS habilitado, permisos UPDATE de otras columnas,
-- que el trigger no cambia contador en UPDATE de reaction_type, y que existe UNIQUE(post_id,user_id).
-- Probar dos cuentas y anónimo: insertar, cambiar, quitar, reintentar, acceso a lista ajena, contador.
