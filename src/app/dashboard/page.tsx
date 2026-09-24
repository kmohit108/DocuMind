'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { QuickDropzone } from '@/components/dashboard/QuickDropzone';
import { RecentDocumentsTable } from '@/components/dashboard/RecentDocumentsTable';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { useAuth } from '@/context/AuthContext';
import { useDocuments } from '@/context/DocumentContext';
import { FileUp, Sparkles, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const { user } = useAuth();
  const { setIsUploadModalOpen } = useDocuments();

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const userName = user?.name?.split(' ')[0] || 'Explorer';

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/50 via-slate-900/60 to-purple-950/40 border border-indigo-500/20 backdrop-blur-md shadow-lg shadow-indigo-950/20">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {greeting}, {userName} 👋
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-900 mt-1 max-w-xl">
              Welcome back to your DocuMind document workspace. You have indexed documents ready for AI analysis and instant querying.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsUploadModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Upload Document
            </Button>
          </div>
        </div>

        {/* 4 Statistics KPI Cards */}
        <StatsOverview />

        {/* Quick Dropzone */}
        <QuickDropzone />

        {/* 2-Column Grid: Recent Documents & Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentDocumentsTable />
          </div>
          <div className="lg:col-span-1">
            <ActivityFeed />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
