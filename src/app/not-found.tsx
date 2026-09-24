'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col justify-center items-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
        <FileQuestion className="w-8 h-8" />
      </div>

      <h2 className="text-3xl font-extrabold text-white tracking-tight">404 - Page Not Found</h2>
      <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md">
        The page or document route you are looking for does not exist in this DocuMind workspace.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <Link href="/dashboard">
          <Button variant="primary" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
