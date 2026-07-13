-- Private bucket for files users upload from the registration form.
-- Objects are keyed as "<user id>/<filename>" so each user has their own
-- folder; the policies below enforce that a user can only touch their own.
insert into storage.buckets (id, name, public, file_size_limit)
values ('user-uploads', 'user-uploads', false, 5242880)
on conflict (id) do nothing;

create policy "Users can upload to their own folder"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'user-uploads'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "Users can view their own uploads"
on storage.objects for select
to authenticated
using (
  bucket_id = 'user-uploads'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "Users can delete their own uploads"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'user-uploads'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);
