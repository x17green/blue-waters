-- Migration: Add Supabase Auth to Public User Sync Trigger
-- This trigger automatically creates a user record in public.users when a new user signs up via Supabase Auth

-- Create function to sync auth.users to public.users table
CREATE OR REPLACE FUNCTION public.sync_user_to_app()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    "fullName",
    phone,
    role,
    "isActive",
    metadata,
    "createdAt",
    "updatedAt"
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'fullName', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    CASE 
      WHEN NEW.raw_user_meta_data->>'user_type' = 'operator' THEN 'operator'::"UserRole"
      WHEN NEW.raw_user_meta_data->>'user_type' = 'staff' THEN 'staff'::"UserRole"
      WHEN NEW.raw_user_meta_data->>'user_type' = 'admin' THEN 'admin'::"UserRole"
      ELSE 'customer'::"UserRole"
    END,
    true,
    COALESCE(NEW.raw_user_meta_data, '{}'::jsonb),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    "fullName" = CASE 
      WHEN EXCLUDED."fullName" != '' THEN EXCLUDED."fullName"
      ELSE public.users."fullName"
    END,
    phone = CASE 
      WHEN EXCLUDED.phone != '' THEN EXCLUDED.phone
      ELSE public.users.phone
    END,
    metadata = EXCLUDED.metadata,
    "updatedAt" = NOW();
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically sync new auth users to public.users
DROP TRIGGER IF EXISTS sync_user_trigger ON auth.users;

CREATE TRIGGER sync_user_trigger
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_to_app();

-- Backfill any existing auth users that aren't in public.users yet
INSERT INTO public.users (
  id,
  email,
  "fullName",
  phone,
  role,
  "isActive",
  metadata,
  "createdAt",
  "updatedAt"
)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'fullName', email),
  COALESCE(raw_user_meta_data->>'phone', ''),
  CASE 
    WHEN raw_user_meta_data->>'user_type' = 'operator' THEN 'operator'::"UserRole"
    WHEN raw_user_meta_data->>'user_type' = 'staff' THEN 'staff'::"UserRole"
    WHEN raw_user_meta_data->>'user_type' = 'admin' THEN 'admin'::"UserRole"
    ELSE 'customer'::"UserRole"
  END,
  true,
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  created_at,
  updated_at
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
  AND deleted_at IS NULL;
