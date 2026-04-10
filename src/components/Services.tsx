import { motion } from 'framer-motion';
import { Bot, Globe, Paintbrush, ArrowUpRight } from 'lucide-react';

// ─── Services data ────────────────────────────────────────────
const services = [
  {
    icon: Bot,
    title: 'AI Workflow Automation',
    description:
      'I connect your CRM, messaging channels, and data sources into one intelligent pipeline. Leads scored, clients notified, follow-ups sent — automatically.',
    tools: ['n8n', 'GPT-4', 'HubSpot', 'Slack', 'Telegram', 'WhatsApp'],
  },
  {
    icon: Globe,
    title: 'AI-Powered Web Apps',
    description:
      "Custom Next.js applications with AI built in — quote calculators, booking systems, client portals. Fast, clean, and yours to keep.",
    tools: ['Next.js', 'Supabase', 'Stripe', 'Tailwind', 'Claude API'],
  },
  {
    icon: Paintbrush,
    title: 'Premium Landing Pages',
    description:
      "High-conversion landing pages with premium animations for businesses that want to look as serious as they are.",
    tools: ['Next.js', 'GSAP', 'Lenis', 'Framer Motion', 'Tailwind'],
  },
];

// ─── Section animation variants ───────────────────────────────
const sectionFade = {
  initial: { opacity: 0, y: 40, filter: 'blur(8px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-80px' as const },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

// ─── Services ─────────────────────────────────────────────────
export function Services() {
  return (
    <section id="services" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        {/* Section header */}
        <motion.div {...sectionFade} className="mb-16">
          <div className="liquid-glass rounded-full px-3.5 py-1 inline-block mb-6">
            <span className="text-xs font-body font-medium text-white/70">Services</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
            What I Build
          </h2>
        </motion.div>

        {/* Cards — alternating layout */}
        <div className="space-y-6">
          {services.map((service, i) => {
            const Icon = service.icon;
            const isReversed = i % 2 !== 0;

            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                }}
                className={`liquid-glass rounded-2xl p-8 sm:p-10 lg:p-12
                  glass-card-hover
                  flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-16 items-start
                  group cursor-default`}
              >
                {/* Content side */}
                <div className={`flex-1 space-y-5 ${isReversed ? 'lg:text-right' : ''}`}>
                  {/* Icon */}
                  <div className={`liquid-glass-strong rounded-full w-11 h-11 flex items-center justify-center
                    ${isReversed ? 'lg:ml-auto' : ''}
                    icon-hover`}>
                    <Icon size={18} className="text-white/70 group-hover:text-white transition-colors duration-400" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl font-heading italic text-white tracking-tight">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/50 font-body font-light text-sm md:text-base leading-relaxed max-w-lg">
                    {service.description}
                  </p>

                  {/* Tools */}
                  <div className={`flex flex-wrap gap-2 pt-3 ${isReversed ? 'lg:justify-end' : ''}`}>
                    {service.tools.map((tool) => (
                      <span
                        key={tool}
                        className="liquid-glass rounded-full px-3 py-1 text-[11px] font-body font-light text-white/40 tracking-wide
                          tag-hover cursor-default"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Visual side — decorative card */}
                <div className="w-full lg:w-[340px] xl:w-[400px] shrink-0">
                  <div className="liquid-glass rounded-2xl p-6 aspect-[4/3] flex flex-col justify-between
                    glass-card-hover group/visual">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-body font-light text-white/30 uppercase tracking-widest">
                        {service.tools[0]} Pipeline
                      </span>
                      <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    </div>
                    <div>
                      <div className="text-3xl font-heading italic text-white/80
                        group-hover/visual:text-white transition-colors duration-500">
                        {i === 0 && '10s Response'}
                        {i === 1 && 'Full Stack'}
                        {i === 2 && 'High Conv.'}
                      </div>
                      <div className="text-xs font-body font-light text-white/30 mt-1">
                        Automated workflow active
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-white/30 group-hover/visual:text-white/60 transition-colors duration-300">
                      <ArrowUpRight size={14} className="transition-transform duration-300 group-hover/visual:translate-x-0.5 group-hover/visual:-translate-y-0.5" />
                      <span className="text-[11px] font-body">View details</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
