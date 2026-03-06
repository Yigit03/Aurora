// app/admin/(dashboard)/users/create/actions.ts

'use server'

import { supabaseAdmin } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { verifyAccesToken } from '@/lib/jwt'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

export interface CreateUserFormData {
  fullname: string
  email: string
  password: string
  role: 'admin' | 'editor'
}

export const createUser = async (formData: CreateUserFormData) => {
  // Mevcut kullanıcının yetkisini kontrol et
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value

  if (!token) return { success: false, message: 'Yetkisiz erişim.' }

  const currentUser = await verifyAccesToken(token)

  if (!currentUser) return { success: false, message: 'Yetkisiz erişim.' }

  if (currentUser.role !== 'superadmin' && currentUser.role !== 'admin') {
    return { success: false, message: 'Bu işlem için yetkiniz yok.' }
  }

  // Admin sadece editor oluşturabilir
  if (currentUser.role === 'admin' && formData.role === 'admin') {
    return { success: false, message: 'Admin rolünde kullanıcı oluşturma yetkiniz yok.' }
  }

  // Email kontrolü
  const { data: existing } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', formData.email)
    .single()

  if (existing) {
    return { success: false, message: 'Bu email adresi zaten kullanımda.' }
  }

  // Şifreyi hashle
  const password_hash = await bcrypt.hash(formData.password, 10)

  // Kullanıcıyı oluştur
  const { error } = await supabaseAdmin.from('users').insert({
    fullname: formData.fullname,
    email: formData.email,
    password_hash,
    role: formData.role,
  })

  if (error) {
    return { success: false, message: 'Kullanıcı oluşturulamadı, lütfen tekrar deneyin.' }
  }

  // Log düş
  await supabaseAdmin.from('logs').insert({
    user_id: currentUser.sub,
    action_type: 'user_created',
    content: `${formData.fullname} (${formData.role}) kullanıcısı oluşturuldu.`,
  })

  redirect('/admin/users')
}