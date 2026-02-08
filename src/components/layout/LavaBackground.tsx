'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export function LavaBackground() {
  const { scrollY } = useScroll();
  const [windowHeight, setWindowHeight] = useState(1000);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
  }, []);

  // Map scroll to movement speed/position
  // When scrolling down, blobs move faster or shift position
  const y1 = useTransform(scrollY, [0, windowHeight], [0, -200]);
  const y2 = useTransform(scrollY, [0, windowHeight], [0, 100]);
  const y3 = useTransform(scrollY, [0, windowHeight], [0, -150]);
  
  const rotate1 = useTransform(scrollY, [0, windowHeight * 5], [0, 360]);
  const rotate2 = useTransform(scrollY, [0, windowHeight * 5], [360, 0]);

  // Smooth out the scroll values
  const smoothY1 = useSpring(y1, { stiffness: 100, damping: 30 });
  const smoothY2 = useSpring(y2, { stiffness: 100, damping: 30 });
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-50 pointer-events-none">
      {/* Blob 1: Purple/Indigo */}
      <motion.div
        style={{ y: smoothY1, rotate: rotate1 }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
      />

      {/* Blob 2: Pink/Rose */}
      <motion.div
        style={{ y: smoothY2, rotate: rotate2 }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute top-[10%] -right-[10%] w-[60vw] h-[60vw] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
      />

      {/* Blob 3: Blue/Cyan (Bottom) */}
      <motion.div
        style={{ y: y3 }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 50, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute -bottom-[20%] left-[20%] w-[80vw] h-[80vw] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
      />
      
      {/* Noise Texture for "Lava" feel */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')]" />
    </div>
  );
}
