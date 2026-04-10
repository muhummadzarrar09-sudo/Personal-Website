import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Play } from 'lucide-react';
import { BlurText } from './BlurText';

// ─── Video & Content ─────────────────────────────────────────
const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4';

const TECH_PARTNERS = ['n8n', 'OpenAI', 'HubSpot', 'Slack', 'Stripe'];

// ─── Animation helpers ───────────────────────────────────────
const blurIn = (delay: number) => ({
  initial: { filter: 'blur(10px)', opacity: 0, y: 20 },
  animate: { filter: 'blur(0px)', opacity: 1, y: 0 },
  transition: {
    duration: 0.8,
    delay,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  },
});

const staggerParent = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const staggerChild = {
  initial: { opacity: 0, y: 30, filter: 'blur(8px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

// ─── Hero Component ──────────────────────────────────────────
export function Hero() {
  const videoA = useRef<HTMLVideoElement>(null);
  const videoB = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>(0);
  const activeRef = useRef<'A' | 'B'>('A');
  const [opacityA, setOpacityA] = useState(1);
  const [opacityB, setOpacityB] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Seamless crossfade loop between two video elements
  const tick = useCallback(() => {
    const primary = activeRef.current === 'A' ? videoA.current : videoB.current;
    const secondary = activeRef.current === 'A' ? videoB.current : videoA.current;

    if (!primary || !secondary || !primary.duration) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    const duration = primary.duration;
    const current = primary.currentTime;
    const remaining = duration - current;
    const crossfadeStart = duration * 0.82; // start crossfade at 82%
    const crossfadeDuration = duration - crossfadeStart; // ~18% of video

    if (current >= crossfadeStart) {
      // In crossfade zone
      const progress = (current - crossfadeStart) / crossfadeDuration;

      if (activeRef.current === 'A') {
        setOpacityA(1 - progress);
        setOpacityB(progress);
      } else {
        setOpacityB(1 - progress);
        setOpacityA(progress);
      }

      // Start secondary video if not playing
      if (secondary.paused) {
        secondary.currentTime = 0;
        secondary.play().catch(() => {});
      }
    }

    // When primary ends, swap active
    if (remaining < 0.05) {
      primary.pause();
      primary.currentTime = 0;

      activeRef.current = activeRef.current === 'A' ? 'B' : 'A';

      if (activeRef.current === 'A') {
        setOpacityA(1);
        setOpacityB(0);
      } else {
        setOpacityB(1);
        setOpacityA(0);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    setMounted(true);

    const va = videoA.current;
    if (va) {
      va.play().catch(() => {});
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* ── Video Background (Dual crossfade) ────────── */}
      <div className="absolute inset-0 z-0">
        {/* Video A */}
        <div
          className="absolute inset-0 transition-opacity"
          style={{ opacity: mounted ? opacityA : 1 }}
        >
          <video
            ref={videoA}
            autoPlay
            muted
            playsInline
            preload="auto"
            poster="/images/hero_bg.jpeg"
            className="w-full h-full object-cover scale-105"
          >
            <source src={VIDEO_URL} type="video/mp4" />
          </video>
        </div>

        {/* Video B */}
        <div
          className="absolute inset-0 transition-opacity"
          style={{ opacity: mounted ? opacityB : 0 }}
        >
          <video
            ref={videoB}
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover scale-105"
          >
            <source src={VIDEO_URL} type="video/mp4" />
          </video>
        </div>
      </div>

      {/* ── Dark overlay ────────────────────────────────── */}
      <div className="absolute inset-0 bg-black/40 z-[1]" />

      {/* ── Top gradient fade into nav ──────────────────── */}
      <div
        className="absolute top-0 left-0 right-0 z-[2] pointer-events-none"
        style={{
          height: '260px',
          background:
            'linear-gradient(to bottom, #0A0A0A 0%, rgba(10,10,10,0.6) 40%, transparent 100%)',
        }}
      />

      {/* ── Bottom gradient fade ─────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[2] pointer-events-none"
        style={{
          height: '340px',
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(10,10,10,0.3) 30%, rgba(10,10,10,0.7) 60%, #0A0A0A 100%)',
        }}
      />

      {/* ── Content Layout — Centered ──────────────────────── */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-16 min-h-screen flex flex-col items-center text-center">
        {/* ── Zone A: Main content ─────────────────────── */}
        <div className="flex-1 flex flex-col items-center justify-center pt-20 sm:pt-24 w-full">
          {/* ── Badge pill ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="liquid-glass rounded-full px-1 py-1 inline-flex items-center gap-2 w-fit mb-10 sm:mb-12"
          >
            <span className="bg-white text-black rounded-full px-3 py-1 text-[11px] font-semibold font-body">
              New
            </span>
            <span className="text-xs font-medium text-white/80 font-body pr-3">
              Introducing AI-powered workflow automation
            </span>
          </motion.div>

          {/* ── Heading (BlurText) ──────────────────── */}
          <motion.div
            className="max-w-5xl w-full"
            variants={staggerParent}
            initial="initial"
            animate="animate"
          >
            <BlurText
              text="I Build Systems That Eliminate Your Manual Work"
              className="
                text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem]
                font-heading italic text-white text-center w-full
                leading-[1.05] sm:leading-[1.0] md:leading-[0.95]
                tracking-[-0.5px] sm:tracking-[-1px] md:tracking-[-1.5px] lg:tracking-[-2px]
              "
              delay={120}
              direction="bottom"
            />
          </motion.div>

          {/* ── Subtext in glass box for readability ── */}
          <motion.div
            {...blurIn(1.0)}
            className="
              liquid-glass rounded-2xl
              px-6 py-4 sm:px-8 sm:py-5
              mt-8 sm:mt-10
              max-w-2xl w-full
            "
          >
            <p className="
              text-sm sm:text-[15px] md:text-base
              text-white/70 font-body font-light
              leading-relaxed
            ">
              Precision automation. Intelligent workflows. Built with AI, refined
              by an engineer. This is how modern businesses operate — no manual
              work, ever.
            </p>
          </motion.div>

          {/* ── CTA Buttons ─────────────────────────── */}
          <motion.div
            {...blurIn(1.3)}
            className="flex items-center justify-center gap-5 sm:gap-6 mt-8 sm:mt-10"
          >
            <button
              onClick={() => scrollTo('contact')}
              className="
                btn-glass-hover cursor-cta
                liquid-glass-strong rounded-full
                px-5 py-2.5 sm:px-6 sm:py-3
                text-sm font-body font-medium text-white
                flex items-center gap-2
              "
            >
              Get Started
              <ArrowUpRight size={16} />
            </button>

            <button
              onClick={() => scrollTo('projects')}
              className="
                flex items-center gap-2.5
                text-sm font-body font-light text-white/70
                cursor-cta group
                px-3 py-2.5 rounded-full
                hover:bg-white/[0.06] hover:text-white
                active:bg-white/[0.1]
                transition-all duration-300
              "
            >
              <span className="relative flex items-center justify-center w-7 h-7 rounded-full border border-white/20
                group-hover:border-white/40 group-hover:bg-white/[0.05]
                transition-all duration-300">
                <Play
                  size={12}
                  fill="currentColor"
                  className="text-white/50 group-hover:text-white transition-colors duration-300"
                />
              </span>
              See My Work
            </button>
          </motion.div>
        </div>

        {/* ── Zone B: Partners / Tech bar ──────────────── */}
        <motion.div
          {...blurIn(1.6)}
          className="pb-8 sm:pb-10 pt-10 sm:pt-16 flex flex-col items-center w-full"
        >
          <div className="liquid-glass rounded-full px-3.5 py-1.5 inline-block mb-5">
            <span className="text-[11px] font-body font-light text-white/40">
              Built with the tools you already use
            </span>
          </div>
          <motion.div
            variants={staggerParent}
            initial="initial"
            animate="animate"
            className="flex items-center justify-center gap-8 md:gap-12 lg:gap-16 flex-wrap"
          >
            {TECH_PARTNERS.map((name, i) => (
              <motion.span
                key={name}
                variants={{
                  ...staggerChild,
                  animate: {
                    ...staggerChild.animate,
                    transition: {
                      ...staggerChild.animate.transition,
                      delay: 1.8 + i * 0.1,
                    },
                  },
                }}
                className="
                  text-xl sm:text-2xl md:text-3xl
                  font-heading italic text-white/50
                  hover:text-white
                  cursor-default
                  px-2 py-1 rounded-lg
                  hover:bg-white/[0.04]
                  transition-all duration-500
                "
              >
                {name}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── Availability indicator — hero-only, bottom-right ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-8 right-6 sm:right-10 lg:right-16 z-20"
      >
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.06] backdrop-blur-sm border border-white/[0.08]">
          <span className="relative flex h-1.5 w-1.5">
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-60"
              style={{
                backgroundColor: '#00FF94',
                animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
              }}
            />
            <span
              className="relative inline-flex h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: '#00FF94' }}
            />
          </span>
          <span className="text-[11px] font-body font-medium text-white/60 tracking-wider uppercase">
            Available
          </span>
        </div>
      </motion.div>
    </section>
  );
}
