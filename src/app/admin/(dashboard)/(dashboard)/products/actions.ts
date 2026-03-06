'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'
import { verifyAccesToken } from '@/lib/jwt'
import cloudinary from '@/lib/cloudinary'

export async function deleteProductAction(productId: string) {
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

    // 2. Ürünü getir
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('id, user_id, image_url, title')
      .eq('id', productId)
      .single()

    if (fetchError || !product) {
      return {
        success: false,
        message: 'Ürün bulunamadı',
      }
    }

    // 3. Yetki kontrolü
    if (
      product.user_id !== currentUser.userId &&
      currentUser.role !== 'admin' &&
      currentUser.role !== 'super_admin'
    ) {
      return {
        success: false,
        message: 'Bu ürünü silme yetkiniz yok',
      }
    }

    // 4. Cloudinary'den resmi sil - DÜZELTİLMİŞ
    try {
      const imageUrl = product.image_url
      
      // URL'den public_id çıkar
      // Örnek URL: https://res.cloudinary.com/dc2pice32/image/upload/v1771164290/products/user-id/filename.jpg
      
      // "upload/" dan sonrasını al
      const uploadIndex = imageUrl.indexOf('/upload/') + 8 // "/upload/" = 8 karakter
      const afterUpload = imageUrl.substring(uploadIndex)
      
      // Version prefix'i kaldır (v1771164290/)
      const withoutVersion = afterUpload.replace(/^v\d+\//, '')
      
      // Uzantıyı kaldır (.jpg, .png vb.)
      const publicId = withoutVersion.replace(/\.[^.]+$/, '')
      
      console.log('🗑️ Siliniyor:', publicId)
      
      const result = await cloudinary.uploader.destroy(publicId)
      
      console.log('✅ Cloudinary sonuç:', result)
      
      if (result.result === 'ok') {
        console.log('✅ Cloudinary resim başarıyla silindi')
      } else {
        console.warn('⚠️ Cloudinary silme uyarısı:', result)
      }
    } catch (cloudinaryError) {
      console.error('❌ Cloudinary silme hatası:', cloudinaryError)
      // Resim silinmese bile devam et
    }

    // 5. Database'den sil
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    if (deleteError) {
      console.error('Ürün silme hatası:', deleteError)
      return {
        success: false,
        message: 'Ürün silinemedi',
      }
    }

    // 6. Activity log
    await supabase.from('activity_logs').insert({
      user_id: currentUser.userId,
      action: 'delete_product',
      entity_type: 'product',
      entity_id: productId,
    })

    // 7. Sayfayı yenile
    revalidatePath('/admin/products')

    console.log('✅ Ürün tamamen silindi:', product.title)

    return {
      success: true,
      message: 'Ürün başarıyla silindi',
    }
  } catch (error) {
    console.error('Ürün silme hatası:', error)
    return {
      success: false,
      message: 'Bir hata oluştu, lütfen tekrar deneyin',
    }
  }
}