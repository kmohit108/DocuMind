'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { DocumentListItem } from '@/components/documents/DocumentListItem';
import { useDocuments } from '@/context/DocumentContext';
import { Star, Search, LayoutGrid, List, Files, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ViewMode, SortOption } from '@/types';

export default function FavoritesPage() {
  const { documents, viewMode, setViewMode } = useDocuments();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const favoriteDocs = useMemo(() => {
    let result = documents.filter((d) => d.isFavorite);

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q)) ||
          d.type.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
        case 'oldest':
          return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'size-desc':
          return b.size - a.size;
        case 'size-asc':
          return a.size - b.size;
        default:
          return 0;
      }
    });

    return result;
  }, [documents, search, sortBy]);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Favorite Documents
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/40">
                {favoriteDocs.length} starred
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Quick access to your high-priority and bookmarked documents.
            </p>
          </div>
        </div>

        {/* Search & View Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your favorite documents..."
              className="w-full h-10 pl-9 pr-4 bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-10 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="size-desc">Largest</option>
            </select>

            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Empty Favorites State */}
        {favoriteDocs.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 max-w-md mx-auto my-12 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No favorite documents yet</h3>
            <p className="text-xs text-slate-400">
              Star any document in your library to keep it pinned here for quick access.
            </p>
            <div className="pt-2">
              <Link href="/documents">
                <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Explore Library
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Grid View */}
        {favoriteDocs.length > 0 && viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteDocs.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        )}

        {/* List View */}
        {favoriteDocs.length > 0 && viewMode === 'list' && (
          <div className="space-y-2.5">
            {favoriteDocs.map((doc) => (
              <DocumentListItem key={doc.id} document={doc} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
