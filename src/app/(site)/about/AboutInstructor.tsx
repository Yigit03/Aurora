"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutInstructor() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Eğitmenimiz:{" "}
              <span className="text-red-600">Havva Tenger</span>
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Merhaba! Ben Havva, 25 yıllık Almanca öğretmenliği deneyimine sahip bir eğitim uzmanıyım.
              </p>
              <p>
                İlköğretim ve ortaöğrenimimi Almanya’da tamamladıktan sonra,
                Ankara Üniversitesi Alman Dili ve Edebiyatı Bölümü’nde lisans eğitimimi bitirdim.
                Ardından aynı alanda yüksek lisans ve öğretmenlik formasyonumu tamamlayarak akademik kariyerimi pekiştirdim.              </p>
              <p>
                Bugüne kadar yüzlerce öğrenciye Almanca öğrettim ve onların hem akademik
                hem de günlük yaşamda dili etkili bir şekilde kullanmalarına katkı sağladım.              
              </p>
              <p>
                Aurora Dil Eğitim Merkezi’ni kurma amacım,
                yılların tecrübesi ve birikimiyle öğrencilere modern,
                kişiselleştirilmiş ve etkili bir Almanca eğitimi sunmaktır.
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Uzmanlık Alanlarım:
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-gray-600">Goethe Sertifika Hazırlığı</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span className="text-gray-600">İş Almancası</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-gray-600">Konuşma Pratiği</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span className="text-gray-600">Almanca Gramer</span>
                </li> 
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-gray-600">Yeminli Tercüme</span>
                </li>                                                      
              </ul>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-red-100 to-yellow-100 rounded-2xl p-8">
              <Image
                src="/about-instructor.png"
                alt="Havva Tenger - Almanca Eğitmeni"
                width={600}
                height={384}
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}