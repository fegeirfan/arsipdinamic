-- Staff can INSERT/UPDATE/DELETE archive_records only when table_permissions allow (PIC/Admin grant can_insert, can_edit, can_delete).
-- Structure (columns) remains editable only by Admin and PIC.

-- ============================================
-- ARCHIVE_RECORDS: Staff INSERT by permission
-- ============================================
CREATE POLICY "Staff can insert records when permitted." ON public.archive_records
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.archive_tables t
      INNER JOIN public.table_permissions tp ON tp.table_id = t.id AND tp.user_id = auth.uid() AND tp.can_insert = true
      WHERE t.id = table_id
    )
  );

-- ============================================
-- ARCHIVE_RECORDS: Staff UPDATE by permission
-- ============================================
CREATE POLICY "Staff can update records when permitted." ON public.archive_records
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.archive_tables t
      INNER JOIN public.table_permissions tp ON tp.table_id = t.id AND tp.user_id = auth.uid() AND tp.can_edit = true
      WHERE t.id = table_id
    )
  );

-- ============================================
-- ARCHIVE_RECORDS: Staff DELETE by permission
-- ============================================
CREATE POLICY "Staff can delete records when permitted." ON public.archive_records
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.archive_tables t
      INNER JOIN public.table_permissions tp ON tp.table_id = t.id AND tp.user_id = auth.uid() AND tp.can_delete = true
      WHERE t.id = table_id
    )
  );
