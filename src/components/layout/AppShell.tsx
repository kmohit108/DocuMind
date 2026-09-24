'use client';
import { useEffect } from 'react';
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { UploadModal } from '@/components/upload/UploadModal';
import { RenameModal } from '@/components/documents/RenameModal';
import { DeleteConfirmModal } from '@/components/documents/DeleteConfirmModal';
import { useDocuments } from '@/context/DocumentContext';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const {
    activeRenameDoc,
    setActiveRenameDoc,
    handleRenameDocument,
    activeDeleteDoc,
    setActiveDeleteDoc,
    handleDeleteDocument,
  } = useDocuments();
useEffect(() => {
  const savedTheme = localStorage.getItem('documind-theme');

  if (savedTheme === 'light') {
    document.documentElement.classList.add('light');
  } else {
    document.documentElement.classList.remove('light');
  }
}, []);
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col antialiased">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />

      {/* Main Content Viewport */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <Header onMenuToggle={() => setIsMobileNavOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Modals */}
      <UploadModal />
      <RenameModal
        document={activeRenameDoc}
        isOpen={!!activeRenameDoc}
        onClose={() => setActiveRenameDoc(null)}
        onRename={handleRenameDocument}
      />
      <DeleteConfirmModal
        document={activeDeleteDoc}
        isOpen={!!activeDeleteDoc}
        onClose={() => setActiveDeleteDoc(null)}
        onDelete={handleDeleteDocument}
      />
    </div>
  );
}
