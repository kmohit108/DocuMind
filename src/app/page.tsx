'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  MessageSquare,
  Zap,
  CheckCircle2,
  HardDrive,
  Layers,
  Terminal,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* SaaS Navigation */}
      <nav className="h-16 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">DocuMind</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-400 border border-indigo-800/40">
            Frontend v1.0
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors"
          >
            Sign In
          </Link>
          <Link href="/dashboard">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Open Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-16 pb-20 max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>Next-Generation AI Document Intelligence</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight sm:leading-tight">
          Turn your complex documents into{' '}
          <span className="gradient-primary-text">instant actionable insights.</span>
        </h1>

        <p className="mt-5 text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
          Ingest, organize, preview, summarize, and converse with your documents. Built frontend-first
          with Next.js, Tailwind CSS, clean service abstractions, and mock LLM pipelines.
        </p>

        {/* CTA Group */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto px-8"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Launch Live Application
            </Button>
          </Link>
          <Link href="/documents" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-6">
              Browse Sample Library
            </Button>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16 w-full text-left">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">Fast Ingestion</h3>
            <p className="text-xs text-slate-400 mt-1">
              Drag-and-drop PDF, DOCX, Markdown, and images with real-time queue tracking.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">Executive AI Summaries</h3>
            <p className="text-xs text-slate-400 mt-1">
              Hierarchical summaries, key takeaway checklists, and entity extraction.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">Grounded Document Q&A</h3>
            <p className="text-xs text-slate-400 mt-1">
              Multi-turn conversational assistant with citation context and suggested prompts.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">Supabase & Cloud Ready</h3>
            <p className="text-xs text-slate-400 mt-1">
              Clean service architecture ready for Supabase Auth, PostgreSQL pgvector, and S3.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-8 px-4 sm:px-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 DocuMind. Modern AI Document Management Platform.</p>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hover:text-slate-300 transition-colors">
              Dashboard
            </Link>
            <Link href="/documents" className="hover:text-slate-300 transition-colors">
              Documents
            </Link>
            <Link href="/settings" className="hover:text-slate-300 transition-colors">
              Settings
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
