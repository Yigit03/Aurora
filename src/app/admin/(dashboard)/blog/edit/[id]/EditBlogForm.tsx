// app/admin/(dashboard)/blogs/edit/[id]/EditBlogForm.tsx

'use client'

import { useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { updateBlog, uploadBlogImage } from '../../actions'
import Link from 'next/link'
import Image from 'next/image'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })
import 'react-quill-new/dist/quill.snow.css'

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'blockquote', 'code-block'],
    ['clean'],
  ],
}

interface EditBlogFormProps {
  id: string
  initialData: {
    title: string
    content: string
    img: string
    is_published: boolean
  }
}

export default function EditBlogForm({ id, initialData }: EditBlogFormProps) {
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [error, setError] = useState('')
  const [title, setTitle] = useState(initialData.title)
  const [content, setContent] = useState(initialData.content)
  const [imageUrl, setImageUrl] = useState(initialData.img)
  const [isPublished, setIsPublished] = useState(initialData.is_published)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    const result = await uploadBlogImage(formData)

    if (result.success && result.url) {
    setImageUrl(result.url)
    } else {
    setError(result.message ?? 'Resim yüklenemedi.')
    }

    setImageLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageUrl) return setError('Lütfen bir kapak resmi yükleyin.')
    if (!content || content === '<p><br></p>') return setError('Lütfen blog içeriği girin.')

    setLoading(true)
    setError('')

    const result = await updateBlog(id, { title, content, img: imageUrl, is_published: isPublished })

    if (result?.success === false) {
      setError(result.message)
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Blog Bilgileri */}
      <div className="bg-slate-800 rounded-xl border border-white/10 p-6 space-y-5">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Blog Bilgileri</h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Başlık <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Blog başlığı"
            className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            İçerik <span className="text-red-400">*</span>
          </label>
          <div className="rounded-xl overflow-hidden border border-white/10">
              <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={QUILL_MODULES}
            />
          </div>
        </div>
      </div>

      {/* Kapak Resmi */}
      <div className="bg-slate-800 rounded-xl border border-white/10 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Kapak Resmi</h2>

        {imageUrl ? (
          <div className="relative w-full h-48 rounded-xl overflow-hidden border border-white/10">
            <Image src={imageUrl} alt="Kapak" className="w-full h-full object-cover" fill />
            <button
              type="button"
              onClick={() => { setImageUrl(''); if (fileInputRef.current) fileInputRef.current.value = '' }}
              className="absolute top-2 right-2 p-1.5 bg-red-600 rounded-lg text-white hover:bg-red-500 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-48 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-500/50 hover:bg-white/5 transition-all"
          >
            {imageLoading ? (
              <svg className="w-6 h-6 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <>
                <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-slate-500">Resim yüklemek için tıklayın</p>
                <p className="text-xs text-slate-600">PNG, JPG, WEBP</p>
              </>
            )}
          </div>
        )}

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      </div>

      {/* Yayın Durumu */}
      <div className="bg-slate-800 rounded-xl border border-white/10 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Yayın Durumu</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {isPublished ? 'Blog yayında görünecek' : 'Blog taslak olarak kaydedilecek'}
            </p>
          </div>
          <div
            onClick={() => setIsPublished(!isPublished)}
            className={`w-12 h-6 rounded-full cursor-pointer transition-all duration-200 relative ${
              isPublished ? 'bg-blue-600' : 'bg-slate-600'
            }`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
              isPublished ? 'left-7' : 'left-1'
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
          href="/admin/blogs"
          className="flex-1 h-11 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium flex items-center justify-center"
        >
          İptal
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-blue-600/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Güncelleniyor...' : 'Güncelle'}
        </button>
      </div>

    </form>
  )
}