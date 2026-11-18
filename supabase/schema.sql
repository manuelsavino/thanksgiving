-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)

create table if not exists public.dishes (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(trim(name)) between 1 and 80),
  dish        text not null check (char_length(trim(dish)) between 1 and 120),
  category    text not null check (category in ('Appetizer', 'Main', 'Side', 'Dessert', 'Drinks', 'Other')),
  guests      int  not null default 1 check (guests between 1 and 20),
  notes       text check (notes is null or char_length(notes) <= 280)
);

-- Everyone brings something different: no two dishes with the same name
create unique index if not exists dishes_unique_dish on public.dishes (lower(trim(dish)));

alter table public.dishes enable row level security;

-- Anyone with the link can see the list and add a dish (no updates/deletes)
create policy "Anyone can view dishes" on public.dishes
  for select to anon using (true);

create policy "Anyone can add a dish" on public.dishes
  for insert to anon with check (true);
