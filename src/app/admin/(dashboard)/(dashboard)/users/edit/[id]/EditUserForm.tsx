'use client'

import { useState } from 'react'
import { updateUser, deleteUser } from './actions'
import Link from 'next/link'

interface EditUserFormProps {
  id: string
  initialData: {
    fullname: string
    email: string
    role: 'admin' | 'editor'
  }
}

export default function EditUserForm({ id, initialData }: EditUserFormProps) {
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [error, setError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [form, setForm] = useState({
    fullname: initialData.fullname,
    email: initialData.email,
    password: '',
    role: initialData.role,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await updateUser(id, {
      fullname: form.fullname,
      email: form.email,
      role: form.role,
      password: form.password || undefined,
    })

    if (result?.success === false) {
      setError(result.message)
    }

    setLoading(false)
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    const result = await deleteUser(id)
    if (result?.success === false) {
      setError(result.message)
      setShowDeleteConfirm(false)
    }
    setDeleteLoading(false)
  }

  return (
    <div className="space-y-6">

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
            Yeni Şifre
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Değiştirmek istemiyorsanız boş bırakın"
            minLength={8}
            className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          <p className="text-xs text-slate-500">Boş bırakırsanız mevcut şifre korunur</p>
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
            {loading ? 'Güncelleniyor...' : 'Güncelle'}
          </button>
        </div>

      </form>

      {/* Tehlikeli Bölge */}
      <div className="bg-red-500/10 rounded-xl border border-red-500/20 p-6">
        <h3 className="text-sm font-semibold text-red-400 mb-1">Tehlikeli Bölge</h3>
        <p className="text-xs text-slate-400 mb-4">Bu kullanıcıyı silmek geri alınamaz.</p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm font-medium transition-all"
          >
            Kullanıcıyı Sil
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <p className="text-sm text-slate-300">Emin misiniz?</p>
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-all disabled:opacity-50"
            >
              {deleteLoading ? 'Siliniyor...' : 'Evet, Sil'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 rounded-lg bg-white/5 text-slate-400 hover:text-white text-sm font-medium transition-all"
            >
              Vazgeç
            </button>
          </div>
        )}
      </div>

    </div>
  )
}