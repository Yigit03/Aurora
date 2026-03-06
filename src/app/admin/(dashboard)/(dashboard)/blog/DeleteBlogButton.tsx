// app/admin/(dashboard)/blogs/DeleteBlogButton.tsx

'use client'

import { useState } from 'react'
import { deleteBlog } from './actions'

export default function DeleteBlogButton({ blogId, blogTitle }: { blogId: string; blogTitle: string }) {
  const [confirm, setConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    await deleteBlog(blogId)
    setLoading(false)
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Siliniyor...' : 'Evet'}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
        >
          Hayır
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
    >
      Sil
    </button>
  )
}