// app/admin/(dashboard)/exam/_components/QuestionForm.tsx

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LEVELS, QuestionFormData } from './constants'

interface QuestionFormProps {
  initialData?: QuestionFormData
  onSubmit: (data: QuestionFormData) => Promise<{ success: boolean; message: string } | void>
  submitLabel: string
}

const defaultForm: QuestionFormData = {
  question: '',
  option_a: '',
  option_b: '',
  option_c: '',
  option_d: '',
  correct_answer: 'a',
  level: 'A1',
  order_index: 0,
  is_active: true,
}

export default function QuestionForm({ initialData, onSubmit, submitLabel }: QuestionFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<QuestionFormData>(initialData ?? defaultForm)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setForm({
      ...form,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
               name === 'order_index' ? parseInt(value) : value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await onSubmit(form)
    if (result?.success === false) setError(result.message)

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Soru Metni */}
      <div className="bg-slate-800 rounded-xl border border-white/10 p-6 space-y-5">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Soru</h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Soru Metni <span className="text-red-400">*</span>
          </label>
          <textarea
            name="question"
            value={form.question}
            onChange={handleChange}
            required
            rows={3}
            placeholder="Soruyu buraya yazın..."
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
          />
        </div>

        {/* Seçenekler */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(['a', 'b', 'c', 'd'] as const).map((opt) => (
            <div key={opt} className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Seçenek {opt.toUpperCase()} <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name={`option_${opt}`}
                value={form[`option_${opt}`]}
                onChange={handleChange}
                required
                placeholder={`Seçenek ${opt.toUpperCase()}`}
                className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          ))}
        </div>

        {/* Doğru Cevap */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Doğru Cevap <span className="text-red-400">*</span>
          </label>
          <div className="flex gap-3">
            {(['a', 'b', 'c', 'd'] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setForm({ ...form, correct_answer: opt })}
                className={`flex-1 h-11 rounded-xl text-sm font-bold transition-all ${
                  form.correct_answer === opt
                    ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {opt.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ayarlar */}
      <div className="bg-slate-800 rounded-xl border border-white/10 p-6 space-y-5">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Ayarlar</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Seviye */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Seviye <span className="text-red-400">*</span>
            </label>
            <select
              name="level"
              value={form.level}
              onChange={handleChange}
              className="w-full h-11 px-4 rounded-xl bg-slate-700 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Sıra */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Sıra</label>
            <input
              type="number"
              name="order_index"
              value={form.order_index}
              onChange={handleChange}
              min={0}
              className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        {/* Aktif/Pasif */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Soru Durumu</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {form.is_active ? 'Soru testte gösterilecek' : 'Soru testte gösterilmeyecek'}
            </p>
          </div>
          <div
            onClick={() => setForm({ ...form, is_active: !form.is_active })}
            className={`w-12 h-6 rounded-full cursor-pointer transition-all duration-200 relative ${
              form.is_active ? 'bg-blue-600' : 'bg-slate-600'
            }`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
              form.is_active ? 'left-7' : 'left-1'
            }`} />
          </div>
        </div>
      </div>

      {/* Hata */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Butonlar */}
      <div className="flex gap-3">
        <Link
          href="/admin/exam"
          className="flex-1 h-11 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium flex items-center justify-center"
        >
          İptal
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-blue-600/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Kaydediliyor...' : submitLabel}
        </button>
      </div>

    </form>
  )
}