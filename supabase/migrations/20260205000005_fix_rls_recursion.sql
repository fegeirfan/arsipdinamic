-- 1. Add target_team_id to access_requests to avoid join recursion in RLS
ALTER TABLE public.access_requests 
  ADD COLUMN target_team_id UUID REFERENCES public.teams(id);

-- Update existing requests with target_team_id (if any)
UPDATE public.access_requests req
SET target_team_id = (SELECT team_id FROM public.archive_tables t WHERE t.id = req.table_id);

-- 2. Drop problematic policies
DROP POLICY IF EXISTS "Admins and Team PICs can manage requests." ON public.access_requests;
DROP POLICY IF EXISTS "Users can see accessible tables." ON public.archive_tables;
DROP POLICY IF EXISTS "Users can see their team tables." ON public.archive_tables;

-- 3. Create non-recursive Access Requests policies
-- PICs can see requests for their team
CREATE POLICY "Admins and Team PICs can manage requests." ON public.access_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') OR
    EXISTS (
      SELECT 1 FROM public.teams tm 
      WHERE tm.id = target_team_id AND tm.pic_id = auth.uid()
    )
  );

-- 4. Create non-recursive Archive Tables policies
-- Users can see tables in their team or where they have an approved request
-- Note: We still need to check access_requests, but now access_requests RLS doesn't call archive_tables
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

-- 5. Fix ambiguous relationships for User creation if needed (already handled in code, but good to ensure RLS is solid)
-- (No changes needed for RLS as it uses table names directly)
