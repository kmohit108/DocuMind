'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Search, FileUp, Sparkles, Bell, HelpCircle } from 'lucide-react';
import { useDocuments } from '@/context/DocumentContext';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { filters, updateFilter, setIsUploadModalOpen, resetToMockData } = useDocuments();

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname === '/documents') return 'Document Library';
    if (pathname.includes('/ask')) return 'Ask AI Assistant';
    if (pathname.startsWith('/documents/')) return 'Document Overview';
    if (pathname === '/favorites') return 'Favorite Documents';
    if (pathname === '/recent') return 'Recent Activity';
    if (pathname === '/settings') return 'Settings & Workspace';
    return 'DocuMind';
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pathname !== '/documents') {
      router.push('/documents');
    }
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left side: Hamburger & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Center: Global Search (Desktop) */}
      <form
        onSubmit={handleSearchSubmit}
        className="hidden md:flex flex-1 max-w-md mx-4 relative items-center"
      >
        <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          placeholder="Search documents by name, type, or tags..."
          className="w-full h-9 pl-9 pr-4 bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => updateFilter('search', '')}
            className="absolute right-3 text-[10px] text-slate-400 hover:text-slate-200 bg-slate-800 px-1.5 py-0.5 rounded"
          >
            ESC
          </button>
        )}
      </form>

      {/* Right side: Actions & Demo status */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Demo Mode Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-800/40 text-indigo-300 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Demo Mode</span>
        </div>

        {/* Upload Button */}
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsUploadModalOpen(true)}
          leftIcon={<FileUp className="w-3.5 h-3.5" />}
          className="hidden sm:inline-flex"
        >
          Upload
        </Button>

        {/* Quick Reset Demo button */}
        <button
          onClick={resetToMockData}
          title="Reset sample documents to original seed"
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800/80 transition-colors text-xs font-medium hidden md:flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[11px]">Reset Data</span>
        </button>
      </div>
    </header>
  );
}
