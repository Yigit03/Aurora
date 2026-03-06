"use client";

import { motion } from "framer-motion";
import Button, { ButtonVariant } from "../ui/Button";

type CTASectionProps = {
  route: string;
  buttonTitle: string;
  buttonVariant: ButtonVariant;
  text: string,
  textTitle: string, // Button componentinizin kabul ettiği variant tipine göre değiştirin
};

export default function CTASection({ route, buttonTitle, buttonVariant, text, textTitle }: CTASectionProps) {
  return (
    <section className="pt-10 pb-10 bg-gradient-to-r from-red-600 to-yellow-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >   
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {textTitle}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {text}
          </p>
            <Button title={buttonTitle} variant={buttonVariant} route={route}/>
        </motion.div>
      </div>
    </section>
  );
}