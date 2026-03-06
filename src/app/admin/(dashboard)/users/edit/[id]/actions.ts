'use server'

import { supabaseAdmin } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { verifyAccesToken } from '@/lib/jwt'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

export const getUserById = async (id: string) => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, fullname, email, role')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export const updateUser = async (
  id: string,
  formData: {
    fullname: string
    email: string
    role: 'admin' | 'editor'
    password?: string
  }
) => {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value

  if (!token) return { success: false, message: 'Yetkisiz erişim.' }

  const currentUser = await verifyAccesToken(token)

  if (!currentUser) return { success: false, message: 'Yetkisiz erişim.' }

  // Editör hiçbir kullanıcıyı güncelleyemez
  if (currentUser.role === 'editor') {
    return { success: false, message: 'Bu işlem için yetkiniz yok.' }
  }

  // Düzenlenecek kullanıcıyı çek
  const { data: targetUser } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', id)
    .single()

  if (!targetUser) return { success: false, message: 'Kullanıcı bulunamadı.' }

  // Superadmin düzenlenemez
  if (targetUser.role === 'superadmin') {
    return { success: false, message: 'Süper admin düzenlenemez.' }
  }

  // Admin, başka bir admin'i düzenleyemez (kendisi hariç)
  if (currentUser.role === 'admin' && targetUser.role === 'admin' && currentUser.sub !== id) {
    return { success: false, message: 'Admin rolündeki kullanıcıyı düzenleme yetkiniz yok.' }
  }

  // Admin, rol olarak admin'den yüksek atayamaz (superadmin koruması)
  if (currentUser.role === 'admin' && formData.role === 'superadmin' as string) {
    return { success: false, message: 'Bu rolü atama yetkiniz yok.' }
  }

  // Email başkası tarafından kullanılıyor mu?
  const { data: existing } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', formData.email)
    .neq('id', id)
    .single()

  if (existing) return { success: false, message: 'Bu email adresi zaten kullanımda.' }

  // Güncellenecek alanları hazırla
  const updateData: Record<string, string> = {
    fullname: formData.fullname,
    email: formData.email,
    role: formData.role,
  }

  // Şifre girilmişse hashle
  if (formData.password && formData.password.length >= 8) {
    updateData.password_hash = await bcrypt.hash(formData.password, 10)
  }

  const { error } = await supabaseAdmin
    .from('users')
    .update(updateData)
    .eq('id', id)

  if (error) return { success: false, message: 'Güncelleme başarısız, lütfen tekrar deneyin.' }

  // Log düş
  await supabaseAdmin.from('logs').insert({
    user_id: currentUser.sub,
    action_type: 'user_updated',
    content: `${formData.fullname} kullanıcısı güncellendi.`,
  })

  redirect('/admin/users')
}

export const deleteUser = async (id: string) => {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value

  if (!token) return { success: false, message: 'Yetkisiz erişim.' }

  const currentUser = await verifyAccesToken(token)

  if (!currentUser) return { success: false, message: 'Yetkisiz erişim.' }

  // Editör kullanıcı silemez
  if (currentUser.role === 'editor') {
    return { success: false, message: 'Bu işlem için yetkiniz yok.' }
  }

  const { data: targetUser } = await supabaseAdmin
    .from('users')
    .select('role, fullname')
    .eq('id', id)
    .single()

  if (!targetUser) return { success: false, message: 'Kullanıcı bulunamadı.' }

  // Superadmin silinemez
  if (targetUser.role === 'superadmin') {
    return { success: false, message: 'Süper admin silinemez.' }
  }

  // Admin, başka bir admini silemez
  if (currentUser.role === 'admin' && targetUser.role === 'admin') {
    return { success: false, message: 'Admin rolündeki kullanıcıyı silme yetkiniz yok.' }
  }

  // Kullanıcı kendini silemez
  if (currentUser.sub === id) {
    return { success: false, message: 'Kendinizi silemezsiniz.' }
  }

  const { error } = await supabaseAdmin.from('users').delete().eq('id', id)

  if (error) return { success: false, message: 'Silme işlemi başarısız.' }

  await supabaseAdmin.from('logs').insert({
    user_id: currentUser.sub,
    action_type: 'user_deleted',
    content: `${targetUser.fullname} kullanıcısı silindi.`,
  })

  redirect('/admin/users')
}