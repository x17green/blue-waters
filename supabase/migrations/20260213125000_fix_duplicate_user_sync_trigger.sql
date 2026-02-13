-- Drop the old duplicate trigger that hardcodes role to 'customer'
-- This trigger conflicts with sync_user_to_app which correctly reads user_type from metadata

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Verify only the correct sync_user_trigger remains
-- This trigger properly maps user_type metadata to the role column:
--   user_type='operator' -> role='operator'
--   user_type='staff'    -> role='staff'
--   user_type='admin'    -> role='admin'
--   default              -> role='customer'

-- Fix any existing users who were registered with wrong roles
-- Update role based on metadata.user_type
UPDATE public.users 
SET 
  role = CASE 
    WHEN metadata->>'user_type' = 'operator' THEN 'operator'::"UserRole"
    WHEN metadata->>'user_type' = 'staff' THEN 'staff'::"UserRole"
    WHEN metadata->>'user_type' = 'admin' THEN 'admin'::"UserRole"
    ELSE role -- Keep existing role if no user_type in metadata
  END,
  "updatedAt" = NOW()
WHERE 
  metadata->>'user_type' IS NOT NULL 
  AND metadata->>'user_type' != ''
  AND role != (metadata->>'user_type')::"UserRole";
