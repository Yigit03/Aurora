// app/admin/(dashboard)/exam/constants.ts

export const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const
export type Level = typeof LEVELS[number]

// app/admin/(dashboard)/exam/types.ts

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
  is_active: boolean
  created_at: string
}

export type QuestionFormData = Omit<ExamQuestion, 'id' | 'created_at'>