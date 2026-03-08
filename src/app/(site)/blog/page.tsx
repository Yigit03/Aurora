// app/(site)/blog/page.tsx

import { supabase } from '@/lib/supabase'
import PageTitle from '@/components/layouts/PageTitle'
import BlogList from './BlogList'
import { BlogPost } from '@/lib/blogData'

export const metadata = {
  title: "Blog | Aurora Dil Eğitim Merkezi",
  description: "Tercüme ve dil öğrenimi hakkında güncel yazılar"
}

export const revalidate = 60;

export default async function BlogPage() {
  // Veri çekme işlemin...
  const { data } = await supabase
    .from('blogs')
    .select('id, slug, title, img, content, is_published, created_at, users(fullname)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  const posts = (data ?? []) as unknown as BlogPost[]

  return (
    <div>
      <PageTitle title="Blog" text="Tercüme ve dil öğrenimi hakkında güncel yazılar" />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <BlogList posts={posts} />
      </div>
    </div>
  )
}