// app/admin/(dashboard)/blogs/edit/[id]/page.tsx

import { getBlogById } from '../../actions'
import EditBlogForm from './EditBlogForm'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const blog = await getBlogById(id)

  if (!blog) notFound()

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/blogs"
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Düzenle</h1>
          <p className="text-slate-400 text-sm mt-1">{blog.title}</p>
        </div>
      </div>

      <EditBlogForm id={blog.id} initialData={{
        title: blog.title,
        content: blog.content,
        img: blog.img,
        is_published: blog.is_published,
      }} />
    </div>
  )
}