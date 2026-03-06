"use client"

import { Search } from "lucide-react"
import { CATEGORIES } from "@/lib/blogData"

interface BlogFilterProps {
  search: string
  activeCategory: string
  onSearchChange: (value: string) => void
  onCategoryChange: (category: string) => void
}

export default function BlogFilter({
  search,
  activeCategory,
  onSearchChange,
  onCategoryChange,
}: BlogFilterProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Arama */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Ara..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Kategoriler */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}