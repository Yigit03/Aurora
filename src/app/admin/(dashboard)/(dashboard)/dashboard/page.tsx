import { cookies } from 'next/headers'
import { verifyAccesToken } from '@/lib/jwt'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'

interface Log {
  id: string
  action_type: string
  content: string
  created_at: string
  users: { fullname: string; email: string } | null
}

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value

  if (!token) redirect('/admin')

  const currentUser = await verifyAccesToken(token!)
  if (!currentUser) redirect('/admin')

  // Paralel veri çekimi
  const [
    { count: blogCount },
    { count: courseCount },
    { count: userCount },
    { data: logs },
  ] = await Promise.all([
    supabaseAdmin.from('blogs').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('courses').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
    supabaseAdmin
      .from('logs')
      .select('*, users(fullname, email)')
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const stats = [
    {
      label: 'Toplam Blog',
      value: blogCount ?? 0,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      ),
      color: 'blue',
    },
    {
      label: 'Toplam Kurs',
      value: courseCount ?? 0,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      ),
      color: 'purple',
    },
    {
      label: 'Toplam Kullanıcı',
      value: userCount ?? 0,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      ),
      color: 'green',
    },
  ]

  const shortcuts = [
    {
      label: 'Yeni Blog',
      description: 'Blog yazısı oluştur',
      href: '/admin/blog/create',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      ),
      color: 'blue',
    },
    {
      label: 'Yeni Kurs',
      description: 'Kurs ekle',
      href: '/admin/courses/create',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      ),
      color: 'purple',
    },
    {
      label: 'Yeni Kullanıcı',
      description: 'Kullanıcı oluştur',
      href: '/admin/users/create',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      ),
      color: 'green',
    },
    {
      label: 'Bloglar',
      description: 'Tüm blogları yönet',
      href: '/admin/blog',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      ),
      color: 'blue',
    },
    {
      label: 'Kurslar',
      description: 'Tüm kursları yönet',
      href: '/admin/courses',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      ),
      color: 'purple',
    },
    {
      label: 'Kullanıcılar',
      description: 'Tüm kullanıcıları yönet',
      href: '/admin/users',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      ),
      color: 'green',
    },
  ]

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/20 text-purple-400',
    green: 'bg-green-500/20 text-green-400',
  }

  const actionTypeLabel: Record<string, string> = {
    login: '🔐 Giriş',
    logout: '🚪 Çıkış',
    blog_created: '📝 Blog Oluşturuldu',
    blog_updated: '✏️ Blog Güncellendi',
    blog_deleted: '🗑️ Blog Silindi',
    course_created: '📚 Kurs Oluşturuldu',
    course_updated: '✏️ Kurs Güncellendi',
    course_deleted: '🗑️ Kurs Silindi',
    user_created: '👤 Kullanıcı Oluşturuldu',
    user_deleted: '👤 Kullanıcı Silindi',
  }

  return (
    <div className="space-y-8">

      {/* Hoşgeldin */}
      <div>
        <h1 className="text-2xl font-bold text-white">Hoş geldin, {currentUser.fullname} 👋</h1>
        <p className="text-slate-400 text-sm mt-1">
          {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' })}
        </p>
      </div>

      {/* BÖLÜM 1 - İstatistikler */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Genel İstatistikler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-slate-800 rounded-xl border border-white/10 p-6 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${colorMap[stat.color]}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {stat.icon}
                </svg>
              </div>
              <div>
                <p className="text-slate-400 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BÖLÜM 2 - Kısayollar */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Hızlı Erişim</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {shortcuts.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-slate-800 border border-white/10 rounded-xl p-5 flex items-center gap-4 hover:bg-slate-700 hover:border-white/20 transition-all duration-200 group"
            >
              <div className={`p-2.5 rounded-lg ${colorMap[item.color]} shrink-0`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {item.icon}
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">{item.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* BÖLÜM 3 - Son Loglar */}
      {/* BÖLÜM 3 - Son Loglar */}
<div>
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Son İşlemler</h2>
    <Link href="/admin/logs" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
      Tümünü gör →
    </Link>
  </div>

  <div className="bg-slate-800 rounded-xl border border-white/10 overflow-hidden">
    {logs && logs.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              {['Kullanıcı', 'İşlem', 'Detay', 'Tarih'].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {logs.map((log: Log) => {
              const actionTypeLabel: Record<string, { label: string; color: string }> = {
                login:          { label: 'Giriş',                 color: 'bg-green-500/20 text-green-400' },
                logout:         { label: 'Çıkış',                 color: 'bg-slate-500/20 text-slate-400' },
                blog_created:   { label: 'Blog Oluşturuldu',      color: 'bg-blue-500/20 text-blue-400' },
                blog_updated:   { label: 'Blog Güncellendi',      color: 'bg-yellow-500/20 text-yellow-400' },
                blog_deleted:   { label: 'Blog Silindi',          color: 'bg-red-500/20 text-red-400' },
                course_created: { label: 'Kurs Oluşturuldu',      color: 'bg-purple-500/20 text-purple-400' },
                course_updated: { label: 'Kurs Güncellendi',      color: 'bg-yellow-500/20 text-yellow-400' },
                course_deleted: { label: 'Kurs Silindi',          color: 'bg-red-500/20 text-red-400' },
                user_created:   { label: 'Kullanıcı Oluşturuldu', color: 'bg-blue-500/20 text-blue-400' },
                user_updated:   { label: 'Kullanıcı Güncellendi', color: 'bg-yellow-500/20 text-yellow-400' },
                user_deleted:   { label: 'Kullanıcı Silindi',     color: 'bg-red-500/20 text-red-400' },
              }
              const action = actionTypeLabel[log.action_type] ?? {
                label: log.action_type,
                color: 'bg-slate-500/20 text-slate-400',
              }
              return (
                <tr key={log.id} className="hover:bg-white/5 transition-colors">

                  {/* Kullanıcı */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400 text-sm font-bold shrink-0">
                        {log.users?.fullname?.charAt(0).toUpperCase() ?? '?'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {log.users?.fullname ?? 'Bilinmiyor'}
                        </p>
                        <p className="text-xs text-slate-500">
                         {log.users?.email ?? ''}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* İşlem */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${action.color}`}>
                      {action.label}
                    </span>
                  </td>

                  {/* Detay */}
                  <td className="px-6 py-4 text-sm text-slate-400 max-w-xs truncate">
                    {log.content ?? '—'}
                  </td>

                  {/* Tarih */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {new Date(log.created_at).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>

                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="text-center py-12">
        <p className="text-slate-500 text-sm">Henüz işlem kaydı bulunmuyor</p>
      </div>
    )}
  </div>
</div>

    </div>
  )
}