-- Create a non-PII validation table so public checkout can attach items
-- to a just-created pending order without exposing customer details from orders.
CREATE TABLE IF NOT EXISTS public.order_checkout_validations (
  order_id uuid PRIMARY KEY REFERENCES public.orders(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '10 minutes')
);

GRANT SELECT ON public.order_checkout_validations TO anon, authenticated;
GRANT INSERT, DELETE ON public.order_checkout_validations TO service_role;
GRANT ALL ON public.order_checkout_validations TO service_role;

ALTER TABLE public.order_checkout_validations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can validate recent checkout orders" ON public.order_checkout_validations;
CREATE POLICY "Public can validate recent checkout orders"
ON public.order_checkout_validations
FOR SELECT
TO public
USING (expires_at > now());

DROP POLICY IF EXISTS "Service role can manage checkout validations" ON public.order_checkout_validations;
CREATE POLICY "Service role can manage checkout validations"
ON public.order_checkout_validations
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Ensure browser checkout has the minimum table privileges needed for existing policies.
GRANT SELECT ON public.artworks TO anon, authenticated;
GRANT INSERT ON public.orders TO anon, authenticated;
GRANT INSERT ON public.order_items TO anon, authenticated;
GRANT SELECT ON public.order_items TO authenticated;
GRANT SELECT ON public.orders TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.artworks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.artworks TO service_role;
GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.order_items TO service_role;
GRANT ALL ON public.user_roles TO service_role;

-- Populate validation rows automatically when a pending order is created.
CREATE OR REPLACE FUNCTION public.create_order_checkout_validation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.status = 'pending' THEN
    INSERT INTO public.order_checkout_validations (order_id)
    VALUES (NEW.id)
    ON CONFLICT (order_id) DO UPDATE
      SET created_at = now(), expires_at = now() + interval '10 minutes';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_create_order_checkout_validation ON public.orders;
CREATE TRIGGER trigger_create_order_checkout_validation
AFTER INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.create_order_checkout_validation();

REVOKE EXECUTE ON FUNCTION public.create_order_checkout_validation() FROM PUBLIC, anon, authenticated;

-- Update order_items policy to validate against the non-PII checkout validation table.
DROP POLICY IF EXISTS "Public can create order items for pending orders" ON public.order_items;
CREATE POLICY "Public can create order items for pending orders"
ON public.order_items
FOR INSERT
TO public
WITH CHECK (
  price_at_purchase >= 0
  AND EXISTS (
    SELECT 1 FROM public.artworks a
    WHERE a.id = order_items.artwork_id
      AND a.available = true
  )
  AND EXISTS (
    SELECT 1 FROM public.order_checkout_validations v
    WHERE v.order_id = order_items.order_id
      AND v.expires_at > now()
  )
);

-- Restore inventory sync trigger so ordered artworks become unavailable.
CREATE OR REPLACE FUNCTION public.mark_artwork_sold()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.artworks
  SET available = false, updated_at = now()
  WHERE id = NEW.artwork_id;

  DELETE FROM public.order_checkout_validations
  WHERE order_id = NEW.order_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_mark_artwork_sold ON public.order_items;
CREATE TRIGGER trigger_mark_artwork_sold
AFTER INSERT ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.mark_artwork_sold();

REVOKE EXECUTE ON FUNCTION public.mark_artwork_sold() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();