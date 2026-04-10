import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

// ─── 3D Particle "MZ" Text ─────────────────────────────────
function MZParticles({ pulseActive, exiting }: { pulseActive: boolean; exiting: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const glowRef = useRef<THREE.Points>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const clockRef = useRef(0);
  const pulseClockRef = useRef(0);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const glowMaterialRef = useRef<THREE.PointsMaterial>(null);
  const ringMat1Ref = useRef<THREE.MeshBasicMaterial>(null);
  const ringMat2Ref = useRef<THREE.MeshBasicMaterial>(null);

  // Create canvas texture for soft circular particles
  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.3, 'rgba(255,255,255,0.6)');
    gradient.addColorStop(0.7, 'rgba(255,255,255,0.1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Generate particle positions from text
  const { mainPositions, originalPositions, glowPositions } = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 256, 128);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 100px Syne, Instrument Serif, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('MZ', 128, 68);

    const imageData = ctx.getImageData(0, 0, 256, 128);
    const pos: number[] = [];
    const sampling = 2;

    for (let y = 0; y < 128; y += sampling) {
      for (let x = 0; x < 256; x += sampling) {
        const i = (y * 256 + x) * 4;
        if (imageData.data[i] > 128) {
          pos.push(
            (x / 256 - 0.5) * 6,
            -(y / 128 - 0.5) * 3,
            (Math.random() - 0.5) * 0.3
          );
        }
      }
    }

    const arr = new Float32Array(pos);
    const origArr = new Float32Array(arr);

    return {
      mainPositions: arr,
      originalPositions: origArr,
      glowPositions: new Float32Array(arr.length),
    };
  }, []);

  // Scatter particles initially for the reveal animation
  const scatteredPositions = useMemo(() => {
    const arr = new Float32Array(mainPositions.length);
    for (let i = 0; i < mainPositions.length; i += 3) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 5;
      arr[i] = r * Math.sin(phi) * Math.cos(theta);
      arr[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [mainPositions]);

  useFrame((_, delta) => {
    if (!pointsRef.current || !groupRef.current) return;
    clockRef.current += delta;

    const t = Math.min(clockRef.current / 2.0, 1); // 2 seconds to assemble
    const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic

    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

    // ─── Pulse animation ───
    if (pulseActive) {
      pulseClockRef.current += delta;
      const pt = pulseClockRef.current;

      let pulseScale = 1;
      let glowBoost = 0;

      if (pt < 0.4) {
        // Quick expand — the "probe"
        const p = pt / 0.4;
        const eased = 1 - Math.pow(1 - p, 2);
        pulseScale = 1 + eased * 0.18;
        glowBoost = eased;
      } else if (pt < 0.8) {
        // Snap back with overshoot
        const p = (pt - 0.4) / 0.4;
        const eased = 1 - Math.pow(1 - p, 3);
        pulseScale = 1.18 - eased * 0.22;
        glowBoost = 1 - eased;
      } else {
        // Settle
        const p = Math.min((pt - 0.8) / 0.3, 1);
        pulseScale = 0.96 + p * 0.04;
        glowBoost = 0;
      }

      // When exiting, blend into a slow zoom
      if (exiting) {
        pulseClockRef.current += delta; // double-time the clock
        const exitProgress = Math.min((pt - 1.1) / 1.2, 1);
        if (exitProgress > 0) {
          const exitEase = 1 - Math.pow(1 - exitProgress, 2);
          pulseScale = 1 + exitEase * 0.6; // smooth zoom beyond the probe
        }
      }

      groupRef.current.scale.setScalar(pulseScale);

      if (materialRef.current) {
        materialRef.current.opacity = 0.9 + glowBoost * 0.1;
      }
      if (glowMaterialRef.current) {
        glowMaterialRef.current.opacity = 0.15 + glowBoost * 0.45;
      }
      if (ringMat1Ref.current) {
        ringMat1Ref.current.opacity = 0.15 + glowBoost * 0.35;
      }
      if (ringMat2Ref.current) {
        ringMat2Ref.current.opacity = 0.08 + glowBoost * 0.2;
      }
    }

    // ─── Particle positions ───
    for (let i = 0; i < posArray.length; i += 3) {
      posArray[i] = scatteredPositions[i] + (originalPositions[i] - scatteredPositions[i]) * ease;
      posArray[i + 1] = scatteredPositions[i + 1] + (originalPositions[i + 1] - scatteredPositions[i + 1]) * ease;
      posArray[i + 2] = scatteredPositions[i + 2] + (originalPositions[i + 2] - scatteredPositions[i + 2]) * ease;

      if (t > 0.8) {
        const breathe = (t - 0.8) / 0.2;
        const idx = i / 3;
        posArray[i] += Math.sin(clockRef.current * 1.2 + idx * 0.1) * 0.015 * breathe;
        posArray[i + 1] += Math.cos(clockRef.current * 0.9 + idx * 0.15) * 0.015 * breathe;
        posArray[i + 2] += Math.sin(clockRef.current * 1.5 + idx * 0.08) * 0.01 * breathe;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Slow rotation
    pointsRef.current.rotation.y = Math.sin(clockRef.current * 0.3) * 0.15;
    pointsRef.current.rotation.x = Math.sin(clockRef.current * 0.2) * 0.05;

    // Glow layer follows
    if (glowRef.current) {
      glowRef.current.rotation.y = pointsRef.current.rotation.y;
      glowRef.current.rotation.x = pointsRef.current.rotation.x;
      const gPos = glowRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < gPos.length; i += 3) {
        gPos[i] = posArray[i] + (Math.random() - 0.5) * 0.02;
        gPos[i + 1] = posArray[i + 1] + (Math.random() - 0.5) * 0.02;
        gPos[i + 2] = posArray[i + 2] + (Math.random() - 0.5) * 0.02;
      }
      glowRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Rings
    if (ringRef.current) {
      ringRef.current.rotation.x = clockRef.current * 0.4;
      ringRef.current.rotation.z = clockRef.current * 0.15;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = clockRef.current * 0.3;
      ring2Ref.current.rotation.x = clockRef.current * 0.2 + 1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[mainPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={materialRef}
          size={0.035}
          map={particleTexture}
          transparent
          opacity={0.9}
          color="#ffffff"
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Glow layer — slightly larger, more transparent */}
      <points ref={glowRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[glowPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={glowMaterialRef}
          size={0.12}
          map={particleTexture}
          transparent
          opacity={0.15}
          color="#00FF94"
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Orbital ring 1 */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2.8, 0.008, 16, 100]} />
        <meshBasicMaterial ref={ringMat1Ref} color="#00FF94" transparent opacity={0.15} />
      </mesh>

      {/* Orbital ring 2 */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[3.3, 0.005, 16, 100]} />
        <meshBasicMaterial ref={ringMat2Ref} color="#F5A623" transparent opacity={0.08} />
      </mesh>

      {/* Ambient floating particles */}
      <AmbientParticles count={80} texture={particleTexture} />
    </group>
  );
}

// ─── Ambient floating particles ──────────────────────────────
function AmbientParticles({ count, texture }: { count: number; texture: THREE.CanvasTexture }) {
  const ref = useRef<THREE.Points>(null);
  const clockRef = useRef(0);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    clockRef.current += delta;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(clockRef.current + i) * 0.001;
      arr[i * 3] += Math.cos(clockRef.current * 0.7 + i * 0.5) * 0.0005;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        map={texture}
        transparent
        opacity={0.4}
        color="#ffffff"
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ─── Progress Bar Component ──────────────────────────────────
function ProgressBar({ progress, completed }: { progress: number; completed: boolean }) {
  return (
    <div className="w-48 sm:w-64 relative">
      <div className="h-[2px] bg-white/[0.08] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: completed
              ? 'linear-gradient(90deg, #00FF94, #00FF94)'
              : 'linear-gradient(90deg, #00FF94, #00FF94cc)',
            boxShadow: completed
              ? '0 0 20px rgba(0,255,148,0.8), 0 0 40px rgba(0,255,148,0.3)'
              : '0 0 12px rgba(0,255,148,0.4)',
          }}
          initial={{ width: '0%' }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: completed ? 0.2 : 0.3, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-[10px] text-white/30 font-body tracking-widest uppercase">
          {completed ? 'Ready' : 'Loading assets'}
        </span>
        <motion.span
          className="text-[10px] font-body tabular-nums"
          animate={{
            color: completed ? '#00FF94' : 'rgba(255,255,255,0.5)',
          }}
          transition={{ duration: 0.3 }}
        >
          {Math.round(progress)}%
        </motion.span>
      </div>
    </div>
  );
}

// ─── Main Loading Screen ─────────────────────────────────────
interface LoadingScreenProps {
  phase: 'loading' | 'revealing' | 'done';
  onReveal: () => void;
}

export function LoadingScreen({ phase, onReveal }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);
  const [internalPhase, setInternalPhase] = useState<
    'loading' | 'pulse' | 'exiting'
  >('loading');
  const hasTriggeredReveal = useRef(false);

  const triggerReveal = useCallback(() => {
    if (hasTriggeredReveal.current) return;
    hasTriggeredReveal.current = true;

    // Phase 1: Trigger the pulse (probe)
    setPulseActive(true);
    setInternalPhase('pulse');

    // Phase 2: After pulse plays, start the exit zoom + notify parent to reveal content
    setTimeout(() => {
      setInternalPhase('exiting');
      onReveal(); // Parent starts fading in content underneath us
    }, 1100);
  }, [onReveal]);

  // Progress simulation
  useEffect(() => {
    // Track font loading
    const checkFonts = async () => {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      setFontsLoaded(true);
    };
    checkFonts();

    let currentProgress = 0;
    const minimumDisplayTime = 3500;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const timeFactor = Math.min(elapsed / minimumDisplayTime, 1);

      if (timeFactor < 0.3) {
        currentProgress = (timeFactor / 0.3) * 45;
      } else if (timeFactor < 0.7) {
        currentProgress = 45 + ((timeFactor - 0.3) / 0.4) * 35;
      } else {
        currentProgress = 80 + ((timeFactor - 0.7) / 0.3) * 20;
      }

      if (!fontsLoaded && currentProgress > 90) {
        currentProgress = 90;
      }

      if (fontsLoaded && timeFactor >= 0.85) {
        currentProgress = 100;
      }

      setProgress(Math.min(Math.round(currentProgress), 100));

      if (currentProgress >= 100 && fontsLoaded) {
        clearInterval(interval);
        triggerReveal();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [fontsLoaded, triggerReveal]);

  // Safety timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgress(100);
      triggerReveal();
    }, 8000);
    return () => clearTimeout(timeout);
  }, [triggerReveal]);

  // Derive animation states from internalPhase
  const isExiting = internalPhase === 'exiting';

  // The loading screen opacity — smooth multi-keyframe exit
  const screenOpacity =
    phase === 'loading' && !isExiting
      ? 1
      : phase === 'loading' && isExiting
        ? 1 // Still fully visible during early exit
        : phase === 'revealing'
          ? 0 // Fading out as content fades in
          : 0;

  const screenScale =
    phase === 'loading' && !isExiting
      ? 1
      : isExiting || phase === 'revealing'
        ? 1.2 // Continuous zoom out
        : 1.2;

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="loading-screen"
          className="fixed inset-0 z-[9999] bg-[#0A0A0A] flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1, scale: 1 }}
          animate={{
            opacity: screenOpacity,
            scale: screenScale,
          }}
          transition={{
            opacity: {
              duration: phase === 'revealing' ? 1.4 : 0,
              ease: [0.16, 1, 0.3, 1],
            },
            scale: {
              duration: isExiting || phase === 'revealing' ? 1.8 : 0,
              ease: [0.16, 1, 0.3, 1],
            },
          }}
          style={{
            pointerEvents: phase === 'revealing' ? 'none' : 'auto',
            willChange: 'opacity, transform',
          }}
        >
          {/* Three.js Canvas */}
          <div className="absolute inset-0">
            <Canvas
              camera={{ position: [0, 0, 5], fov: 50 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: true }}
              style={{ background: 'transparent' }}
            >
              <ambientLight intensity={0.5} />
              <MZParticles pulseActive={pulseActive} exiting={isExiting} />
            </Canvas>
          </div>

          {/* Gradient overlay — vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 30%, #0A0A0A 75%)',
            }}
          />

          {/* Flash overlay on pulse */}
          <AnimatePresence>
            {pulseActive && internalPhase === 'pulse' && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at center, rgba(0,255,148,0.08) 0%, transparent 60%)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, times: [0, 0.3, 1], ease: 'easeOut' }}
              />
            )}
          </AnimatePresence>

          {/* Bottom UI — progress bar */}
          <motion.div
            className="absolute bottom-12 flex flex-col items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isExiting ? 0 : 1,
              y: isExiting ? -10 : 0,
            }}
            transition={{
              delay: 1.5,
              duration: 0.6,
              opacity: { duration: 0.4 },
            }}
          >
            <ProgressBar progress={progress} completed={progress >= 100} />
          </motion.div>

          {/* Subtle tagline */}
          <motion.p
            className="absolute bottom-28 text-white/20 text-[11px] tracking-[0.3em] uppercase font-body"
            animate={{
              opacity: isExiting ? 0 : 1,
            }}
            initial={{ opacity: 0 }}
            transition={{ delay: 2, duration: 1, opacity: { duration: 0.4 } }}
          >
            Automation Engineer · AI Workflow Developer
          </motion.p>

          {/* Corner accents */}
          <div className="absolute top-8 left-8 w-8 h-8 border-l border-t border-white/[0.08]" />
          <div className="absolute top-8 right-8 w-8 h-8 border-r border-t border-white/[0.08]" />
          <div className="absolute bottom-8 left-8 w-8 h-8 border-l border-b border-white/[0.08]" />
          <div className="absolute bottom-8 right-8 w-8 h-8 border-r border-b border-white/[0.08]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
