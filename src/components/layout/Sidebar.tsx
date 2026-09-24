'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Files,
  Star,
  Clock,
  Settings,
  Sparkles,
  HardDrive,
  LogOut,
  ChevronRight,
  X,
  FileUp,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useDocuments } from '@/context/DocumentContext';
import { storageService } from '@/services/storageService';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, settings, logout } = useAuth();
  const { documents, setIsUploadModalOpen } = useDocuments();

  const favoriteCount = documents.filter((d) => d.isFavorite).length;

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      name: 'Documents',
      href: '/documents',
      icon: <Files className="w-4 h-4" />,
      badge: documents.length,
    },
    {
      name: 'Favorites',
      href: '/favorites',
      icon: <Star className="w-4 h-4" />,
      badge: favoriteCount > 0 ? favoriteCount : undefined,
    },
    {
      name: 'Recent',
      href: '/recent',
      icon: <Clock className="w-4 h-4" />,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const totalBytes = documents.reduce((acc, doc) => acc + doc.size, 0);
  const storagePercentage = Math.min(100, Math.round((totalBytes / settings.storageLimit) * 100));

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-950/90 border-r border-slate-800/80 p-4">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-2 py-3 mb-4">
        <Link href="/dashboard" className="flex items-center gap-3 group" onClick={onClose}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-white tracking-tight">DocuMind</span>
              <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.2 rounded">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Document Intelligence</p>
          </div>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Primary Action Button */}
      <div className="px-1 mb-6">
        <button
          onClick={() => {
            setIsUploadModalOpen(true);
            onClose();
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all duration-200 border border-indigo-500/30 active:scale-[0.98] cursor-pointer"
        >
          <FileUp className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Navigation Links */}
      <div className="space-y-1 flex-1 overflow-y-auto px-1">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
          Workspace
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`transition-colors ${
                    isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                    isActive
                      ? 'bg-indigo-500/20 text-indigo-300'
                      : 'bg-slate-800/80 text-slate-400 group-hover:bg-slate-800 group-hover:text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Storage Indicator */}
      <div className="mt-auto px-2 py-3 bg-slate-900/60 rounded-xl border border-slate-800/80 mb-3">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <div className="flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-medium text-[11px]">Demo Storage</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-300">
            {storageService.formatBytes(totalBytes)} / {storageService.formatBytes(settings.storageLimit)}
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(4, storagePercentage)}%` }}
          />
        </div>
      </div>

      {/* User Profile Bar */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between px-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs shrink-0 ring-2 ring-indigo-500/20">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{user?.name || 'Demo User'}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email || 'demo@documind.ai'}</p>
          </div>
        </div>
        <button
          onClick={async () => {
  await logout();
  router.push('/login');
}}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors cursor-pointer"
          title="Sign Out"
          aria-label="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in"
            onClick={onClose}
          />
          <div className="relative w-72 max-w-[80vw] h-full z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
