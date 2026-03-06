import Link from "next/link"
import Image from "next/image"
import { Calendar, User, Clock, ArrowLeft } from "lucide-react"
import { BlogPost } from "@/lib/blogData"
import { supabase } from "@/lib/supabase"
import BlogCard from "./BlogCard"
import CTASection from "@/components/layouts/Cta"
import PageTitle from "@/components/layouts/PageTitle"

interface BlogDetailsProps {
  post: BlogPost
}

export default async function BlogDetails({ post }: BlogDetailsProps) {
  const { data: relatedData } = await supabase
    .from('blogs')
    .select('id, slug, title, img, content, is_published, created_at, users(fullname)')
    .eq('is_published', true)
    .neq('slug', post.slug)
    .order('created_at', { ascending: false })
    .limit(3)

  const related = (relatedData ?? []) as unknown as BlogPost[]

  return (
    <main className="min-h-screen bg-white w-full">

      {/* PageTitle */}
      <PageTitle title={post.title} text="" />

      {/* Geri + Meta */}
      <div className="max-w-3xl mx-auto px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 transition-colors group w-fit"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform duration-200" />
          Blog`a Dön
        </Link>

        <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500 font-medium">
          <span className="flex items-center gap-2">
            <User size={14} className="text-red-400" />
            {post.users?.fullname ?? 'Aurora Dil Merkezi'}
          </span>
          <span className="flex items-center gap-2">
            <Calendar size={14} className="text-red-400" />
            {new Date(post.created_at).toLocaleDateString('tr-TR', {
              day: 'numeric', month: 'long', year: 'numeric'
            })}
          </span>
          <span className="flex items-center gap-2">
            <Clock size={14} className="text-red-400" />
            {Math.ceil(post.content.replace(/<[^>]+>/g, '').split(' ').length / 200)} dk okuma
          </span>
        </div>
      </div>

      {/* Cover Image */}
      <div className="max-w-3xl mx-auto px-6 mb-12">
        <div className="relative h-72 lg:h-96 rounded-2xl overflow-hidden shadow-xl">
          <Image
            src={post.img}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 mb-20">
        <div
          className="prose prose-lg prose-gray max-w-none
            prose-headings:font-black prose-headings:text-gray-900
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-p:text-gray-600 prose-p:leading-relaxed
            prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-800"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <div className="h-px bg-gray-100 my-12" />
      </article>

      {/* İlgili Yazılar */}
      {related.length > 0 && (
        <section className="bg-gray-50 py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="mb-10">
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-red-500 bg-red-50 px-4 py-1.5 rounded-full mb-3">
                İlgili Yazılar
              </span>
              <h2 className="text-3xl font-black text-gray-900">Bunları da Okuyun</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection
        textTitle="Sorularınız mı Var?"
        text="Kafanıza takılan her türlü soru için lütfen iletişime geçin!"
        buttonTitle="İletişime geçin."
        buttonVariant="cta"
        route="/contact"
      />
    </main>
  )
}