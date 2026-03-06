'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { createCategoryAction, deleteCategoryAction } from './category-actions'
import { useState } from 'react'

// Ekleme butonu
function AddButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-green-400 transition-colors text-sm flex items-center gap-2"
    >
      {pending ? (
        <>
          <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Ekleniyor...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ekle
        </>
      )}
    </button>
  )
}

type Props = {
  categories: Array<{ id: string; name: string; slug: string }>
}

export default function CategoryManagement({ categories }: Props) {
  // Ekleme state'i
  const [addState, addFormAction] = useActionState(createCategoryAction, {
    success: false,
    message: '',
  })

  // Silme için loading state
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteMessage, setDeleteMessage] = useState<{ success: boolean; text: string } | null>(null)

  // Kategori silme handler
  const handleDelete = async (categoryId: string, categoryName: string) => {
    // Onay al
    const confirmed = confirm(
      `"${categoryName}" kategorisini silmek istediğinizden emin misiniz?\n\nBu kategoride ürün varsa işlem başarısız olacaktır.`
    )

    if (!confirmed) return

    setDeletingId(categoryId)
    setDeleteMessage(null)

    const result = await deleteCategoryAction(categoryId)

    setDeletingId(null)
    setDeleteMessage({ success: result.success, text: result.message })

    // Başarılıysa mesajı 3 saniye sonra temizle
    if (result.success) {
      setTimeout(() => setDeleteMessage(null), 3000)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      
      {/* Sol: Yeni Kategori Ekle */}
      <div className="bg-green-50 rounded-xl border border-green-200 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-100 rounded-lg p-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Yeni Kategori Ekle</h3>
            <p className="text-xs text-gray-600">Ürünleriniz için yeni kategori oluşturun</p>
          </div>
        </div>

        <form action={addFormAction} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Kategori adı (örn: İçecekler, Tatlılar)"
            required
            className="w-full px-4 py-2.5 bg-white border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition placeholder:text-gray-400 text-sm"
          />
          
          <AddButton />

          {/* Ekleme mesajı */}
          {addState.message && (
            <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
              addState.success
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {addState.success ? '✓' : '✕'} {addState.message}
            </div>
          )}
        </form>
      </div>

      {/* Sağ: Mevcut Kategoriler */}
      <div className="bg-red-50 rounded-xl border border-red-200 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 rounded-lg p-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Kategori Sil</h3>
            <p className="text-xs text-gray-600">Kullanılmayan kategorileri silin</p>
          </div>
        </div>

        {/* Silme mesajı */}
        {deleteMessage && (
          <div className={`mb-3 p-3 rounded-lg text-xs flex items-center gap-2 ${
            deleteMessage.success
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}>
            {deleteMessage.success ? '✓' : '✕'} {deleteMessage.text}
          </div>
        )}

        {/* Kategori listesi */}
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {categories.length === 0 ? (
            <div className="text-center py-6 text-gray-500 text-sm">
              Henüz kategori bulunmuyor
            </div>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between bg-white p-3 rounded-lg border border-red-200 hover:border-red-300 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{category.name}</p>
                  <p className="text-xs text-gray-500">{category.slug}</p>
                </div>
                <button
                  onClick={() => handleDelete(category.id, category.name)}
                  disabled={deletingId === category.id}
                  className="ml-3 p-2 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Sil"
                >
                  {deletingId === category.id ? (
                    <svg className="animate-spin w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}