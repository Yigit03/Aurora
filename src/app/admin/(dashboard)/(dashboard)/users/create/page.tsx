// Yeni kullanıcı oluşturma sayfası - Temaya uygun tasarım
import CreateUserForm from './CreateUserForm'
import Link from 'next/link'

export default function CreateUserPage() {
  return (
    <div className="max-w-3xl">
      {/* Breadcrumb / Geri Butonu */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/users"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Kullanıcılar</span>
        </Link>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-sm text-gray-500">Yeni Kullanıcı</span>
      </div>

      {/* Başlık */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Yeni Kullanıcı Oluştur</h1>
        <p className="text-gray-600 text-sm mt-1">
          Personel ekibi için yeni yetkili hesapları tanımlayın.
        </p>
      </div>

      {/* Form */}
      <CreateUserForm />
    </div>
  )
}