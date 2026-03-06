"use client";
// Bu dosyanın Client Component olduğunu belirtir.
// useState, useEffect, window, document ve framer-motion kullanımı için zorunludur.

import { useState, useEffect } from "react";
// React state ve lifecycle hook’larını içeri aktarır.

import Link from "next/link";
// Next.js client-side navigation için Link bileşeni.

import Image from "next/image";
// Next.js image optimization sağlayan Image bileşeni.

import { usePathname } from "next/navigation";
// Aktif route bilgisini almak için kullanılır.

import { motion, AnimatePresence, Variants } from "framer-motion";
// motion → animasyonlu bileşenler
// AnimatePresence → mount / unmount animasyonları
// Variants → animasyon presetlerini tip güvenli şekilde tanımlamak için

import { Menu, X } from "lucide-react";
// Mobil menü için hamburger (Menu) ve kapatma (X) ikonları.

import Button from "../ui/Button";
// Projede tanımlı reusable Button bileşeni.

const Header = () => {
  // Header bileşenini tanımlayan fonksiyonel React component.

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Mobil menünün açık / kapalı durumunu tutan state.

  const [isScrolled, setIsScrolled] = useState(false);
  // Sayfa kaydırıldığında header stilini değiştirmek için kullanılan state.

  const pathname = usePathname();
  // Aktif URL path’ini alır (örn: "/", "/about").

  // Sayfa kaydırıldığında header görünümünü değiştir
  useEffect(() => {
    // Scroll event’inde çalışacak fonksiyon tanımı.
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    // ScrollY 10px’i geçerse isScrolled true olur.

    window.addEventListener("scroll", handleScroll);
    // Scroll event listener eklenir.

    return () => window.removeEventListener("scroll", handleScroll);
    // Component unmount olduğunda event listener temizlenir.
  }, []);
  // Boş dependency array → sadece ilk render’da çalışır.

  // Menü açıkken sayfa kaydırmayı engelle
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    // Menü açıksa body scroll’u kapatılır.

    return () => { document.body.style.overflow = ""; };
    // Cleanup: body overflow resetlenir.
  }, [isMenuOpen]);
  // isMenuOpen değiştiğinde tetiklenir.

  const navItems = [
    { name: "Anasayfa", path: "/" },
    // Ana sayfa navigasyon linki

    { name: "Hakkımızda", path: "/about" },
    // Hakkımızda sayfası linki

    { name: "Kurslar", path: "/courses" },
    // Kurslar sayfası linki

    { name: "Tercümanlık", path: "/interpreting" },
    // Tercümanlık hizmetleri sayfası linki

    { name: "Blog", path: "/blog" },
    // Blog sayfası linki
  ];

  const menuVariants: Variants = {
    closed: { opacity: 0, x: "100%" },
    // Menü kapalıyken tamamen sağda ve görünmez

    open: {
      opacity: 1,
      x: 0,
      // Menü açıkken görünür ve ekrana kayar

      transition: { type: "spring", stiffness: 300, damping: 30 },
      // Yay (spring) animasyonu ayarları
    },
  };

  const itemVariants: Variants = {
    closed: { opacity: 0, x: 20 },
    // Menü item’ları kapalıyken hafif sağda ve görünmez

    open: (i: number) => ({
      opacity: 1,
      x: 0,
      // Açık durumda görünür ve hizalanmış

      transition: { delay: i * 0.07, type: "spring", stiffness: 300, damping: 24 },
      // Index bazlı gecikme ile staggered animasyon
    }),
  };

  return (
    <>
      {/* Fragment: Header ve mobil menü overlay’ini sarmak için */}

      <header
        className={`w-full bg-white sticky top-0 z-50 transition-shadow duration-300 ${
          isScrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        {/* Sayfanın üst kısmına yapışık header alanı
            Scroll durumuna göre shadow değişir */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* İçeriği ortalayan ve genişliği sınırlayan container */}

          <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
            {/* Header içeriğini yatayda hizalayan ana flex alan */}

            {/* ── Logo ── */}
            <Link href="/" className="flex-shrink-0 flex items-center">
              {/* Logo tıklanınca ana sayfaya gider */}

              <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 400 }}>
                {/* Logo hover edildiğinde hafif büyüme animasyonu */}

                <Image
                  src="/header-logo.png"
                  alt="Online Almanca dersi alan öğrenci"
                  width={130}
                  height={70}
                  className="object-contain rounded-lg w-auto h-10 sm:h-12 lg:h-14"
                  priority
                />
                {/* Optimize edilmiş logo görseli */}
              </motion.div>
            </Link>

            {/* ── Masaüstü Navigasyon ── */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {/* Sadece medium ve üzeri ekranlarda görünen navigasyon */}

              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 group ${
                    pathname === item.path
                      ? "text-red-600"
                      : "text-gray-600 hover:text-red-600"
                  }`}
                >
                  {/* Aktif route’a göre renk değiştiren nav link */}

                  {/* Aktif / hover alt çizgi efekti */}
                  <span
                    className={`absolute bottom-0 left-3 right-3 h-0.5 bg-red-500 rounded-full transition-transform duration-200 origin-left ${
                      pathname === item.path
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                  {/* Alt çizgi animasyonu */}

                  {item.name}
                  {/* Menü başlığı */}
                </Link>
              ))}
            </nav>

            {/* ── Sağ Alan: Buton + Mobil Toggle ── */}
            <div className="flex items-center gap-3">
              {/* Header’ın sağ tarafı */}

              {/* İletişim butonu — masaüstünde görünür */}
              <div className="hidden md:block">
                <Button title="İletişim" variant="primary" route="/contact" />
                {/* Call-to-action butonu */}
              </div>

              {/* Hamburger / Close butonu */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 active:scale-90 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                aria-label={isMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
                aria-expanded={isMenuOpen}
              >
                {/* Mobil menüyü açıp kapatan buton */}

                <AnimatePresence mode="wait" initial={false}>
                  {/* Icon değişimini animasyonlu yapar */}

                  {isMenuOpen ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X size={22} />
                      {/* Menü açıkken kapatma ikonu */}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu size={22} />
                      {/* Menü kapalıyken hamburger ikonu */}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobil Menü Overlay ── */}
      <AnimatePresence>
        {/* Mobil menünün mount / unmount animasyonu */}

        {isMenuOpen && (
          <>
            {/* Karartma arkaplanı */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />
            {/* Menü açıkken arkadaki içeriği karartan overlay */}

            {/* Sağdan kayan panel */}
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-white z-50 md:hidden flex flex-col shadow-2xl"
            >
              {/* Mobil menü paneli */}

              {/* Panel başlığı */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                {/* Logo ve kapatma butonu */}

                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                  <Image
                    src="/header-logo.png"
                    alt="Logo"
                    width={110}
                    height={55}
                    className="object-contain w-auto h-9"
                  />
                </Link>

                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  aria-label="Menüyü kapat"
                >
                  <X size={20} />
                  {/* Menü kapatma ikonu */}
                </button>
              </div>

              {/* Navigasyon linkleri */}
              <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
                {/* Kaydırılabilir mobil menü link alanı */}

                {navItems.map((item, i) => (
                  <motion.div
                    key={item.path}
                    custom={i}
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                  >
                    {/* Her menü item’ı için animasyon wrapper */}

                    <Link
                      href={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-150 ${
                        pathname === item.path
                          ? "text-red-600 bg-red-50 font-semibold"
                          : "text-gray-700 hover:text-red-600 hover:bg-gray-50 active:bg-red-50"
                      }`}
                    >
                      {/* Mobil menü linki */}

                      {/* Aktif gösterge */}
                      <span
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          pathname === item.path ? "bg-red-500" : "bg-transparent"
                        }`}
                      />
                      {/* Aktif sayfa için nokta göstergesi */}

                      {item.name}
                      {/* Menü metni */}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Panel alt kısmı — İletişim butonu */}
              <div className="px-5 py-5 border-t border-gray-100">
                {/* Mobil menü CTA alanı */}

                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center w-full py-3 px-4 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-semibold rounded-xl transition-all duration-150 shadow-sm shadow-red-200"
                >
                  İletişime Geç
                  {/* Mobil menü ana aksiyon butonu */}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
// Header bileşenini dışa aktarır.