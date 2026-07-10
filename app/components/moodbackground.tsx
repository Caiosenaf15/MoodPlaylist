"use client";

import { motion } from 'framer-motion';

interface MoodBackgroundProps {
  cores: string[];
}

export default function MoodBackground({ cores }: MoodBackgroundProps) {
  // Garante 3 cores mesmo que venham menos, repetindo a última como fallback
  const [c1, c2, c3] = [
    cores[0] ?? '#3b82f6',
    cores[1] ?? cores[0] ?? '#8b5cf6',
    cores[2] ?? cores[0] ?? '#ec4899',
  ];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-950">
      <motion.div
        className="absolute w-[38vw] h-[38vw] rounded-full blur-[100px] opacity-40"
        style={{ backgroundColor: c1, top: '5%', left: '10%' }}
        animate={{
          x: [0, 60, -30, 0],
          y: [0, 40, 80, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute w-[32vw] h-[32vw] rounded-full blur-[100px] opacity-35"
        style={{ backgroundColor: c2, top: '40%', right: '8%' }}
        animate={{
          x: [0, -50, 20, 0],
          y: [0, 60, -40, 0],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute w-[30vw] h-[30vw] rounded-full blur-[100px] opacity-30"
        style={{ backgroundColor: c3, bottom: '5%', left: '30%' }}
        animate={{
          x: [0, 40, -60, 0],
          y: [0, -50, 30, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Camada escura por cima, pra garantir contraste e legibilidade do texto */}
      <div className="absolute inset-0 bg-slate-950/40" />
    </div>
  );
}