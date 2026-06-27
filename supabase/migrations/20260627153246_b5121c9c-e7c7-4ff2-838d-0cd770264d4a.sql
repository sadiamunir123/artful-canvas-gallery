
-- 1. Private schema for SECURITY DEFINER helpers (not exposed via PostgREST)
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated, anon, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

CREATE OR REPLACE FUNCTION private.is_admin_email()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT private.has_role(auth.uid(), 'admin'::public.app_role) $$;

CREATE OR REPLACE FUNCTION private.is_checkout_active(_order_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.order_checkout_validations WHERE order_id = _order_id AND expires_at > now()) $$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.is_admin_email() FROM PUBLIC;
REVOKE ALL ON FUNCTION private.is_checkout_active(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION private.is_admin_email() TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION private.is_checkout_active(uuid) TO authenticated, anon, service_role;

-- 2. Recreate policies to reference private.* helpers
DROP POLICY IF EXISTS "Admin email can view orders" ON public.orders;
CREATE POLICY "Admin email can view orders" ON public.orders
  FOR SELECT TO authenticated USING (private.is_admin_email());

DROP POLICY IF EXISTS "Admin email can create artworks" ON public.artworks;
CREATE POLICY "Admin email can create artworks" ON public.artworks
  FOR INSERT TO authenticated WITH CHECK (private.is_admin_email());

DROP POLICY IF EXISTS "Admin email can delete artworks" ON public.artworks;
CREATE POLICY "Admin email can delete artworks" ON public.artworks
  FOR DELETE TO authenticated USING (private.is_admin_email());

DROP POLICY IF EXISTS "Admin email can update artworks" ON public.artworks;
CREATE POLICY "Admin email can update artworks" ON public.artworks
  FOR UPDATE TO authenticated USING (private.is_admin_email()) WITH CHECK (private.is_admin_email());

DROP POLICY IF EXISTS "Admin email can view order items" ON public.order_items;
CREATE POLICY "Admin email can view order items" ON public.order_items
  FOR SELECT TO authenticated USING (private.is_admin_email());

DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING ((auth.uid() = user_id) OR private.is_admin_email());

-- Storage policies
DROP POLICY IF EXISTS "Admin can delete artwork images" ON storage.objects;
CREATE POLICY "Admin can delete artwork images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'artworks' AND private.is_admin_email());

DROP POLICY IF EXISTS "Admin can update artwork images" ON storage.objects;
CREATE POLICY "Admin can update artwork images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'artworks' AND private.is_admin_email());

DROP POLICY IF EXISTS "Admin can upload artwork images" ON storage.objects;
CREATE POLICY "Admin can upload artwork images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'artworks' AND private.is_admin_email());

-- 3. order_items INSERT: require price to match artwork price, and use private validation helper
DROP POLICY IF EXISTS "Public can create order items for pending orders" ON public.order_items;
CREATE POLICY "Public can create order items for pending orders" ON public.order_items
  FOR INSERT TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.artworks a
      WHERE a.id = order_items.artwork_id
        AND a.available = true
        AND a.price = order_items.price_at_purchase
    )
    AND private.is_checkout_active(order_items.order_id)
  );

-- 4. Remove public SELECT on order_checkout_validations (enumeration risk)
DROP POLICY IF EXISTS "Public can validate recent checkout orders" ON public.order_checkout_validations;

-- 5. Drop the now-unused public-schema helper functions
DROP FUNCTION IF EXISTS public.is_admin_email();
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
