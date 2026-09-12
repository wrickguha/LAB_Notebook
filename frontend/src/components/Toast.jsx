import React, { useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Info, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: {
      bg: 'bg-slate-900/95 border-teal-500/40 text-slate-100',
      icon: <CheckCircle2 className="w-4.5 h-4.5 text-teal-400 shrink-0" />,
      accent: 'bg-teal-500',
      badge: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
      label: 'SYSTEM CONFIRMED'
    },
    error: {
      bg: 'bg-slate-900/95 border-rose-500/40 text-slate-100',
      icon: <AlertCircle className="w-4.5 h-4.5 text-rose-400 shrink-0" />,
      accent: 'bg-rose-500',
      badge: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      label: 'ACTION REQUIRED'
    },
    info: {
      bg: 'bg-slate-900/95 border-sky-500/40 text-slate-100',
      icon: <Info className="w-4.5 h-4.5 text-sky-400 shrink-0" />,
      accent: 'bg-sky-500',
      badge: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
      label: 'NOTIFICATION'
    },
  }[type] || {
    bg: 'bg-slate-900/95 border-slate-700 text-slate-100',
    icon: <Info className="w-4.5 h-4.5 text-slate-400 shrink-0" />,
    accent: 'bg-teal-500',
    badge: 'text-slate-400 bg-slate-800 border-slate-700',
    label: 'SYSTEM'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed bottom-5 right-5 z-50 flex flex-col max-w-sm w-full shadow-2xl rounded-2xl border backdrop-blur-xl overflow-hidden ${config.bg}`}
    >
      <div className="flex items-start p-3.5 gap-3">
        <div className="mt-0.5">{config.icon}</div>
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[9px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded border ${config.badge}`}>
              {config.label}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">21-CFR-11</span>
          </div>
          <p className="text-xs font-medium text-slate-200 leading-snug">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex-shrink-0 rounded-lg p-1 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress timer bar */}
      <div className="h-0.5 w-full bg-slate-800/80 overflow-hidden">
        <div className={`h-full ${config.accent} animate-toast-progress`} />
      </div>
    </motion.div>
  );
}
