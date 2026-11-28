-- Run only in the authorized Supabase SQL editor.
-- No schema changes, public grants, or personal identifiers.
select count(*) as registered_users,
 count(*) filter (where confirmed_at is not null) as confirmed_users,
 count(*) filter (where created_at >= now()-interval '24 hours') as registrations_24h,
 count(*) filter (where created_at >= now()-interval '7 days') as registrations_7d,
 count(*) filter (where last_sign_in_at >= now()-interval '24 hours') as recent_sign_ins
from auth.users
where deleted_at is null;
-- Recent sign-ins are not a measure of online presence.

-- Publication activity, not online presence. Aggregate only.
select count(*) as total_posts,
 count(*) filter (where created_at >= now()-interval '24 hours') as posts_24h,
 count(distinct user_id) filter (where created_at >= now()-interval '7 days') as publishing_users_7d
from public.posts;

-- Authorized SQL editor only. Never expose this query directly to clients.
-- Latest 100 registrations, including accounts without a profile.
select (select p.username from public.gyste_profiles p
 where p.user_id=u.id order by p.created_at desc limit 1) as username,
 u.created_at as registered_at,
 u.created_at at time zone 'Europe/Madrid' as registered_local,
 u.confirmed_at is not null as confirmed
from auth.users u where u.deleted_at is null
order by u.created_at desc,u.id desc limit 100;
