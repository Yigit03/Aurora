// app/admin/dashboard/_components/Header.tsx

'use client'

import { JwtPayload } from '@/lib/jwt'
import Image from 'next/image'

interface HeaderProps {
  currentUser: JwtPayload
  logoutAction: () => Promise<never>
}


export default function AdminHeader({ currentUser, logoutAction }: HeaderProps) {
  const roleLabel = {
    superadmin: 'Süper Admin',
    admin: 'Admin',
    editor: 'Editör',
  }[currentUser.role] ?? currentUser.role

  return (
    <header className="w-full h-16 bg-slate-800 border-b border-white/10 flex items-center justify-between px-6 shrink-0 z-20">

      {/* Sol - Logo */}
      <div className="flex items-center gap-3 pl-5">
        <Image src="/logo-white.png" alt="Logo" className="h-8 w-auto" width={350} height={100} />
        
      </div>

      {/* Sağ - Kullanıcı + Çıkış */}
      <div className="flex items-center gap-4">

        {/* Tarih */}
        <div className="text-right hidden md:block">
          <p className="text-sm font-medium text-slate-300">
            {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <p className="text-xs text-slate-500">
            {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} GMT+3
          </p>
        </div>

        <div className="w-px h-8 bg-white/10" />

        {/* Kullanıcı Bilgisi */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {currentUser.email.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-white leading-none">
              {currentUser.fullname}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{roleLabel}</p>
          </div>
        </div>

        <div className="w-px h-8 bg-white/10" />

        {/* Çıkış */}
        <form action={logoutAction}>
          <button
            type="submit"
            title="Çıkış Yap"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </form>

      </div>
    </header>
  )
}