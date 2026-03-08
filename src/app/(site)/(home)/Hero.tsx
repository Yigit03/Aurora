// components/Hero.tsx
"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-red-50 to-blue-50 py-16 sm:py-20 lg:py-30 overflow-hidden">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">

          {/* ── Sol / Üst: Metin Alanı ── */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
            /*
              Mobilde her şey ortalanmış.
              lg ekranda sola hizalanmış.
            */
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-5 leading-tight">
              <span className="text-red-600">Almanca</span>
              {" "}Öğrenmenin
              <span className="text-yellow-500"> En Kolay</span>
              {" "}Yolu
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
              Goethe & Telc Sınav Odaklı Eğitim. <br />
              Profesyonel eğitmenlerle ister grup <br /> ister birebir online dersler alın.
            </p>

            {/* ── CTA Butonları: yan yana, eşit genişlik ── */}
            <div className="flex flex-row gap-4 w-full sm:w-auto">
              {/*
                flex-row   → her zaman yan yana (mobil dahil)
                w-full     → mobilde ikisi toplam genişliği paylaşır
                sm:w-auto  → büyük ekranda içeriğe göre genişler
              */}
              <div className="flex-1 sm:flex-none">
                <Button title="Öğrenmeye Başla" variant="danger" route="/contact" />
              </div>
              <div className="flex-1 sm:flex-none sm:w-44">
                <Button title="Kursları İncele" variant="outline" route="/courses" />
              </div>
            </div>
          </motion.div>

          {/* ── Sağ / Alt: Görsel Alanı ── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end mt-8 lg:mt-0"
            /*
              Mobilde görsel ortalanır.
              lg ekranda sağa hizalanır.
              mt-8 → mobilde metinden ayrışmak için üst boşluk
            */
          >
            {/* Görsel kart */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 transform rotate-3 w-full max-w-sm sm:max-w-md lg:max-w-full">
              <Image
                src="/hero.png"
                alt="Online Almanca dersi alan öğrenci"
                width={600}
                height={320}
                className="w-full h-56 sm:h-72 lg:h-80 object-cover rounded-lg"
                priority
              />
            </div>

            {/* İstatistik rozeti */}
            <div className="absolute -bottom-4 -left-2 sm:-bottom-6 sm:-left-6 bg-yellow-400 rounded-2xl p-4 sm:p-6 shadow-xl transform -rotate-6">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">1000+</div>
                <div className="text-xs sm:text-sm text-gray-700">Mutlu Öğrenci</div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}