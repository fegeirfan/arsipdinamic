-- FIX CIRCULAR DEPENDENCY: archive_tables <-> table_permissions
-- The issue: "team_member_select_tables" checks table_permissions.
-- But "PIC can manage permissions" on table_permissions checks archive_tables.
-- This creates a loop (Infinite Recursion).

-- Solution: Use a SECURITY DEFINER function to check table_permissions.
-- SECURITY DEFINER functions run with the privileges of the creator (postgres/admin),
-- ignoring RLS on the tables they access (table_permissions).

-- 1. Create the helper function
CREATE OR REPLACE FUNCTION public.check_view_permission_bypass_rls(table_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.table_permissions tp
    WHERE tp.table_id = table_uuid
      AND tp.user_id = user_uuid
      AND tp.can_view = true
  );
END;
$$ LANGUAGE plpgsql;

-- 2. Drop the recursive policy
DROP POLICY IF EXISTS "team_member_select_tables" ON public.archive_tables;

-- 3. Recreate the policy using the function
CREATE POLICY "team_member_select_tables" ON public.archive_tables
  FOR SELECT USING (
    visibility = 'public' OR
    team_id = (SELECT team_id FROM public.profiles WHERE id = auth.uid()) OR
    -- Use function to break recursion
    public.check_view_permission_bypass_rls(id, auth.uid())
  );
