'use server'
// Kullanıcı yönetimi action'ları (silme, güncelleme)

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'
import { verifyAccesToken } from '@/lib/jwt'

const isAdmin = (role: string) => ['superadmin', 'admin'].includes(role)
const isEditor = (role: string) => ['superadmin', 'admin', 'editor'].includes(role)

/**
 * Kullanıcı Silme Action
 * @param userId - Silinecek kullanıcının ID'si
 */
export async function deleteUserAction(userId: string) {
  try {
    // 1. Token'dan giriş yapan kullanıcıyı al
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

    if (!currentUser) {
      return {
        success: false,
        message: 'Geçersiz oturum',
      }
    }

    // 2. Yetki kontrolü (sadece super_admin ve admin silebilir)
    if (currentUser.role !== 'super_admin' && currentUser.role !== 'admin') {
      return {
        success: false,
        message: 'Bu işlem için yetkiniz yok',
      }
    }

    // 3. Silinecek kullanıcıyı database'den al
    const { data: targetUser, error: fetchError } = await supabase
      .from('users')
      .select('id, role, email')
      .eq('id', userId)
      .single()

    // Kullanıcı bulunamadı
    if (fetchError || !targetUser) {
      return {
        success: false,
        message: 'Kullanıcı bulunamadı',
      }
    }

    // 4. Süper admin silinemez (KORİTİK GÜVENLİK)
    if (targetUser.role === 'super_admin') {
      return {
        success: false,
        message: 'Süper admin kullanıcı silinemez',
      }
    }

    // 5. Admin kullanıcıyı sadece super_admin silebilir
    if (targetUser.role === 'admin' && currentUser.role !== 'super_admin') {
      return {
        success: false,
        message: 'Admin kullanıcıyı sadece süper admin silebilir',
      }
    }

    // 6. Kendi hesabını silemez
    if (targetUser.id === currentUser.sub) {
      return {
        success: false,
        message: 'Kendi hesabınızı silemezsiniz',
      }
    }

    // 7. Kullanıcıyı sil (CASCADE: products ve activity_logs otomatik silinir)
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)

    // Silme hatası
    if (deleteError) {
      console.error('Kullanıcı silme hatası:', deleteError)
      return {
        success: false,
        message: 'Kullanıcı silinemedi',
      }
    }

    // 8. Activity log kaydet (silinen kullanıcının kendi log'u silindiği için, silen kişinin log'una yazıyoruz)
    await supabase.from('activity_logs').insert({
      user_id: currentUser.sub,
      action: 'delete_user',
      entity_type: 'user',
      entity_id: userId,
    })

    // 9. Sayfayı yenile (cache'i temizle, yeni liste gelsin)
    // revalidatePath: Server component'leri yeniden render eder
    revalidatePath('/admin/users')

    return {
      success: true,
      message: 'Kullanıcı başarıyla silindi',
    }
  } catch (error) {
    console.error('Kullanıcı silme hatası:', error)
    return {
      success: false,
      message: 'Bir hata oluştu, lütfen tekrar deneyin',
    }
  }
}