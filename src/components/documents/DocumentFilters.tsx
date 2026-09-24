'use client';

import React from 'react';
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  RotateCcw,
  ArrowUpDown,
  Star,
} from 'lucide-react';
import { useDocuments } from '@/context/DocumentContext';
import { SortOption, ViewMode } from '@/types';

export function DocumentFilters() {
  const { filters, updateFilter, resetFilters, viewMode, setViewMode, filteredDocuments, documents } =
    useDocuments();

  const typeOptions = [
    { value: 'all', label: 'All Formats' },
    { value: 'pdf', label: 'PDF' },
    { value: 'docx', label: 'Word (.docx)' },
    { value: 'md', label: 'Markdown' },
    { value: 'txt', label: 'Text (.txt)' },
    { value: 'png', label: 'Images' },
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name-asc', label: 'Name (A to Z)' },
    { value: 'name-desc', label: 'Name (Z to A)' },
    { value: 'size-desc', label: 'Size (Largest)' },
    { value: 'size-asc', label: 'Size (Smallest)' },
  ];

  const hasActiveFilters =
    filters.search !== '' ||
    filters.type !== 'all' ||
    filters.status !== 'all' ||
    filters.favoritesOnly ||
    filters.tag !== '';

  return (
    <div className="space-y-3.5 mb-6">
      {/* Top Search & Primary Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            placeholder="Search documents by title, tags, or type..."
            className="w-full h-10 pl-9 pr-8 bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter('search', '')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* View Toggle & Reset */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {/* Favorites Filter Button */}
          <button
            onClick={() => updateFilter('favoritesOnly', !filters.favoritesOnly)}
            className={`h-10 px-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              filters.favoritesOnly
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${filters.favoritesOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>Favorites</span>
          </button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="h-10 px-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {/* Grid / List Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Grid View"
              aria-label="Grid View"
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
              aria-label="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Filters Bar: Type Tabs & Sort Dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/60">
        {/* Type pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {typeOptions.map((opt) => {
            const isSelected = filters.type === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => updateFilter('type', opt.value)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/80'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 ml-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400 font-medium">Sort by:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter('sortBy', e.target.value as SortOption)}
            className="h-8 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-slate-200 px-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            {sortOptions.map((sort) => (
              <option key={sort.value} value={sort.value}>
                {sort.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
