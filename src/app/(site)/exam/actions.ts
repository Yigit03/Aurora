// app/(site)/exam/actions.ts
'use server'

import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface ExamQuestion {
  id: string
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: 'a' | 'b' | 'c' | 'd'
  level: string
  order_index: number
}

export interface ExamResult {
  fullname: string
  email: string
  level: string
  score: number
  total: number
}

export const getExamQuestions = async (): Promise<ExamQuestion[]> => {
  const { data } = await supabase
    .from('exam_questions')
    .select('id, question, option_a, option_b, option_c, option_d, correct_answer, level, order_index')
    .eq('is_active', true)
    .order('level', { ascending: true })
    .order('order_index', { ascending: true })
  return (data ?? []) as ExamQuestion[]
}

export const submitExam = async (
  userInfo: { fullname: string; email: string },
  answers: Record<string, 'a' | 'b' | 'c' | 'd'>,
  questions: ExamQuestion[]
): Promise<{ level: string; nextLevel: string; score: number; total: number }> => {

  const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
  const PASS_RATE = 0.6

  // Her seviyedeki doğru/toplam sayısını hesapla
  const levelStats: Record<string, { correct: number; total: number }> = {}

  for (const q of questions) {
    if (!levelStats[q.level]) levelStats[q.level] = { correct: 0, total: 0 }
    levelStats[q.level].total++
    if (answers[q.id] === q.correct_answer) levelStats[q.level].correct++
  }

  // En son geçilen seviyeyi bul
  let determinedLevel = 'A1'
  for (const level of LEVELS) {
    const stats = levelStats[level]
    if (!stats) continue
    if (stats.correct / stats.total >= PASS_RATE) {
      determinedLevel = level
    } else {
      break
    }
  }

  const levelIndex = LEVELS.indexOf(determinedLevel)
  const nextLevel = LEVELS[levelIndex + 1] ?? determinedLevel

  const totalCorrect = Object.values(levelStats).reduce((sum, s) => sum + s.correct, 0)
  const totalQuestions = questions.length

  // DB'ye kaydet
  await supabase.from('exam_results').insert({
    fullname: userInfo.fullname,
    email: userInfo.email,
    score: totalCorrect,
    total: totalQuestions,
    level: determinedLevel,
    answers: answers,
  })

  // Email gönder
  const levelDescriptions: Record<string, string> = {
    A1: 'Başlangıç Seviyesi',
    A2: 'Temel Seviye',
    B1: 'Orta Seviye',
    B2: 'Orta-Üst Seviye',
    C1: 'İleri Seviye',
    C2: 'Anadil Seviyesi',
  }

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: userInfo.email,
    subject: 'Almanca Seviye Test Sonucunuz',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #fff;">
        <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 32px; border-radius: 16px; text-align: center; margin-bottom: 32px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Test Sonucunuz</h1>
          <p style="color: #fecaca; margin: 8px 0 0;">Aurora Dil Eğitim Merkezi</p>
        </div>

        <p style="color: #374151; font-size: 16px;">Merhaba <strong>${userInfo.fullname}</strong>,</p>
        <p style="color: #6b7280;">Almanca seviye testini tamamladınız. İşte sonuçlarınız:</p>

        <div style="background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
          <p style="color: #6b7280; margin: 0 0 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Mevcut Seviyeniz</p>
          <div style="font-size: 48px; font-weight: 900; color: #dc2626;">${determinedLevel}</div>
          <p style="color: #374151; font-weight: 600; margin: 4px 0 0;">${levelDescriptions[determinedLevel]}</p>
          <p style="color: #9ca3af; font-size: 14px; margin: 8px 0 0;">${totalCorrect} / ${totalQuestions} doğru</p>
        </div>

        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <p style="color: #dc2626; font-weight: 700; margin: 0 0 8px;">🎯 Hedef Seviyeniz: ${nextLevel}</p>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">
            Bu sonuç yapay zeka tarafından belirlenmiştir. Kesin sonuç için uzman eğitmenlerimizle ücretsiz görüşme yapmanızı öneririz.
          </p>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="https://wa.me/905462071948?text=${encodeURIComponent('Merhaba, seviye testini tamamladım ve uzman görüşü almak istiyorum.')}" 
             style="background: #16a34a; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px;">
            Uzmanla Görüş 📞
          </a>
        </div>

        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 32px;">
          Aurora Dil Eğitim Merkezi · Bu mail otomatik olarak gönderilmiştir.
        </p>
      </div>
    `
  })

  return {
    level: determinedLevel,
    nextLevel,
    score: totalCorrect,
    total: totalQuestions,
  }
}