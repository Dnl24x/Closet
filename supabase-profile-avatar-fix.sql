-- A doua șansă — profile avatar upgrade
-- Run once in the Supabase SQL Editor after pulling the latest website code.

begin;

alter table public.profiles
    add column if not exists avatar_color text not null default '#E8E0D6';

update public.profiles
set avatar_color = '#E8E0D6'
where avatar_color is null
   or avatar_color !~ '^#[0-9A-Fa-f]{6}$';

grant select, update on public.profiles to authenticated;
grant select on public.profiles to anon;

commit;
