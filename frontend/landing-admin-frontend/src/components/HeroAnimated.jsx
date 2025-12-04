// HeroAnimated.jsx
import React from 'react';
import { motion } from 'framer-motion';

const titleAnim = {
  hidden: { y: 20, opacity: 0 },
  visible: (i = 1) => ({ y: 0, opacity: 1, transition: { delay: 0.12 * i, duration: 0.5 } })
};

export default function HeroAnimated() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-primary-50">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <motion.h1 initial="hidden" animate="visible" custom={0} variants={titleAnim} className="text-4xl sm:text-5xl font-extrabold">
            LeadManager — Capture & Convert
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-4 text-gray-600 max-w-lg">
            A professional lead management system for agencies and developers. Fast, reliable and simple to extend.
          </motion.p>

          <div className="mt-6 flex gap-3">
            <a className="inline-block bg-primary-600 text-white px-4 py-3 rounded-md" href="/login">Get started</a>
            <a className="inline-block text-primary-700 px-4 py-3 rounded-md border border-primary-100" href="#features">Learn more</a>
          </div>
        </div>

        <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl shadow p-6">
          <div className="h-64 flex items-center justify-center border rounded-lg text-gray-400">Preview panel</div>
        </motion.div>
      </div>
    </section>
  );
}
