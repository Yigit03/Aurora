"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { sendContactEmail } from "./actions";

const TOPICS = [
  "Yazılı Tercüme",
  "Sözlü Tercüme",
  "Yeminli Tercüme",
  "İş & Kurumsal Çeviri",
  "Akademik Çeviri",
  "Online Kurs Paketleri",
  "Diğer",
];

export default function ContactForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    topic: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await sendContactEmail({
      fullname: form.fullName,
      email: form.email,
      topic: form.topic,
      message: form.message,
    });

    if (result.succes) {
      setSubmitted(true);
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-8 py-16">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-6">
          <Send size={28} className="text-red-600" />
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-3">Mesajınız İletildi!</h3>
        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
          En kısa sürede size geri döneceğiz. İlginiz için teşekkür ederiz.
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm({ fullName: "", email: "", topic: "", message: "" }); }}
          className="mt-8 text-sm font-bold text-red-600 hover:text-red-700 underline underline-offset-4 transition-colors"
        >
          Yeni mesaj gönder
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-8 lg:p-10">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">Bize Ulaşın</h2>
        <p className="text-sm text-gray-500">Formu doldurun, sizi arayalım.</p>
      </div>

      {/* Ad Soyad */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">
          Ad Soyad <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          required
          placeholder="Adınız Soyadınız"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 transition-all duration-200 bg-gray-50 hover:bg-white"
        />
      </div>

      {/* E-posta */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">
          E-posta <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="ornek@email.com"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 transition-all duration-200 bg-gray-50 hover:bg-white"
        />
      </div>

      {/* Konu */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">
          Konu <span className="text-red-500">*</span>
        </label>
        <select
          name="topic"
          value={form.topic}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 transition-all duration-200 bg-gray-50 hover:bg-white appearance-none cursor-pointer"
        >
          <option value="" disabled>Hizmet seçiniz</option>
          {TOPICS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Mesaj */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">
          Mesaj <span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Mesajınızı buraya yazınız..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
        />
      </div>

      {/* Hata mesajı */}
      {error && (
        <p className="text-sm text-red-500 font-medium">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-red-500 to-red-700 text-white font-extrabold text-sm tracking-wide hover:brightness-110 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 mt-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
      >
        <Send size={16} />
        {loading ? "Gönderiliyor..." : "Gönder"}
      </button>
    </form>
  );
}