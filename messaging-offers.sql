-- =========================================================
-- A doua șansă: safer messaging + offers
-- Run this once in Supabase SQL Editor.
-- =========================================================

alter table public.messages
    add column if not exists read_at timestamptz;

grant select, insert, update on table public.messages to authenticated;

drop policy if exists "Recipients can mark their received messages as read" on public.messages;
create policy "Recipients can mark their received messages as read"
on public.messages
for update
to authenticated
using (
    exists (
        select 1
        from public.conversations c
        where c.id = messages.conversation_id
          and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
    and sender_id <> auth.uid()
)
with check (
    exists (
        select 1
        from public.conversations c
        where c.id = messages.conversation_id
          and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
    and sender_id <> auth.uid()
);

create table if not exists public.offers (
    id uuid primary key default gen_random_uuid(),
    conversation_id uuid not null references public.conversations(id) on delete cascade,
    listing_id uuid not null references public.listings(id) on delete cascade,
    buyer_id uuid not null references public.profiles(id) on delete cascade,
    seller_id uuid not null references public.profiles(id) on delete cascade,
    amount_mdl numeric(12,2) not null check (amount_mdl > 0),
    percentage_below numeric(5,2) not null check (percentage_below between 1 and 80),
    status text not null default 'pending'
        check (status in ('pending', 'accepted', 'declined', 'withdrawn')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint offers_buyer_not_seller
        check (buyer_id <> seller_id)
);

alter table public.offers enable row level security;

grant select, insert, update on table public.offers to authenticated;

drop policy if exists "Participants can view offers" on public.offers;
create policy "Participants can view offers"
on public.offers
for select
to authenticated
using (
    buyer_id = auth.uid()
    or seller_id = auth.uid()
);

drop policy if exists "Buyers can create offers" on public.offers;
create policy "Buyers can create offers"
on public.offers
for insert
to authenticated
with check (
    buyer_id = auth.uid()
    and buyer_id <> seller_id
    and exists (
        select 1
        from public.listings l
        where l.id = offers.listing_id
          and l.seller_id = offers.seller_id
          and l.status = 'active'
    )
    and exists (
        select 1
        from public.conversations c
        where c.id = offers.conversation_id
          and c.listing_id = offers.listing_id
          and (
              (c.buyer_id = offers.buyer_id and c.seller_id = offers.seller_id)
              or
              (c.buyer_id = offers.seller_id and c.seller_id = offers.buyer_id)
          )
    )
);

drop policy if exists "Participants can update offer status" on public.offers;
create policy "Participants can update offer status"
on public.offers
for update
to authenticated
using (
    buyer_id = auth.uid()
    or seller_id = auth.uid()
)
with check (
    buyer_id = auth.uid()
    or seller_id = auth.uid()
);

create index if not exists offers_conversation_created_at_idx
on public.offers(conversation_id, created_at desc);

create index if not exists offers_listing_id_idx
on public.offers(listing_id);

create index if not exists offers_buyer_id_idx
on public.offers(buyer_id, created_at desc);

create index if not exists offers_seller_id_idx
on public.offers(seller_id, created_at desc);

drop trigger if exists offers_updated_at on public.offers;
create trigger offers_updated_at
before update on public.offers
for each row execute procedure public.update_updated_at();

create index if not exists messages_unread_idx
on public.messages(conversation_id, sender_id, read_at)
where read_at is null;
