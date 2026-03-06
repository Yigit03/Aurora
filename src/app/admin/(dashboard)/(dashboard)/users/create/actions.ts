'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { supabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'
import { createUserSchema } from '@/lib/validations'

export async function createUserAction(prevState: any, formData: FormData) {
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

    // 2. Form verilerini al
    const rawData = {
      full_name: formData.get('full_name'),
      email: formData.get('email'),
      password: formData.get('password'),
      role: formData.get('role') as string,
      is_active: formData.get('is_active') === 'on',
    }

    // 3. Validasyon
    const validatedData = createUserSchema.safeParse(rawData)

    if (!validatedData.success) {
      return {
        success: false,
        message: validatedData.error.issues[0].message,
      }
    }

    const { full_name, email, password, role, is_active } = validatedData.data

    // 4. Email kontrolü
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return {
        success: false,
        message: 'Bu email adresi zaten kullanılıyor',
      }
    }

    // 5. Role kontrolü
    if (role === 'admin' && currentUser.role !== 'super_admin') {
      return {
        success: false,
        message: 'Admin kullanıcı oluşturmak için super_admin olmalısınız',
      }
    }

    // 6. Şifre hashle
    const password_hash = await bcrypt.hash(password, 10)

    // 7. Kullanıcı ekle
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        full_name,
        email,
        password_hash,
        role,
        is_active,
        created_by: currentUser.userId,
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('Kullanıcı ekleme hatası:', insertError)
      return {
        success: false,
        message: 'Kullanıcı oluşturulamadı',
      }
    }

    // 8. Activity log
    await supabase.from('activity_logs').insert({
      user_id: currentUser.userId,
      action: 'create_user',
      entity_type: 'user',
      entity_id: newUser.id,
    })

    // NOT: Success mesajı gösterme, direkt redirect
    // return { success: true, message: '...' } YAPMA!

  } catch (error) {
    console.error('Kullanıcı oluşturma hatası:', error)
    return {
      success: false,
      message: 'Bir hata oluştu, lütfen tekrar deneyin',
    }
  }

  // FIX: redirect() try-catch DIŞINDA olmalı
  redirect('/admin/users')
}