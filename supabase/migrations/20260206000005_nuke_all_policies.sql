-- NUCLEAR OPTION: Drop ALL policies on archive_tables dynamically
-- This avoids issues with knowing the exact policy names

DO $$
DECLARE
    pol record;
BEGIN
    -- Loop through all policies on archive_tables and drop them one by one
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'archive_tables' 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.archive_tables', pol.policyname);
    END LOOP;
END $$;

-- ============================================
-- RECREATE POLICIES (Clean Set)
-- ============================================

-- ===================
-- ADMIN POLICIES
-- ===================
CREATE POLICY "admin_select_tables" ON public.archive_tables
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "admin_insert_tables" ON public.archive_tables
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "admin_update_tables" ON public.archive_tables
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "admin_delete_tables" ON public.archive_tables
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ===================
-- PIC POLICIES
-- ===================
CREATE POLICY "pic_select_tables" ON public.archive_tables
  FOR SELECT USING (
    team_pic_id = auth.uid() OR
    created_by = auth.uid() OR
    auth.uid() = ANY(pic_ids) OR
    EXISTS (
      SELECT 1 FROM public.teams t
      WHERE t.id = archive_tables.team_id AND t.pic_id = auth.uid()
    )
  );

CREATE POLICY "pic_insert_tables" ON public.archive_tables
  FOR INSERT WITH CHECK (
    -- User must be PIC of the team they're creating table for
    EXISTS (
      SELECT 1 FROM public.teams t
      WHERE t.id = team_id AND t.pic_id = auth.uid()
    )
  );

CREATE POLICY "pic_update_tables" ON public.archive_tables
  FOR UPDATE USING (
    team_pic_id = auth.uid() OR
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.teams t
      WHERE t.id = archive_tables.team_id AND t.pic_id = auth.uid()
    )
  );

CREATE POLICY "pic_delete_tables" ON public.archive_tables
  FOR DELETE USING (
    team_pic_id = auth.uid() OR
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.teams t
      WHERE t.id = archive_tables.team_id AND t.pic_id = auth.uid()
    )
  );

-- ===================
-- TEAM MEMBER POLICIES
-- ===================
CREATE POLICY "team_member_select_tables" ON public.archive_tables
  FOR SELECT USING (
    visibility = 'public' OR
    team_id = (SELECT team_id FROM public.profiles WHERE id = auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.table_permissions tp
      WHERE tp.table_id = id AND tp.user_id = auth.uid() AND tp.can_view = true
    )
  );
