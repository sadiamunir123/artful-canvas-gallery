drop policy if exists "Anyone can create orders" on public.orders;
drop policy if exists "Anyone can create order items" on public.order_items;

create policy "Public can create pending orders"
on public.orders
for insert
to public
with check (
  status = 'pending'
  and length(trim(customer_name)) > 0
  and length(trim(customer_email)) > 0
  and total_price >= 0
);

create policy "Public can create order items for available artworks"
on public.order_items
for insert
to public
with check (
  price_at_purchase >= 0
  and exists (
    select 1
    from public.artworks a
    where a.id = artwork_id
      and a.available = true
  )
);