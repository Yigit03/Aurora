"use client";

import { motion } from "framer-motion";
import { Users, BookOpen, Award, Globe, LucideIcon } from "lucide-react";

type Stat = {
  icon: LucideIcon;
  iconColor: string;
  number: string;
  label: string;
};

const stats: Stat[] = [
  {
    icon: Users,
    iconColor: "text-red-500",
    number: "1000+",
    label: "Mutlu Öğrenci",
  },
  {
    icon: BookOpen,
    iconColor: "text-yellow-500",
    number: "2026+",
    label: "Sonrası Güncel Müfredat",
  },
  {
    icon: Award,
    iconColor: "text-blue-400",
    number: "95%",
    label: "Başarı Oranı",
  },
  {
    icon: Globe,
    iconColor: "text-red-500",
    number: "500+",
    label: "Ders",
  },
];

export default function AboutStats() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="">
            <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
            >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Rakamlarla{" "}
                <span className="text-red-600">Aurora Dil Eğitim Merkezi</span>
            </h2>
            </motion.div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="flex justify-center mb-4">
                  <Icon className={`w-8 h-8 ${stat.iconColor}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}