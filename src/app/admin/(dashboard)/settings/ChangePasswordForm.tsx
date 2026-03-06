'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { changePasswordAction } from './actions'
import { useState } from 'react'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-blue-600/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
    </button>
  )
}

type Props = {
  userId: string
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}

export default function ChangePasswordForm({ userId }: Props) {
  const changePasswordWithId = changePasswordAction.bind(null, userId)

  const [state, formAction] = useActionState(changePasswordWithId, {
    success: false,
    message: '',
  })

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const fields = [
    { id: 'current_password', label: 'Mevcut Şifre', placeholder: 'Mevcut şifrenizi girin', show: showCurrent, toggle: () => setShowCurrent(!showCurrent) },
    { id: 'new_password', label: 'Yeni Şifre', placeholder: 'En az 8 karakter', show: showNew, toggle: () => setShowNew(!showNew) },
    { id: 'confirm_password', label: 'Yeni Şifre (Tekrar)', placeholder: 'Yeni şifrenizi tekrar girin', show: showConfirm, toggle: () => setShowConfirm(!showConfirm) },
  ]

  return (
    <form action={formAction} className="space-y-5">

      {/* Hata/Başarı Mesajı */}
      {state.message && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm border ${
          state.success
            ? 'bg-green-500/10 border-green-500/20 text-green-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${state.success ? 'bg-green-500' : 'bg-red-500'}`} />
          {state.message}
        </div>
      )}

      {/* Şifre Alanları */}
      {fields.map((field) => (
        <div key={field.id} className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            {field.label} <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              type={field.show ? 'text' : 'password'}
              id={field.id}
              name={field.id}
              required
              placeholder={field.placeholder}
              className="w-full h-11 px-4 pr-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            <button
              type="button"
              onClick={field.toggle}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <EyeIcon open={field.show} />
            </button>
          </div>
        </div>
      ))}

      <SubmitButton />
    </form>
  )
}