// app/admin/(dashboard)/exam/actions.ts

'use server'

import { supabaseAdmin } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { verifyAccesToken } from '@/lib/jwt'
import { redirect } from 'next/navigation'
import { ExamQuestion, QuestionFormData } from './constants'

const getUser = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) return null
  return await verifyAccesToken(token)
}

// ================================
// 📋 SORU LİSTESİ
// ================================
export const getQuestions = async (): Promise<ExamQuestion[]> => {
  const { data } = await supabaseAdmin
    .from('exam_questions')
    .select('*')
    .order('level', { ascending: true })
    .order('order_index', { ascending: true })
  return (data ?? []) as ExamQuestion[]
}

// ================================
// 🔍 TEK SORU
// ================================
export const getQuestionById = async (id: string): Promise<ExamQuestion | null> => {
  const { data } = await supabaseAdmin
    .from('exam_questions')
    .select('*')
    .eq('id', id)
    .single()
  return data as ExamQuestion | null
}

// ================================
// ➕ SORU OLUŞTUR
// ================================
export const createQuestion = async (formData: QuestionFormData) => {
  const user = await getUser()
  if (!user) return { success: false, message: 'Yetkisiz erişim.' }

  const { error } = await supabaseAdmin.from('exam_questions').insert(formData)

  if (error) return { success: false, message: 'Soru oluşturulamadı.' }

  await supabaseAdmin.from('logs').insert({
    user_id: user.sub,
    action_type: 'question_created',
    content: `Yeni soru eklendi. (${formData.level})`,
  })

  redirect('/admin/exam')
}

// ================================
// ✏️ SORU GÜNCELLE
// ================================
export const updateQuestion = async (id: string, formData: QuestionFormData) => {
  const user = await getUser()
  if (!user) return { success: false, message: 'Yetkisiz erişim.' }

  const { error } = await supabaseAdmin
    .from('exam_questions')
    .update(formData)
    .eq('id', id)

  if (error) return { success: false, message: 'Soru güncellenemedi.' }

  await supabaseAdmin.from('logs').insert({
    user_id: user.sub,
    action_type: 'question_updated',
    content: `Soru güncellendi. (${formData.level})`,
  })

  redirect('/admin/exam')
}

// ================================
// 🗑️ SORU SİL
// ================================
export const deleteQuestion = async (id: string) => {
  const user = await getUser()
  if (!user) return { success: false, message: 'Yetkisiz erişim.' }

  const { error } = await supabaseAdmin
    .from('exam_questions')
    .delete()
    .eq('id', id)

  if (error) return { success: false, message: 'Soru silinemedi.' }

  await supabaseAdmin.from('logs').insert({
    user_id: user.sub,
    action_type: 'question_deleted',
    content: 'Soru silindi.',
  })

  redirect('/admin/exam')
}