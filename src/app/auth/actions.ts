'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/src/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error, data: authData } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  if (!authData.user) {
    return { error: 'Authentication failed' }
  }

  // Fetch user role from database
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', authData.user.id)
    .maybeSingle()

  const userRole = userData?.role || 'customer'

  revalidatePath('/', 'layout')
  
  // Redirect based on role
  if (userRole === 'admin') {
    redirect('/admin')
  } else if (userRole === 'operator' || userRole === 'staff') {
    redirect('/operator/dashboard')
  } else {
    redirect('/dashboard')
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    fullName: formData.get('fullName') as string,
    phone: formData.get('phone') as string,
    userType: formData.get('userType') as string,
  }

  // Validate passwords match
  const confirmPassword = formData.get('confirmPassword') as string
  if (data.password !== confirmPassword) {
    return { error: 'Passwords do not match' }
  }

  const { error, data: authData } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
        phone: data.phone,
        user_type: data.userType,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // User data will be synced to Prisma via the database trigger we created
  // No need to manually insert into the users table

  // Check if email confirmation is required
  if (authData.user && !authData.session) {
    return {
      success: true,
      message: 'Please check your email to confirm your account',
    }
  }

  if (!authData.user) {
    return { error: 'Signup failed' }
  }

  // Fetch user role from database  
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', authData.user.id)
    .maybeSingle()

  const userRole = userData?.role || data.userType || 'customer'

  revalidatePath('/', 'layout')
  
  // Redirect based on role
  if (userRole === 'operator' || userRole === 'staff' || userRole === 'admin') {
    redirect('/operator/dashboard')
  } else {
    redirect('/dashboard')
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()

  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const fullName = formData.get('fullName') as string
  const phone = formData.get('phone') as string

  // Update auth metadata
  const { error: authError } = await supabase.auth.updateUser({
    data: {
      full_name: fullName,
      phone,
    },
  })

  if (authError) {
    return { error: authError.message }
  }

  // Update public.users table
  const { error: dbError } = await supabase
    .from('users')
    .update({
      fullName,
      phone,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (dbError) {
    return { error: dbError.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
