import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

// ─── Projects data ────────────────────────────────────────────
const projects = [
  {
    name: 'AI Sales Command Center',
    description:
      'Full lead automation pipeline — form submission triggers GPT-4 scoring, HubSpot CRM update, and simultaneous Slack + Gmail + Telegram notifications in under 10 seconds.',
    stack: ['n8n', 'GPT-4', 'HubSpot', 'Google Sheets', 'Slack', 'Gmail', 'Telegram'],
    tag: 'AUTOMATION',
    accent: '#00FF94',
  },
  {
    name: 'SolarPeak Energy Solutions',
    description:
      'Premium dark/gold luxury landing page for a Pakistani solar company — animated hero, GSAP scroll effects, Lenis smooth scroll, mobile responsive.',
    stack: ['Next.js', 'GSAP', 'Lenis', 'Tailwind', 'AOS'],
    tag: 'WEB DESIGN',
    accent: '#F5A623',
  },
  {
    name: 'Instant Quote Calculator',
    description:
      'Webhook-triggered quote pipeline — client fills form, Supabase stores the record, Stripe processes payment, confirmation email fires automatically. Scalable to any business niche.',
    stack: ['Next.js', 'Supabase', 'Stripe', 'Webhooks', 'Email'],
    tag: 'FULL STACK',
    accent: '#00FF94',
  },
];

// ─── Projects ─────────────────────────────────────────────────
export function Projects() {
  return (
    <section id="projects" className="relative py-24 sm:py-32">
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
            <span className="text-xs font-body font-medium text-white/70">Work</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
            Recent Builds
          </h2>
        </motion.div>

        {/* Project cards */}
        <div className="space-y-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.7,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
              }}
            >
              <div className="liquid-glass rounded-2xl p-8 sm:p-10 lg:p-12 group
                glass-card-hover cursor-default">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-10">
                  {/* Left content */}
                  <div className="flex-1 space-y-5">
                    {/* Tag + LIVE badge */}
                    <div className="flex items-center gap-3">
                      <span className="liquid-glass rounded-full px-3 py-1 text-[11px] font-body font-light text-white/50 uppercase tracking-widest
                        tag-hover">
                        {project.tag}
                      </span>
                      <span className="liquid-glass rounded-full px-3 py-1 text-[11px] font-body font-medium text-white/80 flex items-center gap-1.5
                        tag-hover">
                        <span
                          className="w-1.5 h-1.5 rounded-full animate-pulse"
                          style={{ backgroundColor: project.accent }}
                        />
                        LIVE
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-heading italic text-white/90 tracking-tight
                      group-hover:text-white transition-colors duration-500">
                      {project.name}
                    </h3>

                    {/* Description */}
                    <p className="text-white/40 font-body font-light text-sm sm:text-base leading-relaxed max-w-2xl
                      group-hover:text-white/60 transition-colors duration-500">
                      {project.description}
                    </p>

                    {/* Stack tags */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="liquid-glass rounded-full px-3 py-1 text-[11px] font-body font-light text-white/35 tracking-wide
                            tag-hover"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* View button */}
                  <div className="shrink-0 flex items-start pt-2">
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="
                        cursor-cta inline-flex items-center gap-2
                        liquid-glass-strong rounded-full
                        px-5 py-3
                        text-sm font-body font-medium text-white
                        btn-glass-hover
                        group/btn
                      "
                    >
                      View Project
                      <ArrowUpRight
                        size={15}
                        className="transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
