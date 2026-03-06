// Ürün düzenleme sayfası
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import EditProductForm from './EditProductForm'

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditProductPage(props: Props) {
  const params = await props.params
  const productId = params.id

  // Token kontrolü
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) {
    redirect('/admin/login')
  }

  const currentUser = await verifyToken(token)

  if (!currentUser) {
    redirect('/admin/login')
  }

  // Ürünü getir
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      id,
      user_id,
      title,
      description,
      price,
      image_url,
      category_id,
      categories (id, name)
    `)
    .eq('id', productId)
    .single()

  if (error || !product) {
    notFound()
  }

  // Yetki kontrolü
  if (
    product.user_id !== currentUser.userId &&
    currentUser.role !== 'admin' &&
    currentUser.role !== 'super_admin'
  ) {
    redirect('/admin/products')
  }

  // Kategorileri getir
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name')

  return (
    <div className="max-w-3xl space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Ürünler</span>
        </Link>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-sm text-gray-500">Düzenle</span>
      </div>

      {/* Başlık */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ürün Düzenle</h1>
        <p className="text-gray-600 text-sm mt-1">
          Ürün bilgilerini güncelleyin
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <EditProductForm product={product || {}} categories={categories || []} />
      </div>
    </div>
  )
}