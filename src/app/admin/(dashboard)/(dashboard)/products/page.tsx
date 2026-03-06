import { supabase } from '@/lib/supabase'
import CreateProductForm from './create/CreateProductForm'
import ProductCard from './ProductCard'
import CategoryManagement from './CategoryManagement'

export default async function ProductsPage() {
  // Kategorileri getir
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name')

  // Ürünleri kategoriye göre getir
  const { data: products } = await supabase
    .from('products')
    .select(`
      id,
      title,
      description,
      price,
      image_url,
      is_published,
      created_at,
      categories (id, name)
    `)
    .order('created_at', { ascending: false })

  // Kategoriye göre grupla
  const productsByCategory: Record<string, any[]> = {}
  
  categories?.forEach(cat => {
    productsByCategory[cat.id] = products?.filter(
      p => p.categories?.id === cat.id
    ) || []
  })

  // Toplam istatistikler
  const totalProducts = products?.length || 0
  const publishedProducts = products?.filter(p => p.is_published).length || 0

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ürün Yönetimi</h1>
        <p className="text-gray-600 text-sm mt-1">
          Menünüze yeni ürünler ekleyin ve mevcut ürünleri yönetin
        </p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Toplam Ürün */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Toplam Ürün</p>
              <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Yayında */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Yayında</p>
              <p className="text-3xl font-bold text-gray-900">{publishedProducts}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Kategoriler */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Kategoriler</p>
              <p className="text-3xl font-bold text-gray-900">{categories?.length || 0}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
          {/* Kategori Yönetimi - YENİ (2 bölümlü) */}
      <CategoryManagement categories={categories || []} />

      {/* Ürün Ekleme Formu - Küçültülmüş */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Yeni Ürün Ekle</h2>
          <p className="text-sm text-gray-600 mt-1">
            Ürün bilgilerini girin ve fotoğraf yükleyin
          </p>
        </div>
        <CreateProductForm categories={categories || []} />
      </div>

    {/* Ürün Listesi - Kategoriye Göre */}
      <div className="space-y-6">
        {categories?.map(category => {
          const categoryProducts = productsByCategory[category.id]
          
          if (!categoryProducts || categoryProducts.length === 0) {
            return null
          }

          return (
            <div key={category.id}>
              {/* Kategori Başlığı */}
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-bold text-gray-900">{category.name}</h2>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                  {categoryProducts.length} ürün
                </span>
              </div>

              {/* Ürün Listesi - Yatay Kartlar (Tek Sütun) */}
              <div className="space-y-3">
                {categoryProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )
        })}

        {/* Hiç ürün yoksa */}
        {totalProducts === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-gray-500 mb-2">Henüz ürün bulunmuyor</p>
            <p className="text-sm text-gray-400">Yukarıdaki formu kullanarak ilk ürününüzü ekleyin</p>
          </div>
        )}
      </div>
    </div>
  )
}