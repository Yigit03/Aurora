// app/admin/(dashboard)/exam/edit/[id]/page.tsx

import Link from 'next/link'
import { notFound } from 'next/navigation'
import QuestionForm from '../../QuestionForm'
import { ExamQuestion, QuestionFormData } from '../../constants'
import { getQuestionById, updateQuestion } from '../../actions'

export default async function EditQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const question = await getQuestionById(id)

  if (!question) notFound()

  const handleUpdate = async (data: Parameters<typeof updateQuestion>[1]) => {
    'use server'
    return await updateQuestion(id, data)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/exam" className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Soru Düzenle</h1>
          <p className="text-slate-400 text-sm mt-1">{question.level} seviyesi</p>
        </div>
      </div>

      <QuestionForm
        initialData={question}
        onSubmit={handleUpdate}
        submitLabel="Güncelle"
      />
    </div>
  )
}