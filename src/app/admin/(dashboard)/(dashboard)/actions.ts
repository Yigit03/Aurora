'use server'
// Dashboard genel action'ları (logout, vb.)

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'

/**
 * Logout İşlemi
 * Cookie temizle, activity log kaydet, login'e yönlendir
 */
export async function logoutAction() {
  try {
    // 1. Cookie'den user bilgisini al (log için)
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    // Token varsa activity log kaydet
    if (token) {
      // Token'dan user ID çıkar (basit parse - production'da jwt verify kullan)
      try {
        const { verifyAccesToken } = await import('@/lib/jwt')
        const payload = await verifyAccesToken(token)
        
        if (payload) {
          // Logout log'u kaydet
          await supabase.from('activity_logs').insert({
            user_id: payload.userId,
            action: 'logout',
            entity_type: 'user',
            entity_id: payload.userId,
          })
        }
      } catch (error) {
        console.error('Logout log hatası:', error)
        // Log hatası olsa bile logout devam etsin
      }
    }

    // 2. Cookie'yi temizle
    cookieStore.delete('auth-token')

  } catch (error) {
    console.error('Logout hatası:', error)
  }

  // 3. Login sayfasına yönlendir
  redirect('/admin/login')
}