-- CANDIDATE ONLY. Review and test in isolated Supabase before applying.
-- One RPC call is a database transaction. SECURITY INVOKER preserves existing RLS.
begin;
create or replace function public.gyste_publish_limited_atomic(
 p_id uuid,p_content text,p_audience text,p_member_ids uuid[],
 p_media_url text,p_media_type text,p_media_path text,p_space_id uuid
) returns uuid
language plpgsql security invoker set search_path = ''
as $function$
declare
 actor uuid := auth.uid();
 previous public.posts%rowtype;
 actual uuid[];
 expected uuid[];
begin
 if actor is null then raise exception 'authentication_required' using errcode='42501'; end if;
 if p_id is null or p_content is null or char_length(p_content)>5000
   or p_audience is null or p_audience not in ('selected','except')
   or coalesce(cardinality(p_member_ids),0) not between 1 and 100
   or array_position(p_member_ids,null) is not null
   or actor = any(p_member_ids)
   or (p_media_path is not null and not starts_with(p_media_path,actor::text||'/'||p_id::text||'-'))
   or (p_media_path is null and (p_media_type is not null or p_media_url is not null))
   or (p_media_url is not null and not starts_with(p_media_url,'gyste-gallery-v1:'))
   or (p_media_path is not null and (p_media_type is null or p_media_type not in ('image/jpeg','image/png','image/webp','video/mp4','video/webm')))
 then raise exception 'invalid_publication' using errcode='22023'; end if;
 select array_agg(distinct member order by member) into expected from unnest(p_member_ids) as u(member);
 insert into public.posts(id,user_id,content,audience,media_url,media_type,media_path,space_id)
 values(p_id,actor,p_content,p_audience,p_media_url,p_media_type,p_media_path,p_space_id)
 on conflict (id) do nothing;
 select * into previous from public.posts where id=p_id and user_id=actor;
 if not found or previous.content is distinct from p_content or previous.audience is distinct from p_audience
 or previous.media_url is distinct from p_media_url or previous.media_type is distinct from p_media_type
 or previous.media_path is distinct from p_media_path or previous.space_id is distinct from p_space_id
 or previous.repost_of is not null
 then raise exception 'publication_conflict' using errcode='42501'; end if;
 insert into public.gyste_post_audience(post_id,owner_id,member_ids)
 values(p_id,actor,expected) on conflict (post_id) do nothing;
 select array_agg(distinct member order by member) into actual
 from public.gyste_post_audience a cross join lateral unnest(a.member_ids) as u(member)
 where a.post_id=p_id and a.owner_id=actor;
 if actual is distinct from expected then raise exception 'audience_conflict' using errcode='42501'; end if;
 return p_id;
end;
$function$;
revoke all on function public.gyste_publish_limited_atomic(uuid,text,text,uuid[],text,text,text,uuid) from public,anon;
grant execute on function public.gyste_publish_limited_atomic(uuid,text,text,uuid[],text,text,text,uuid) to authenticated;
commit;
