'use client'
// Ürün silme butonu (onay ile)

import { useState } from 'react'
import { deleteProductAction } from './actions'

type Props = {
  productId: string
  productTitle: string
}

export default function DeleteProductButton({ productId, productTitle }: Props) {
  // Loading state
  const [isDeleting, setIsDeleting] = useState(false)

  // Silme handler
  const handleDelete = async () => {
    // 1. Onay al
    const confirmed = confirm(
      `"${productTitle}" ürününü silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz ve ürün fotoğrafı da silinecektir.`
    )

    if (!confirmed) return

    // 2. Loading başlat
    setIsDeleting(true)

    // 3. Server action çağır
    const result = await deleteProductAction(productId)

    // 4. Sonucu göster
    if (result.success) {
      // Başarılı - sayfa otomatik yenilenecek (revalidatePath)
      // İsteğe bağlı: Başarı mesajı
    } else {
      // Hata
      alert(result.message)
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 hover:bg-red-50 rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
      title="Sil"
    >
      {isDeleting ? (
        <svg className="animate-spin w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-gray-400 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      )}
    </button>
  )
}