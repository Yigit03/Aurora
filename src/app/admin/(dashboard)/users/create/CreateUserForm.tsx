'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { createUserAction } from './actions'

// Submit butonu
function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
      <button
        type="submit"
        disabled={pending}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        {pending ? 'Oluşturuluyor...' : 'Kullanıcı Oluştur'}
      </button>
      
        <a href="/admin/users"
        className="px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-50 border border-gray-300 transition-colors"
      >
        İptal
      </a>
    </div>
  )
}

export default function CreateUserForm() {
  const [state, formAction] = useActionState(createUserAction, {
    success: false,
    message: '',
  })

  return (
    <form action={formAction} className="space-y-8">
      
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
            {state.success ? (
              <svg className="w-5 h-5 text-green-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span>{state.message}</span>
          </div>
        </div>
      )}

      {/* Kişisel Bilgiler Bölümü */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Kişisel Bilgiler</h2>
        
        <div className="space-y-5">
          {/* Ad Soyad */}
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
              placeholder="Ahmet Yılmaz"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder:text-gray-400"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Adresi <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              autoComplete="email"
              placeholder="ahmet@example.com"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder:text-gray-400"
            />
            <p className="text-xs text-gray-500 mt-1">
              Kullanıcı bu email adresi ile giriş yapacaktır
            </p>
          </div>

          {/* Şifre */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Şifre <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder:text-gray-400"
            />
            <p className="text-xs text-gray-500 mt-1">
              Şifre en az 8 karakter olmalıdır
            </p>
          </div>
        </div>
      </div>

      {/* Yetki ve Durum Bölümü */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Yetki ve Durum</h2>
        
        <div className="space-y-5">
          {/* Rol Seçimi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Kullanıcı Rolü <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {/* User Radio */}
              <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  defaultChecked
                  className="w-5 h-5 text-blue-600 mt-0.5 shrink-0"
                />
                <div className="flex-1">
                  <span className="font-medium text-gray-900 block">Kullanıcı</span>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Sadece kendi ürünlerini yönetebilir. Sınırlı erişim.
                  </p>
                </div>
              </label>

              {/* Admin Radio */}
              <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  className="w-5 h-5 text-blue-600 mt-0.5 shrink-0"
                />
                <div className="flex-1">
                  <span className="font-medium text-gray-900 block">Admin</span>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Kullanıcıları ve tüm ürünleri yönetebilir. Tam erişim.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Aktif/Pasif Toggle */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <input
              type="checkbox"
              name="is_active"
              id="is_active"
              defaultChecked
              className="w-5 h-5 text-blue-600 rounded mt-0.5 shrink-0"
            />
            <div className="flex-1">
              <label htmlFor="is_active" className="font-medium text-gray-900 block cursor-pointer">
                Hesap Aktif
              </label>
              <p className="text-sm text-gray-600 mt-0.5">
                Pasif hesaplar sisteme giriş yapamaz
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Buttons */}
      <SubmitButton />
    </form>
  )
}