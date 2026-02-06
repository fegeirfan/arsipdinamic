-- Create the custom enum type
CREATE TYPE public.user_role AS ENUM ('admin', 'staff');

-- Drop the policies that depend on the role column
DROP POLICY IF EXISTS "Admins can do everything on tables." ON public.archive_tables;
DROP POLICY IF EXISTS "Admins can do everything on columns." ON public.archive_columns;
DROP POLICY IF EXISTS "Admins can do everything on records." ON public.archive_records;
DROP POLICY IF EXISTS "Admins can manage permissions." ON public.table_permissions;

-- Alter the profiles table to use the new enum type
-- We need to drop the default and constraints first to avoid casting errors
ALTER TABLE public.profiles 
  ALTER COLUMN role DROP DEFAULT;

-- Drop the check constraint if it exists (usually profiles_role_check)
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_role_check') THEN
        ALTER TABLE public.profiles DROP CONSTRAINT profiles_role_check;
    END IF;
END $$;

-- Change the type and cast existing values
ALTER TABLE public.profiles 
  ALTER COLUMN role TYPE public.user_role 
  USING role::public.user_role;

-- Re-add the default with the new type
ALTER TABLE public.profiles 
  ALTER COLUMN role SET DEFAULT 'staff'::public.user_role;

-- Recreate the policies
CREATE POLICY "Admins can do everything on tables." ON public.archive_tables
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can do everything on columns." ON public.archive_columns
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can do everything on records." ON public.archive_records
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage permissions." ON public.table_permissions
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Update the trigger function to handle the enum correctly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role, email)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'role', 'staff')::public.user_role,
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
