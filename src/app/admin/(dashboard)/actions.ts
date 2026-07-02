'use server'
// Dashboard genel action'ları (logout, vb.)

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'


export async function logoutAction() {
  try {

    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value


    if (token) {
      try {
        const { verifyAccesToken } = await import('@/lib/jwt')
        const payload = await verifyAccesToken(token)
        
        if (payload) {
          await supabase.from('activity_logs').insert({ 
            user_id: payload.sub,
            action: 'logout',
            entity_type: 'user',
            entity_id: payload.sub,
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