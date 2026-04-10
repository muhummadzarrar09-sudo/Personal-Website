import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="relative pb-8 pt-4">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        <div className="w-full h-px bg-white/[0.06] mb-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs text-white/30 font-body font-light
              hover:text-white/50 transition-colors duration-300 cursor-default"
          >
            Muhammad Zarrar · Automation Engineer · 2026
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xs text-white/20 font-body font-light
              hover:text-white/40 transition-colors duration-300 cursor-default"
          >
            Built with Next.js · Deployed on Vercel
          </motion.span>
        </div>
      </div>
    </footer>
  );
}
