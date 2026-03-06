import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowRight } from "lucide-react";
import { BlogPost } from "@/lib/blogData";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
        {/* Cover image */}
        <div className={`relative overflow-hidden ${featured ? "h-64" : "h-48"} bg-gray-100`}>
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <span className="inline-block text-xs font-bold tracking-wide bg-red-600 text-white px-3 py-1 rounded-full shadow-sm">
              {post.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6">
          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-gray-400 font-medium mb-3">
            <span className="flex items-center gap-1.5">
              <Calendar size={12} />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <User size={12} />
              {post.author}
            </span>
          </div>

          {/* Title */}
          <h3 className={`font-black text-gray-900 leading-snug mb-3 group-hover:text-red-600 transition-colors duration-200 ${featured ? "text-xl" : "text-base"}`}>
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-5 flex-1">
            {post.excerpt}
          </p>

          {/* CTA */}
          <div className="flex items-center gap-1.5 text-sm font-bold text-red-600 mt-auto group-hover:gap-2.5 transition-all duration-200">
            Devamını Oku
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </div>
      </article>
    </Link>
  );
}