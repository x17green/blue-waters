-- ============================================
-- FIX SERVICE ROLE PERMISSIONS
-- ============================================
-- Root Cause: Service role lacks schema permissions
-- This prevents admin operations and causes 500 errors
-- ============================================

-- Grant full permissions to service_role (bypasses RLS)
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL PRIVILEGES ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL PRIVILEGES ON SEQUENCES TO service_role;

-- Verify permissions
SELECT
  '✓ Service Role Schema Usage' as check_type,
  has_schema_privilege('service_role', 'public', 'usage') as granted
UNION ALL
SELECT
  '✓ Service Role Table Permissions' as check_type,
  COUNT(*) > 0 as granted
FROM information_schema.table_privileges
WHERE table_schema = 'public'
  AND grantee = 'service_role';