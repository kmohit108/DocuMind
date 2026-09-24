'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Star,
  MessageSquare,
  Sparkles,
  Download,
  Edit3,
  Trash2,
  Calendar,
  HardDrive,
  FileCheck,
  Tag,
  Clock,
  User,
  ExternalLink,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { DocumentViewer } from '@/components/documents/DocumentViewer';
import { SummaryPanel } from '@/components/ai/SummaryPanel';
import { useDocuments } from '@/context/DocumentContext';
import { storageService } from '@/services/storageService';
import { DocumentTypeBadge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DocumentItem } from '@/types';

interface DocumentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function DocumentDetailPage({ params }: DocumentDetailPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const {
    documents,
    isLoading,
    handleToggleFavorite,
    setActiveRenameDoc,
    setActiveDeleteDoc,
    handleGenerateSummary,
  } = useDocuments();

  const [document, setDocument] = useState<DocumentItem | null>(null);

  useEffect(() => {
    if (documents.length > 0) {
      const found = documents.find((d) => d.id === resolvedParams.id);
      setDocument(found || null);
    }
  }, [documents, resolvedParams.id]);

  if (isLoading) {
    return (
      <AppShell>
        <div className="space-y-6 animate-pulse">
          <div className="h-10 w-48 bg-slate-900 rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 h-[600px] bg-slate-900 rounded-2xl" />
            <div className="lg:col-span-5 h-[600px] bg-slate-900 rounded-2xl" />
          </div>
        </div>
      </AppShell>
    );
  }

  if (!document) {
    return (
      <AppShell>
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 max-w-lg mx-auto my-12 space-y-4">
          <h3 className="text-lg font-bold text-white">Document Not Found</h3>
          <p className="text-xs text-slate-400">
            The document you are looking for might have been deleted or the ID is invalid.
          </p>
          <Link href="/documents">
            <Button variant="primary" size="sm" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
              Back to Documents
            </Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top Header & Quick Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/documents"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors shrink-0"
              title="Back to library"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">
                  {document.name}
                </h2>
                <DocumentTypeBadge type={document.type} />
                <StatusBadge status={document.status} />
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-400">
                <span>{storageService.formatBytes(document.size)}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  Uploaded {new Date(document.uploadedAt).toLocaleDateString()}
                </span>
                <span>•</span>
                <span>Author: {document.author || 'Current User'}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Favorite button */}
            <button
              onClick={() => handleToggleFavorite(document.id)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                document.isFavorite
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title={document.isFavorite ? 'Remove favorite' : 'Add favorite'}
            >
              <Star className={`w-4 h-4 ${document.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span className="hidden sm:inline">
                {document.isFavorite ? 'Favorited' : 'Favorite'}
              </span>
            </button>

            {/* Ask AI CTA */}
            <Link href={`/documents/${document.id}/ask`}>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
              >
                Ask AI Chat
              </Button>
            </Link>

            {/* Rename button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveRenameDoc(document)}
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
            >
              Rename
            </Button>

            {/* Delete button */}
            <Button
              variant="danger"
              size="sm"
              onClick={() => setActiveDeleteDoc(document)}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* 2-Column Desktop Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): Document Previewer */}
          <div className="lg:col-span-7">
            <DocumentViewer document={document} />
          </div>

          {/* Right Column (5 cols): AI Summary & Metadata Panel */}
          <div className="lg:col-span-5 space-y-6">
            <SummaryPanel document={document} />

            {/* Document Metadata Card */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 backdrop-blur-md space-y-3.5 text-xs">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Document Metadata & Index Info</span>
              </h4>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60">
                  <p className="text-[10px] text-slate-400">File Type</p>
                  <p className="font-semibold text-slate-200 mt-0.5">{document.mimeType}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60">
                  <p className="text-[10px] text-slate-400">Page Estimate</p>
                  <p className="font-semibold text-slate-200 mt-0.5">{document.pageCount || 1} Page(s)</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60">
                  <p className="text-[10px] text-slate-400">Index Status</p>
                  <p className="font-semibold text-emerald-400 mt-0.5">Semantic Ready</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60">
                  <p className="text-[10px] text-slate-400">Storage Service</p>
                  <p className="font-semibold text-indigo-400 mt-0.5">Local Encrypted Blob</p>
                </div>
              </div>

              {/* Tags */}
              {document.tags && document.tags.length > 0 && (
                <div className="pt-2">
                  <p className="text-[10px] text-slate-400 mb-1.5 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>Assigned Tags</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {document.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/50"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
