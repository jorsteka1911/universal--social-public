-- REVIEW ONLY: not applied. Requires gyste_private to remain outside exposed schemas.
begin;
create schema if not exists gyste_private;
create table gyste_private.admin_members (
 user_id uuid primary key references auth.users(id) on delete cascade
);
alter table gyste_private.admin_members enable row level security;
revoke all on gyste_private.admin_members from public, anon, authenticated;
create function gyste_private.admin_snapshot_v01() returns jsonb
language plpgsql security definer set search_path = '' as $$
begin
 if auth.uid() is null or not exists (
 select 1 from gyste_private.admin_members a
 join auth.users u on u.id=a.user_id
 join auth.sessions s on s.user_id=u.id
 where a.user_id=auth.uid() and u.deleted_at is null
 and u.confirmed_at is not null
 and s.id::text=auth.jwt()->>'session_id'
 and (s.not_after is null or s.not_after > now())
 and coalesce(auth.jwt()->>'is_anonymous','false')='false'
 and (u.banned_until is null or u.banned_until < now())
 ) then raise exception 'Access denied' using errcode='42501'; end if;
 return jsonb_build_object(
 'registered_users',(select count(*) from auth.users where deleted_at is null),
 'registrations_24h',(select count(*) from auth.users where deleted_at is null and created_at>=now()-interval '24 hours'),
 'latest_registrations',coalesce((select jsonb_agg((to_jsonb(q)-'sort_id') order by q.registered_at desc,q.sort_id desc) from (select u.created_at as registered_at, u.id as sort_id, (select p.username from public.gyste_profiles p where p.user_id=u.id order by p.created_at desc limit 1) as username, u.confirmed_at is not null as confirmed from auth.users u where u.deleted_at is null order by u.created_at desc,u.id desc limit 100) q),'[]'::jsonb),
 'total_posts',(select count(*) from public.posts),
 'pending_feedback',(select count(*) from public.gyste_feedback where status='pending')
 );
end $$;
revoke all on function gyste_private.admin_snapshot_v01() from public,anon,authenticated;
grant usage on schema gyste_private to authenticated;
grant execute on function gyste_private.admin_snapshot_v01() to authenticated;
create function public.gyste_admin_snapshot_v01() returns jsonb
language sql security invoker set search_path='' as $$
 select gyste_private.admin_snapshot_v01();
$$;
revoke all on function public.gyste_admin_snapshot_v01() from public,anon,authenticated;
grant execute on function public.gyste_admin_snapshot_v01() to authenticated;
-- No account is granted administrator rights by this draft.
commit;
