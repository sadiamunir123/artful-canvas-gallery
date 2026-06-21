
-- Assign admin role to the existing admin user
INSERT INTO public.user_roles (user_id, role)
VALUES ('15696688-dc76-43e7-8c99-8bf1de9f27de', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Replace email-based admin check with role-based check (no hardcoded email)
CREATE OR REPLACE FUNCTION public.is_admin_email()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin'::public.app_role)
$$;
