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
