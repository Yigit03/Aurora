'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { updateProductAction } from './actions'
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
      {pending ? 'Güncelleniyor...' : 'Güncelle'}
    </button>
  )
}

type Props = {
  product: {
    id: string
    title: string
    description: string | null
    price: number
    image_url: string
    category_id: string
    categories: { id: string; name: string } | null
  }
  categories: Array<{ id: string; name: string; slug: string }>
}

export default function EditProductForm({ product, categories }: Props) {
  // Action'a productId bind et
  const updateWithId = updateProductAction.bind(null, product.id)

  const [state, formAction] = useActionState(updateWithId, {
    success: false,
    message: '',
  })

  // Resim önizleme (yeni resim seçilirse)
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
    <form action={formAction} className="space-y-5">
      
      {/* Hata/Başarı Mesajı */}
      {state.message && (
        <div
          className={`p-4 rounded-lg text-sm border ${
            state.success
              ? 'bg-green-50 text-green-800 border-green-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          <div className="flex items-start gap-3">
            {state.success ? '✓' : '✕'} {state.message}
          </div>
        </div>
      )}

      {/* Resim */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ürün Fotoğrafı
        </label>
        
        <div className="flex items-start gap-4">
          {/* Mevcut veya Yeni Resim */}
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200 shrink-0">
            <Image
              src={imagePreview || product.image_url}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Değiştir Butonu */}
          <div className="flex-1">
            <label
              htmlFor="image"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Fotoğrafı Değiştir
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <p className="text-xs text-gray-500 mt-2">
              PNG, JPG, WEBP (max. 5MB). Boş bırakırsanız mevcut resim kalır.
            </p>
          </div>
        </div>
      </div>

      {/* Ürün Adı */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Ürün Adı <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          defaultValue={product.title}
          placeholder="Örn: Izgara Köfte"
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder:text-gray-400 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Kategori */}
        <div>
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
            Kategori <span className="text-red-500">*</span>
          </label>
          <select
            id="category_id"
            name="category_id"
            required
            defaultValue={product.category_id}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Fiyat */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Fiyat (₺) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="price"
            name="price"
            required
            step="0.01"
            min="0"
            defaultValue={product.price}
            placeholder="0.00"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder:text-gray-400 text-sm"
          />
        </div>
      </div>

      {/* Açıklama */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Açıklama (Opsiyonel)
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={product.description || ''}
          placeholder="Ürün hakkında kısa açıklama..."
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder:text-gray-400 text-sm resize-none"
        />
      </div>

      {/* Butonlar */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        <SubmitButton />
        
        <a href="/admin/products"
          className="px-6 py-2.5 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 border border-gray-300 transition-colors text-sm"
        >
          İptal
        </a>
      </div>
    </form>
  )
}