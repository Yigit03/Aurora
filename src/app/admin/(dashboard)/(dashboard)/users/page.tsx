import { cookies } from 'next/headers'
import { verifyAccesToken } from '@/lib/jwt'
import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase'
import DeleteUserButton from './DeleteUserButton'

export default async function UsersPage() {
  const { data: users } = await supabaseAdmin
    .from('users')
    .select('id, fullname, email, role, created_at')
    .order('created_at', { ascending: false })

  const totalUsers = users?.length || 0
  const superAdminCount = users?.filter(u => u.role === 'superadmin').length || 0
  const adminCount = users?.filter(u => u.role === 'admin').length || 0
  const editorCount = users?.filter(u => u.role === 'editor').length || 0

  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  const currentUser = token ? await verifyAccesToken(token) : null
  
  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Kullanıcılar</h1>
          <p className="text-slate-400 text-sm mt-1">Tüm kullanıcıları görüntüleyin ve yönetin</p>
        </div>
        <Link
          href="/admin/users/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Kullanıcı
        </Link>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Toplam', value: totalUsers, color: 'blue' },
          { label: 'Süper Admin', value: superAdminCount, color: 'purple' },
          { label: 'Admin', value: adminCount, color: 'indigo' },
          { label: 'Editör', value: editorCount, color: 'green' },
        ].map((stat) => (
          <div key={stat.label} className="bg-slate-800 rounded-xl border border-white/10 p-6">
            <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Kullanıcı Tablosu */}
      <div className="bg-slate-800 rounded-xl border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="font-semibold text-white">Tüm Kullanıcılar</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                {['Ad Soyad', 'Email', 'Rol', 'Kayıt Tarihi', 'İşlemler'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users?.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {user.fullname.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-white">{user.fullname}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {user.email}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'superadmin' ? 'bg-purple-500/20 text-purple-400' :
                      user.role === 'admin' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {user.role === 'superadmin' ? 'Süper Admin' :
                       user.role === 'admin' ? 'Admin' : 'Editör'}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {new Date(user.created_at).toLocaleDateString('tr-TR')}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user.role === 'superadmin' ? (
                      <span className="text-slate-500 text-xs">🔒 Korumalı</span>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/users/edit/${user.id}`}
                          className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                          Düzenle
                        </Link>
                        {currentUser?.role !== 'editor' && (
                          <DeleteUserButton userId={user.id} userName={user.fullname} />
                        )}                  
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {(!users || users.length === 0) && (
            <div className="text-center py-12">
              <p className="text-slate-500">Henüz kullanıcı bulunmuyor</p>
              <Link href="/admin/users/create" className="inline-block mt-4 text-blue-400 hover:text-blue-300 font-medium">
                İlk kullanıcıyı oluştur →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}