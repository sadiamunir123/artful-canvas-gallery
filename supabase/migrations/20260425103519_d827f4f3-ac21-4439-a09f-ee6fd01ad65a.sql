-- Use the signed-in user's verified session email as the backend admin check.
CREATE OR REPLACE FUNCTION public.is_admin_email()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT lower(coalesce(auth.jwt() ->> 'email', '')) = 'iamsadiamunir@gmail.com'
$$;

-- Replace artwork admin policies with the stable email-based admin check.
DROP POLICY IF EXISTS "Admins can create artworks" ON public.artworks;
DROP POLICY IF EXISTS "Admins can update artworks" ON public.artworks;
DROP POLICY IF EXISTS "Admins can delete artworks" ON public.artworks;

CREATE POLICY "Admin email can create artworks"
ON public.artworks
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin_email());

CREATE POLICY "Admin email can update artworks"
ON public.artworks
FOR UPDATE
TO authenticated
USING (public.is_admin_email())
WITH CHECK (public.is_admin_email());

CREATE POLICY "Admin email can delete artworks"
ON public.artworks
FOR DELETE
TO authenticated
USING (public.is_admin_email());

-- Replace order viewing policies with the same stable admin check.
DROP POLICY IF EXISTS "Admins can view orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view order items" ON public.order_items;

CREATE POLICY "Admin email can view orders"
ON public.orders
FOR SELECT
TO authenticated
USING (public.is_admin_email());

CREATE POLICY "Admin email can view order items"
ON public.order_items
FOR SELECT
TO authenticated
USING (public.is_admin_email());

-- Remove old role-management policy dependency on has_role.
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

CREATE POLICY "Admin email can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.is_admin_email())
WITH CHECK (public.is_admin_email());

CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin_email());

-- Remove fragile admin RPC helpers from the old UI flow.
DROP FUNCTION IF EXISTS public.claim_admin_access();
DROP FUNCTION IF EXISTS public.is_current_user_admin();