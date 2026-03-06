// app/admin/(dashboard)/courses/create/CourseForm.tsx

'use client'

import { useState } from 'react'
import { createCourse, CourseContent } from '../actions'
import Link from 'next/link'

export default function CourseForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [students, setStudents] = useState('')
  const [price, setPrice] = useState('')
  const [isPopular, setIsPopular] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [contentItems, setContentItems] = useState<string[]>([''])
  const [orderIndex, setOrderIndex] = useState(0)
  
  const addContentItem = () => setContentItems([...contentItems, ''])
  const removeContentItem = (index: number) => setContentItems(contentItems.filter((_, i) => i !== index))
  const updateContentItem = (index: number, value: string) => {
    const updated = [...contentItems]
    updated[index] = value
    setContentItems(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const content: CourseContent[] = contentItems
      .filter(item => item.trim() !== '')
      .map(item => ({ item }))

    if (content.length === 0) {
      setError('En az bir içerik maddesi ekleyin.')
      setLoading(false)
      return
    }

    const result = await createCourse({
      title,
      subtitle,
      students,
      content,
      price: price ? parseInt(price) : null,
      is_popular: isPopular,
      is_published: isPublished,
      order_index: orderIndex,
    })

    if (result?.success === false) setError(result.message)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Temel Bilgiler */}
      <div className="bg-slate-800 rounded-xl border border-white/10 p-6 space-y-5">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Kurs Bilgileri</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Başlık <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Almanca'ya İlk Adım"
              className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Alt Başlık <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              required
              placeholder="A1 - Başlangıç"
              className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Öğrenci Sayısı
            </label>
            <input
              type="text"
              value={students}
              onChange={(e) => setStudents(e.target.value)}
              placeholder="750+ Öğrenci"
              className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Fiyat (₺)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Boş bırakırsanız iletişim linki gösterilir"
              className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>
      </div>

    {/* Sıralama için index değeri alma işlemi */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Sıra <span className="text-red-400">*</span>
        </label>
        <input
          type="number"
          value={orderIndex}
          onChange={(e) => setOrderIndex(parseInt(e.target.value))}
          min={0}
          placeholder="0"
          className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
        />
        <p className="text-xs text-slate-500">Küçük sayı önce gelir. A1→0, A2→1, B1→2 gibi</p>
      </div>

      {/* İçerik Maddeleri */}
      <div className="bg-slate-800 rounded-xl border border-white/10 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Kurs İçeriği</h2>

        <div className="space-y-3">
          {contentItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="text"
                value={item}
                onChange={(e) => updateContentItem(index, e.target.value)}
                placeholder={`İçerik maddesi ${index + 1}`}
                className="flex-1 h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              {contentItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeContentItem(index)}
                  className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addContentItem}
          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Madde Ekle
        </button>
      </div>

      {/* Ayarlar */}
      <div className="bg-slate-800 rounded-xl border border-white/10 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Ayarlar</h2>

        {[
          { label: 'Popüler Kurs', desc: 'Kurs popüler olarak işaretlenecek', value: isPopular, setter: setIsPopular },
          { label: 'Yayın Durumu', desc: isPublished ? 'Kurs yayında görünecek' : 'Kurs taslak olarak kaydedilecek', value: isPublished, setter: setIsPublished },
        ].map((toggle) => (
          <div key={toggle.label} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">{toggle.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{toggle.desc}</p>
            </div>
            <div
              onClick={() => toggle.setter(!toggle.value)}
              className={`w-12 h-6 rounded-full cursor-pointer transition-all duration-200 relative ${
                toggle.value ? 'bg-blue-600' : 'bg-slate-600'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
                toggle.value ? 'left-7' : 'left-1'
              }`} />
            </div>
          </div>
        ))}
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
        <Link href="/admin/courses" className="flex-1 h-11 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium flex items-center justify-center">
          İptal
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-blue-600/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Oluşturuluyor...' : 'Kurs Oluştur'}
        </button>
      </div>

    </form>
  )
}