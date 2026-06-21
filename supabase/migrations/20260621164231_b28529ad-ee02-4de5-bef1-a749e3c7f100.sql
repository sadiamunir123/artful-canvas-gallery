
-- Strengthen order_items INSERT: require parent order exists and is pending
DROP POLICY IF EXISTS "Public can create order items for available artworks" ON public.order_items;
CREATE POLICY "Public can create order items for pending orders"
ON public.order_items
FOR INSERT
TO public
WITH CHECK (
  price_at_purchase >= 0
  AND EXISTS (
    SELECT 1 FROM public.artworks a
    WHERE a.id = order_items.artwork_id AND a.available = true
  )
  AND EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id
      AND o.status = 'pending'
      AND o.created_at > (now() - interval '10 minutes')
  )
);

-- Prevent public/authenticated users from inserting their own roles.
-- Only the service role (server-side) or an existing admin can manage roles.
DROP POLICY IF EXISTS "Admin email can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
