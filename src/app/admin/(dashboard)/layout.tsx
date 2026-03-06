// app/admin/dashboard/layout.tsx
import { JwtPayload } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { verifyAccesToken } from '@/lib/jwt';
import { redirect } from 'next/navigation';
import { logout } from '@/app/admin/(login)/actions';
import AdminHeader from '@/components/layouts/AdminHeader';
import AdminSidebar from '@/components/layouts/AdminSidebar';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  console.log('TOKEN:', token)
  if (!token) redirect('/admin')

  const currentUser = await verifyAccesToken(token) as JwtPayload
  console.log('USER:', currentUser)
  if (!currentUser) redirect('/admin')

  return (
    <div className="min-h-screen flex flex-col">

      {/* Header - tam genişlik, en üstte */}
      <AdminHeader currentUser={currentUser} logoutAction={logout} />

      {/* Sidebar + Content */}
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 bg-slate-600 p-8 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  )
}