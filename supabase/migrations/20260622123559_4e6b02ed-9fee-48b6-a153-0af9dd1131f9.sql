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

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.mark_artwork_sold() FROM PUBLIC, anon, authenticated;