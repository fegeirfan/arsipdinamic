-- Refine Archive Tables RLS
DROP POLICY IF EXISTS "Users can see their team tables." ON public.archive_tables;

CREATE POLICY "Users can see accessible tables." ON public.archive_tables
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') OR
    team_id = (SELECT team_id FROM public.profiles WHERE id = auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.access_requests 
      WHERE user_id = auth.uid() 
      AND table_id = public.archive_tables.id 
      AND status = 'approved'
    )
  );

-- Refine Archive Records RLS
ALTER TABLE public.archive_records ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can see their team records." ON public.archive_records;

CREATE POLICY "Users can see accessible records." ON public.archive_records
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') OR
    EXISTS (
        SELECT 1 FROM public.archive_tables t
        WHERE t.id = table_id AND (
            t.team_id = (SELECT team_id FROM public.profiles WHERE id = auth.uid()) OR
            EXISTS (
                SELECT 1 FROM public.access_requests req
                WHERE req.user_id = auth.uid() AND req.table_id = t.id AND req.status = 'approved'
            )
        )
    )
  );

-- Allow Insert if in team or if approved (with 'insert' level)
CREATE POLICY "Users can insert into accessible tables." ON public.archive_records
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') OR
    EXISTS (
        SELECT 1 FROM public.archive_tables t
        WHERE t.id = table_id AND (
            t.team_id = (SELECT team_id FROM public.profiles WHERE id = auth.uid()) OR
            EXISTS (
                SELECT 1 FROM public.access_requests req
                WHERE req.user_id = auth.uid() AND req.table_id = t.id AND req.status = 'approved' AND req.requested_level = 'insert'
            )
        )
    )
  );
