'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileUp,
  Sparkles,
  MessageSquare,
  Star,
  Edit3,
  Trash2,
  Clock,
} from 'lucide-react';
import { useDocuments } from '@/context/DocumentContext';
import { ActivityType } from '@/types';

export function ActivityFeed() {
  const { activities } = useDocuments();

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'uploaded':
        return (
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <FileUp className="w-3.5 h-3.5" />
          </div>
        );
      case 'summary_generated':
        return (
          <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        );
      case 'question_asked':
        return (
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
        );
      case 'favorited':
        return (
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Star className="w-3.5 h-3.5" />
          </div>
        );
      case 'renamed':
        return (
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Edit3 className="w-3.5 h-3.5" />
          </div>
        );
      case 'deleted':
        return (
          <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Trash2 className="w-3.5 h-3.5" />
          </div>
        );
      default:
        return (
          <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
            <Clock className="w-3.5 h-3.5" />
          </div>
        );
    }
  };

  const formatRelativeTime = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">Recent Activity</h3>
          <p className="text-xs text-slate-400 mt-0.5">Audit log of actions across your workspace</p>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="p-6 text-center text-xs text-slate-500">No recent activity</div>
      ) : (
        <div className="space-y-3.5 flex-1 overflow-y-auto pr-1">
          {activities.slice(0, 7).map((act) => (
            <div key={act.id} className="flex items-start gap-3 text-xs">
              {getActivityIcon(act.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-slate-200 truncate">
                    {act.documentName}
                  </p>
                  <span className="text-[10px] text-slate-500 shrink-0 font-medium">
                    {formatRelativeTime(act.createdAt)}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] mt-0.5 truncate leading-tight">
                  {act.description || act.type.replace('_', ' ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
