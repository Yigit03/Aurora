import { cookies } from 'next/headers'
import { verifyAccesToken } from '@/lib/jwt'
import { redirect } from 'next/navigation'
import ChangePasswordForm from './ChangePasswordForm'

export default async function SettingsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value

  if (!token) redirect('/admin')

  const currentUser = await verifyAccesToken(token!)

  if (!currentUser) redirect('/admin')

  return (
    <div className="max-w-3xl space-y-6">

      {/* Başlık */}
      <div>
        <h1 className="text-2xl font-bold text-white">Ayarlar</h1>
        <p className="text-slate-400 text-sm mt-1">
          Hesap bilgilerinizi ve güvenlik ayarlarınızı yönetin
        </p>
      </div>

      {/* Hesap Bilgileri */}
      <div className="bg-slate-800 rounded-xl border border-white/10 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Hesap Bilgileri</h2>

        <div className="space-y-1">
          {/* Email */}
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <div>
              <p className="text-sm font-medium text-slate-300">Email Adresi</p>
              <p className="text-sm text-slate-400 mt-0.5">{currentUser.email}</p>
            </div>
            <span className="text-xs bg-white/5 text-slate-400 px-2.5 py-1 rounded-full border border-white/10">
              Değiştirilemez
            </span>
          </div>

          {/* Rol */}
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-slate-300">Yetki Düzeyi</p>
              <p className="text-sm text-slate-400 mt-0.5">
                {currentUser.role === 'superadmin' ? 'Süper Admin' :
                 currentUser.role === 'admin' ? 'Admin' : 'Editör'}
              </p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
              currentUser.role === 'superadmin' ? 'bg-purple-500/20 text-purple-400' :
              currentUser.role === 'admin' ? 'bg-blue-500/20 text-blue-400' :
              'bg-green-500/20 text-green-400'
            }`}>
              {currentUser.role === 'superadmin' ? '🔐 Tam Yetki' :
               currentUser.role === 'admin' ? '⚡ Yönetici' : '✏️ Editör'}
            </span>
          </div>
        </div>
      </div>

      {/* Şifre Değiştirme */}
      <div className="bg-slate-800 rounded-xl border border-white/10 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">Şifre Değiştir</h2>
          <p className="text-sm text-slate-400 mt-1">
            Güvenliğiniz için güçlü bir şifre kullanın
          </p>
        </div>
        <ChangePasswordForm userId={currentUser.sub} />
      </div>

      {/* Güvenlik İpuçları */}
      <div className="bg-blue-600/10 rounded-xl border border-blue-500/20 p-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-semibold text-blue-400 mb-2">Güçlü Şifre İpuçları</h3>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• En az 8 karakter kullanın</li>
              <li>• Büyük ve küçük harf karışımı ekleyin</li>
              <li>• Rakam ve özel karakter kullanın (!@#$%)</li>
              <li>• Kolay tahmin edilebilir şifrelerden kaçının</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  )
}