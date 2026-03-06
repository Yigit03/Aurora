"use client";

import { motion } from "framer-motion";

type PageTitleProps = {
  title: string,
  text: string,
};

export default function PageTitle({title, text}:PageTitleProps) {

  return (
    <section className="bg-gradient-to-br from-red-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            <span className="text-red-600">{title}</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {text}
          </p>
        </motion.div>
      </div>
    </section>
  );
}