'use client'
// Kullanıcı düzenleme formu

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { updateUserAction } from './actions'

// Submit butonu
function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? 'Güncelleniyor...' : 'Güncelle'}
    </button>
  )
}

type Props = {
  user: {
    id: string
    full_name: string
    email: string
    role: string
    is_active: boolean
  }
}

export default function EditUserForm({ user }: Props) {
  // Action'a userId bind et (curry pattern)
  const updateWithId = updateUserAction.bind(null, user.id)

  // State yönetimi
  const [state, formAction] = useActionState(updateWithId, {
    success: false,
    message: '',
  })

  return (
    <form action={formAction} className="space-y-6">
      {/* Hata/Başarı Mesajı */}
      {state.message && (
        <div
          className={`p-4 rounded-lg text-sm ${
            state.success
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {state.message}
        </div>
      )}

      {/* Ad Soyad Input - Mevcut değer ile doldurulmuş */}
      <div>
        <label
          htmlFor="full_name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Ad Soyad <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="full_name"
          name="full_name"
          required
          defaultValue={user.full_name} // Mevcut değer
          placeholder="Ahmet Yılmaz"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />
      </div>

      {/* Email Input */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          defaultValue={user.email} // Mevcut değer
          autoComplete="email"
          placeholder="ahmet@example.com"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />
      </div>

      {/* Şifre Input - OPSİYONEL */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Yeni Şifre (opsiyonel)
        </label>
        <input
          type="password"
          id="password"
          name="password"
          autoComplete="new-password"
          placeholder="Boş bırakırsanız şifre değişmez"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />
        <p className="text-xs text-gray-500 mt-1">
          Şifre değiştirmek istemiyorsanız boş bırakın
        </p>
      </div>

      {/* Rol Seçimi */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rol <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {/* User Radio */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="role"
              value="user"
              defaultChecked={user.role === 'user'} // Mevcut rol seçili
              className="w-4 h-4 text-blue-600"
            />
            <div>
              <span className="font-medium">Kullanıcı</span>
              <p className="text-xs text-gray-500">
                Sadece kendi ürünlerini yönetebilir
              </p>
            </div>
          </label>

          {/* Admin Radio */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="role"
              value="admin"
              defaultChecked={user.role === 'admin'} // Mevcut rol seçili
              className="w-4 h-4 text-blue-600"
            />
            <div>
              <span className="font-medium">Admin</span>
              <p className="text-xs text-gray-500">
                Kullanıcı ve ürünleri yönetebilir
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Aktif/Pasif Checkbox */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={user.is_active} // Mevcut durum
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-sm font-medium text-gray-700">
            Hesap aktif
          </span>
        </label>
        <p className="text-xs text-gray-500 mt-1 ml-6">
          Pasif hesaplar giriş yapamaz
        </p>
      </div>

      {/* Submit Button */}
      <SubmitButton />
    </form>
  )
}