'use server'
// Şifre değiştirme action'ı

import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { supabase } from '@/lib/supabase'
import { verifyAccesToken } from '@/lib/jwt'

/**
 * Şifre Değiştirme Action
 * @param userId - Kullanıcı ID
 * @param prevState - Önceki state
 * @param formData - Form verisi
 */
export async function changePasswordAction(
  userId: string,
  prevState: any,
  formData: FormData
) {
  try {
    // 1. Token kontrolü (güvenlik)
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return {
        success: false,
        message: 'Oturum bulunamadı',
      }
    }

    // Token'ı doğrula
    const currentUser = await verifyAccesToken(token)

    if (!currentUser || currentUser.userId !== userId) {
      return {
        success: false,
        message: 'Yetkisiz işlem',
      }
    }

    // 2. Form verilerini al
    const currentPassword = formData.get('current_password') as string
    const newPassword = formData.get('new_password') as string
    const confirmPassword = formData.get('confirm_password') as string

    // 3. Basit validasyonlar
    if (!currentPassword || !newPassword || !confirmPassword) {
      return {
        success: false,
        message: 'Tüm alanları doldurun',
      }
    }

    // Yeni şifre en az 8 karakter olmalı
    if (newPassword.length < 8) {
      return {
        success: false,
        message: 'Yeni şifre en az 8 karakter olmalı',
      }
    }

    // Şifreler eşleşmeli
    if (newPassword !== confirmPassword) {
      return {
        success: false,
        message: 'Yeni şifreler eşleşmiyor',
      }
    }

    // 4. Mevcut kullanıcıyı database'den al
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('id, password_hash')
      .eq('id', userId)
      .single()

    if (fetchError || !user) {
      return {
        success: false,
        message: 'Kullanıcı bulunamadı',
      }
    }

    // 5. Mevcut şifreyi doğrula
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password_hash
    )

    if (!isCurrentPasswordValid) {
      return {
        success: false,
        message: 'Mevcut şifre yanlış',
      }
    }

    // 6. Yeni şifreyi hashle
    const newPasswordHash = await bcrypt.hash(newPassword, 10)

    // 7. Şifreyi güncelle
    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: newPasswordHash })
      .eq('id', userId)

    if (updateError) {
      console.error('Şifre güncelleme hatası:', updateError)
      return {
        success: false,
        message: 'Şifre güncellenemedi',
      }
    }

    // 8. Activity log kaydet
    await supabase.from('activity_logs').insert({
      user_id: userId,
      action: 'change_password',
      entity_type: 'user',
      entity_id: userId,
    })

    return {
      success: true,
      message: 'Şifre başarıyla değiştirildi',
    }
  } catch (error) {
    console.error('Şifre değiştirme hatası:', error)
    return {
      success: false,
      message: 'Bir hata oluştu, lütfen tekrar deneyin',
    }
  }
}