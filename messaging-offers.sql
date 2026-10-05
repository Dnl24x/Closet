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
    counter_amount_mdl numeric(12,2),
    status text not null default 'pending'
        check (status in ('pending', 'countered', 'accepted', 'declined', 'withdrawn')),
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


-- SECURITY HARDENING
-- Only the fields used by the client may be updated.
revoke update on table public.messages from authenticated;
grant update (read_at) on table public.messages to authenticated;

revoke update on table public.offers from authenticated;
grant update (status) on table public.offers to authenticated;


-- ---------------------------------------------------------
-- IN-CHAT NEGOTIATION + PAYMENT EXPIRY
-- ---------------------------------------------------------

alter table public.offers
    add column if not exists counter_amount_mdl numeric(12,2);

alter table public.offers
    drop constraint if exists offers_status_check;

alter table public.offers
    add constraint offers_status_check
    check (status in ('pending', 'countered', 'accepted', 'declined', 'withdrawn'));

alter table public.offers
    drop constraint if exists offers_counter_amount_check;

alter table public.offers
    add constraint offers_counter_amount_check
    check (counter_amount_mdl is null or counter_amount_mdl > 0);

alter table public.orders
    add column if not exists offer_id uuid references public.offers(id) on delete restrict;

alter table public.orders
    add column if not exists payment_status text not null default 'pending';

alter table public.orders
    add column if not exists payment_deadline timestamptz;

alter table public.orders
    drop constraint if exists orders_status_check;

alter table public.orders
    add constraint orders_status_check
    check (
        status in (
            'pending_locker_delivery',
            'seller_confirmed',
            'awaiting_payment',
            'shipped',
            'delivered',
            'cancelled'
        )
    );

alter table public.orders
    drop constraint if exists orders_payment_status_check;

alter table public.orders
    add constraint orders_payment_status_check
    check (payment_status in ('pending', 'paid', 'failed', 'expired'));

create unique index if not exists orders_active_offer_unique_idx
on public.orders(offer_id)
where offer_id is not null and status <> 'cancelled';

create index if not exists orders_payment_deadline_idx
on public.orders(payment_deadline)
where status = 'awaiting_payment' and payment_status = 'pending';

create or replace function public.enforce_offer_update()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
    asking_price numeric;
begin
    if
        new.id <> old.id
        or new.conversation_id <> old.conversation_id
        or new.listing_id <> old.listing_id
        or new.buyer_id <> old.buyer_id
        or new.seller_id <> old.seller_id
        or new.amount_mdl <> old.amount_mdl
        or new.percentage_below <> old.percentage_below
    then
        raise exception 'Offer ownership and original terms cannot be changed';
    end if;

    if auth.uid() = old.seller_id then
        if old.status <> 'pending' then
            raise exception 'This offer is no longer waiting for the seller';
        end if;

        if new.status not in ('accepted', 'declined', 'countered') then
            raise exception 'Invalid seller offer response';
        end if;

        if new.status = 'countered' then
            select price_mdl into asking_price
            from public.listings
            where id = old.listing_id
              and seller_id = old.seller_id
              and status = 'active';

            if asking_price is null
               or new.counter_amount_mdl is null
               or new.counter_amount_mdl <= 0
               or new.counter_amount_mdl > asking_price then
                raise exception 'Invalid counter offer amount';
            end if;
        else
            new.counter_amount_mdl := null;
        end if;

    elsif auth.uid() = old.buyer_id then
        if old.status <> 'countered' then
            raise exception 'Only a seller counter offer can be accepted or declined';
        end if;

        if new.status not in ('accepted', 'declined') then
            raise exception 'Invalid buyer counter response';
        end if;

    else
        raise exception 'Only the buyer or seller can respond to this offer';
    end if;

    new.updated_at := now();
    return new;
end;
$$;

drop trigger if exists offers_enforce_update on public.offers;
create trigger offers_enforce_update
before update on public.offers
for each row
execute procedure public.enforce_offer_update();

create or replace function public.cancel_expired_unpaid_orders()
returns void
language sql
security definer
set search_path = public
as $$
    update public.orders
    set
        status = 'cancelled',
        payment_status = 'expired',
        updated_at = now()
    where status = 'awaiting_payment'
      and payment_status = 'pending'
      and payment_deadline is not null
      and payment_deadline <= now();
$$;

revoke update on table public.offers from authenticated;
grant update (status, counter_amount_mdl) on table public.offers to authenticated;

revoke update on table public.messages from authenticated;
grant update (read_at) on table public.messages to authenticated;

revoke update on table public.conversations from authenticated;
grant update (updated_at) on table public.conversations to authenticated;

-- Supabase Cron
-- Enable pg_cron from Supabase Dashboard > Integrations > Cron
-- (or Database > Extensions, depending on the Dashboard view) before running this block.
create extension if not exists pg_cron;

select cron.schedule(
    'cancel-expired-unpaid-orders',
    '*/5 * * * *',
    $select public.cancel_expired_unpaid_orders();$
);
