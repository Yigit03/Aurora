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

const createUser = async (formData: CreateUserFormData) => {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value

  if (!token) return { success: false, message: 'Yetkisiz erişim.' }

  const currentUser = await verifyAccesToken(token)

  if (!currentUser) return { success: false, message: 'Yetkisiz erişim.' }

  // Editör kullanıcı oluşturamaz
  if (currentUser.role === 'editor') {
    return { success: false, message: 'Bu işlem için yetkiniz yok.' }
  }

  // Admin sadece editor oluşturabilir
  if (currentUser.role === 'admin' && formData.role !== 'editor') {
    return { success: false, message: 'Sadece editör rolünde kullanıcı oluşturabilirsiniz.' }
  }

  // Superadmin rolü sadece superadmin atayabilir
  if (currentUser.role !== 'superadmin' && formData.role === 'superadmin' as string) {
    return { success: false, message: 'Superadmin rolü atanamaz.' }
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

export const createUserAction = async (
  prevState: { success: boolean; message: string },
  formData: FormData
) => {
  return createUser({
    fullname: formData.get('fullname') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    role: formData.get('role') as 'admin' | 'editor',
  })
}

export const createUserDirect = async (formData: CreateUserFormData) => {
  return createUser(formData)
}