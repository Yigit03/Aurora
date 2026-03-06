// app/admin/(dashboard)/blogs/page.tsx

import { cookies } from 'next/headers'
import { verifyAccesToken } from '@/lib/jwt'
import Link from 'next/link'
import DeleteBlogButton from './DeleteBlogButton'
import { getBlogs, Blog } from './actions'
import Image from 'next/image'

export default async function BlogsPage() {
  const blogs = await getBlogs()

  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  const currentUser = token ? await verifyAccesToken(token) : null

  return (
    <div className="space-y-6">

      {/* Başlık */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Bloglar</h1>
          <p className="text-slate-400 text-sm mt-1">Tüm blog yazılarını yönetin</p>
        </div>
        <Link
          href="/admin/blog/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Blog
        </Link>
      </div>

      {/* Blog Tablosu */}
      <div className="bg-slate-800 rounded-xl border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-semibold text-white">Tüm Bloglar</h2>
          <span className="text-xs text-slate-400">{blogs.length} yazı</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                {['Kapak', 'Başlık', 'Yazar', 'Durum', 'Tarih', 'İşlemler'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {blogs.map((blog: Blog) => (
                <tr key={blog.id} className="hover:bg-white/5 transition-colors">

                  {/* Kapak */}
                  <td className="px-6 py-4">
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-slate-700 shrink-0">
                    {blog.img ? (
                      <Image src={blog.img} alt={blog.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  </td>

                  {/* Başlık */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-white">{blog.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{blog.slug}</p>
                  </td>

                  {/* Yazar */}
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {blog.users?.fullname ?? '—'}
                  </td>

                  {/* Durum */}
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      blog.is_published
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {blog.is_published ? 'Yayında' : 'Taslak'}
                    </span>
                  </td>

                  {/* Tarih */}
                  <td className="px-6 py-4 text-sm text-slate-400 whitespace-nowrap">
                    {new Date(blog.created_at).toLocaleDateString('tr-TR', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </td>

                  {/* İşlemler */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/blog/edit/${blog.id}`}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                      >
                        Düzenle
                      </Link>

                      
                    {currentUser?.role !== 'editor' && (
                      <DeleteBlogButton blogId={blog.id} blogTitle={blog.title} />
                    )}
                    
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {blogs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500 text-sm">Henüz blog yazısı bulunmuyor</p>
              <Link href="/admin/blog/create" className="inline-block mt-4 text-blue-400 hover:text-blue-300 font-medium text-sm">
                İlk blogu oluştur →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}