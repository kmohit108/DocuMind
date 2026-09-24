import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DocumentType, ProcessingStatus } from '@/types';
import { FileText, Image as ImageIcon, FileCode, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-slate-800 text-slate-300 border-slate-700/60',
    success: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/40',
    warning: 'bg-amber-950/70 text-amber-300 border-amber-800/40',
    danger: 'bg-rose-950/70 text-rose-300 border-rose-800/40',
    info: 'bg-sky-950/70 text-sky-300 border-sky-800/40',
    purple: 'bg-indigo-950/70 text-indigo-300 border-indigo-800/40',
    outline: 'bg-transparent text-slate-400 border-slate-700',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 rounded-md font-medium tracking-tight border',
    md: 'text-xs px-2.5 py-1 rounded-lg font-medium border',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 whitespace-nowrap transition-colors',
          variants[variant],
          sizes[size],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: ProcessingStatus }) {
  if (status === 'ready') {
    return (
      <Badge variant="success" size="sm">
        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
        <span>Ready</span>
      </Badge>
    );
  }
  if (status === 'processing') {
    return (
      <Badge variant="warning" size="sm">
        <Clock className="w-3 h-3 text-amber-400 animate-spin" />
        <span>Processing</span>
      </Badge>
    );
  }
  return (
    <Badge variant="danger" size="sm">
      <AlertCircle className="w-3 h-3 text-rose-400" />
      <span>Failed</span>
    </Badge>
  );
}

export function DocumentTypeBadge({ type }: { type: DocumentType }) {
  const configs: Record<DocumentType, { label: string; color: BadgeProps['variant'] }> = {
    pdf: { label: 'PDF', color: 'danger' },
    docx: { label: 'DOCX', color: 'info' },
    txt: { label: 'TXT', color: 'default' },
    md: { label: 'MD', color: 'purple' },
    png: { label: 'PNG', color: 'success' },
    jpg: { label: 'JPG', color: 'success' },
    jpeg: { label: 'JPEG', color: 'success' },
    other: { label: 'FILE', color: 'default' },
  };

  const config = configs[type] || configs.other;

  return (
    <Badge variant={config.color} size="sm">
      {config.label}
    </Badge>
  );
}
