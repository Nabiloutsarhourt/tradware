-- Create documents bucket for uploads if it doesn't exist
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do nothing;

-- Set up RLS for storage.objects
create policy "Allow authenticated users to upload documents"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'documents' );

create policy "Allow everyone to read documents"
on storage.objects for select
using ( bucket_id = 'documents' );

create policy "Allow users to update own documents"
on storage.objects for update
to authenticated
using ( bucket_id = 'documents' and auth.uid() = owner);

create policy "Allow users to delete own documents"
on storage.objects for delete
to authenticated
using ( bucket_id = 'documents' and auth.uid() = owner);
