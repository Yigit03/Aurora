"use client";

import { motion } from "framer-motion";
import { BookOpen, Users, Award, Clock, LucideIcon } from "lucide-react";

type FeatureItem = {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  description: string;
};

const featureList: FeatureItem[] = [
  {
    icon: BookOpen,
    iconColor: "text-red-500",
    title: "Kapsamlı Müfredat",
    description: "A1'den C2'ye kadar tüm seviyeler için detaylı ders planları",
  },
  {
    icon: Users,
    iconColor: "text-yellow-500",
    title: "Uzman Eğitmenler",
    description: "Anadili Almanca olan deneyimli öğretmenlerle birebir dersler",
  },
  {
    icon: Award,
    iconColor: "text-blue-400",
    title: "Sertifika",
    description: "Uluslararası geçerliliği olan sertifikalar kazanın",
  },
  {
    icon: Clock,
    iconColor: "text-red-500",
    title: "Esnek Saatler",
    description: "Size uygun saatlerde online dersler alın",
  },
];

export default function Features() {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Neden{" "}
            <span className="text-red-600">Aurora Dil Eğitim Merkezi</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Modern öğretim yöntemleri ve deneyimli eğitmenlerimizle Almanca
            öğrenme hedeflerinize ulaşın
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featureList.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4">
                  <Icon className={`w-8 h-8 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}