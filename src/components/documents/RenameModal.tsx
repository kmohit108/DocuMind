'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { DocumentItem } from '@/types';
import { Edit3 } from 'lucide-react';

interface RenameModalProps {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRename: (id: string, newName: string) => Promise<DocumentItem | null>;
}

export function RenameModal({ document, isOpen, onClose, onRename }: RenameModalProps) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (document) {
      setName(document.name);
      setError('');
    }
  }, [document, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!document) return;

    const trimmed = name.trim();
    if (!trimmed) {
      setError('Document name cannot be empty');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await onRename(document.id, trimmed);
      if (res) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!document) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Rename Document"
      description={`Enter a new name for "${document.name}"`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Document Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
          error={error}
          leftIcon={<Edit3 className="w-4 h-4" />}
          autoFocus
        />

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
