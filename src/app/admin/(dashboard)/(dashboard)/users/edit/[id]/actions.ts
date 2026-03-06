'use server'
// Kullanıcı düzenleme action'ı

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { supabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'
import { updateUserSchema } from '@/lib/validations'

/**
 * Kullanıcı Güncelleme Action
 * @param userId - Güncellenecek kullanıcının ID'si
 * @param prevState - Önceki form state'i
 * @param formData - Form verisi
 */
export async function updateUserAction(
  userId: string,
  prevState: any,
  formData: FormData
) {
  try {
    // 1. Token kontrolü
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return {
        success: false,
        message: 'Oturum bulunamadı',
      }
    }

    // Token'ı doğrula
    const currentUser = await verifyToken(token)

    if (!currentUser) {
      return {
        success: false,
        message: 'Geçersiz oturum',
      }
    }

    // Yetki kontrolü
    if (currentUser.role !== 'super_admin' && currentUser.role !== 'admin') {
      return {
        success: false,
        message: 'Bu işlem için yetkiniz yok',
      }
    }

    // 2. Güncellenecek kullanıcıyı getir
    const { data: targetUser, error: fetchError } = await supabase
      .from('users')
      .select('id, role, email')
      .eq('id', userId)
      .single()

    if (fetchError || !targetUser) {
      return {
        success: false,
        message: 'Kullanıcı bulunamadı',
      }
    }

    // 3. Süper admin düzenlenemez
    if (targetUser.role === 'super_admin') {
      return {
        success: false,
        message: 'Süper admin kullanıcı düzenlenemez',
      }
    }

    // 4. Admin kullanıcıyı sadece super_admin düzenleyebilir
    if (targetUser.role === 'admin' && currentUser.role !== 'super_admin') {
      return {
        success: false,
        message: 'Admin kullanıcıyı sadece süper admin düzenleyebilir',
      }
    }

    // 5. Form verilerini al
    const rawData = {
      full_name: formData.get('full_name'),
      email: formData.get('email'),
      password: formData.get('password') || undefined, // Boşsa undefined
      role: formData.get('role') as string,
      is_active: formData.get('is_active') === 'on',
    }

    // 6. Validasyon
    const validatedData = updateUserSchema.safeParse(rawData)

    if (!validatedData.success) {
      return {
        success: false,
        message: validatedData.error.issues[0].message,
      }
    }

    const { full_name, email, password, role, is_active } = validatedData.data

    // 7. Email değiştiyse, başka kullanıcıda kullanılıyor mu kontrol et
    if (email !== targetUser.email) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .neq('id', userId) // Kendisi hariç
        .single()

      if (existingUser) {
        return {
          success: false,
          message: 'Bu email adresi başka bir kullanıcı tarafından kullanılıyor',
        }
      }
    }

    // 8. Role değiştirme kontrolü
    // Admin rolüne yükseltmek için super_admin olmalı
    if (role === 'admin' && targetUser.role !== 'admin' && currentUser.role !== 'super_admin') {
      return {
        success: false,
        message: 'Admin rolü vermek için süper admin olmalısınız',
      }
    }

    // 9. Güncellenecek veriler
    const updateData: any = {
      full_name,
      email,
      role,
      is_active,
    }

    // Şifre değiştiyse hash'le ve ekle
    if (password && password.trim() !== '') {
      updateData.password_hash = await bcrypt.hash(password, 10)
    }

    // 10. Kullanıcıyı güncelle
    const { error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)

    if (updateError) {
      console.error('Kullanıcı güncelleme hatası:', updateError)
      return {
        success: false,
        message: 'Kullanıcı güncellenemedi',
      }
    }

    // 11. Activity log kaydet
    await supabase.from('activity_logs').insert({
      user_id: currentUser.userId,
      action: 'update_user',
      entity_type: 'user',
      entity_id: userId,
    })

  } catch (error) {
    console.error('Kullanıcı güncelleme hatası:', error)
    return {
      success: false,
      message: 'Bir hata oluştu, lütfen tekrar deneyin',
    }
  }

  // 12. Kullanıcı listesine yönlendir
  redirect('/admin/users')
}