import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

// ─── Contact info ─────────────────────────────────────────────
const contactDetails = [
  {
    icon: Mail,
    label: 'Email',
    value: 'muhummadzarrar09@gmail.com',
    href: 'mailto:muhummadzarrar09@gmail.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+92 333 5666050',
    href: 'tel:+923335666050',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Rawalpindi, Pakistan',
    href: null,
  },
  {
    icon: Clock,
    label: 'Availability',
    value: 'Open to freelance projects',
    href: null,
  },
];

// ─── Helpers ──────────────────────────────────────────────────
const RECIPIENT = 'muhummadzarrar09@gmail.com';

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

function validate(name: string, email: string, message: string): FormErrors {
  const errors: FormErrors = {};
  if (!name.trim()) errors.name = 'Name is required';
  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email';
  }
  if (!message.trim()) errors.message = 'Message is required';
  else if (message.trim().length < 10) errors.message = 'At least 10 characters';
  return errors;
}

function buildMailto(name: string, email: string, message: string): string {
  const subject = `Project Inquiry from ${name}`;
  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    '',
    '---',
    '',
    message,
    '',
    '---',
    `Sent from muhammadzarrar.com`,
  ].join('\n');

  const params = new URLSearchParams({
    subject,
    body,
    from: email,
  });

  return `mailto:${RECIPIENT}?${params.toString()}`;
}

// ─── Contact ──────────────────────────────────────────────────
export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validate
    const found = validate(name, email, message);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    setErrors({});
    setStatus('sending');

    // Build and open mailto link — triggers default email client
    const mailtoUrl = buildMailto(name, email, message);

    // Small delay so user sees "Opening..." state
    setTimeout(() => {
      try {
        window.location.href = mailtoUrl;
        setStatus('sent');
        // Reset form after a beat
        setTimeout(() => {
          setName('');
          setEmail('');
          setMessage('');
          setStatus('idle');
        }, 4000);
      } catch {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    }, 600);
  };

  const inputBase = `w-full bg-white/[0.03] border rounded-xl px-4 py-3 text-sm text-white font-body
    placeholder:text-white/15
    focus:outline-none focus:border-white/25 focus:bg-white/[0.05] focus:shadow-[0_0_24px_rgba(255,255,255,0.04)]
    hover:border-white/[0.12] hover:bg-white/[0.04]
    transition-all duration-300`;

  const inputError = 'border-red-400/40 focus:border-red-400/60';

  return (
    <section id="contact" className="relative py-24 sm:py-32">
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
            <span className="text-xs font-body font-medium text-white/70">Contact</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
            Let&apos;s Build Something
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left — Info */}
          <motion.div
            initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="space-y-8"
          >
            <p className="text-white/50 font-body font-light text-base sm:text-lg leading-relaxed max-w-md">
              Got a process that wastes your team&apos;s time? I&apos;ll
              automate it. Got a website that doesn&apos;t convert? I&apos;ll
              rebuild it. Let&apos;s talk.
            </p>

            <div className="w-full h-px bg-white/[0.06]" />

            <div className="space-y-2">
              {contactDetails.map((detail, i) => {
                const Icon = detail.icon;
                const content = (
                  <div className="flex items-center gap-4 group/detail">
                    <div className="liquid-glass-strong rounded-full w-10 h-10 flex items-center justify-center shrink-0
                      icon-hover">
                      <Icon size={15} className="text-white/50 group-hover/detail:text-white transition-colors duration-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-body font-light text-white/25 uppercase tracking-widest mb-0.5">
                        {detail.label}
                      </div>
                      <div
                        className={`text-sm font-body ${
                          detail.href
                            ? 'text-white/60 group-hover/detail:text-white transition-colors duration-300'
                            : 'text-white/40 font-light'
                        }`}
                      >
                        {detail.value}
                      </div>
                    </div>
                  </div>
                );

                const wrapperClass = `block p-3 -mx-3 rounded-xl
                  hover:bg-white/[0.04] active:bg-white/[0.06]
                  transition-all duration-300 cursor-default`;

                if (detail.href) {
                  return (
                    <motion.a
                      key={detail.label}
                      href={detail.href}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className={`${wrapperClass} cursor-cta`}
                    >
                      {content}
                    </motion.a>
                  );
                }
                return (
                  <motion.div
                    key={detail.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className={wrapperClass}
                  >
                    {content}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            <form
              onSubmit={handleSubmit}
              noValidate
              className="liquid-glass rounded-2xl p-8 sm:p-10 space-y-5"
            >
              {/* Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="text-[10px] font-body font-light text-white/25 uppercase tracking-widest"
                >
                  Name
                </label>
                <input
                  id="name"
                  placeholder="Your name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: undefined })); }}
                  className={`${inputBase} ${errors.name ? inputError : 'border-white/[0.08]'}`}
                />
                <AnimatePresence>
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -4, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -4, height: 0 }}
                      className="text-red-400/80 text-[11px] font-body flex items-center gap-1 pt-0.5"
                    >
                      <AlertCircle size={11} />
                      {errors.name}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-[10px] font-body font-light text-white/25 uppercase tracking-widest"
                >
                  Email
                </label>
                <input
                  id="email"
                  placeholder="you@company.com"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: undefined })); }}
                  className={`${inputBase} ${errors.email ? inputError : 'border-white/[0.08]'}`}
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -4, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -4, height: 0 }}
                      className="text-red-400/80 text-[11px] font-body flex items-center gap-1 pt-0.5"
                    >
                      <AlertCircle size={11} />
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label
                  htmlFor="message"
                  className="text-[10px] font-body font-light text-white/25 uppercase tracking-widest"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="Tell me about your project..."
                  rows={5}
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); if (errors.message) setErrors((p) => ({ ...p, message: undefined })); }}
                  className={`${inputBase} min-h-[120px] resize-none ${errors.message ? inputError : 'border-white/[0.08]'}`}
                />
                <AnimatePresence>
                  {errors.message && (
                    <motion.p
                      initial={{ opacity: 0, y: -4, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -4, height: 0 }}
                      className="text-red-400/80 text-[11px] font-body flex items-center gap-1 pt-0.5"
                    >
                      <AlertCircle size={11} />
                      {errors.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={status === 'sending' || status === 'sent'}
                className={`
                  cursor-cta w-full mt-2
                  rounded-full px-6 py-3.5
                  text-sm font-body font-medium
                  flex items-center justify-center gap-2
                  btn-glass-hover
                  transition-all duration-300
                  ${status === 'sent'
                    ? 'bg-[#00FF94]/15 text-[#00FF94]'
                    : status === 'sending'
                      ? 'bg-white/[0.06] text-white/60'
                      : status === 'error'
                        ? 'bg-red-400/10 text-red-400'
                        : 'liquid-glass-strong text-white'
                  }
                `}
              >
                {status === 'idle' && (
                  <>
                    Send Message
                    <Send size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </>
                )}
                {status === 'sending' && (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Opening Email Client…
                  </>
                )}
                {status === 'sent' && (
                  <>
                    <CheckCircle size={16} />
                    Email Client Opened
                  </>
                )}
                {status === 'error' && (
                  <>
                    <AlertCircle size={16} />
                    Something went wrong
                  </>
                )}
              </button>

              {/* Helper text */}
              <AnimatePresence>
                {status === 'idle' && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] font-body font-light text-white/20 text-center flex items-center justify-center gap-1"
                  >
                    <ExternalLink size={9} />
                    Opens your default email client — Gmail, Outlook, Apple Mail, etc.
                  </motion.p>
                )}
                {status === 'sent' && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] font-body font-light text-[#00FF94]/40 text-center flex items-center justify-center gap-1"
                  >
                    <CheckCircle size={9} />
                    Draft pre-filled with your message. Just hit send in your email app.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
