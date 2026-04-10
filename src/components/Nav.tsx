import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#projects' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-4 sm:top-5 left-0 right-0 z-50 px-4 sm:px-6 lg:px-16 transition-all duration-700 ${
          scrolled ? 'top-3 sm:top-4' : ''
        }`}
      >
        <div
          className={`max-w-7xl mx-auto flex items-center justify-between py-2.5 sm:py-3 px-4 sm:px-6 rounded-full transition-all duration-700 ${
            scrolled
              ? 'bg-white/[0.06] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]'
              : 'bg-white/[0.04] backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.06)]'
          }`}
        >
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-heading text-2xl text-white italic tracking-tight relative z-10"
          >
            MZ<span className="text-white/30">.</span>
          </a>

          {/* Desktop Links — translucent bar with hover blocks */}
          <div className="hidden md:flex items-center gap-1 bg-white/[0.04] backdrop-blur-sm rounded-full px-1.5 py-1.5 border border-white/[0.06]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(link.href.slice(1));
                }}
                className="relative px-3.5 py-2 text-sm font-medium text-white/70 font-body rounded-full
                  hover:bg-white/[0.08] hover:text-white
                  active:bg-white/[0.12] active:scale-[0.97]
                  transition-all duration-300 cursor-cta"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => scrollTo('contact')}
              className="bg-white text-black rounded-full px-4 py-2 text-sm font-body font-semibold flex items-center gap-1.5
                cursor-cta
                hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]
                active:scale-[0.96]
                transition-all duration-300"
            >
              Let&apos;s Build
              <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden relative z-10 text-white p-2 rounded-full
              hover:bg-white/[0.08] active:bg-white/[0.12]
              transition-all duration-300"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-[#0A0A0A]/98 backdrop-blur-2xl flex flex-col items-center justify-center gap-4"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(link.href.slice(1));
                }}
                className="text-4xl font-heading italic text-white/60 hover:text-white
                  px-6 py-2 rounded-xl
                  hover:bg-white/[0.05] active:bg-white/[0.08]
                  transition-all duration-300 cursor-cta"
              >
                {link.label}
              </motion.a>
            ))}
            <motion.button
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              onClick={() => scrollTo('contact')}
              className="mt-6 bg-white text-black rounded-full px-8 py-3.5 text-sm font-body font-semibold
                flex items-center gap-2 cursor-cta
                hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]
                active:scale-[0.97]
                transition-all duration-300"
            >
              Let&apos;s Build
              <ArrowUpRight size={16} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
