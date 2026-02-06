-- Fix RLS policies for user and team management

-- 1. Add INSERT policy for teams (admins only)
-- (SELECT and ALL are already set, but INSERT might need explicit policy)
CREATE POLICY "Admins can insert teams." ON public.teams
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 2. Add UPDATE policy for teams (admins only)
CREATE POLICY "Admins can update teams." ON public.teams
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 3. Fix profiles UPDATE policy to allow admins to update any profile
-- First drop the existing policy
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

-- Recreate with admin bypass
CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING (
    auth.uid() = id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 4. Create a helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql STABLE;
