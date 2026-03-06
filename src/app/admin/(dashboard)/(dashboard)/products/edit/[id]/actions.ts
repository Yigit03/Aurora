'use server'
// Ürün düzenleme action'ı

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'
import { verifyAccesToken } from '@/lib/jwt'
import cloudinary from '@/lib/cloudinary'

/**
 * Ürün Güncelleme Action
 * @param productId - Güncellenecek ürün ID
 * @param prevState - Önceki state
 * @param formData - Form verisi
 */
export async function updateProductAction(
  productId: string,
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

    const currentUser = await verifyAccesToken(token)

    if (!currentUser) {
      return {
        success: false,
        message: 'Geçersiz oturum',
      }
    }

    // 2. Mevcut ürünü getir
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('id, user_id, image_url')
      .eq('id', productId)
      .single()

    if (fetchError || !existingProduct) {
      return {
        success: false,
        message: 'Ürün bulunamadı',
      }
    }

    // 3. Yetki kontrolü (sadece kendi ürünü veya admin)
    if (
      existingProduct.user_id !== currentUser.userId &&
      currentUser.role !== 'admin' &&
      currentUser.role !== 'super_admin'
    ) {
      return {
        success: false,
        message: 'Bu ürünü düzenleme yetkiniz yok',
      }
    }

    // 4. Form verilerini al
    const title = formData.get('title') as string
    const categoryId = formData.get('category_id') as string
    const price = formData.get('price') as string
    const description = formData.get('description') as string
    const image = formData.get('image') as File

    // 5. Validasyon
    if (!title || title.trim().length < 3) {
      return {
        success: false,
        message: 'Ürün adı en az 3 karakter olmalı',
      }
    }

    if (!categoryId) {
      return {
        success: false,
        message: 'Lütfen bir kategori seçin',
      }
    }

    if (!price || parseFloat(price) <= 0) {
      return {
        success: false,
        message: 'Geçerli bir fiyat girin',
      }
    }

    // 6. Güncellenecek veriler
    const updateData: any = {
      title: title.trim(),
      category_id: categoryId,
      price: parseFloat(price),
      description: description?.trim() || null,
    }

    // 7. Yeni resim yüklendiyse
    if (image && image.size > 0) {
      // Resim boyut kontrolü
      if (image.size > 5 * 1024 * 1024) {
        return {
          success: false,
          message: 'Resim boyutu en fazla 5MB olabilir',
        }
      }

      if (!image.type.startsWith('image/')) {
        return {
          success: false,
          message: 'Sadece resim dosyası yükleyebilirsiniz',
        }
      }

      // Eski resmi Cloudinary'den sil - DÜZELTİLMİŞ
      try {
        const oldImageUrl = existingProduct.image_url
        
        // URL'den public_id çıkar
        const uploadIndex = oldImageUrl.indexOf('/upload/') + 8
        const afterUpload = oldImageUrl.substring(uploadIndex)
        const withoutVersion = afterUpload.replace(/^v\d+\//, '')
        const publicId = withoutVersion.replace(/\.[^.]+$/, '')
        
        console.log('🗑️ Eski resim siliniyor:', publicId)
        
        const result = await cloudinary.uploader.destroy(publicId)
        
        console.log('✅ Cloudinary sonuç:', result)
      } catch (deleteError) {
        console.error('⚠️ Eski resim silme hatası:', deleteError)
        // Silme hatası olsa bile devam et
      }

      // Yeni resmi yükle
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64Image = `data:${image.type};base64,${buffer.toString('base64')}`

      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: `products/${currentUser.userId}`,
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' },
        ],
      })

      updateData.image_url = uploadResponse.secure_url
    }

    // 8. Ürünü güncelle
    const { error: updateError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', productId)

    if (updateError) {
      console.error('Ürün güncelleme hatası:', updateError)
      return {
        success: false,
        message: 'Ürün güncellenemedi',
      }
    }

    // 9. Activity log
    await supabase.from('activity_logs').insert({
      user_id: currentUser.userId,
      action: 'update_product',
      entity_type: 'product',
      entity_id: productId,
    })

    return {
      success: true,
      message: 'Ürün başarıyla güncellendi',
    }
  } catch (error) {
    console.error('Ürün güncelleme hatası:', error)
    return {
      success: false,
      message: 'Bir hata oluştu, lütfen tekrar deneyin',
    }
  }

  // Redirect
  redirect('/admin/products')
}