'use client';

import React, { useState } from 'react';
import {
  FileText,
  FileCode,
  Image as ImageIcon,
  Download,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Layers,
} from 'lucide-react';
import { DocumentItem } from '@/types';
import { storageService } from '@/services/storageService';
import { useToast } from '@/context/ToastContext';

interface DocumentViewerProps {
  document: DocumentItem;
}

export function DocumentViewer({ document: doc }: DocumentViewerProps) {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const { success, info } = useToast();

  const handleCopyText = () => {
    const textToCopy = doc.extractedText || doc.summary?.overview || doc.name;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    success('Text Copied', 'Extracted document content copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = doc.extractedText || `# ${doc.name}\n\nDocument downloaded from DocuMind.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = doc.name;
    link.click();
    URL.revokeObjectURL(url);
    info('Download Started', `Downloading "${doc.name}"`);
  };

  const isImage = ['png', 'jpg', 'jpeg'].includes(doc.type);
  const isCodeOrText = ['txt', 'md'].includes(doc.type);
  const isPdf = doc.type === 'pdf';

  return (
    <div
      className={`rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col backdrop-blur-md overflow-hidden transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-4 z-50 bg-slate-950/95 border-indigo-500/50 shadow-2xl'
          : 'h-[600px] lg:h-[720px]'
      }`}
    >
      {/* Viewer Header Toolbar */}
      <div className="p-3.5 sm:p-4 border-b border-slate-800/80 flex items-center justify-between gap-3 bg-slate-950/60">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            {isImage ? (
              <ImageIcon className="w-4 h-4" />
            ) : isCodeOrText ? (
              <FileCode className="w-4 h-4" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-white truncate">{doc.name}</h3>
            <p className="text-[10px] text-slate-400">
              {storageService.formatBytes(doc.size)} • {doc.pageCount || 1} Page(s) •{' '}
              <span className="text-emerald-400">OCR & Index Verified</span>
            </p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs text-slate-400">
            <button
              onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
              className="p-1.5 hover:text-white rounded hover:bg-slate-800"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] text-slate-300">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
              className="p-1.5 hover:text-white rounded hover:bg-slate-800"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Copy Extracted Text */}
          <button
            onClick={handleCopyText}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Copy Text"
            aria-label="Copy extracted text"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Download File */}
          <button
            onClick={handleDownload}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Download Document"
            aria-label="Download document"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen((f) => !f)}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Viewer Canvas */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-950/40 relative">
        <div
          className="mx-auto transition-transform duration-150 origin-top"
          style={{ transform: `scale(${zoomLevel / 100})`, width: `${(100 / zoomLevel) * 100}%` }}
        >
          {/* PDF Visual Page Simulator */}
          {isPdf && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="p-8 sm:p-12 rounded-xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="font-mono text-[11px] text-slate-400 uppercase tracking-widest">
                      DocuMind PDF Ingestion Engine • Page 1 of {doc.pageCount || 1}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    ID: {doc.id.substring(0, 10)}
                  </span>
                </div>

                <div className="prose prose-invert prose-indigo max-w-none">
                  {doc.extractedText ? (
                    <div className="whitespace-pre-wrap font-sans text-slate-200">
                      {doc.extractedText}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic">No extracted text content available.</p>
                  )}
                </div>

                <div className="pt-8 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Author: {doc.author || 'System Ingest'}</span>
                  <span>Digitally Parsed by DocuMind</span>
                </div>
              </div>
            </div>
          )}

          {/* Markdown / Plain Text Editor-Style Viewer */}
          {isCodeOrText && (
            <div className="max-w-3xl mx-auto rounded-xl bg-slate-900 border border-slate-800 p-6 sm:p-8 font-mono text-xs text-slate-200 shadow-xl overflow-x-auto leading-relaxed">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 text-slate-400 text-[11px]">
                <span>Source File: {doc.name}</span>
                <span>Format: {doc.type.toUpperCase()}</span>
              </div>
              <pre className="whitespace-pre-wrap font-mono leading-relaxed">
                {doc.extractedText || 'No text content available'}
              </pre>
            </div>
          )}

          {/* Image Document Viewer */}
          {isImage && (
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col items-center justify-center">
                <div className="w-24 h-24 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                  <ImageIcon className="w-12 h-12" />
                </div>
                <h4 className="text-sm font-bold text-white">{doc.name}</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md">
                  Visual document indexed via OCR. Text and structure extracted for semantic search and AI Q&A.
                </p>

                <div className="mt-6 w-full text-left p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400/90 whitespace-pre-wrap">
                  {doc.extractedText}
                </div>
              </div>
            </div>
          )}

          {/* Polished Fallback for Word .docx and other binary formats */}
          {!isPdf && !isCodeOrText && !isImage && (
            <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
              <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
                <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{doc.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Microsoft Word Document • {storageService.formatBytes(doc.size)}
                  </p>
                </div>
              </div>

              <div>
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Parsed Document Text Preview</span>
                </h5>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                  {doc.extractedText || 'Structured content parsed by DocuMind text extractor.'}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Original Document</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
