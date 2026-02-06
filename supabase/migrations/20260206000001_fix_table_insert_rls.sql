-- Fix RLS policies to allow PIC to insert tables for their team

-- Add INSERT policy for team PICs
CREATE POLICY "Team PIC can create tables for their team." ON public.archive_tables
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.teams t
      WHERE t.id = archive_tables.team_id AND t.pic_id = auth.uid()
    )
  );

-- Add INSERT policy for users creating their own tables (personal tables)
CREATE POLICY "Users can create personal tables." ON public.archive_tables
  FOR INSERT WITH CHECK (
    created_by = auth.uid() AND team_id IS NULL
  );
