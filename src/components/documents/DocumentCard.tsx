'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  FileCode,
  Image as ImageIcon,
  MoreVertical,
  Star,
  Sparkles,
  MessageSquare,
  Trash2,
  Edit3,
  ExternalLink,
  Clock,
} from 'lucide-react';
import { DocumentItem } from '@/types';
import { useDocuments } from '@/context/DocumentContext';
import { storageService } from '@/services/storageService';
import { StatusBadge, DocumentTypeBadge } from '@/components/ui/Badge';
import { Dropdown } from '@/components/ui/Dropdown';

interface DocumentCardProps {
  document: DocumentItem;
}

export function DocumentCard({ document: doc }: DocumentCardProps) {
  const router = useRouter();
  const {
    handleToggleFavorite,
    setActiveRenameDoc,
    setActiveDeleteDoc,
    handleGenerateSummary,
  } = useDocuments();

  const getDocIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-rose-400" />;
      case 'docx':
        return <FileText className="w-6 h-6 text-sky-400" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <ImageIcon className="w-6 h-6 text-emerald-400" />;
      case 'md':
      case 'txt':
        return <FileCode className="w-6 h-6 text-purple-400" />;
      default:
        return <FileText className="w-6 h-6 text-slate-400" />;
    }
  };

  const actionItems = [
    {
      label: 'Open Details',
      icon: <ExternalLink className="w-3.5 h-3.5" />,
      onClick: () => router.push(`/documents/${doc.id}`),
    },
    {
      label: 'Ask AI Chat',
      icon: <MessageSquare className="w-3.5 h-3.5" />,
      onClick: () => router.push(`/documents/${doc.id}/ask`),
    },
    {
      label: doc.summary ? 'View Summary' : 'Generate Summary',
      icon: <Sparkles className="w-3.5 h-3.5" />,
      onClick: () => {
        if (!doc.summary) handleGenerateSummary(doc.id);
        router.push(`/documents/${doc.id}`);
      },
    },
    {
      label: 'Rename',
      icon: <Edit3 className="w-3.5 h-3.5" />,
      onClick: () => setActiveRenameDoc(doc),
    },
    {
      label: 'Delete',
      icon: <Trash2 className="w-3.5 h-3.5" />,
      variant: 'danger' as const,
      divider: true,
      onClick: () => setActiveDeleteDoc(doc),
    },
  ];

  return (
    <div className="group relative rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 backdrop-blur-md">
      {/* Top row: Type Badge, Favorite, Menu */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <DocumentTypeBadge type={doc.type} />

        <div className="flex items-center gap-1">
          <button
            onClick={() => handleToggleFavorite(doc.id)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              doc.isFavorite
                ? 'text-amber-400 hover:text-amber-300'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            title={doc.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={doc.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`w-4 h-4 ${doc.isFavorite ? 'fill-amber-400' : ''}`} />
          </button>

          <Dropdown
            trigger={
              <button
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="More options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            }
            items={actionItems}
          />
        </div>
      </div>

      {/* Main card icon & Title */}
      <div className="mb-4">
        <Link href={`/documents/${doc.id}`} className="block group-hover:opacity-95">
          <div className="w-12 h-12 rounded-xl bg-slate-800/70 border border-slate-700/40 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:border-indigo-500/30 transition-all">
            {getDocIcon(doc.type)}
          </div>
          <h4 className="text-sm font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug tracking-tight">
            {doc.name}
          </h4>
        </Link>

        {/* Tags */}
        {doc.tags && doc.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2.5">
            {doc.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/40"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info & Quick Actions */}
      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 mt-auto">
        <div className="flex flex-col text-[11px] gap-0.5">
          <span className="font-semibold text-slate-300">
            {storageService.formatBytes(doc.size)}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-slate-500">
            <Clock className="w-3 h-3" />
            {new Date(doc.uploadedAt).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {doc.summary ? (
            <Link
              href={`/documents/${doc.id}`}
              className="px-2 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-[11px] font-semibold flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Summary</span>
            </Link>
          ) : (
            <button
              onClick={() => handleGenerateSummary(doc.id)}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
            >
              Summarize
            </button>
          )}

          <Link
            href={`/documents/${doc.id}/ask`}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-400 transition-colors"
            title="Ask AI"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
