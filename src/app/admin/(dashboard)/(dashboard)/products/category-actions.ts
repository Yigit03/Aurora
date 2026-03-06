'use server'
// Kategori ekleme action'ı

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'
import { verifyAccesToken } from '@/lib/jwt'

/**
 * Kategori Ekleme Action
 * @param prevState - Önceki state
 * @param formData - Form verisi
 */
export async function createCategoryAction(prevState: any, formData: FormData) {
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

    const currentUser = await verifyAccesToken(token)

    if (!currentUser) {
      return {
        success: false,
        message: 'Geçersiz oturum',
      }
    }

    // Sadece admin ve super_admin kategori ekleyebilir
    if (currentUser.role !== 'super_admin' && currentUser.role !== 'admin') {
      return {
        success: false,
        message: 'Bu işlem için yetkiniz yok',
      }
    }

    // 2. Form verilerini al
    const name = formData.get('name') as string

    if (!name || name.trim().length < 2) {
      return {
        success: false,
        message: 'Kategori adı en az 2 karakter olmalı',
      }
    }

    // Slug oluştur (Türkçe karakterleri düzelt)
    const slug = name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // 3. Aynı isimde kategori var mı kontrol et
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('name', name.trim())
      .single()

    if (existing) {
      return {
        success: false,
        message: 'Bu kategori zaten mevcut',
      }
    }

    // 4. Kategori ekle
    const { error: insertError } = await supabase
      .from('categories')
      .insert({
        name: name.trim(),
        slug: slug,
      })

    if (insertError) {
      console.error('Kategori ekleme hatası:', insertError)
      return {
        success: false,
        message: 'Kategori eklenemedi',
      }
    }

    // 5. Sayfayı yenile
    revalidatePath('/admin/products')

    return {
      success: true,
      message: 'Kategori başarıyla eklendi',
    }
  } catch (error) {
    console.error('Kategori ekleme hatası:', error)
    return {
      success: false,
      message: 'Bir hata oluştu',
    }
  }
}

/**
 * Kategori Silme Action
 * @param categoryId - Silinecek kategori ID
 */
export async function deleteCategoryAction(categoryId: string) {
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

    // Sadece admin ve super_admin kategori silebilir
    if (currentUser.role !== 'super_admin' && currentUser.role !== 'admin') {
      return {
        success: false,
        message: 'Bu işlem için yetkiniz yok',
      }
    }

    // 2. Kategoride ürün var mı kontrol et
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', categoryId)

    if (productCount && productCount > 0) {
      return {
        success: false,
        message: `Bu kategoride ${productCount} ürün var. Önce ürünleri taşıyın veya silin.`,
      }
    }

    // 3. Kategoriyi sil
    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId)

    if (deleteError) {
      console.error('Kategori silme hatası:', deleteError)
      return {
        success: false,
        message: 'Kategori silinemedi',
      }
    }

    // 4. Sayfayı yenile
    revalidatePath('/admin/products')

    return {
      success: true,
      message: 'Kategori başarıyla silindi',
    }
  } catch (error) {
    console.error('Kategori silme hatası:', error)
    return {
      success: false,
      message: 'Bir hata oluştu',
    }
  }
}