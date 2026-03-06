'use client'

import { useState } from 'react'
import { createUserDirect } from './actions'
import Link from 'next/link'

export default function CreateUserPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    password: '',
    role: 'editor' as 'admin' | 'editor',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await createUserDirect(form)

    if (result?.success === false) {
      setError(result.message)
    }

    setLoading(false)
  }

  return (
    <div className="max-w-xl space-y-6">

      {/* Başlık */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/users"
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Yeni Kullanıcı</h1>
          <p className="text-slate-400 text-sm mt-1">Yeni bir kullanıcı oluşturun</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl border border-white/10 p-6 space-y-5">

        {/* Ad Soyad */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Ad Soyad <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
            required
            placeholder="Ad Soyad"
            className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="ornek@email.com"
            className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* Şifre */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Şifre <span className="text-red-400">*</span>
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
            minLength={8}
            className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          <p className="text-xs text-slate-500">En az 8 karakter</p>
        </div>

        {/* Rol */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Rol <span className="text-red-400">*</span>
          </label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            className="w-full h-11 px-4 rounded-xl bg-slate-700 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
          >
            <option value="editor">Editör</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Hata */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Butonlar */}
        <div className="flex gap-3 pt-2">
          <Link
            href="/admin/users"
            className="flex-1 h-11 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium flex items-center justify-center"
          >
            İptal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-blue-600/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Oluşturuluyor...' : 'Kullanıcı Oluştur'}
          </button>
        </div>

      </form>
    </div>
  )
}