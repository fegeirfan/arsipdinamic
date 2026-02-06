-- Add 'drive' to allowed column types
ALTER TABLE public.archive_columns DROP CONSTRAINT archive_columns_type_check;

ALTER TABLE public.archive_columns ADD CONSTRAINT archive_columns_type_check 
CHECK (type IN ('text', 'number', 'date', 'select', 'file', 'drive'));
