import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert } from 'lucide-react';

interface InstructionBannerProps {
  message: string;
  duration?: number;
}

export default function InstructionBanner({ message, duration = 3000 }: InstructionBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  return (
    <AnimatePresence>
      {visible && message && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9, x: '-50%' }}
          animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
          exit={{ opacity: 0, y: -20, scale: 0.9, x: '-50%' }}
          className="fixed top-6 left-1/2 z-50 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-900 font-extrabold px-6 py-3 rounded-full shadow-2xl shadow-yellow-500/20 flex items-center gap-2.5 border-2 border-slate-950 font-sans tracking-wide text-xs sm:text-sm uppercase select-none pointer-events-none"
        >
          <span className="text-xl animate-bounce">⚽</span>
          <span className="drop-shadow-sm">{message}</span>
          <span className="text-xl animate-bounce" style={{ animationDelay: '0.15s' }}>📢</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
