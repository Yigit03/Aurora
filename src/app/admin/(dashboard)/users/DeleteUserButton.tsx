'use client'
// Client component (confirm dialog için)

import { useState } from 'react'
import { deleteUserAction } from './actions'

type Props = {
  userId: string
  userName: string
}

export default function DeleteUserButton({ userId, userName }: Props) {
  // Loading state (buton disabled için)
  const [isDeleting, setIsDeleting] = useState(false)

  // Silme fonksiyonu
  const handleDelete = async () => {
    // 1. Onay al (tarayıcı native dialog)
    const confirmed = confirm(
      `"${userName}" kullanıcısını silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz ve kullanıcının tüm ürünleri de silinecektir.`
    )

    // Onay verilmediyse iptal
    if (!confirmed) return

    // 2. Loading başlat
    setIsDeleting(true)

    // 3. Server action çağır
    const result = await deleteUserAction(userId)

    // 4. Sonucu göster
    if (result.success) {
      // Başarılı - sayfa otomatik yenilenecek (revalidatePath sayesinde)
      alert(result.message)
    } else {
      // Hata - kullanıcıya göster
      alert(result.message)
      setIsDeleting(false) // Loading durdur
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
    >
      {isDeleting ? 'Siliniyor...' : 'Sil'}
    </button>
  )
}