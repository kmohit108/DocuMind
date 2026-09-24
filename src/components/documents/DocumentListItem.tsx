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

interface DocumentListItemProps {
  document: DocumentItem;
}

export function DocumentListItem({ document: doc }: DocumentListItemProps) {
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
        return <FileText className="w-4 h-4 text-rose-400" />;
      case 'docx':
        return <FileText className="w-4 h-4 text-sky-400" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <ImageIcon className="w-4 h-4 text-emerald-400" />;
      case 'md':
      case 'txt':
        return <FileCode className="w-4 h-4 text-purple-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
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
    <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all flex items-center justify-between gap-3 group backdrop-blur-md">
      {/* Left: Star, Icon, Name, Tags */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          onClick={() => handleToggleFavorite(doc.id)}
          className={`p-1.5 rounded-lg transition-colors shrink-0 cursor-pointer ${
            doc.isFavorite
              ? 'text-amber-400 hover:text-amber-300'
              : 'text-slate-600 hover:text-slate-400'
          }`}
          title={doc.isFavorite ? 'Remove favorite' : 'Add favorite'}
          aria-label={doc.isFavorite ? 'Remove favorite' : 'Add favorite'}
        >
          <Star className={`w-4 h-4 ${doc.isFavorite ? 'fill-amber-400' : ''}`} />
        </button>

        <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          {getDocIcon(doc.type)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Link
              href={`/documents/${doc.id}`}
              className="font-bold text-slate-100 hover:text-indigo-400 text-xs sm:text-sm truncate block transition-colors"
            >
              {doc.name}
            </Link>
            <DocumentTypeBadge type={doc.type} />
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-400">
            <span>{storageService.formatBytes(doc.size)}</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              {new Date(doc.uploadedAt).toLocaleDateString()}
            </span>
            {doc.tags && doc.tags.length > 0 && (
              <>
                <span className="hidden md:inline">•</span>
                <div className="hidden md:flex items-center gap-1">
                  {doc.tags.slice(0, 2).map((t) => (
                    <span key={t} className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                      #{t}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right: Status & Action buttons */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden sm:block">
          <StatusBadge status={doc.status} />
        </div>

        <Link
          href={`/documents/${doc.id}/ask`}
          className="p-2 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-400 transition-colors hidden sm:flex items-center gap-1.5 text-xs font-semibold"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Ask AI</span>
        </Link>

        <Dropdown
          trigger={
            <button
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          }
          items={actionItems}
        />
      </div>
    </div>
  );
}
