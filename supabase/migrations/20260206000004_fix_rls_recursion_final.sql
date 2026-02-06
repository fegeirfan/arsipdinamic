-- FINAL FIX: Drop persistent zombie policies that cause infinite recursion
-- Specifically: "Users can see accessible tables." was missed in previous fix.

-- ============================================
-- DROP ALL POSSIBLE POLICIES ON ARCHIVE_TABLES
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
-- The culprit:
DROP POLICY IF EXISTS "Users can see accessible tables." ON public.archive_tables;

-- Use the existing good policies from the previous file if they fail to create
-- (Supabase might have already created them if the previous run partly succeeded)
-- But safe to recreate if we drop them first.

-- Drop the new good policies too, to ensure clean slate
DROP POLICY IF EXISTS "admin_select_tables" ON public.archive_tables;
DROP POLICY IF EXISTS "admin_insert_tables" ON public.archive_tables;
DROP POLICY IF EXISTS "admin_update_tables" ON public.archive_tables;
DROP POLICY IF EXISTS "admin_delete_tables" ON public.archive_tables;
DROP POLICY IF EXISTS "pic_select_tables" ON public.archive_tables;
DROP POLICY IF EXISTS "pic_insert_tables" ON public.archive_tables;
DROP POLICY IF EXISTS "pic_update_tables" ON public.archive_tables;
DROP POLICY IF EXISTS "pic_delete_tables" ON public.archive_tables;
DROP POLICY IF EXISTS "team_member_select_tables" ON public.archive_tables;


-- ============================================
-- RECREATE POLICIES (clean copy of 000003 content)
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
