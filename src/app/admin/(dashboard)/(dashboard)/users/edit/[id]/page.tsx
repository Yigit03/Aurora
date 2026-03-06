// app/admin/(dashboard)/users/edit/[id]/page.tsx

import { getUserById } from './actions'
import EditUserForm from './EditUserForm'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getUserById(id)

  if (!user) notFound()

  return (
    <div className="max-w-xl space-y-6">

      {/* Başlık */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/users"
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Kullanıcı Düzenle</h1>
          <p className="text-slate-400 text-sm mt-1">{user.fullname}</p>
        </div>
      </div>

      <EditUserForm id={user.id} initialData={{
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      }} />

    </div>
  )
}