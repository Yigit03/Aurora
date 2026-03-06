"use client";

import React, { useState } from 'react';
import { login } from "./actions";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Image from 'next/image';

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError("");
    setLoading(true);

    const result = await login({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    if (result?.success === false) {
      setError(result.message);
    }

    setLoading(false);
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      
      {/* Kart */}
      <div className="w-full max-w-md mx-4">
        
        {/* Logo / Başlık */}
        <div className="text-center mb-8 justify-center items-center flex flex-col gap-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 mb-4 shadow-lg shadow-blue-600/30">
            <Lock size={24} className="text-white" />
          </div>
          <Image src="/logo-white.png" alt="Logo" className="h-18 w-auto" width={800} height={500} />
        </div>

        {/* Form Kartı */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
          <form action={handleSubmit} className="flex flex-col gap-5">

            {/* E-posta */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                E-posta
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  required
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Şifre */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Şifre
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 pl-10 pr-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Beni Hatırla */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${
                    rememberMe
                      ? "bg-blue-600 border-blue-600"
                      : "border-white/20 bg-white/5"
                  }`}
                >
                  {rememberMe && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  Beni hatırla
                </span>
              </label>

              <button
                type="button"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                onClick={() => alert("Şifre sıfırlama özelliği yakında eklenecek.")}
              >
                Şifremi unuttum
              </button>
            </div>

            {/* Hata mesajı */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm tracking-wide transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Giriş yapılıyor...
                </span>
              ) : (
                "Giriş Yap"
              )}
            </button>

          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-6">
          2026 Copyright.{" "}
          <a href="https://www.sembyweb.com" className="text-slate-500 hover:text-slate-400 transition-colors">
            Sembyweb
          </a>{" "}
          tüm hakları saklıdır.
        </p>

      </div>
    </div>
  );
}