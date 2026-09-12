import React from 'react';

export default function LoadingSpinner({ fullPage = false, size = 'md', label = 'Syncing research telemetry...' }) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-[2.5px]',
    lg: 'w-12 h-12 border-3',
  }[size] || 'w-8 h-8 border-[2.5px]';

  const spinnerContent = (
    <div className="flex flex-col items-center justify-center gap-3.5">
      <div className="relative flex items-center justify-center">
        {/* Ambient bioluminescent glow */}
        <div className="absolute w-12 h-12 rounded-full bg-teal-500/15 blur-md animate-pulse" />
        {/* Outer rotating ring */}
        <div className={`rounded-full border-teal-600 border-t-transparent border-r-transparent animate-spin ${sizeClasses} ring-1 ring-teal-500/20`} />
      </div>
      <span className="text-xs text-slate-500 font-medium tracking-wide flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping" />
        {label}
      </span>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md">
        <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-2xl">
          {spinnerContent}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8 w-full min-h-[160px]">
      {spinnerContent}
    </div>
  );
}
