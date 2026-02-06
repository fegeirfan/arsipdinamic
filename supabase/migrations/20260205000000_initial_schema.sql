-- Create a table for public profiles
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
  email TEXT UNIQUE
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role, email)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'role', 'staff'),
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Archive Tables
CREATE TABLE public.archive_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  pic_ids UUID[] DEFAULT '{}'
);

-- Archive Columns
CREATE TABLE public.archive_columns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID REFERENCES public.archive_tables ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('text', 'number', 'date', 'select', 'file')),
  is_required BOOLEAN DEFAULT false,
  options JSONB DEFAULT '[]'
);

-- Archive Records
CREATE TABLE public.archive_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID REFERENCES public.archive_tables ON DELETE CASCADE NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Table Permissions
CREATE TABLE public.table_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID REFERENCES public.archive_tables ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  can_view BOOLEAN DEFAULT false,
  can_insert BOOLEAN DEFAULT false,
  can_edit BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  can_edit_structure BOOLEAN DEFAULT false
);

-- RLS for tables
ALTER TABLE public.archive_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archive_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archive_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.table_permissions ENABLE ROW LEVEL SECURITY;

-- Policies for archive_tables
CREATE POLICY "Public tables are viewable by everyone." ON public.archive_tables
  FOR SELECT USING (visibility = 'public' OR auth.uid() = created_by OR auth.uid() = ANY(pic_ids));

CREATE POLICY "Admins can do everything on tables." ON public.archive_tables
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policies for archive_columns
CREATE POLICY "Columns are viewable by authorized users." ON public.archive_columns
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.archive_tables t 
    WHERE t.id = table_id AND (t.visibility = 'public' OR auth.uid() = t.created_by OR auth.uid() = ANY(t.pic_ids))
  ));

CREATE POLICY "Admins can do everything on columns." ON public.archive_columns
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policies for archive_records
CREATE POLICY "Records are viewable by authorized users." ON public.archive_records
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.archive_tables t 
    WHERE t.id = table_id AND (t.visibility = 'public' OR auth.uid() = t.created_by OR auth.uid() = ANY(t.pic_ids))
  ));

CREATE POLICY "Admins can do everything on records." ON public.archive_records
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policies for table_permissions
CREATE POLICY "Admins can manage permissions." ON public.table_permissions
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can view their own permissions." ON public.table_permissions
  FOR SELECT USING (auth.uid() = user_id);
