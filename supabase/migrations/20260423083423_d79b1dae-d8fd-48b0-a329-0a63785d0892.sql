create or replace function public.claim_admin_access()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  current_email text := auth.jwt() ->> 'email';
begin
  if current_user_id is null then
    return false;
  end if;

  if lower(coalesce(current_email, '')) <> 'iamsadiamunir@gmail.com' then
    return false;
  end if;

  insert into public.user_roles (user_id, role)
  values (current_user_id, 'admin')
  on conflict (user_id, role) do nothing;

  return true;
end;
$$;

create or replace function public.is_current_user_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role(auth.uid(), 'admin')
$$;

drop policy if exists "Admins can view roles" on public.user_roles;

create policy "Users can view own roles"
on public.user_roles
for select
to authenticated
using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));