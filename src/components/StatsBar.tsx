import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// ─── CountUp component ────────────────────────────────────────
function CountUp({
  target,
  suffix = '',
  prefix = '',
  duration = 2000,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

// ─── Stats data ───────────────────────────────────────────────
const stats = [
  { value: 3, suffix: '+', label: 'Projects Delivered' },
  { value: 5, suffix: '', label: 'Platforms Per Workflow' },
  { value: 10, suffix: 's', prefix: '< ', label: 'Automation Response Time' },
  { value: 100, suffix: '%', label: 'Systems Owned By You' },
];

// ─── StatsBar ─────────────────────────────────────────────────
export function StatsBar() {
  return (
    <section className="relative py-4">
      <motion.div
        initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16"
      >
        <div className="liquid-glass rounded-3xl p-10 md:p-14 lg:p-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                className="flex flex-col items-center text-center gap-3
                  glass-card-hover rounded-2xl p-6 cursor-default"
              >
                <div className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight">
                  <CountUp
                    target={stat.value}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                  />
                </div>
                <div className="text-white/40 font-body font-light text-sm max-w-[180px]">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
