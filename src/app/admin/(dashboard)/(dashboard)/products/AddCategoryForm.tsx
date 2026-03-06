'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { createCategoryAction } from './category-actions'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-5 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-purple-400 transition-colors text-sm"
    >
      {pending ? 'Ekleniyor...' : '+ Ekle'}
    </button>
  )
}

export default function AddCategoryForm() {
  const [state, formAction] = useActionState(createCategoryAction, {
    success: false,
    message: '',
  })

  return (
    <div className="bg-purple-50 rounded-xl border border-purple-200 p-4">
      <form action={formAction} className="flex items-center gap-4">
        
        {/* Icon */}
        <div className="bg-purple-100 rounded-lg p-2.5 shrink-0">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>

        {/* Input ve Button */}
        <div className="flex-1 flex items-center gap-3">
          <div className="flex-1">
            <input
              type="text"
              name="name"
              placeholder="Yeni kategori adı (örn: İçecekler)"
              required
              className="w-full px-4 py-2.5 bg-white border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition placeholder:text-gray-400 text-sm"
            />
          </div>
          <SubmitButton />
        </div>

        {/* Mesaj */}
        {state.message && (
          <div className={`text-xs font-medium ${
            state.success ? 'text-green-700' : 'text-red-700'
          }`}>
            {state.message}
          </div>
        )}
      </form>
    </div>
  )
}