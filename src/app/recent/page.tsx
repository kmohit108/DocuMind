'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { RecentDocumentsTable } from '@/components/dashboard/RecentDocumentsTable';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { Clock, History, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function RecentPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Clock className="w-4 h-4" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Recent Activity & Files
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Timeline of document uploads, AI summary generations, questions, and workspace modifications.
            </p>
          </div>

          <Link href="/documents">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              All Documents
            </Button>
          </Link>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <RecentDocumentsTable />
          </div>
          <div className="lg:col-span-5">
            <ActivityFeed />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
