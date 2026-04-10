import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
}

export function BlurText({
  text,
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'bottom',
}: BlurTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const directionOffset = direction === 'bottom' ? 40 : -40;
  const midY = directionOffset > 0 ? -5 : 5;

  return (
    <p
      ref={ref}
      className={className}
      style={{ lineHeight: 'inherit' }}
    >
      {elements.map((segment, index) => (
        <motion.span
          key={index}
          initial={{
            filter: 'blur(10px)',
            opacity: 0,
            y: directionOffset,
          }}
          animate={
            isInView
              ? {
                  filter: ['blur(10px)', 'blur(5px)', 'blur(0px)'],
                  opacity: [0, 0.5, 1],
                  y: [directionOffset, midY, 0],
                }
              : {
                  filter: 'blur(10px)',
                  opacity: 0,
                  y: directionOffset,
                }
          }
          transition={{
            duration: 1.05,
            delay: index * (delay / 1000),
            ease: 'easeOut',
          }}
          className="inline-block"
          style={{
            verticalAlign: 'baseline',
            willChange: 'filter, opacity, transform',
          }}
        >
          {segment === ' ' ? '\u00A0' : segment}
          {animateBy === 'words' && index < elements.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </p>
  );
}
