// Ürün kartı component'i
import Image from 'next/image'
import Link from 'next/link'
import DeleteProductButton from './DeleteProductButton' // YENİ

type Props = {
  product: {
    id: string
    title: string
    description: string | null
    price: number
    image_url: string
    is_published: boolean
  }
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all">
      <div className="flex items-center gap-4 p-4">
        
        {/* Sol: Resim */}
        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Orta: Bilgiler */}
        <div className="flex-1 min-w-0">
          {/* Başlık ve Durum */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {product.title}
            </h3>
            {product.is_published ? (
              <span className="flex-shrink-0 bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                Yayında
              </span>
            ) : (
              <span className="flex-shrink-0 bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                Taslak
              </span>
            )}
          </div>

          {/* Açıklama */}
          {product.description && (
            <p className="text-sm text-gray-500 mb-2 line-clamp-1">
              {product.description}
            </p>
          )}

          {/* Alt: Fiyat ve Butonlar */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              ₺{product.price.toFixed(2)}
            </span>

            {/* İşlem Butonları */}
            <div className="flex items-center gap-2">
              {/* Düzenle */}
              <Link 
                href={`/admin/products/edit/${product.id}`}
                className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                title="Düzenle"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Link>
              
              {/* Sil - YENİ */}
              <DeleteProductButton 
                productId={product.id} 
                productTitle={product.title} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}