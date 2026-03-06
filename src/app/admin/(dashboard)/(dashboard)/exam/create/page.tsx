// app/admin/(dashboard)/exam/create/page.tsx

import Link from 'next/link'
import QuestionForm from '../QuestionForm'
import { createQuestion } from '../actions'

export default function CreateQuestionPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/exam" className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Yeni Soru</h1>
          <p className="text-slate-400 text-sm mt-1">Seviye testine yeni soru ekleyin</p>
        </div>
      </div>

      <QuestionForm onSubmit={createQuestion} submitLabel="Soru Oluştur" />
    </div>
  )
}