'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { DocumentFilters } from '@/components/documents/DocumentFilters';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { DocumentListItem } from '@/components/documents/DocumentListItem';
import { useDocuments } from '@/context/DocumentContext';
import { Files, Plus, SearchX, FileUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function DocumentsPage() {
  const {
    filteredDocuments,
    documents,
    viewMode,
    isLoading,
    setIsUploadModalOpen,
    resetFilters,
  } = useDocuments();

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Document Library
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                {documents.length} files
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Manage, search, organize, and perform AI analysis on your stored documents.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => setIsUploadModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Upload Document
          </Button>
        </div>

        {/* Search, Filters, Sorting & View Toggle */}
        <DocumentFilters />

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-48 rounded-2xl bg-slate-900/40 border border-slate-800/60 animate-pulse p-5"
              />
            ))}
          </div>
        )}

        {/* Empty Search / Filters State */}
        {!isLoading && filteredDocuments.length === 0 && documents.length > 0 && (
          <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md max-w-lg mx-auto space-y-3 my-8">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
              <SearchX className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No documents match your filters</h3>
            <p className="text-xs text-slate-400">
              Try adjusting your search query, format selection, or reset all active filters.
            </p>
            <div className="pt-2">
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset All Filters
              </Button>
            </div>
          </div>
        )}

        {/* Empty Collection State */}
        {!isLoading && documents.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 max-w-lg mx-auto space-y-4 my-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
              <FileUp className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white">Your document workspace is empty</h3>
            <p className="text-xs text-slate-400">
              Upload your first document (PDF, Word, Markdown, Text, or Image) to begin generating AI summaries.
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsUploadModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Upload First Document
            </Button>
          </div>
        )}

        {/* Document Grid View */}
        {!isLoading && filteredDocuments.length > 0 && viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        )}

        {/* Document List View */}
        {!isLoading && filteredDocuments.length > 0 && viewMode === 'list' && (
          <div className="space-y-2.5">
            {filteredDocuments.map((doc) => (
              <DocumentListItem key={doc.id} document={doc} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
