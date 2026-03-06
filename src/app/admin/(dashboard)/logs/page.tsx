// app/admin/(dashboard)/logs/page.tsx

import { supabaseAdmin } from '@/lib/supabase'

interface Log {
  id: string
  action_type: string
  content: string
  created_at: string
  users: { fullname: string; email: string } | null
}

const actionTypeLabel: Record<string, { label: string; color: string }> = {
  login:          { label: 'Giriş',             color: 'bg-green-500/20 text-green-400' },
  logout:         { label: 'Çıkış',             color: 'bg-slate-500/20 text-slate-400' },
  blog_created:   { label: 'Blog Oluşturuldu',  color: 'bg-blue-500/20 text-blue-400' },
  blog_updated:   { label: 'Blog Güncellendi',  color: 'bg-yellow-500/20 text-yellow-400' },
  blog_deleted:   { label: 'Blog Silindi',      color: 'bg-red-500/20 text-red-400' },
  course_created: { label: 'Kurs Oluşturuldu',  color: 'bg-purple-500/20 text-purple-400' },
  course_updated: { label: 'Kurs Güncellendi',  color: 'bg-yellow-500/20 text-yellow-400' },
  course_deleted: { label: 'Kurs Silindi',      color: 'bg-red-500/20 text-red-400' },
  user_created:   { label: 'Kullanıcı Oluşturuldu', color: 'bg-blue-500/20 text-blue-400' },
  user_updated:   { label: 'Kullanıcı Güncellendi', color: 'bg-yellow-500/20 text-yellow-400' },
  user_deleted:   { label: 'Kullanıcı Silindi', color: 'bg-red-500/20 text-red-400' },
}

export default async function LogsPage() {
  const { data: logs } = await supabaseAdmin
    .from('logs')
    .select('*, users(fullname, email)')
    .order('created_at', { ascending: false })
    .limit(100)

  const totalLogs = logs?.length ?? 0
  const loginCount = logs?.filter(l => l.action_type === 'login').length ?? 0
  const deleteCount = logs?.filter(l => l.action_type.includes('deleted')).length ?? 0
  const createCount = logs?.filter(l => l.action_type.includes('created')).length ?? 0

  return (
    <div className="space-y-6">

      {/* Başlık */}
      <div>
        <h1 className="text-2xl font-bold text-white">İşlem Logları</h1>
        <p className="text-slate-400 text-sm mt-1">Sistemdeki tüm işlem kayıtları</p>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Toplam İşlem', value: totalLogs, color: 'blue' },
          { label: 'Giriş',        value: loginCount, color: 'green' },
          { label: 'Oluşturma',    value: createCount, color: 'purple' },
          { label: 'Silme',        value: deleteCount, color: 'red' },
        ].map((stat) => {
          const colorMap: Record<string, string> = {
            blue:   'bg-blue-500/20 text-blue-400',
            green:  'bg-green-500/20 text-green-400',
            purple: 'bg-purple-500/20 text-purple-400',
            red:    'bg-red-500/20 text-red-400',
          }
          return (
            <div key={stat.label} className="bg-slate-800 rounded-xl border border-white/10 p-5">
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Log Tablosu */}
      <div className="bg-slate-800 rounded-xl border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="font-semibold text-white">Tüm Kayıtlar</h2>
        </div>

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
              {logs?.map((log: Log) => {
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

          {(!logs || logs.length === 0) && (
            <div className="text-center py-12">
              <p className="text-slate-500 text-sm">Henüz işlem kaydı bulunmuyor</p>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}