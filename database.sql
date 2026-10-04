-- ============================================
-- CLOSET DATABASE
-- ============================================

-- --------------------------------------------
-- PROFILES
-- --------------------------------------------

create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    display_name text not null default '',
    username text unique,
    bio text not null default '',
    location text not null default '',
    avatar_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

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


-- --------------------------------------------
-- LISTINGS
-- --------------------------------------------

create table if not exists public.listings (
    id uuid primary key default gen_random_uuid(),
    seller_id uuid not null references public.profiles(id) on delete cascade,

    title text not null,
    description text not null,
    price_mdl numeric(10, 2) not null check (price_mdl > 0),

    category text not null,
    size text not null,
    condition text not null,

    status text not null default 'active'
        check (status in ('active', 'sold', 'hidden')),

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.listings enable row level security;

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


-- --------------------------------------------
-- LISTING IMAGES
-- --------------------------------------------

create table if not exists public.listing_images (
    id uuid primary key default gen_random_uuid(),
    listing_id uuid not null references public.listings(id) on delete cascade,
    image_url text not null,
    sort_order integer not null default 0,
    created_at timestamptz not null default now()
);

alter table public.listing_images enable row level security;

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


-- --------------------------------------------
-- REVIEWS
-- --------------------------------------------

create table if not exists public.reviews (
    id uuid primary key default gen_random_uuid(),
    reviewer_id uuid not null references public.profiles(id) on delete cascade,
    seller_id uuid not null references public.profiles(id) on delete cascade,

    rating integer not null check (rating between 1 and 5),
    comment text not null default '',

    created_at timestamptz not null default now(),

    constraint reviewer_cannot_review_themselves
        check (reviewer_id <> seller_id)
);

alter table public.reviews enable row level security;

create policy "Reviews are publicly viewable"
on public.reviews
for select
to anon, authenticated
using (true);

create policy "Users can create reviews"
on public.reviews
for insert
to authenticated
with check (auth.uid() = reviewer_id);

create policy "Users can update their own reviews"
on public.reviews
for update
to authenticated
using (auth.uid() = reviewer_id)
with check (auth.uid() = reviewer_id);

create policy "Users can delete their own reviews"
on public.reviews
for delete
to authenticated
using (auth.uid() = reviewer_id);


-- --------------------------------------------
-- PROFILE CREATION AFTER SIGNUP
-- --------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (
        id,
        display_name
    )
    values (
        new.id,
        coalesce(new.raw_user_meta_data ->> 'name', '')
    );

    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();


-- --------------------------------------------
-- UPDATED_AT
-- --------------------------------------------

create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;

create trigger profiles_updated_at
before update on public.profiles
for each row
execute procedure public.update_updated_at();


drop trigger if exists listings_updated_at on public.listings;

create trigger listings_updated_at
before update on public.listings
for each row
execute procedure public.update_updated_at();


-- --------------------------------------------
-- INDEXES
-- --------------------------------------------

create index if not exists listings_seller_id_idx
on public.listings(seller_id);

create index if not exists listings_status_idx
on public.listings(status);

create index if not exists listings_created_at_idx
on public.listings(created_at desc);

create index if not exists listing_images_listing_id_idx
on public.listing_images(listing_id);

create index if not exists reviews_seller_id_idx
on public.reviews(seller_id);


-- --------------------------------------------
-- STORAGE
-- --------------------------------------------

insert into storage.buckets (
    id,
    name,
    public
)
values (
    'listing-images',
    'listing-images',
    true
)
on conflict (id) do nothing;


-- Anyone can view published listing images.
create policy "Public can view listing images"
on storage.objects
for select
to public
using (
    bucket_id = 'listing-images'
);


-- Logged-in users can upload listing images.
create policy "Users can upload listing images"
on storage.objects
for insert
to authenticated
with check (
    bucket_id = 'listing-images'
);


-- Users can update their own uploaded images.
create policy "Users can update their listing images"
on storage.objects
for update
to authenticated
using (
    bucket_id = 'listing-images'
    and owner_id = auth.uid()::text
)
with check (
    bucket_id = 'listing-images'
    and owner_id = auth.uid()::text
);


-- Users can delete their own uploaded images.
create policy "Users can delete their listing images"
on storage.objects
for delete
to authenticated
using (
    bucket_id = 'listing-images'
    and owner_id = auth.uid()::text
);

