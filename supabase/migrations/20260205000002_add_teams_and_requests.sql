-- Create teams table
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  pic_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Add team_id to profiles
ALTER TABLE public.profiles 
  ADD COLUMN team_id UUID REFERENCES public.teams(id);

-- Update archive_tables to support team ownership
ALTER TABLE public.archive_tables
  ADD COLUMN team_id UUID REFERENCES public.teams(id),
  ADD COLUMN team_pic_id UUID REFERENCES public.profiles(id);

-- Create access_requests table
CREATE TABLE public.access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  table_id UUID REFERENCES public.archive_tables(id) NOT NULL,
  requested_level TEXT NOT NULL CHECK (requested_level IN ('view', 'insert')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes TEXT,
  processed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS Policies Update

-- Teams: Admins can do everything, others can view
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage teams." ON public.teams
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users can view teams." ON public.teams
  FOR SELECT USING (true);

-- Archive Tables: Update visibility based on team
-- Users can see tables in their team
CREATE POLICY "Users can see their team tables." ON public.archive_tables
  FOR SELECT USING (team_id = (SELECT team_id FROM public.profiles WHERE id = auth.uid()));

-- Access Requests RLS
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own requests." ON public.access_requests
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create requests." ON public.access_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins and Team PICs can manage requests." ON public.access_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') OR
    EXISTS (
      SELECT 1 FROM public.archive_tables t
      JOIN public.teams tm ON t.team_id = tm.id
      WHERE t.id = table_id AND tm.pic_id = auth.uid()
    )
  );
