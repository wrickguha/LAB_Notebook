import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: {
      bg: 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200',
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
      bar: 'bg-emerald-500',
    },
    error: {
      bg: 'bg-rose-950/90 border-rose-500/30 text-rose-200',
      icon: <AlertCircle className="w-5 h-5 text-rose-400" />,
      bar: 'bg-rose-500',
    },
    info: {
      bg: 'bg-sky-950/90 border-sky-500/30 text-sky-200',
      icon: <Info className="w-5 h-5 text-sky-400" />,
      bar: 'bg-sky-500',
    },
  }[type] || {
    bg: 'bg-zinc-900 border-zinc-700 text-zinc-200',
    icon: <Info className="w-5 h-5 text-zinc-400" />,
    bar: 'bg-zinc-500',
  };

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex flex-col max-w-sm w-full shadow-2xl rounded-xl border backdrop-blur-md overflow-hidden animate-slide-in duration-300 ${styles.bg}`}>
      <div className="flex items-start p-4 gap-3">
        <div className="flex-shrink-0 mt-0.5">{styles.icon}</div>
        <div className="flex-1 text-sm font-medium pr-2 leading-relaxed">{message}</div>
        <button
          onClick={onClose}
          className="flex-shrink-0 rounded-lg p-1 hover:bg-white/10 transition-colors cursor-pointer text-white/40 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {/* Toast progress bar timer effect */}
      <div className="h-1 w-full bg-white/10">
        <div className={`h-full ${styles.bar} animate-toast-progress`} />
      </div>
    </div>
  );
}
