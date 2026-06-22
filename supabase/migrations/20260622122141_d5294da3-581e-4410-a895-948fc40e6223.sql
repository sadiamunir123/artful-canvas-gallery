-- Lock down SECURITY DEFINER functions: revoke from PUBLIC/anon where unnecessary

-- Trigger-only functions: revoke from everyone (triggers run regardless of EXECUTE grants)
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.mark_artwork_sold() FROM PUBLIC, anon, authenticated;

-- RLS helper functions: only authenticated users need to call these (via policy checks)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin_email() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_email() TO authenticated;

-- Ensure the legacy permissive insert policy on order_items is gone
DROP POLICY IF EXISTS "Anyone can insert order_items" ON public.order_items;