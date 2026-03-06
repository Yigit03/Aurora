"use client"
/* Bu dosyanın Client Component olduğunu belirtir.
   Framer Motion gibi tarayıcıya bağlı kütüphaneler için zorunludur. */

import React from 'react';
/* React kütüphanesini içeri aktarır.
   JSX kullanımı ve component tanımı için gereklidir. */

import { motion } from 'framer-motion';
/* Framer Motion'dan motion objesini import eder.
   Animasyonlu bileşenler oluşturmak için kullanılır. */

const ExamsList = () => {
  /* Almanca sınavlarını listeleyen fonksiyonel React bileşeni */

  const exams = [
    "Goethe Institut",
    /* Goethe Institut sınav adını temsil eder */

    "DAAD",
    /* DAAD sınav / kurum adını temsil eder */

    "TestDaF",
    /* TestDaF Almanca yeterlilik sınavını temsil eder */

    "TELC",
    /* TELC dil sınavı adını temsil eder */

    "ÖSD"
    /* Avusturya merkezli ÖSD Almanca sınavını temsil eder */
  ];

  return (
    <div className="bg-red-600 py-8 border-b border-gray-100">
      {/* Tüm bileşeni saran ana container.
          Kırmızı arka plan, dikey padding ve alt border içerir. */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* İçeriği ortalayan ve maksimum genişliği sınırlayan wrapper.
            Responsive yatay padding uygular. */}

        <div className="flex flex-wrap justify-between items-center w-full gap-4 md:gap-8">
          {/* Sınav isimlerini yatay eksende dizen flex container.
              wrap → taşan elemanları alt satıra geçirir.
              justify-between → boşlukları eşit dağıtır. */}

          {exams.map((exam, index) => (
            /* exams dizisini dolaşarak her sınav için bir JSX elemanı üretir */

            <motion.div
              key={index}
              /* React için benzersiz key değeri.
                 Liste render’larında zorunludur. */

              initial={{ opacity: 0, y: 10 }}
              /* İlk render anında eleman görünmez ve aşağıda başlar */

              animate={{ opacity: 1, y: 0 }}
              /* Animasyon sonunda tam görünür ve normal konumuna gelir */

              transition={{ duration: 0.5, delay: index * 0.1 }}
              /* Animasyon süresi 0.5 sn.
                 index bazlı delay ile kademeli (staggered) animasyon sağlar */

              className="group cursor-default flex-grow sm:flex-grow-0 text-center sm:text-left"
              /* Hover state için group tanımı.
                 Mobilde genişler, büyük ekranlarda sabit kalır.
                 Metin hizalaması responsive ayarlanır. */
            >
              <span className="text-lg md:text-xl font-semibold text-white tracking-tight transition-colors duration-300 group-hover:text-yellow-400 whitespace-nowrap">
                {/* Sınav adını gösteren metin alanı.
                    Hover durumunda renk değiştirir.
                    whitespace-nowrap → satır kırılmasını engeller. */}

                {exam}
                {/* exams dizisinden gelen sınav adını render eder */}
              </span>
            </motion.div>
          ))}
          {/* exams.map döngüsünün ve JSX üretiminin kapanışı */}
        </div>
      </div>
    </div>
  );
};

export default ExamsList;
/* ExamsList bileşenini dışa aktarır.
   Başka dosyalarda import edilerek kullanılmasını sağlar. */