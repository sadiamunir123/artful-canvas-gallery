create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

create policy "Admins can view roles"
on public.user_roles
for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can manage roles"
on public.user_roles
for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

alter table public.artworks enable row level security;

drop policy if exists "Anyone can insert artworks" on public.artworks;
drop policy if exists "Anyone can update artworks" on public.artworks;
drop policy if exists "Anyone can delete artworks" on public.artworks;

create policy "Admins can create artworks"
on public.artworks
for insert
to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update artworks"
on public.artworks
for update
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete artworks"
on public.artworks
for delete
to authenticated
using (public.has_role(auth.uid(), 'admin'));

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Orders viewable by email" on public.orders;
drop policy if exists "Order items are viewable" on public.order_items;

create policy "Admins can view orders"
on public.orders
for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can view order items"
on public.order_items
for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));