# 🔐 Authentication Quick Start

Your Supabase authentication is now fully implemented and ready to test!

## ✅ What's Been Implemented

### Core Infrastructure
- ✅ **Supabase SSR Client** - Proper Next.js App Router integration
- ✅ **Server & Client Components** - Separate clients for each context
- ✅ **Middleware Protection** - Auto-redirect for protected routes
- ✅ **Auth Hook** - `useAuth()` for client components
- ✅ **Server Actions** - Type-safe auth operations
- ✅ **Database Sync** - Automatic Supabase → Prisma user sync

### Pages & Features
- ✅ **Login Page** (`/login`) - Email/password authentication
- ✅ **Signup Page** (`/signup`) - Account creation with role selection
- ✅ **Dashboard** (`/dashboard`) - Protected user dashboard
- ✅ **Auth Callback** (`/auth/callback`) - OAuth & email confirmation handler

### Protected Routes
- `/dashboard` - User dashboard
- `/checkout` - Booking checkout  
- `/book/*` - Trip booking pages
- `/operator/*` - Operator admin pages

## 🚀 How to Test

### 1. Ensure Environment Variables

Make sure your `.env.local` has:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DATABASE_URL=your_database_url
```

### 2. Server is Running

✅ Dev server is already running at: **http://localhost:3000**

### 3. Create a Test Account

#### Option A: Use the Demo Account (if seeded)
- Email: `john.customer@example.com`
- Password: `SecurePass123!`

#### Option B: Create New Account
1. Visit http://localhost:3000/signup
2. Fill in the form:
   ```
   Full Name: John Doe
   Email: your-email@example.com
   Phone: +234 800 123 4567
   User Type: Customer (or Operator)
   Password: YourSecurePassword123!
   Confirm Password: YourSecurePassword123!
   ```
3. Check "I agree to terms"
4. Click "Create Account"

**Note:** If email confirmation is enabled in Supabase, check your email. Otherwise, you'll be redirected to the dashboard immediately.

### 4. Test Login Flow

1. Visit http://localhost:3000/login
2. Enter your credentials
3. Should redirect to `/dashboard`

### 5. Test Protected Routes

Try these scenarios:

| Action | Expected Result |
|--------|----------------|
| Visit `/dashboard` while logged out | Redirects to `/login` |
| Visit `/login` while logged in | Redirects to `/dashboard` |
| Click "Sign Out" on dashboard | Redirects to `/login` |
| Visit `/checkout` while logged out | Redirects to `/login` |

### 6. Verify Database Sync

Check that user was created in Prisma database:

```bash
npx prisma studio
```

Look for your user in the `User` table with:
- ✅ Correct email
- ✅ Correct role (CUSTOMER or OPERATOR)
- ✅ UUID from Supabase Auth

## 📂 File Structure

```
src/
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Browser client
│   │   ├── server.ts          # Server client
│   │   └── middleware.ts      # Middleware client
│   └── supabase.ts            # ⚠️ Deprecated (legacy)
├── app/
│   ├── auth/
│   │   ├── actions.ts         # Server actions (login, signup, signOut)
│   │   └── callback/
│   │       └── route.ts       # OAuth callback handler
│   ├── login/
│   │   └── page.tsx           # Login page
│   ├── signup/
│   │   └── page.tsx           # Signup page
│   └── dashboard/
│       ├── page.tsx           # Dashboard (server component)
│       └── dashboard-client.tsx  # Dashboard UI (client component)
├── hooks/
│   └── use-auth.ts            # Auth hook for client components
└── middleware.ts              # Route protection
```

## 🔍 Debugging Tips

### Check Auth State (Browser Console)

```javascript
// In browser console on any page
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
const { data } = await supabase.auth.getSession()
console.log(data)
```

### Check Cookies

1. Open DevTools → Application/Storage → Cookies
2. Look for cookies with names like `sb-*`
3. Should have `access_token` and `refresh_token`

### Check Middleware

If redirects aren't working:
1. Check browser network tab
2. Should see 307 redirects for protected routes
3. Check middleware.ts matcher config

### Common Issues

| Issue | Solution |
|-------|----------|
| "User not found" | Check if trigger creates user in database |
| Redirect loop | Clear cookies, verify middleware config |
| Email not sent | Check Supabase email settings (Auth → Email Templates) |
| "Invalid JWT" | Token expired, try logging out and back in |

## 🎯 Next Features to Implement

- [ ] **Password Reset** - Forgot password flow
- [ ] **Email Verification** - Require email confirmation
- [ ] **OAuth Providers** - Google, GitHub login
- [ ] **Profile Update** - Edit user profile
- [ ] **2FA** - Two-factor authentication
- [ ] **Account Settings** - Manage account preferences
- [ ] **Session Management** - View/revoke active sessions

## 📚 Documentation

Full documentation: [`docs/authentication.md`](../docs/authentication.md)

### Key Concepts

**Server Components (RSC):**
```tsx
import { createClient } from '@/src/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return <div>Welcome {user?.email}</div>
}
```

**Client Components:**
```tsx
'use client'
import { useAuth } from '@/src/hooks/use-auth'

export default function Component() {
  const { user, signOut } = useAuth()
  return <button onClick={signOut}>Sign Out</button>
}
```

**Server Actions:**
```tsx
'use server'
import { createClient } from '@/src/lib/supabase/server'

export async function myAction() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  // Do something...
}
```

## 🎉 You're Ready!

Your authentication system is production-ready with:
- ✅ Secure server-side auth
- ✅ Automatic session refresh
- ✅ Route protection
- ✅ Database synchronization
- ✅ TypeScript type safety

Go ahead and test the login/signup flow! 🚀
