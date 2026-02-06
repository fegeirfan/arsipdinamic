-- NUCLEAR OPTION for ARCHIVE_COLUMNS
-- Fix potential policy conflicts or zombies on archive_columns

DO $$
DECLARE
    pol record;
BEGIN
    -- Loop through all policies on archive_columns and drop them
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'archive_columns' 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.archive_columns', pol.policyname);
    END LOOP;
END $$;

-- ============================================
-- RECREATE POLICIES FOR ARCHIVE_COLUMNS
-- ============================================

-- 1. Admins: All access
CREATE POLICY "admin_all_columns" ON public.archive_columns
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 2. PIC: All access for their tables (separated for safety)
-- SELECT
CREATE POLICY "pic_select_columns" ON public.archive_columns
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.archive_tables t
      WHERE t.id = archive_columns.table_id 
      AND (
        t.team_pic_id = auth.uid() OR 
        t.created_by = auth.uid() OR
        auth.uid() = ANY(t.pic_ids) OR
        EXISTS (SELECT 1 FROM public.teams tm WHERE tm.id = t.team_id AND tm.pic_id = auth.uid())
      )
    )
  );

-- INSERT
CREATE POLICY "pic_insert_columns" ON public.archive_columns
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.archive_tables t
      WHERE t.id = table_id 
      AND (
        t.team_pic_id = auth.uid() OR 
        t.created_by = auth.uid() OR
        auth.uid() = ANY(t.pic_ids) OR
        EXISTS (SELECT 1 FROM public.teams tm WHERE tm.id = t.team_id AND tm.pic_id = auth.uid())
      )
    )
  );

-- UPDATE
CREATE POLICY "pic_update_columns" ON public.archive_columns
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.archive_tables t
      WHERE t.id = archive_columns.table_id 
      AND (
        t.team_pic_id = auth.uid() OR 
        t.created_by = auth.uid() OR
        auth.uid() = ANY(t.pic_ids) OR
        EXISTS (SELECT 1 FROM public.teams tm WHERE tm.id = t.team_id AND tm.pic_id = auth.uid())
      )
    )
  );

-- DELETE
CREATE POLICY "pic_delete_columns" ON public.archive_columns
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.archive_tables t
      WHERE t.id = archive_columns.table_id 
      AND (
        t.team_pic_id = auth.uid() OR 
        t.created_by = auth.uid() OR
        auth.uid() = ANY(t.pic_ids) OR
        EXISTS (SELECT 1 FROM public.teams tm WHERE tm.id = t.team_id AND tm.pic_id = auth.uid())
      )
    )
  );

-- 3. Team Members / Users: View Only
CREATE POLICY "view_columns_access" ON public.archive_columns
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.archive_tables t
      WHERE t.id = archive_columns.table_id 
      AND (
        t.visibility = 'public' OR
        t.created_by = auth.uid() OR
        t.team_id = (SELECT team_id FROM public.profiles WHERE id = auth.uid()) OR
        auth.uid() = ANY(t.pic_ids) OR
        -- Use the bypass function for permission check safety
        public.check_view_permission_bypass_rls(t.id, auth.uid())
      )
    )
  );
