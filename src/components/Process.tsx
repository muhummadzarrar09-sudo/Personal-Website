import { motion } from 'framer-motion';
import { Search, Wrench, Eye, Rocket } from 'lucide-react';

// ─── Process steps ────────────────────────────────────────────
const steps = [
  {
    num: '01',
    title: 'Scope',
    icon: Search,
    description:
      "You describe the manual process you want eliminated. I ask the right questions.",
  },
  {
    num: '02',
    title: 'Build',
    icon: Wrench,
    description:
      "I build the system using your existing tools. No new subscriptions unless necessary.",
  },
  {
    num: '03',
    title: 'Test',
    icon: Eye,
    description: "We run it live together. I don't hand over broken work.",
  },
  {
    num: '04',
    title: 'Ship',
    icon: Rocket,
    description:
      "You own the code, the workflow, everything. No lock-in.",
  },
];

// ─── Process ──────────────────────────────────────────────────
export function Process() {
  return (
    <section id="process" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="mb-16"
        >
          <div className="liquid-glass rounded-full px-3.5 py-1 inline-block mb-6">
            <span className="text-xs font-body font-medium text-white/70">Process</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
            How It Works
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-[44px] left-[44px] right-[44px] h-px bg-white/[0.06]" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.15,
                    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                  }}
                  className="liquid-glass rounded-2xl p-6 sm:p-8
                    glass-card-hover
                    group cursor-default"
                >
                  {/* Step node */}
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-4">
                      {/* Number circle */}
                      <div className="relative z-10 liquid-glass-strong rounded-full w-[40px] h-[40px] flex items-center justify-center shrink-0
                        icon-hover">
                        <Icon size={16} className="text-white/60 group-hover:text-white transition-colors duration-400" />
                      </div>

                      {/* Step number + title */}
                      <div>
                        <span className="text-[11px] font-body font-light text-white/25 tracking-widest uppercase">
                          {step.num}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-heading italic text-white/80 group-hover:text-white tracking-tight transition-colors duration-400">
                          {step.title}
                        </h3>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-white/40 font-body font-light text-sm leading-relaxed
                      group-hover:text-white/60 transition-colors duration-500">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
