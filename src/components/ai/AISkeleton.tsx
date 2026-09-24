import React from 'react';

export function AISkeleton() {
  return (
    <div className="space-y-4 animate-pulse p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-indigo-500/20" />
        <div className="h-4 w-36 bg-slate-800 rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-slate-800/80 rounded" />
        <div className="h-3 w-5/6 bg-slate-800/80 rounded" />
        <div className="h-3 w-4/6 bg-slate-800/80 rounded" />
      </div>
      <div className="pt-2 space-y-1.5">
        <div className="h-3 w-28 bg-slate-800/60 rounded" />
        <div className="h-3 w-3/4 bg-slate-800/60 rounded" />
        <div className="h-3 w-2/3 bg-slate-800/60 rounded" />
      </div>
    </div>
  );
}
