// app/admin/(dashboard)/exam/page.tsx
"use server"

import Link from 'next/link'
import DeleteQuestionButton from './DeleteQuestionButton'
import { ExamQuestion } from './constants'
import { getQuestions } from './actions'

const LEVEL_COLORS: Record<string, string> = {
  A1: 'bg-green-500/20 text-green-400',
  A2: 'bg-teal-500/20 text-teal-400',
  B1: 'bg-blue-500/20 text-blue-400',
  B2: 'bg-indigo-500/20 text-indigo-400',
  C1: 'bg-purple-500/20 text-purple-400',
  C2: 'bg-red-500/20 text-red-400',
}

export default async function ExamPage() {
  const questions = await getQuestions()

  const grouped = questions.reduce((acc, q) => {
    if (!acc[q.level]) acc[q.level] = []
    acc[q.level].push(q)
    return acc
  }, {} as Record<string, ExamQuestion[]>)

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

  return (
    <div className="space-y-6">

      {/* Başlık */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Seviye Testi Soruları</h1>
          <p className="text-slate-400 text-sm mt-1">
            Toplam {questions.length} soru · {Object.keys(grouped).length} seviye
          </p>
        </div>
        <Link
          href="/admin/exam/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Soru
        </Link>
      </div>

      {/* Seviyeye göre gruplandırılmış sorular */}
      {levels.map((level) => {
        const levelQuestions = grouped[level] ?? []
        if (levelQuestions.length === 0) return null

        return (
          <div key={level} className="bg-slate-800 rounded-xl border border-white/10 overflow-hidden">
            {/* Level Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${LEVEL_COLORS[level]}`}>
                  {level}
                </span>
                <h2 className="font-semibold text-white">{levelQuestions.length} Soru</h2>
              </div>
            </div>

            {/* Sorular */}
            <div className="divide-y divide-white/5">
              {levelQuestions.map((q, index) => (
                <div key={q.id} className="px-6 py-4 flex items-start justify-between gap-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <span className="text-slate-500 text-sm font-medium shrink-0 mt-0.5">
                      {index + 1}.
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{q.question}</p>
                      <div className="grid grid-cols-2 gap-1 mt-2">
                        {(['a', 'b', 'c', 'd'] as const).map((opt) => (
                          <p key={opt} className={`text-xs px-2 py-1 rounded-lg ${
                            q.correct_answer === opt
                              ? 'bg-green-500/20 text-green-400 font-semibold'
                              : 'text-slate-500'
                          }`}>
                            {opt.toUpperCase()}. {q[`option_${opt}`]}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`w-2 h-2 rounded-full ${q.is_active ? 'bg-green-400' : 'bg-slate-600'}`} title={q.is_active ? 'Aktif' : 'Pasif'} />
                    <Link
                      href={`/admin/exam/edit/${q.id}`}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      Düzenle
                    </Link>
                    <DeleteQuestionButton questionId={q.id} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {questions.length === 0 && (
        <div className="text-center py-12 bg-slate-800 rounded-xl border border-white/10">
          <p className="text-slate-500 text-sm">Henüz soru bulunmuyor</p>
          <Link href="/admin/exam/create" className="inline-block mt-4 text-blue-400 hover:text-blue-300 font-medium text-sm">
            İlk soruyu ekle →
          </Link>
        </div>
      )}
    </div>
  )
}