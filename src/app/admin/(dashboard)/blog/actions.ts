// app/admin/(dashboard)/blogs/actions.ts

'use server'

import { supabaseAdmin } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { verifyAccesToken } from '@/lib/jwt'
import { redirect } from 'next/navigation'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// actions.ts içine ekle
export interface Blog {
  id: string
  title: string
  slug: string
  img: string
  is_published: boolean
  created_at: string
  users: { fullname: string } | null
}

const isAdmin = (role: string) => ['superadmin', 'admin'].includes(role)
const isEditor = (role: string) => ['superadmin', 'admin', 'editor'].includes(role)

// Başlıktan slug üret
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

const getUser = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) return null
  return await verifyAccesToken(token)
}

// ================================
// 📤 RESİM YÜKLE
// ================================
export const uploadBlogImage = async (formData: FormData) => {
  const user = await getUser()
  if (!user) return { success: false, message: 'Yetkisiz erişim.' }

  const file = formData.get('file') as File
  if (!file) return { success: false, message: 'Dosya bulunamadı.' }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

  const result = await cloudinary.uploader.upload(base64, {
    folder: 'blogs',
    resource_type: 'image',
  })

  return {
    success: true,
    url: result.secure_url,
    publicId: result.public_id,
  }
}

// ================================
// ➕ BLOG OLUŞTUR
// ================================
export const createBlog = async (formData: {
  title: string
  content: string
  img: string
  is_published: boolean
}) => {
  const user = await getUser()
  if (!user || !isEditor(user.role)) {
    return { success: false, message: 'Bu işlem için yetkiniz yok.' }
  }

  const slug = generateSlug(formData.title)

  // Slug benzersiz mi?
  const { data: existing } = await supabaseAdmin
    .from('blogs')
    .select('id')
    .eq('slug', slug)
    .single()

  if (existing) return { success: false, message: 'Bu başlıkta bir blog zaten mevcut.' }

  const { error } = await supabaseAdmin.from('blogs').insert({
    title: formData.title,
    slug,
    content: formData.content,
    img: formData.img,
    is_published: formData.is_published,
    user_id: user.sub,
  })

  if (error) return { success: false, message: 'Blog oluşturulamadı.' }

  await supabaseAdmin.from('logs').insert({
    user_id: user.sub,
    action_type: 'blog_created',
    content: `"${formData.title}" blogu oluşturuldu.`,
  })

  redirect('/admin/blog')
}

// ================================
// ✏️ BLOG GÜNCELLE
// ================================
export const updateBlog = async (
  id: string,
  formData: {
    title: string
    content: string
    img: string
    is_published: boolean
  }
) => {
  const user = await getUser()
  if (!user || !isAdmin(user.role)){   // ← sadece admin+
    return { success: false, message: 'Bu işlem için yetkiniz yok.' }
  }

  const slug = generateSlug(formData.title)

  // Slug başkası tarafından kullanılıyor mu?
  const { data: existing } = await supabaseAdmin
    .from('blogs')
    .select('id')
    .eq('slug', slug)
    .neq('id', id)
    .single()

  if (existing) return { success: false, message: 'Bu başlıkta bir blog zaten mevcut.' }

  const { error } = await supabaseAdmin
    .from('blogs')
    .update({
      title: formData.title,
      slug,
      content: formData.content,
      img: formData.img,
      is_published: formData.is_published,
    })
    .eq('id', id)

  if (error) return { success: false, message: 'Blog güncellenemedi.' }

  await supabaseAdmin.from('logs').insert({
    user_id: user.sub,
    action_type: 'blog_updated',
    content: `"${formData.title}" blogu güncellendi.`,
  })

  redirect('/admin/blog')
}

// ================================
// 🗑️ BLOG SİL
// ================================
export const deleteBlog = async (id: string) => {
  const user = await getUser()
  if (!user || !isAdmin(user.role)) {  // ← sadece admin+
    return { success: false, message: 'Bu işlem için yetkiniz yok.' }
  }
  
  const { data: blog } = await supabaseAdmin
    .from('blogs')
    .select('title, img')
    .eq('id', id)
    .single()

  if (!blog) return { success: false, message: 'Blog bulunamadı.' }

  // Cloudinary'den resmi sil
  if (blog.img) {
    const publicId = blog.img.split('/').slice(-2).join('/').replace(/\.[^/.]+$/, '')
    await cloudinary.uploader.destroy(publicId)
  }

  const { error } = await supabaseAdmin.from('blogs').delete().eq('id', id)

  if (error) return { success: false, message: 'Blog silinemedi.' }

  await supabaseAdmin.from('logs').insert({
    user_id: user.sub,
    action_type: 'blog_deleted',
    content: `"${blog.title}" blogu silindi.`,
  })

  redirect('/admin/blog')
}

// ================================
// 📋 BLOG LİSTESİ
// ================================
export const getBlogs = async (): Promise<Blog[]> => {
  const { data } = await supabaseAdmin
    .from('blogs')
    .select(`
      id, title, slug, img, is_published, created_at,
      users ( fullname )
    `)
    .order('created_at', { ascending: false })

  return (data ?? []) as unknown as Blog[]
}
// ================================
// 🔍 TEK BLOG
// ================================
export const getBlogById = async (id: string) => {
  const { data } = await supabaseAdmin
    .from('blogs')
    .select('*')
    .eq('id', id)
    .single()
  return data
}