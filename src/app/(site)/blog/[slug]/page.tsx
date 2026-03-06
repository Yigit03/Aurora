// app/(site)/blog/[slug]/page.tsx

import { notFound } from "next/navigation"
import { supabase } from '@/lib/supabase'
import BlogDetails from "../BlogDetails"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const { data: post } = await supabase
    .from('blogs')
    .select('title')
    .eq('slug', slug)
    .single()

  if (!post) return {}
  return {
    title: `${post.title} | Aurora Dil Eğitim Merkezi`,
  }
}

export default async function BlogSlugPage({ params }: PageProps) {
  const { slug } = await params

  const { data: post } = await supabase
    .from('blogs')
    .select('*, users(fullname)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!post) notFound()

  return <BlogDetails post={post} />
}