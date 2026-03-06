// app/(site)/exam/ExamClient.tsx
'use client'

import { useState } from 'react'
import { ExamQuestion, submitExam } from './actions'
import { CheckCircle, ChevronRight, Loader2, Mail, User } from 'lucide-react'

interface Props {
  questions: ExamQuestion[]
}

type Step = 'info' | 'test' | 'result'

interface ResultData {
  level: string
  nextLevel: string
  score: number
  total: number
}

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

const LEVEL_LABELS: Record<string, string> = {
  A1: 'Başlangıç',
  A2: 'Temel',
  B1: 'Orta',
  B2: 'Orta-Üst',
  C1: 'İleri',
  C2: 'Anadil',
}

const LEVEL_COLORS: Record<string, string> = {
  A1: 'from-green-500 to-emerald-600',
  A2: 'from-teal-500 to-cyan-600',
  B1: 'from-blue-500 to-indigo-600',
  B2: 'from-indigo-500 to-violet-600',
  C1: 'from-purple-500 to-fuchsia-600',
  C2: 'from-red-500 to-rose-600',
}

export default function ExamClient({ questions }: Props) {
  const [step, setStep] = useState<Step>('info')
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [answers, setAnswers] = useState<Record<string, 'a' | 'b' | 'c' | 'd'>>({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ResultData | null>(null)
  const [error, setError] = useState('')

  const grouped = LEVELS.reduce((acc, level) => {
    const levelQs = questions.filter(q => q.level === level)
    if (levelQs.length > 0) acc[level] = levelQs
    return acc
  }, {} as Record<string, ExamQuestion[]>)

  const answeredCount = Object.keys(answers).length
  const progress = Math.round((answeredCount / questions.length) * 100)

  const handleSubmit = async () => {
    if (answeredCount < questions.length) {
      setError('Lütfen tüm soruları cevaplayın.')
      return
    }
    setError('')
    setLoading(true)
    const res = await submitExam({ fullname, email }, answers, questions)
    setResult(res)
    setStep('result')
    setLoading(false)
  }

  // ── ADIM 1: Kullanıcı Bilgileri ──
  if (step === 'info') {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="w-auto h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <h2 className="text-xl font-black text-gray-900">Seviyenizi Görün!</h2>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              Sonuç e-posta adresinize gönderilecektir.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                Ad Soyad <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={fullname}
                  onChange={e => setFullname(e.target.value)}
                  placeholder="Adınız Soyadınız"
                  className="w-full pl-10 pr-4 h-11 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                E-posta <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  className="w-full pl-10 pr-4 h-11 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <button
              onClick={() => {
                if (!fullname.trim() || !email.trim()) return
                setStep('test')
              }}
              disabled={!fullname.trim() || !email.trim()}
              className="w-full h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Teste Başla
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 pt-6 border-t border-gray-100">
            {[
              { label: 'Soru', value: questions.length.toString() },
              { label: 'Seviye', value: '6' },
              { label: 'Süre', value: 'Serbest' },
            ].map(item => (
              <div key={item.label} className="text-center">
                <p className="text-lg font-black text-gray-900">{item.value}</p>
                <p className="text-xs text-gray-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── ADIM 2: Test ──
  if (step === 'test') {
    return (
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Progress */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-gray-700">{answeredCount} / {questions.length} soru cevaplandı</span>
            <span className="text-sm font-bold text-red-600">%{progress}</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Sorular - Seviyeye Göre Gruplandırılmış */}
        {LEVELS.filter(l => grouped[l]).map((level) => (
          <div key={level} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${LEVEL_COLORS[level]} flex items-center justify-center`}>
                <span className="text-white text-xs font-black">{level}</span>
              </div>
              <div>
                <h3 className="font-black text-gray-900">{level} <span className="text-gray-400 font-normal">— {LEVEL_LABELS[level]}</span></h3>
                <p className="text-xs text-gray-400">{grouped[level].length} soru</p>
              </div>
            </div>

            {grouped[level].map((q, index) => (
              <div
                key={q.id}
                className={`bg-white rounded-2xl border shadow-sm p-6 transition-all ${
                  answers[q.id] ? 'border-green-200' : 'border-gray-100'
                }`}
              >
                <p className="font-bold text-gray-900 mb-4 leading-snug">
                  <span className="text-gray-400 font-normal mr-2">{index + 1}.</span>
                  {q.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(['a', 'b', 'c', 'd'] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-all ${
                        answers[q.id] === opt
                          ? 'bg-red-600 border-red-600 text-white font-semibold'
                          : 'border-gray-200 text-gray-600 hover:border-red-300 hover:bg-red-50'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        answers[q.id] === opt ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {opt.toUpperCase()}
                      </span>
                      {q[`option_${opt}`]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Submit */}
        {error && (
          <p className="text-sm text-red-600 font-medium text-center">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-base transition-all hover:shadow-lg hover:shadow-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 size={20} className="animate-spin" /> Sonuçlar hesaplanıyor...</>
          ) : (
            <><CheckCircle size={20} /> Testi Tamamla</>
          )}
        </button>
      </div>
    )
  }

  // ── ADIM 3: Sonuç ──
  if (step === 'result' && result) {
    const waMessage = encodeURIComponent(`Merhaba, seviye testini tamamladım. Seviyem ${result.level} çıktı, uzman görüşü almak istiyorum.`)

    return (
      <div className="max-w-lg mx-auto space-y-6">

        {/* Sonuç Kartı */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className={`bg-gradient-to-br ${LEVEL_COLORS[result.level]} px-8 py-10 text-center`}>
            <p className="text-white/80 text-sm font-medium mb-2">Mevcut Seviyeniz</p>
            <div className="text-7xl font-black text-white mb-1">{result.level}</div>
            <p className="text-white/90 font-semibold text-lg">{LEVEL_LABELS[result.level]}</p>
            <p className="text-white/70 text-sm mt-2">{result.score} / {result.total} doğru</p>
          </div>

          <div className="p-6 space-y-4">
            {/* Seviye Skalası */}
            <div className="flex gap-1.5">
              {LEVELS.map((l) => {
                const passed = LEVELS.indexOf(l) <= LEVELS.indexOf(result.level)
                return (
                  <div key={l} className="flex-1 text-center">
                    <div className={`h-2 rounded-full mb-1 ${passed ? 'bg-red-500' : 'bg-gray-100'}`} />
                    <span className={`text-xs font-bold ${l === result.level ? 'text-red-600' : passed ? 'text-gray-500' : 'text-gray-300'}`}>{l}</span>
                  </div>
                )
              })}
            </div>

            {/* Hedef Seviye */}
            <div className="bg-red-50 rounded-xl p-4">
              <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">Hedef Seviyeniz</p>
              <p className="font-black text-gray-900">{result.nextLevel} — {LEVEL_LABELS[result.nextLevel]}</p>
              <p className="text-xs text-gray-500 mt-1">
                Bu sonuç algoritmik bir ön değerlendirmedir. Kesin seviyeniz için uzman eğitmenlerimizle görüşmenizi öneririz.
              </p>
            </div>

            {/* Email Onay */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Mail size={14} className="text-green-500 shrink-0" />
              Sonuçlar <strong className="text-gray-700">{email}</strong> adresine gönderildi.
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center space-y-4">
          <h3 className="font-black text-gray-900">Uzmanlarımızla Görüşün</h3>
          <p className="text-sm text-gray-500">
            Seviyenizi netleştirmek ve size özel kurs planı oluşturmak için ücretsiz danışmanlık alın.
          </p>
          
          <a href={`https://wa.me/905462071948?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm transition-all hover:shadow-lg hover:shadow-green-500/30"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
            </svg>
            WhatsApp ile Görüş
          </a>
          
          <a  href="/contact"
            className="flex items-center justify-center w-full h-12 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm transition-all"
          >
            İletişim Formu
          </a>
        </div>
      </div>
    )
  }

  return null
}