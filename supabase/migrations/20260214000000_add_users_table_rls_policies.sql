-- Migration: Add Row Level Security Policies for Users Table
-- 
-- Issue: Users cannot query their own user record due to missing RLS policies AND missing GRANTs
-- Error: "permission denied for schema public" when querying users table
-- 
-- Root Cause: The users table has NO grants for authenticated/anon roles
-- The RLS policies exist but are useless without table-level SELECT permission
-- 
-- This migration:
-- 1. Grants SELECT to authenticated users (required before RLS can work)
-- 2. Grants UPDATE to authenticated users (for profile editing)
-- 3. RLS policies are already in place to restrict to own record

-- Step 1: Grant table-level permissions to authenticated users
-- Without this, RLS policies cannot even be evaluated
GRANT SELECT ON public.users TO authenticated;
GRANT UPDATE ON public.users TO authenticated;

-- Step 2: Grant limited access to anon users for public-facing data
-- (Currently not needed, but kept for future use)
-- GRANT SELECT ON public.users TO anon;

-- Step 3: Ensure RLS is enabled (should already be enabled)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Step 4: Verify existing policies
-- These policies already exist from previous manual creation:
--   - "Users can view own profile" (SELECT): auth.uid() = id
--   - "Users can update own profile" (UPDATE): auth.uid() = id

-- If policies don't exist, create them:
DO $$
BEGIN
  -- Check and create SELECT policy if not exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' 
      AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
      ON public.users
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  -- Check and create UPDATE policy if not exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' 
      AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON public.users
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Step 5: Verify configuration
SELECT 
  'Table Permissions' as check_type,
  grantee,
  privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public' 
  AND table_name = 'users'
  AND grantee IN ('authenticated', 'anon')

UNION ALL

SELECT 
  'RLS Policies' as check_type,
  policyname as grantee,
  cmd as privilege_type
FROM pg_policies 
WHERE tablename = 'users';
