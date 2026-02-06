-- Update RLS policies for team-based archive access

-- First, drop existing policies that need to be updated
DROP POLICY IF EXISTS "Public tables are viewable by everyone." ON public.archive_tables;
DROP POLICY IF EXISTS "Users can see their team tables." ON public.archive_tables;
DROP POLICY IF EXISTS "Admins can do everything on tables." ON public.archive_tables;
DROP POLICY IF EXISTS "Columns are viewable by authorized users." ON public.archive_columns;
DROP POLICY IF EXISTS "Admins can do everything on columns." ON public.archive_columns;
DROP POLICY IF EXISTS "Records are viewable by authorized users." ON public.archive_records;
DROP POLICY IF EXISTS "Admins can do everything on records." ON public.archive_records;
DROP POLICY IF EXISTS "Admins can manage permissions." ON public.table_permissions;

-- ============================================
-- ARCHIVE_TABLES POLICIES
-- ============================================

-- 1. Admins can do everything on tables
CREATE POLICY "Admins can do everything on tables." ON public.archive_tables
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- 2. PIC can CRUD their team's tables
CREATE POLICY "PIC can manage team tables." ON public.archive_tables
  FOR ALL USING (
    team_pic_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.teams t
      WHERE t.id = archive_tables.team_id AND t.pic_id = auth.uid()
    )
  );

-- 3. Team members can view their team's tables
CREATE POLICY "Team members can view team tables." ON public.archive_tables
  FOR SELECT USING (
    -- Public tables
    visibility = 'public' OR
    -- Own tables
    created_by = auth.uid() OR
    -- PIC's tables
    team_pic_id = auth.uid() OR
    -- Team member - same team
    team_id = (SELECT team_id FROM public.profiles WHERE id = auth.uid()) OR
    -- In pic_ids array
    auth.uid() = ANY(pic_ids) OR
    -- Has explicit view permission
    EXISTS (
      SELECT 1 FROM public.table_permissions tp
      WHERE tp.table_id = archive_tables.id 
        AND tp.user_id = auth.uid()
        AND tp.can_view = true
    )
  );

-- ============================================
-- ARCHIVE_COLUMNS POLICIES
-- ============================================

-- 1. Admins can do everything on columns
CREATE POLICY "Admins can do everything on columns." ON public.archive_columns
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- 2. PIC can manage columns for their team's tables
CREATE POLICY "PIC can manage columns." ON public.archive_columns
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.archive_tables t
    WHERE t.id = archive_columns.table_id 
      AND (t.team_pic_id = auth.uid() OR t.created_by = auth.uid())
  ));

-- 3. Team members can view columns
CREATE POLICY "Team members can view columns." ON public.archive_columns
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.archive_tables t
    WHERE t.id = archive_columns.table_id 
      AND (
        t.visibility = 'public' OR
        t.created_by = auth.uid() OR
        t.team_id = (SELECT team_id FROM public.profiles WHERE id = auth.uid()) OR
        auth.uid() = ANY(t.pic_ids) OR
        EXISTS (
          SELECT 1 FROM public.table_permissions tp
          WHERE tp.table_id = t.id AND tp.user_id = auth.uid() AND tp.can_view = true
        )
      )
  ));

-- ============================================
-- ARCHIVE_RECORDS POLICIES
-- ============================================

-- 1. Admins can do everything on records
CREATE POLICY "Admins can do everything on records." ON public.archive_records
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- 2. PIC can manage records for their team's tables
CREATE POLICY "PIC can manage records." ON public.archive_records
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.archive_tables t
    WHERE t.id = archive_records.table_id 
      AND (t.team_pic_id = auth.uid() OR t.created_by = auth.uid())
  ));

-- 3. Team members can view records
CREATE POLICY "Team members can view records." ON public.archive_records
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.archive_tables t
    WHERE t.id = archive_records.table_id 
      AND (
        t.visibility = 'public' OR
        t.created_by = auth.uid() OR
        t.team_id = (SELECT team_id FROM public.profiles WHERE id = auth.uid()) OR
        auth.uid() = ANY(t.pic_ids) OR
        EXISTS (
          SELECT 1 FROM public.table_permissions tp
          WHERE tp.table_id = t.id AND tp.user_id = auth.uid() AND tp.can_view = true
        )
      )
  ));

-- ============================================
-- TABLE_PERMISSIONS POLICIES
-- ============================================

-- 1. Admins can manage all permissions
CREATE POLICY "Admins can manage all permissions." ON public.table_permissions
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- 2. PIC can manage permissions for their team's tables
CREATE POLICY "PIC can manage permissions." ON public.table_permissions
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.archive_tables t
    WHERE t.id = table_permissions.table_id 
      AND (t.team_pic_id = auth.uid() OR t.created_by = auth.uid())
  ));

-- 3. Users can view their own permissions
CREATE POLICY "Users can view own permissions." ON public.table_permissions
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- Helper function to check if user can view table
-- ============================================
CREATE OR REPLACE FUNCTION public.can_user_view_table(table_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.archive_tables t
    WHERE t.id = table_id
      AND (
        -- Public table
        t.visibility = 'public' OR
        -- User is creator
        t.created_by = user_id OR
        -- User is PIC
        t.team_pic_id = user_id OR
        -- User in pic_ids
        user_id = ANY(t.pic_ids) OR
        -- Same team
        t.team_id = (SELECT team_id FROM public.profiles WHERE id = user_id) OR
        -- Has explicit permission
        EXISTS (
          SELECT 1 FROM public.table_permissions tp
          WHERE tp.table_id = table_id 
            AND tp.user_id = user_id 
            AND tp.can_view = true
        )
      )
  );
END;
$$ LANGUAGE plpgsql STABLE;
