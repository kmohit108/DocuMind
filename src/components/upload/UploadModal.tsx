'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Dropzone } from './Dropzone';
import { UploadQueue } from './UploadQueue';
import { useDocuments } from '@/context/DocumentContext';

export function UploadModal() {
  const {
    isUploadModalOpen,
    setIsUploadModalOpen,
    handleUploadFiles,
    uploadQueue,
    cancelUpload,
    retryUpload,
    removeQueueItem,
  } = useDocuments();

  return (
    <Modal
      isOpen={isUploadModalOpen}
      onClose={() => setIsUploadModalOpen(false)}
      title="Upload Documents"
      description="Upload files to analyze with AI, extract insights, and query in real-time."
      maxWidth="lg"
    >
      <div className="space-y-4">
        <Dropzone onFilesSelected={handleUploadFiles} />
        <UploadQueue
          items={uploadQueue}
          onCancel={cancelUpload}
          onRetry={retryUpload}
          onRemove={removeQueueItem}
        />
      </div>
    </Modal>
  );
}
