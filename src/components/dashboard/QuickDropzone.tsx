'use client';

import React from 'react';
import { Dropzone } from '@/components/upload/Dropzone';
import { useDocuments } from '@/context/DocumentContext';
import { UploadQueue } from '@/components/upload/UploadQueue';

export function QuickDropzone() {
  const { handleUploadFiles, uploadQueue, cancelUpload, retryUpload, removeQueueItem } = useDocuments();

  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">Quick Document Ingestion</h3>
          <p className="text-xs text-slate-400 mt-0.5">Drag files anywhere or drop below to begin instant processing</p>
        </div>
      </div>
      <Dropzone onFilesSelected={handleUploadFiles} compact={false} />
      {uploadQueue.length > 0 && (
        <UploadQueue
          items={uploadQueue}
          onCancel={cancelUpload}
          onRetry={retryUpload}
          onRemove={removeQueueItem}
        />
      )}
    </div>
  );
}
