'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  CheckCircle2,
  Tag,
  HelpCircle,
  RotateCw,
  MessageSquare,
  Zap,
} from 'lucide-react';
import { DocumentItem } from '@/types';
import { useDocuments } from '@/context/DocumentContext';
import { Button } from '@/components/ui/Button';
import { AISkeleton } from './AISkeleton';
import { SuggestedQuestions } from './SuggestedQuestions';

interface SummaryPanelProps {
  document: DocumentItem;
}

export function SummaryPanel({ document: doc }: SummaryPanelProps) {
  const router = useRouter();
  const { handleGenerateSummary } = useDocuments();
  const [isGenerating, setIsGenerating] = useState(false);

  const onGenerate = async () => {
    setIsGenerating(true);
    try {
      await handleGenerateSummary(doc.id);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectQuestion = (q: string) => {
    router.push(`/documents/${doc.id}/ask?initial=${encodeURIComponent(q)}`);
  };

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-md space-y-6">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">AI Executive Summary</h3>
            <p className="text-[11px] text-slate-400">Automated multi-level document analysis</p>
          </div>
        </div>

        {doc.summary && (
          <Button
            variant="outline"
            size="sm"
            onClick={onGenerate}
            isLoading={isGenerating}
            leftIcon={<RotateCw className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            Regenerate
          </Button>
        )}
      </div>

      {/* Loading State */}
      {isGenerating && <AISkeleton />}

      {/* Empty State / Not Generated Yet */}
      {!isGenerating && !doc.summary && (
        <div className="p-8 text-center rounded-xl bg-slate-950/40 border border-dashed border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
            <Zap className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-white">No Summary Generated Yet</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Generate an executive summary, identify core entities, and prepare suggested questions for this document.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={onGenerate}
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            className="mt-2"
          >
            Generate AI Summary
          </Button>
        </div>
      )}

      {/* Generated Content */}
      {!isGenerating && doc.summary && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Overview Paragraph */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Overview
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
              {doc.summary.overview}
            </p>
          </div>

          {/* Key Points */}
          {doc.summary.keyPoints && doc.summary.keyPoints.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                Key Takeaways & Points
              </h4>
              <ul className="space-y-2">
                {doc.summary.keyPoints.map((point, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs text-slate-300 leading-relaxed"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Extracted Topics / Entities */}
          {doc.summary.topics && doc.summary.topics.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-400" />
                <span>Extracted Topics & Entities</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {doc.summary.topics.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-2.5 py-1 rounded-lg bg-indigo-950/50 text-indigo-300 border border-indigo-800/40"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Questions */}
          {doc.summary.suggestedQuestions && doc.summary.suggestedQuestions.length > 0 && (
            <div className="pt-2 border-t border-slate-800/80">
              <SuggestedQuestions
                questions={doc.summary.suggestedQuestions}
                onSelectQuestion={handleSelectQuestion}
              />
            </div>
          )}

          {/* Jump to Chat button */}
          <div className="pt-2">
            <Button
              variant="subtle"
              size="md"
              onClick={() => router.push(`/documents/${doc.id}/ask`)}
              leftIcon={<MessageSquare className="w-4 h-4 text-indigo-400" />}
              className="w-full justify-center"
            >
              Ask AI Questions About This Document
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
