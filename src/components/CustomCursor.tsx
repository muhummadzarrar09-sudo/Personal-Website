import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// ─── Custom Cursor ──────────────────────────────────────────
// A smooth circular ring + dot that follows the mouse globally.
// Ring scales up on hover over interactive elements.
// Hidden on touch devices automatically.

const INTERACTIVE_SELECTOR =
  'a, button, [data-cursor="pointer"], input, textarea, select, [role="button"], .cursor-cta';

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [isTouch, setIsTouch] = useState(true);
  const hoveringRef = useRef(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring for outer ring (lag behind)
  const ringX = useSpring(mouseX, { stiffness: 180, damping: 22, mass: 0.6 });
  const ringY = useSpring(mouseY, { stiffness: 180, damping: 22, mass: 0.6 });

  // Tighter spring for inner dot (snappier)
  const dotX = useSpring(mouseX, { stiffness: 600, damping: 30, mass: 0.15 });
  const dotY = useSpring(mouseY, { stiffness: 600, damping: 30, mass: 0.15 });

  // ── Mouse tracking ─────────────────────────────────────
  useEffect(() => {
    const onFirstMove = (e: MouseEvent) => {
      setIsTouch(false);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);
      window.removeEventListener('mousemove', onFirstMove);
    };
    window.addEventListener('mousemove', onFirstMove);

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('mousemove', onFirstMove);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
    };
  }, [mouseX, mouseY]);

  // ── Hover detection ────────────────────────────────────
  useEffect(() => {
    const checkTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      return !!target.closest(INTERACTIVE_SELECTOR);
    };

    const onOver = (e: MouseEvent) => {
      if (checkTarget(e.target)) {
        hoveringRef.current = true;
        setHovering(true);
      }
    };
    const onOut = (e: MouseEvent) => {
      if (checkTarget(e.target)) {
        hoveringRef.current = false;
        setHovering(false);
      }
    };

    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    return () => {
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, []);

  if (isTouch) return null;

  const ringSize = clicking ? 20 : hovering ? 52 : 28;
  const dotSize = clicking ? 3 : hovering ? 5 : 3;

  return (
    <>
      {/* ── Outer ring ────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          width: { type: 'spring', stiffness: 350, damping: 22 },
          height: { type: 'spring', stiffness: 350, damping: 22 },
          opacity: { duration: 0.15 },
        }}
      >
        <div
          className="w-full h-full rounded-full transition-colors duration-300"
          style={{
            border: `${hovering ? 1.5 : 1}px solid ${hovering ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)'}`,
            boxShadow: hovering ? '0 0 15px rgba(255,255,255,0.06)' : 'none',
          }}
        />
      </motion.div>

      {/* ── Inner dot ─────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: dotSize,
          height: dotSize,
          opacity: visible ? (hovering ? 1 : 0.7) : 0,
        }}
        transition={{
          width: { type: 'spring', stiffness: 500, damping: 25 },
          height: { type: 'spring', stiffness: 500, damping: 25 },
          opacity: { duration: 0.12 },
        }}
      >
        <div className="w-full h-full rounded-full bg-white" />
      </motion.div>
    </>
  );
}
