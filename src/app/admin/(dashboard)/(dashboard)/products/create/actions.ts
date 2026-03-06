'use server'
// Ürün oluşturma action'ı (Cloudinary upload ile)

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'
import { verifyAccesToken } from '@/lib/jwt'
import cloudinary from '@/lib/cloudinary'

/**
 * Ürün Oluşturma Action
 * @param prevState - Önceki form state'i
 * @param formData - Form verisi (resim dahil)
 */
export async function createProductAction(prevState: any, formData: FormData) {
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

    // 2. Form verilerini al
    const title = formData.get('title') as string
    const categoryId = formData.get('category_id') as string
    const price = formData.get('price') as string
    const description = formData.get('description') as string
    const image = formData.get('image') as File

    // 3. Basit validasyonlar
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

    // Resim kontrolü
    if (!image || image.size === 0) {
      return {
        success: false,
        message: 'Lütfen bir ürün fotoğrafı yükleyin',
      }
    }

    // Resim boyut kontrolü (5MB max)
    if (image.size > 5 * 1024 * 1024) {
      return {
        success: false,
        message: 'Resim boyutu en fazla 5MB olabilir',
      }
    }

    // Resim tipi kontrolü
    if (!image.type.startsWith('image/')) {
      return {
        success: false,
        message: 'Sadece resim dosyası yükleyebilirsiniz',
      }
    }

    // 4. Resmi Cloudinary'ye yükle
    // Resmi buffer'a çevir
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Base64'e çevir
    const base64Image = `data:${image.type};base64,${buffer.toString('base64')}`

    // Cloudinary'ye upload
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: `products/${currentUser.userId}`, // Kullanıcı klasörü
      transformation: [
        { width: 800, height: 800, crop: 'limit' }, // Max boyut
        { quality: 'auto' }, // Otomatik kalite
        { fetch_format: 'auto' }, // Otomatik format (webp vb.)
      ],
    })

    const imageUrl = uploadResponse.secure_url

    // 5. Ürünü database'e ekle
    const { data: newProduct, error: insertError } = await supabase
      .from('products')
      .insert({
        user_id: currentUser.userId,
        category_id: categoryId,
        title: title.trim(),
        description: description?.trim() || null,
        price: parseFloat(price),
        image_url: imageUrl,
        is_published: true, // Varsayılan yayında
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('Ürün ekleme hatası:', insertError)
      
      // Hata olursa Cloudinary'den resmi sil
      try {
        await cloudinary.uploader.destroy(uploadResponse.public_id)
      } catch (e) {
        console.error('Cloudinary silme hatası:', e)
      }

      return {
        success: false,
        message: 'Ürün eklenemedi',
      }
    }

    // 6. Activity log kaydet
    await supabase.from('activity_logs').insert({
      user_id: currentUser.userId,
      action: 'create_product',
      entity_type: 'product',
      entity_id: newProduct.id,
    })

    return {
      success: true,
      message: 'Ürün başarıyla eklendi',
    }
  } catch (error) {
    console.error('Ürün oluşturma hatası:', error)
    return {
      success: false,
      message: 'Bir hata oluştu, lütfen tekrar deneyin',
    }
  }
}