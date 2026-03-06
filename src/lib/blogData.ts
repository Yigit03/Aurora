// lib/blogData.ts

export interface BlogPost {
  id: string
  slug: string
  title: string
  content: string
  img: string
  is_published: boolean
  created_at: string
  users: { fullname: string } | null
}

export const CATEGORIES = [
  "Tümü",
  "Yazılı Tercüme",
  "Sözlü Tercüme",
  "Yeminli Tercüme",
  "Akademik Çeviri",
  "Dil Öğrenimi",
]