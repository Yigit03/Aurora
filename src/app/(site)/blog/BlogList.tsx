"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import BlogCard from "./BlogCard";
import { BLOG_POSTS } from "@/lib/blogData";
import BlogFilter from "./BlogFilter";

export default function BlogList() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tümü");

  const filtered = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory =
        activeCategory === "Tümü" || post.category === activeCategory;
      const matchesSearch =
        search.trim() === "" ||
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  return (
    <div className="flex flex-col gap-8">
      {/* ── Filters ── */}
      <BlogFilter
        search={search}
        activeCategory={activeCategory}
        onSearchChange={setSearch}
        onCategoryChange={setActiveCategory}
      />

      {/* ── Grid ── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post, i) => (
            <BlogCard key={post.slug} post={post} featured={i === 0 && activeCategory === "Tümü" && search === ""} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <Search size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-700 font-bold mb-1">Sonuç bulunamadı</p>
          <p className="text-sm text-gray-400">Farklı bir arama veya kategori deneyin.</p>
          <button
            onClick={() => { setSearch(""); setActiveCategory("Tümü"); }}
            className="mt-5 text-sm font-bold text-red-600 hover:text-red-700 underline underline-offset-4 transition-colors"
          >
            Filtreleri temizle
          </button>
        </div>
      )}
    </div>
  );
}