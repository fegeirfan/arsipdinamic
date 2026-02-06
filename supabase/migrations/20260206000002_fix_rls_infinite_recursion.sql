-- COMPREHENSIVE FIX: Drop ALL archive_tables policies and recreate properly
-- This fixes infinite recursion by ensuring INSERT policies use only WITH CHECK
-- and never reference the table being inserted into.

-- ============================================
-- DROP ALL EXISTING POLICIES ON ARCHIVE_TABLES
-- ============================================
DROP POLICY IF EXISTS "Admins can do everything on tables." ON public.archive_tables;
DROP POLICY IF EXISTS "PIC can manage team tables." ON public.archive_tables;
DROP POLICY IF EXISTS "Team members can view team tables." ON public.archive_tables;
DROP POLICY IF EXISTS "PIC can read update delete team tables." ON public.archive_tables;
DROP POLICY IF EXISTS "PIC can update team tables." ON public.archive_tables;
DROP POLICY IF EXISTS "PIC can delete team tables." ON public.archive_tables;
DROP POLICY IF EXISTS "PIC can insert tables for their team." ON public.archive_tables;
DROP POLICY IF EXISTS "Team PIC can create tables for their team." ON public.archive_tables;
DROP POLICY IF EXISTS "Users can create personal tables." ON public.archive_tables;
DROP POLICY IF EXISTS "Public tables are viewable by everyone." ON public.archive_tables;
DROP POLICY IF EXISTS "Users can see their team tables." ON public.archive_tables;

-- ============================================
-- RECREATE POLICIES WITH PROPER SEPARATION
-- ============================================

-- ===================
-- ADMIN POLICIES
-- ===================
-- Admin SELECT
CREATE POLICY "admin_select_tables" ON public.archive_tables
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin INSERT (WITH CHECK only, no USING)
CREATE POLICY "admin_insert_tables" ON public.archive_tables
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin UPDATE
CREATE POLICY "admin_update_tables" ON public.archive_tables
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin DELETE
CREATE POLICY "admin_delete_tables" ON public.archive_tables
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ===================
-- PIC POLICIES
-- ===================
-- PIC SELECT - can view tables where they are PIC or team PIC
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

-- PIC INSERT - WITH CHECK only, references teams table (not archive_tables)
CREATE POLICY "pic_insert_tables" ON public.archive_tables
  FOR INSERT WITH CHECK (
    -- User must be PIC of the team they're creating table for
    EXISTS (
      SELECT 1 FROM public.teams t
      WHERE t.id = team_id AND t.pic_id = auth.uid()
    )
  );

-- PIC UPDATE
CREATE POLICY "pic_update_tables" ON public.archive_tables
  FOR UPDATE USING (
    team_pic_id = auth.uid() OR
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.teams t
      WHERE t.id = archive_tables.team_id AND t.pic_id = auth.uid()
    )
  );

-- PIC DELETE
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
-- TEAM MEMBER POLICIES (SELECT only)
-- ===================
CREATE POLICY "team_member_select_tables" ON public.archive_tables
  FOR SELECT USING (
    -- Public tables visible to all authenticated users
    visibility = 'public' OR
    -- Same team
    team_id = (SELECT team_id FROM public.profiles WHERE id = auth.uid()) OR
    -- Has explicit view permission via table_permissions
    EXISTS (
      SELECT 1 FROM public.table_permissions tp
      WHERE tp.table_id = id AND tp.user_id = auth.uid() AND tp.can_view = true
    )
  );
