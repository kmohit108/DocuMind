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

export function RecentDocumentsTable() {
  const router = useRouter();
  const {
    documents,
    handleToggleFavorite,
    setActiveRenameDoc,
    setActiveDeleteDoc,
    handleGenerateSummary,
  } = useDocuments();

  const recentDocs = [...documents]
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .slice(0, 6);

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

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md overflow-hidden">
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">Recent Documents</h3>
          <p className="text-xs text-slate-400 mt-0.5">Recently uploaded and indexed files</p>
        </div>
        <Link
          href="/documents"
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
        >
          View all ({documents.length})
        </Link>
      </div>

      {recentDocs.length === 0 ? (
        <div className="p-10 text-center">
          <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-300">No documents found</p>
          <p className="text-xs text-slate-500 mt-1">Upload files using the dropzone above to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/40">
                <th className="py-3 px-4">Document</th>
                <th className="py-3 px-4 hidden sm:table-cell">Type</th>
                <th className="py-3 px-4 hidden md:table-cell">Size</th>
                <th className="py-3 px-4 hidden lg:table-cell">Uploaded</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs">
              {recentDocs.map((doc) => {
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
                  <tr
                    key={doc.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleFavorite(doc.id)}
                          className={`p-1 rounded-md transition-colors ${
                            doc.isFavorite
                              ? 'text-amber-400 hover:text-amber-300'
                              : 'text-slate-600 hover:text-slate-400'
                          }`}
                          title={doc.isFavorite ? 'Remove favorite' : 'Add favorite'}
                          aria-label={doc.isFavorite ? 'Remove favorite' : 'Add favorite'}
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${doc.isFavorite ? 'fill-amber-400' : ''}`}
                          />
                        </button>
                        <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-center shrink-0">
                          {getDocIcon(doc.type)}
                        </div>
                        <div className="min-w-0 max-w-[200px] sm:max-w-xs md:max-w-md">
                          <Link
                            href={`/documents/${doc.id}`}
                            className="font-semibold text-slate-200 hover:text-indigo-400 transition-colors truncate block"
                          >
                            {doc.name}
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5 sm:hidden text-[10px] text-slate-400">
                            <span>{storageService.formatBytes(doc.size)}</span>
                            <span>•</span>
                            <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 hidden sm:table-cell">
                      <DocumentTypeBadge type={doc.type} />
                    </td>

                    <td className="py-3 px-4 hidden md:table-cell text-slate-400 font-medium">
                      {storageService.formatBytes(doc.size)}
                    </td>

                    <td className="py-3 px-4 hidden lg:table-cell text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <StatusBadge status={doc.status} />
                    </td>

                    <td className="py-3 px-4 text-right">
                      <Dropdown
                        trigger={
                          <button
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            aria-label="More document options"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        }
                        items={actionItems}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
