// app/admin/login/actions.ts

'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { signAccessToken, tokenCookieOptions } from '@/lib/jwt'
import bcrypt from 'bcryptjs'

export interface LoginFormData {
  email: string
  password: string
}

export const login = async (formData: LoginFormData) => {
  const { email, password } = formData

  // Kullanıcıyı bul
  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !user) {
    return { success: false, message: 'E-posta veya şifre hatalı.' }
  }

  // Şifre doğrula
  const isValid = await bcrypt.compare(password, user.password_hash)

  if (!isValid) {
    return { success: false, message: 'E-posta veya şifre hatalı.' }
  }

  // Token oluştur
  const token = await signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    fullname: user.fullname,
  })

  // Cookie'ye yaz
  const cookieStore = await cookies()
  cookieStore.set('admin_token', token, tokenCookieOptions)

  // Login logunu düş (trigger last_login'i otomatik güncelleyecek)
  await supabaseAdmin.from('logs').insert({
    user_id: user.id,
    action_type: 'login',
    content: `${user.fullname} giriş yaptı.`,
  })

  redirect('/admin/dashboard')
}

export const logout = async () => {
  const cookieStore = await cookies()
  cookieStore.delete('admin_token')
  redirect('/admin')
}