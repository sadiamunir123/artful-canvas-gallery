-- Remove publicly-readable orders policy (leaks customer PII)
DROP POLICY IF EXISTS "Anyone can select orders" ON public.orders;

-- Remove overlapping unrestricted insert policy on orders (keep validated one)
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;

-- Remove overlapping unrestricted insert policy on order_items (keep validated one)
DROP POLICY IF EXISTS "Anyone can insert order_items" ON public.order_items;

-- Lock down SECURITY DEFINER helper functions: only authenticated users may execute
REVOKE EXECUTE ON FUNCTION public.is_admin_email() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;