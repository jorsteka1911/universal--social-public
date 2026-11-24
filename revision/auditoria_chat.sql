-- SOLO LECTURA.
select table_schema,table_name,column_name,data_type,is_nullable
from information_schema.columns where table_schema='public'
and table_name in ('gyste_messages','gyste_notifications','reactions','gyste_profiles','posts')
order by table_name,ordinal_position;
select schemaname,tablename,policyname,roles,cmd,qual,with_check
from pg_policies where (schemaname='public' and tablename in ('gyste_messages','gyste_notifications','reactions','gyste_profiles','posts'))
or (schemaname='storage' and tablename='objects') order by schemaname,tablename,policyname;
select id,public,file_size_limit,allowed_mime_types from storage.buckets order by id;
