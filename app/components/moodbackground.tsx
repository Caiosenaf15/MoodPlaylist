"use client";

import { motion } from 'framer-motion';

interface MoodBackgroundProps {
  cores: string[];
}

export default function MoodBackground({ cores }: MoodBackgroundProps) {
  const [c1, c2, c3] = [
    cores[0] ?? '#3b82f6',
    cores[1] ?? cores[0] ?? '#8b5cf6',
    cores[2] ?? cores[0] ?? '#ec4899',
  ];

  return (
    <motion.div
      className="fixed inset-0 -z-10 overflow-hidden bg-slate-950"
      animate={{
        filter: [
          'hue-rotate(0deg) saturate(1)',
          'hue-rotate(35deg) saturate(1.3)',
          'hue-rotate(-30deg) saturate(1.1)',
          'hue-rotate(20deg) saturate(1.2)',
          'hue-rotate(0deg) saturate(1)',
        ],
      }}
      transition={{
        duration: 14,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <motion.div
        className="absolute w-[42vw] h-[42vw] rounded-full blur-[110px]"
        style={{ top: '5%', left: '10%' }}
        animate={{
          backgroundColor: [c1, c2, c3, c1],
          x: [0, 80, -40, 0],
          y: [0, 60, 100, 0],
          scale: [1, 1.25, 0.9, 1],
          opacity: [0.4, 0.55, 0.35, 0.4],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute w-[36vw] h-[36vw] rounded-full blur-[110px]"
        style={{ top: '40%', right: '8%' }}
        animate={{
          backgroundColor: [c2, c3, c1, c2],
          x: [0, -70, 30, 0],
          y: [0, 80, -50, 0],
          scale: [1, 0.85, 1.3, 1],
          opacity: [0.35, 0.5, 0.3, 0.35],
        }}
        transition={{
          duration: 21,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute w-[34vw] h-[34vw] rounded-full blur-[110px]"
        style={{ bottom: '5%', left: '30%' }}
        animate={{
          backgroundColor: [c3, c1, c2, c3],
          x: [0, 60, -80, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.2, 0.9, 1],
          opacity: [0.3, 0.45, 0.28, 0.3],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="absolute inset-0 bg-slate-950/10" />
    </motion.div>
  );
}