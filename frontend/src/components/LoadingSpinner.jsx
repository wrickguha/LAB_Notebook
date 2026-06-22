import React from 'react';

export default function LoadingSpinner({ fullPage = false, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }[size] || 'w-8 h-8 border-3';

  const spinnerContent = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`rounded-full border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin ${sizeClasses} border-white/10`} />
      <span className="text-xs text-slate-400 font-medium tracking-wide">Syncing data...</span>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
        {spinnerContent}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8 w-full min-h-[150px]">
      {spinnerContent}
    </div>
  );
}
