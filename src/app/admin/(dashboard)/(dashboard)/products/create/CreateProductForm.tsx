'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { createProductAction } from './actions'
import { useState } from 'react'
import Image from 'next/image'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors text-sm"
    >
      {pending ? 'Ekleniyor...' : 'Ürün Ekle'}
    </button>
  )
}

type Props = {
  categories: Array<{ id: string; name: string; slug: string }>
}

export default function CreateProductForm({ categories }: Props) {
  const [state, formAction] = useActionState(createProductAction, {
    success: false,
    message: '',
  })

  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  return (
    <form action={formAction} className="space-y-4">
      
      {/* Hata/Başarı Mesajı */}
      {state.message && (
        <div
          className={`p-3 rounded-lg text-sm border flex items-center gap-2 ${
            state.success
              ? 'bg-green-50 text-green-800 border-green-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {state.success ? '✓' : '✕'} {state.message}
        </div>
      )}

      {/* Tek satır form - yatay layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* Fotoğraf - 2 kolon */}
        <div className="lg:col-span-2">
          {imagePreview ? (
            <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
              <Image
                src={imagePreview}
                alt="Önizleme"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null)
                  const input = document.getElementById('image') as HTMLInputElement
                  if (input) input.value = ''
                }}
                className="absolute top-1 right-1 bg-white/90 p-1 rounded"
              >
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <label
              htmlFor="image"
              className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-xs text-gray-500">Fotoğraf</span>
            </label>
          )}
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            required
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Bilgiler - 10 kolon */}
        <div className="lg:col-span-10 grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Ürün Adı */}
          <div>
            <input
              type="text"
              name="title"
              required
              placeholder="Ürün adı *"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder:text-gray-400 text-sm"
            />
          </div>

          {/* Kategori */}
          <div>
            <select
              name="category_id"
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
            >
              <option value="">Kategori seçin *</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Fiyat */}
          <div>
            <input
              type="number"
              name="price"
              required
              step="0.01"
              min="0"
              placeholder="Fiyat (₺) *"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder:text-gray-400 text-sm"
            />
          </div>

          {/* Açıklama */}
          <div>
            <input
              type="text"
              name="description"
              placeholder="Açıklama (opsiyonel)"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder:text-gray-400 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Butonlar */}
      <div className="flex items-center gap-3">
        <SubmitButton />
        <button
          type="reset"
          onClick={() => setImagePreview(null)}
          className="px-6 py-2.5 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 border border-gray-300 transition-colors text-sm"
        >
          Temizle
        </button>
      </div>
    </form>
  )
}