-- A doua șansă — Supabase publishing repair
-- Run this entire file once in the Supabase SQL Editor.
-- It fixes the table-level permissions and RLS rules required for publishing.

begin;

grant usage on schema public to anon, authenticated;

-- The publishing flow needs to create/keep the authenticated user's profile.
grant select, insert, update on public.profiles to authenticated;
grant select on public.profiles to anon;

-- Public marketplace data.
grant select on public.categories to anon, authenticated;
grant select, insert, update, delete on public.listings to authenticated;
grant select on public.listings to anon;
grant select, insert, update, delete on public.listing_images to authenticated;
grant select on public.listing_images to anon;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;

drop policy if exists "Profiles are publicly viewable" on public.profiles;
drop policy if exists "Users can create their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;

create policy "Profiles are publicly viewable"
on public.profiles
for select
to anon, authenticated
using (true);

create policy "Users can create their own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Categories are publicly viewable" on public.categories;

create policy "Categories are publicly viewable"
on public.categories
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Active listings are publicly viewable" on public.listings;
drop policy if exists "Users can create their own listings" on public.listings;
drop policy if exists "Users can update their own listings" on public.listings;
drop policy if exists "Users can delete their own listings" on public.listings;

create policy "Active listings are publicly viewable"
on public.listings
for select
to anon, authenticated
using (
    status = 'active'
    or seller_id = auth.uid()
);

create policy "Users can create their own listings"
on public.listings
for insert
to authenticated
with check (auth.uid() = seller_id);

create policy "Users can update their own listings"
on public.listings
for update
to authenticated
using (auth.uid() = seller_id)
with check (auth.uid() = seller_id);

create policy "Users can delete their own listings"
on public.listings
for delete
to authenticated
using (auth.uid() = seller_id);

drop policy if exists "Listing images are publicly viewable" on public.listing_images;
drop policy if exists "Users can add images to their own listings" on public.listing_images;
drop policy if exists "Users can update images on their own listings" on public.listing_images;
drop policy if exists "Users can delete images from their own listings" on public.listing_images;

create policy "Listing images are publicly viewable"
on public.listing_images
for select
to anon, authenticated
using (
    exists (
        select 1
        from public.listings
        where listings.id = listing_images.listing_id
        and (
            listings.status = 'active'
            or listings.seller_id = auth.uid()
        )
    )
);

create policy "Users can add images to their own listings"
on public.listing_images
for insert
to authenticated
with check (
    exists (
        select 1
        from public.listings
        where listings.id = listing_images.listing_id
        and listings.seller_id = auth.uid()
    )
);

create policy "Users can update images on their own listings"
on public.listing_images
for update
to authenticated
using (
    exists (
        select 1
        from public.listings
        where listings.id = listing_images.listing_id
        and listings.seller_id = auth.uid()
    )
)
with check (
    exists (
        select 1
        from public.listings
        where listings.id = listing_images.listing_id
        and listings.seller_id = auth.uid()
    )
);

create policy "Users can delete images from their own listings"
on public.listing_images
for delete
to authenticated
using (
    exists (
        select 1
        from public.listings
        where listings.id = listing_images.listing_id
        and listings.seller_id = auth.uid()
    )
);

-- Ensure future signups always receive a profile.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (id, display_name)
    values (
        new.id,
        coalesce(new.raw_user_meta_data ->> 'name', '')
    )
    on conflict (id) do nothing;

    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

commit;
