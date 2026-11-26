-- CANDIDATE. Isolated testing only. No provider calls or charges from this SQL.
begin;
create table if not exists gyste_private.ai_pilot_usage (
 day_utc date not null,
 actor uuid not null,
 request_id uuid not null,
 created_at timestamptz not null default now(),
 primary key (actor,request_id)
);
alter table gyste_private.ai_pilot_usage enable row level security;
revoke all on gyste_private.ai_pilot_usage from public,anon,authenticated;
grant usage on schema gyste_private to service_role;
grant select,insert on gyste_private.ai_pilot_usage to service_role;
create index if not exists ai_pilot_usage_day_idx on gyste_private.ai_pilot_usage(day_utc);
create or replace function public.gyste_ai_reserve_pilot(p_actor uuid,p_request uuid)
returns text language plpgsql security invoker set search_path=''
as $$
declare today date := (now() at time zone 'UTC')::date;
begin
 if p_actor is null or p_request is null then return 'invalid'; end if;
 if not exists(select 1 from public.gyste_moderators where user_id=p_actor) then return 'denied'; end if;
 -- Serialize reservations across accounts, instances and concurrent requests.
 perform pg_catalog.pg_advisory_xact_lock(473261907::bigint);
 if exists(select 1 from gyste_private.ai_pilot_usage where actor=p_actor and request_id=p_request) then return 'duplicate'; end if;
 if (select count(*) from gyste_private.ai_pilot_usage where day_utc=today and actor=p_actor)>=3 then return 'user_limit'; end if;
 if (select count(*) from gyste_private.ai_pilot_usage where day_utc=today)>=10 then return 'daily_limit'; end if;
 if (select count(*) from gyste_private.ai_pilot_usage where day_utc>=date_trunc('month',today::timestamp)::date)>=50 then return 'monthly_limit'; end if;
 insert into gyste_private.ai_pilot_usage(day_utc,actor,request_id) values(today,p_actor,p_request);
 return 'reserved';
end;
$$;
revoke all on function public.gyste_ai_reserve_pilot(uuid,uuid) from public,anon,authenticated;
grant execute on function public.gyste_ai_reserve_pilot(uuid,uuid) to service_role;
commit;
