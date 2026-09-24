'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image, FileCode, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DropzoneProps {
  onFilesSelected: (files: FileList | File[]) => void;
  className?: string;
  compact?: boolean;
}

export function Dropzone({ onFilesSelected, className = '', compact = false }: DropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`relative group cursor-pointer border-2 border-dashed rounded-2xl transition-all duration-200 flex flex-col items-center justify-center text-center ${
        isDragOver
          ? 'border-indigo-500 bg-indigo-500/10 scale-[0.99]'
          : 'border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/40 bg-slate-950/40'
      } ${compact ? 'p-6 sm:p-8' : 'p-8 sm:p-12'} ${className}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.doc,.txt,.md,.png,.jpg,.jpeg"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Floating Cloud Icon */}
      <div
        className={`rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center transition-transform group-hover:scale-110 duration-200 ${
          compact ? 'w-12 h-12 mb-3' : 'w-16 h-16 mb-4'
        }`}
      >
        <UploadCloud className={compact ? 'w-6 h-6' : 'w-8 h-8'} />
      </div>

      <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
        Drop your documents here or <span className="text-indigo-400 underline underline-offset-2">browse files</span>
      </h4>
      <p className="text-xs text-slate-400 mt-1 max-w-sm">
        Supports PDF, DOCX, Markdown, Text, and Images up to 20 MB per file
      </p>

      {/* Format pills */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
        {['PDF', 'DOCX', 'TXT', 'MD', 'PNG', 'JPG'].map((ext) => (
          <span
            key={ext}
            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400"
          >
            .{ext.toLowerCase()}
          </span>
        ))}
      </div>
    </div>
  );
}
