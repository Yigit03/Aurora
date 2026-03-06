// app/admin/(dashboard)/courses/actions.ts

'use server'

import { supabaseAdmin } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { verifyAccesToken } from '@/lib/jwt'
import { redirect } from 'next/navigation'

export interface CourseContent {
  item: string
}

export interface Course {
  id: string
  title: string
  subtitle: string
  content: CourseContent[]
  price: number | null
  is_popular: boolean
  is_published: boolean
  students: string
  created_at: string
  order_index: number
}

const isAdmin = (role: string) => ['superadmin', 'admin'].includes(role)
const isEditor = (role: string) => ['superadmin', 'admin', 'editor'].includes(role)

const getUser = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) return null
  return await verifyAccesToken(token)
}

export const getCourses = async (): Promise<Course[]> => {
  const { data } = await supabaseAdmin
    .from('courses')
    .select('*')
    .order('order_index', { ascending: true })
  return (data ?? []) as Course[]
}

export const getCourseById = async (id: string): Promise<Course | null> => {
  const { data } = await supabaseAdmin
    .from('courses')
    .select('*')
    .eq('id', id)
    .single()
  return data as Course | null
}

export const createCourse = async (formData: {
  title: string
  subtitle: string
  content: CourseContent[]
  price: number | null
  is_popular: boolean
  is_published: boolean
  students: string
  order_index: number
}) => {
  const user = await getUser()
  if (!user || !isAdmin(user.role)){
    return { success: false, message: 'Bu işlem için yetkiniz yok.' }
  }

  const { error } = await supabaseAdmin.from('courses').insert({
    title: formData.title,
    subtitle: formData.subtitle,
    content: formData.content,
    price: formData.price,
    is_popular: formData.is_popular,
    is_published: formData.is_published,
    students: formData.students,
    user_id: user.sub,
  })

  if (error) return { success: false, message: 'Kurs oluşturulamadı.' }

  await supabaseAdmin.from('logs').insert({
    user_id: user.sub,
    action_type: 'course_created',
    content: `"${formData.title}" kursu oluşturuldu.`,
  })

  redirect('/admin/courses')
}

export const updateCourse = async (
  id: string,
  formData: {
    title: string
    subtitle: string
    content: CourseContent[]
    price: number | null
    is_popular: boolean
    is_published: boolean
    students: string
    order_index: number
  }
) => {
  const user = await getUser()
  if (!user || !isAdmin(user.role)){
    return { success: false, message: 'Bu işlem için yetkiniz yok.' }
  }

  const { error } = await supabaseAdmin
    .from('courses')
    .update({
      title: formData.title,
      subtitle: formData.subtitle,
      content: formData.content,
      price: formData.price,
      is_popular: formData.is_popular,
      is_published: formData.is_published,
      students: formData.students,
      order_index: formData.order_index,
    })
    .eq('id', id)

  if (error) return { success: false, message: 'Kurs güncellenemedi.' }

  await supabaseAdmin.from('logs').insert({
    user_id: user.sub,
    action_type: 'course_updated',
    content: `"${formData.title}" kursu güncellendi.`,
  })

  redirect('/admin/courses')
}

export const deleteCourse = async (id: string) => {
  const user = await getUser()
  if (!user || !isAdmin(user.role)){  
    return { success: false, message: 'Bu işlem için yetkiniz yok.' }
  }

  const { data: course } = await supabaseAdmin
    .from('courses')
    .select('title')
    .eq('id', id)
    .single()

  if (!course) return { success: false, message: 'Kurs bulunamadı.' }

  const { error } = await supabaseAdmin.from('courses').delete().eq('id', id)

  if (error) return { success: false, message: 'Kurs silinemedi.' }

  await supabaseAdmin.from('logs').insert({
    user_id: user.sub,
    action_type: 'course_deleted',
    content: `"${course.title}" kursu silindi.`,
  })

  redirect('/admin/courses')
}