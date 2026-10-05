-- ============================================
-- A DOUA SANSA ORDERS / NOVA POST
-- ============================================

create table if not exists public.orders (
    id uuid primary key default gen_random_uuid(),
    listing_id uuid not null references public.listings(id) on delete restrict,
    seller_id uuid not null references public.profiles(id) on delete restrict,
    buyer_id uuid not null references public.profiles(id) on delete restrict,

    buyer_full_name text not null check (char_length(trim(buyer_full_name)) between 2 and 100),
    buyer_phone text not null check (buyer_phone ~ '^\\+373[0-9]{8}$'),
    delivery_city_sector text not null check (char_length(trim(delivery_city_sector)) between 2 and 120),

    pickup_type text not null check (pickup_type in ('locker', 'branch')),
    pickup_number text not null check (char_length(trim(pickup_number)) between 1 and 40),

    status text not null default 'pending_locker_delivery'
        check (status in (
            'pending_locker_delivery',
            'seller_confirmed',
            'shipped',
            'delivered',
            'cancelled'
        )),

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint orders_buyer_not_seller check (buyer_id <> seller_id)
);

alter table public.orders enable row level security;

drop policy if exists "Buyers can create their own orders" on public.orders;
create policy "Buyers can create their own orders"
on public.orders
for insert
to authenticated
with check (
    buyer_id = auth.uid()
    and buyer_id <> seller_id
    and exists (
        select 1
        from public.listings l
        where l.id = orders.listing_id
          and l.seller_id = orders.seller_id
          and l.status = 'active'
    )
);

drop policy if exists "Participants can view their orders" on public.orders;
create policy "Participants can view their orders"
on public.orders
for select
to authenticated
using (
    buyer_id = auth.uid()
    or seller_id = auth.uid()
);

create index if not exists orders_buyer_id_idx
on public.orders(buyer_id, created_at desc);

create index if not exists orders_seller_id_idx
on public.orders(seller_id, created_at desc);

create index if not exists orders_listing_id_idx
on public.orders(listing_id);

drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at
before update on public.orders
for each row execute procedure public.update_updated_at();
