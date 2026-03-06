// app/blog/[slug]/page.tsx

import { notFound } from "next/navigation";
import { BLOG_POSTS } from "@/lib/blogData";
import BlogDetails from "../BlogDetails";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Tüm slug'ları statik olarak üret
export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

// Her yazı için SEO metadata
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} | Aurora Dil Eğitim Merkezi`,
    description: post.excerpt,
  };
}

export default async function BlogSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) notFound();

  return <BlogDetails post={post} />;
}