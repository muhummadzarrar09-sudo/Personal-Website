import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { StatsBar } from './components/StatsBar';
import { Services } from './components/Services';
import { Projects } from './components/Projects';
import { Process } from './components/Process';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { LoadingScreen } from './components/LoadingScreen';

// ─── Animated Background Orbs ─────────────────────────────────
function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Subtle grid lines */}
      <div className="absolute inset-0 grid-bg opacity-40" />

      {/* Noise texture */}
      <div className="absolute inset-0 noise-overlay opacity-60" />

      {/* Orb 1 — large green glow, top right */}
      <div
        className="orb-1 absolute -top-[200px] -right-[200px] w-[700px] h-[700px] rounded-full opacity-[0.035]"
        style={{
          background: 'radial-gradient(circle, #00FF94 0%, transparent 70%)',
        }}
      />

      {/* Orb 2 — warm gold glow, center left */}
      <div
        className="orb-2 absolute top-[40%] -left-[300px] w-[600px] h-[600px] rounded-full opacity-[0.025]"
        style={{
          background: 'radial-gradient(circle, #F5A623 0%, transparent 70%)',
        }}
      />

      {/* Orb 3 — blue-white glow, bottom right */}
      <div
        className="orb-3 absolute top-[70%] -right-[200px] w-[500px] h-[500px] rounded-full opacity-[0.03]"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)',
        }}
      />

      {/* Orb 4 — green glow, bottom left */}
      <div
        className="orb-2 absolute top-[90%] -left-[100px] w-[400px] h-[400px] rounded-full opacity-[0.02]"
        style={{
          background: 'radial-gradient(circle, #00FF94 0%, transparent 70%)',
        }}
      />

      {/* Orb 5 — white glow, center */}
      <div
        className="orb-1 absolute top-[55%] left-[30%] w-[500px] h-[500px] rounded-full opacity-[0.015]"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)',
        }}
      />

      {/* Horizontal line accents */}
      <div className="absolute top-[30%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
      <div className="absolute top-[60%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />
      <div className="absolute top-[85%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />
    </div>
  );
}

function RollSection({ children }: { children: React.ReactNode }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 92%', 'end 8%'],
  });

  const rawY = useTransform(scrollYProgress, [0, 0.25, 1], [110, 0, -36]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.18, 0.85, 1], [0, 1, 1, 0.9]);
  const rawScale = useTransform(scrollYProgress, [0, 0.2, 1], [0.965, 1, 0.988]);
  const rawRotateX = useTransform(scrollYProgress, [0, 0.3, 1], [8, 0, -2]);

  const y = useSpring(rawY, { stiffness: 110, damping: 24, mass: 0.45 });
  const opacity = useSpring(rawOpacity, { stiffness: 120, damping: 24, mass: 0.4 });
  const scale = useSpring(rawScale, { stiffness: 110, damping: 24, mass: 0.5 });
  const rotateX = useSpring(rawRotateX, { stiffness: 100, damping: 22, mass: 0.5 });

  return (
    <motion.div
      ref={sectionRef}
      style={{
        y,
        opacity,
        scale,
        rotateX,
        transformPerspective: 1200,
        transformStyle: 'preserve-3d',
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── App ──────────────────────────────────────────────────────
export default function App() {
  const [loadingPhase, setLoadingPhase] = useState<
    'loading' | 'revealing' | 'done'
  >('loading');
  const contentRef = useRef<HTMLDivElement>(null);

  const handleLoadingReveal = () => {
    setLoadingPhase('revealing');
  };

  useEffect(() => {
    if (loadingPhase === 'loading') {
      document.body.style.overflow = 'hidden';
    } else {
      // Small delay before unlocking scroll so the reveal animation plays
      const t = setTimeout(() => {
        document.body.style.overflow = '';
      }, 1200);
      return () => clearTimeout(t);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [loadingPhase]);

  useEffect(() => {
    if (loadingPhase === 'revealing') {
      const t = setTimeout(() => setLoadingPhase('done'), 1500);
      return () => clearTimeout(t);
    }
  }, [loadingPhase]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white antialiased font-body relative">
      {/* Keep cursor outside transformed containers so it stays viewport-fixed site-wide */}
      <CustomCursor />

      {/* ─── Content layer: always rendered, starts hidden ─── */}
      <motion.div
        ref={contentRef}
        initial={{ opacity: 0, scale: 0.97, filter: 'blur(8px)' }}
        animate={
          loadingPhase === 'loading'
            ? { opacity: 0, scale: 0.97, filter: 'blur(8px)' }
            : { opacity: 1, scale: 1, filter: 'blur(0px)' }
        }
        transition={{
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1], // easeOutExpo
        }}
        style={{ willChange: 'opacity, transform, filter' }}
      >
        {/* Living background layer */}
        <BackgroundOrbs />

        {/* Content layer */}
        <div className="relative z-10">
          <Nav />
          <main>
            <Hero />
            <RollSection>
              <StatsBar />
            </RollSection>
            <RollSection>
              <Services />
            </RollSection>
            <RollSection>
              <Projects />
            </RollSection>
            <RollSection>
              <Process />
            </RollSection>
            <RollSection>
              <Contact />
            </RollSection>
          </main>
          <Footer />
        </div>

        {/* Top fade into page */}
        <motion.div
          className="fixed top-0 left-0 right-0 z-40 pointer-events-none"
          style={{
            height: '80px',
            background: 'linear-gradient(to bottom, #0A0A0A 0%, transparent 100%)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: loadingPhase === 'loading' ? 0 : 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        />
      </motion.div>

      {/* ─── Loading screen: on top, animates out ─── */}
      <LoadingScreen
        phase={loadingPhase}
        onReveal={handleLoadingReveal}
      />
    </div>
  );
}
