'use client';

import React from 'react';
import { UploadQueueItem } from '@/types';
import { storageService } from '@/services/storageService';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCw,
  X,
  Loader2,
} from 'lucide-react';

interface UploadQueueProps {
  items: UploadQueueItem[];
  onCancel: (id: string) => void;
  onRetry: (id: string) => void;
  onRemove: (id: string) => void;
}

export function UploadQueue({ items, onCancel, onRetry, onRemove }: UploadQueueProps) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-2 mt-4 max-h-60 overflow-y-auto pr-1">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
        <span>Upload Queue ({items.length})</span>
        <span>Status</span>
      </div>

      {items.map((item) => {
        const isReady = item.status === 'ready';
        const isFailed = item.status === 'failed';
        const isUploading = item.status === 'uploading' || item.status === 'processing';

        return (
          <div
            key={item.id}
            className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2 transition-all"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-200 truncate">{item.name}</p>
                  <p className="text-[10px] text-slate-400">
                    {storageService.formatBytes(item.size)} • {item.type.toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Status Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {isReady && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Ready</span>
                  </span>
                )}

                {isFailed && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{item.errorMessage || 'Failed'}</span>
                    </span>
                    <button
                      onClick={() => onRetry(item.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Retry Upload"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {isUploading && (
                  <div className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                    <span className="text-[11px] font-medium text-indigo-300">
                      {item.progress}%
                    </span>
                    <button
                      onClick={() => onCancel(item.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Cancel Upload"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {(isReady || isFailed) && (
                  <button
                    onClick={() => onRemove(item.id)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                    title="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Progress Bar for In-Flight Items */}
            {isUploading && (
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
