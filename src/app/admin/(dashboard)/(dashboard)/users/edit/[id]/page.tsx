// Kullanıcı düzenleme sayfası
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import EditUserForm from './EditUserForm'

type Props = {
  params: Promise<{ id: string }> // Next.js 15+: params artık Promise
}

export default async function EditUserPage(props: Props) {
  // await ile params'ı aç
  const params = await props.params
  const userId = params.id
  
  // Kullanıcıyı getir
  const { data: user, error } = await supabase
    .from('users')
    .select('id, full_name, email, role, is_active')
    .eq('id', userId)
    .single()

  // Kullanıcı bulunamadı → 404
  if (error || !user) {
    notFound()
  }

  // Süper admin düzenlenemez → 404
  if (user.role === 'super_admin') {
    notFound()
  }

  return (
    <div className="max-w-2xl">
      {/* Başlık ve Geri Butonu */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/users"
          className="text-gray-600 hover:text-gray-900"
        >
          ← Geri
        </Link>
        <h1 className="text-2xl font-bold">Kullanıcı Düzenle</h1>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <EditUserForm user={user} />
      </div>
    </div>
  )
}