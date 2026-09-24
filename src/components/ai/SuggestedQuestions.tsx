'use client';

import React from 'react';
import { HelpCircle, Sparkles, ArrowRight } from 'lucide-react';

interface SuggestedQuestionsProps {
  questions: string[];
  onSelectQuestion: (question: string) => void;
  className?: string;
}

export function SuggestedQuestions({
  questions,
  onSelectQuestion,
  className = '',
}: SuggestedQuestionsProps) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Suggested Questions</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {questions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSelectQuestion(q)}
            className="text-left text-xs bg-slate-900/90 hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-200 border border-slate-800 hover:border-indigo-500/40 px-3 py-2 rounded-xl transition-all flex items-center justify-between gap-2 group cursor-pointer"
          >
            <span className="line-clamp-2">{q}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </button>
        ))}
      </div>
    </div>
  );
}
