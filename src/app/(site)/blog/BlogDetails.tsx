import Link from "next/link";
import Image from "next/image";
import { Calendar, User, Clock, ArrowLeft, Tag, Cat } from "lucide-react";
import { BlogPost, BLOG_POSTS } from "@/lib/blogData"
import BlogCard from "./BlogCard";
import CTASection from "@/components/layouts/Cta";

interface BlogDetailsProps {
  post: BlogPost;
}

export default function BlogDetails({ post }: BlogDetailsProps) {
  const related = BLOG_POSTS.filter(
    (p) => p.slug !== post.slug && p.category === post.category
  ).slice(0, 3);

  return (
    <main className="min-h-screen bg-white w-full">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-slate-100 pt-24 pb-16 w-full">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-red-100/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-0 w-96 h-96 rounded-full bg-slate-200/40 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-6">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 mb-8 transition-colors group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform duration-200" />
            Blog`a Dön
          </Link>

          {/* Category */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wide bg-red-600 text-white px-3 py-1 rounded-full">
              <Tag size={10} />
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500 font-medium">
            <span className="flex items-center gap-2">
              <User size={14} className="text-red-400" />
              {post.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={14} className="text-red-400" />
              {post.date}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={14} className="text-red-400" />
              {post.readingTime} dk okuma
            </span>
          </div>
        </div>
      </section>

      {/* ── Cover Image ── */}
      <div className="max-w-3xl mx-auto px-6 -mt-2 mb-12">
        <div className="relative h-72 lg:h-96 rounded-2xl overflow-hidden shadow-xl">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* ── Content ── */}
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

        {/* Divider */}
        <div className="h-px bg-gray-100 my-12" />

        {/* Tags */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Kategori</span>
          <span className="inline-block text-xs font-bold bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-100">
            {post.category}
          </span>
        </div>
      </article>

      {/* ── Related Posts ── */}
      {related.length > 0 && (
        <section className="bg-gray-50 py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="mb-10">
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-red-500 bg-red-50 px-4 py-1.5 rounded-full mb-3">
                İlgili Yazılar
              </span>
              <h2 className="text-3xl font-black text-gray-900">
                Bunları da Okuyun
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <CTASection textTitle="Sorularınız mı Var?" text="Kafanıza takılan her türlü soru için lütfen iletişime geçin!" buttonTitle="İletişime geçin." buttonVariant="cta" route="/contact" />
    </main>
  );
}