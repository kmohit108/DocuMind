'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  MessageSquare,
  Zap,
  Layers,
  FileText,
  ShieldCheck,
  Brain,
  Search,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">

      {/* ==================== NAVIGATION ==================== */}
      <nav className="h-16 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50 px-4 sm:px-8 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>

          <span className="font-bold text-lg text-white tracking-tight">
            DocuMind
          </span>

          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-950/80 text-indigo-300 border border-indigo-700/50 shadow-sm">
            AI
          </span>
        </div>

        {/* Top Right */}
        <div className="flex items-center gap-2">

          <Link
            href="/login"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-600/30 transition-all"
          >
            Sign In
          </Link>

          <Link
            href="/login?mode=signup"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-indigo-700/60 bg-indigo-950/40 text-indigo-300 text-xs font-semibold hover:bg-indigo-900/60 hover:text-white transition-all"
          >
            Sign Up
          </Link>

        </div>
      </nav>


      {/* ==================== HERO ==================== */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-14 pb-12 max-w-6xl mx-auto flex flex-col items-center text-center">

        {/* Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 text-xs font-semibold mb-5 shadow-sm">

          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />

          <span>
            Next-Generation AI Document Intelligence
          </span>

        </div>


        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight sm:leading-tight">

          Turn your complex documents into{' '}

          <span className="gradient-primary-text">
            instant actionable insights.
          </span>

        </h1>


        {/* Main CTA */}
        <div className="mt-8 flex items-center justify-center">

          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-600/40 hover:scale-[1.02] transition-all"
          >
            Let's Explore More...

            <ArrowRight className="w-4 h-4" />
          </Link>

        </div>


        {/* ==================== FEATURES ==================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 w-full text-left">


          {/* Feature 1 */}
          <Link
            href="/login"
            className="group p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-indigo-600/50 hover:bg-slate-900 transition-all hover:-translate-y-1"
          >

            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 group-hover:bg-indigo-500/20 transition-colors">
              <Zap className="w-5 h-5" />
            </div>

            <h3 className="text-sm font-bold text-white tracking-tight">
              Upload Documents
            </h3>

            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Upload your important documents and keep everything organized
              inside one secure workspace.
            </p>

            <div className="flex items-center gap-1 text-[11px] text-indigo-400 mt-4 font-semibold">
              Explore feature
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>

          </Link>


          {/* Feature 2 */}
          <Link
            href="/login"
            className="group p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-purple-600/50 hover:bg-slate-900 transition-all hover:-translate-y-1"
          >

            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3 group-hover:bg-purple-500/20 transition-colors">
              <Layers className="w-5 h-5" />
            </div>

            <h3 className="text-sm font-bold text-white tracking-tight">
              Organize & Manage
            </h3>

            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Search, filter, favorite, rename, and manage your entire
              document library from one place.
            </p>

            <div className="flex items-center gap-1 text-[11px] text-purple-400 mt-4 font-semibold">
              Explore feature
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>

          </Link>


          {/* Feature 3 */}
          <Link
            href="/login"
            className="group p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-emerald-600/50 hover:bg-slate-900 transition-all hover:-translate-y-1"
          >

            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 group-hover:bg-emerald-500/20 transition-colors">
              <Sparkles className="w-5 h-5" />
            </div>

            <h3 className="text-sm font-bold text-white tracking-tight">
              AI Summaries
            </h3>

            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Quickly understand long documents with AI-generated summaries
              and important insights.
            </p>

            <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-4 font-semibold">
              Explore feature
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>

          </Link>


          {/* Feature 4 */}
          <Link
            href="/login"
            className="group p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-sky-600/50 hover:bg-slate-900 transition-all hover:-translate-y-1"
          >

            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-3 group-hover:bg-sky-500/20 transition-colors">
              <MessageSquare className="w-5 h-5" />
            </div>

            <h3 className="text-sm font-bold text-white tracking-tight">
              Ask AI Questions
            </h3>

            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Ask questions about your documents and get useful answers based
              on the information inside them.
            </p>

            <div className="flex items-center gap-1 text-[11px] text-sky-400 mt-4 font-semibold">
              Explore feature
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>

          </Link>

        </div>


        {/* ==================== FEATURE OVERVIEW ==================== */}

        <div className="mt-14 w-full border-t border-slate-800/80 pt-10">

          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Everything you need to work with documents smarter
          </h2>

          <p className="text-sm text-slate-400 mt-2 max-w-2xl mx-auto">
            DocuMind brings document management and AI-powered understanding
            together in one simple workspace.
          </p>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 text-left">

            {/* Small Feature */}
            <Link
              href="/login"
              className="group p-4 rounded-xl border border-slate-800/70 bg-slate-950/40 hover:border-indigo-700/40 transition-all"
            >
              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <FileText className="w-4 h-4" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Document Library
                  </h3>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Keep documents organized and easy to find.
                  </p>
                </div>

              </div>
            </Link>


            {/* Small Feature */}
            <Link
              href="/login"
              className="group p-4 rounded-xl border border-slate-800/70 bg-slate-950/40 hover:border-purple-700/40 transition-all"
            >
              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <Brain className="w-4 h-4" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">
                    AI-Powered Understanding
                  </h3>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Turn lengthy documents into useful insights.
                  </p>
                </div>

              </div>
            </Link>


            {/* Small Feature */}
            <Link
              href="/login"
              className="group p-4 rounded-xl border border-slate-800/70 bg-slate-950/40 hover:border-emerald-700/40 transition-all"
            >
              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Search className="w-4 h-4" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Fast Search
                  </h3>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Find the documents you need quickly.
                  </p>
                </div>

              </div>
            </Link>

          </div>
        </div>

      </section>


      {/* ==================== FOOTER ==================== */}

      <footer className="border-t border-slate-800/80 bg-slate-950/70">

        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Brand */}
            <div className="lg:col-span-2">

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>

                <span className="font-bold text-lg text-white">
                  DocuMind
                </span>

                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-950/80 text-indigo-300 border border-indigo-700/50">
                  AI
                </span>

              </div>

              <p className="text-xs text-slate-500 leading-relaxed mt-4 max-w-md">
                An AI-powered document management workspace designed to help
                you upload, organize, understand, summarize, and interact
                with your documents more efficiently.
              </p>

            </div>


            {/* Product */}
            <div>

              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Product
              </h3>

              <div className="flex flex-col gap-3 mt-4">

                <Link
                  href="/login"
                  className="text-xs text-slate-500 hover:text-indigo-400 transition-colors"
                >
                  Document Management
                </Link>

                <Link
                  href="/login"
                  className="text-xs text-slate-500 hover:text-indigo-400 transition-colors"
                >
                  AI Summaries
                </Link>

                <Link
                  href="/login"
                  className="text-xs text-slate-500 hover:text-indigo-400 transition-colors"
                >
                  Document Q&A
                </Link>

                <Link
                  href="/login"
                  className="text-xs text-slate-500 hover:text-indigo-400 transition-colors"
                >
                  Search & Organization
                </Link>

              </div>

            </div>


            {/* Quick Links */}
            <div>

              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Quick Links
              </h3>

              <div className="flex flex-col gap-3 mt-4">

                <Link
                  href="/login"
                  className="text-xs text-slate-500 hover:text-indigo-400 transition-colors"
                >
                  Sign In
                </Link>

                <Link
                  href="/login?mode=signup"
                  className="text-xs text-slate-500 hover:text-indigo-400 transition-colors"
                >
                  Create Account
                </Link>

                <Link
                  href="/privacy-policy"
                  className="text-xs text-slate-500 hover:text-indigo-400 transition-colors"
                >
                  Privacy Policy
                </Link>

              </div>

            </div>

          </div>


          {/* Bottom Footer */}
          <div className="border-t border-slate-800/80 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">

            <p className="text-[11px] text-slate-600">
              © 2026 DocuMind. All rights reserved.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>
                Built for smarter document workflows.
              </span>
            </div>

          </div>

        </div>

      </footer>

    </div>
  );
}