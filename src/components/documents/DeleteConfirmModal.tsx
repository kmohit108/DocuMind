'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { DocumentItem } from '@/types';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => Promise<boolean>;
}

export function DeleteConfirmModal({
  document,
  isOpen,
  onClose,
  onDelete,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!document) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      const ok = await onDelete(document.id);
      if (ok) {
        onClose();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="sm"
    >
      <div className="text-center sm:text-left">
        <div className="mx-auto sm:mx-0 w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-white tracking-tight">Delete Document</h3>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          Are you sure you want to permanently delete <strong className="text-slate-200 font-semibold">"{document.name}"</strong>? This will remove all AI summaries, extracted text, and chat history.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            isLoading={isDeleting}
            leftIcon={<Trash2 className="w-4 h-4" />}
            onClick={handleConfirm}
            className="w-full sm:w-auto"
          >
            Delete Permanently
          </Button>
        </div>
      </div>
    </Modal>
  );
}
