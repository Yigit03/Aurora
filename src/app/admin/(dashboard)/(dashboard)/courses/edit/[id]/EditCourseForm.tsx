// app/admin/(dashboard)/courses/edit/[id]/EditCourseForm.tsx

'use client'

import { useState } from 'react'
import { updateCourse, deleteCourse, Course, CourseContent } from '../../actions'
import Link from 'next/link'

interface EditCourseFormProps {
  id: string
  initialData: Course
}

export default function EditCourseForm({ id, initialData }: EditCourseFormProps) {
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [error, setError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [title, setTitle] = useState(initialData.title)
  const [subtitle, setSubtitle] = useState(initialData.subtitle)
  const [students, setStudents] = useState(initialData.students)
  const [price, setPrice] = useState(initialData.price?.toString() ?? '')
  const [isPopular, setIsPopular] = useState(initialData.is_popular)
  const [isPublished, setIsPublished] = useState(initialData.is_published)
  const [orderIndex, setOrderIndex] = useState(initialData.order_index ?? 0)
  const [contentItems, setContentItems] = useState<string[]>(
    initialData.content?.map(c => c.item) ?? ['']
  )

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

    const result = await updateCourse(id, {
      title, subtitle, students, content,
      price: price ? parseInt(price) : null,
      is_popular: isPopular,
      is_published: isPublished,
      order_index: orderIndex,
    })

    if (result?.success === false) setError(result.message)
    setLoading(false)
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    const result = await deleteCourse(id)
    if (result?.success === false) {
      setError(result.message)
      setShowDeleteConfirm(false)
    }
    setDeleteLoading(false)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Temel Bilgiler */}
        <div className="bg-slate-800 rounded-xl border border-white/10 p-6 space-y-5">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Kurs Bilgileri</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Başlık', value: title, setter: setTitle, placeholder: "Almanca'ya İlk Adım", required: true },
              { label: 'Alt Başlık', value: subtitle, setter: setSubtitle, placeholder: 'A1 - Başlangıç', required: true },
              { label: 'Öğrenci Sayısı', value: students, setter: setStudents, placeholder: '750+ Öğrenci', required: false },
            ].map((field) => (
              <div key={field.label} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  {field.label} {field.required && <span className="text-red-400">*</span>}
                </label>
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  required={field.required}
                  placeholder={field.placeholder}
                  className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            ))}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Fiyat (₺)</label>
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
                  <button type="button" onClick={() => removeContentItem(index)} className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={addContentItem} className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium">
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
              <div onClick={() => toggle.setter(!toggle.value)} className={`w-12 h-6 rounded-full cursor-pointer transition-all duration-200 relative ${toggle.value ? 'bg-blue-600' : 'bg-slate-600'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${toggle.value ? 'left-7' : 'left-1'}`} />
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <Link href="/admin/courses" className="flex-1 h-11 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium flex items-center justify-center">
            İptal
          </Link>
          <button type="submit" disabled={loading} className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-blue-600/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Güncelleniyor...' : 'Güncelle'}
          </button>
        </div>

      </form>

      {/* Tehlikeli Bölge */}
      <div className="bg-red-500/10 rounded-xl border border-red-500/20 p-6">
        <h3 className="text-sm font-semibold text-red-400 mb-1">Tehlikeli Bölge</h3>
        <p className="text-xs text-slate-400 mb-4">Bu kursu silmek geri alınamaz.</p>
        {!showDeleteConfirm ? (
          <button onClick={() => setShowDeleteConfirm(true)} className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm font-medium transition-all">
            Kursu Sil
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <p className="text-sm text-slate-300">Emin misiniz?</p>
            <button onClick={handleDelete} disabled={deleteLoading} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-all disabled:opacity-50">
              {deleteLoading ? 'Siliniyor...' : 'Evet, Sil'}
            </button>
            <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 rounded-lg bg-white/5 text-slate-400 hover:text-white text-sm font-medium transition-all">
              Vazgeç
            </button>
          </div>
        )}
      </div>
    </div>
  )
}