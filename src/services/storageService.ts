import { DocumentType } from '@/types';

export const storageService = {
  /**
   * Identifies document type from extension and mime type
   */
  detectType(fileName: string, mimeType?: string): DocumentType {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (ext === 'pdf' || mimeType?.includes('pdf')) return 'pdf';
    if (ext === 'docx' || ext === 'doc' || mimeType?.includes('word')) return 'docx';
    if (ext === 'txt' || mimeType?.includes('text/plain')) return 'txt';
    if (ext === 'md' || ext === 'markdown') return 'md';
    if (ext === 'png') return 'png';
    if (ext === 'jpg' || ext === 'jpeg') return 'jpg';
    return 'other';
  },

  /**
   * Reads a client-side File as text or provides realistic mock content
   */
  async extractText(file: File): Promise<string> {
    const type = this.detectType(file.name, file.type);
    
    // For text and markdown files, read genuine content
    if (type === 'txt' || type === 'md') {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string) || '');
        reader.onerror = () => resolve(`Document text content from ${file.name}`);
        reader.readAsText(file);
      });
    }

    // For images, generate realistic OCR-like mock extracted text
    if (type === 'png' || type === 'jpg' || type === 'jpeg') {
      return `# Image Document Analysis: ${file.name}
Extracted Visual Data & OCR Text:
- Document Type: Visual Graphic / Diagram / Screenshot
- Ingested Resolution: Auto-Detected
- Extracted Headers: System Architecture & Workflow Diagram
- Key Text Blocks: Client Frontend -> Service Layer -> Vector Database -> LLM Pipeline`;
    }

    // For PDF and DOCX, create structured extracted mock representation
    return `# Document Preview: ${file.name}

## Extracted Content Overview
- File Name: ${file.name}
- Size: ${(file.size / 1024).toFixed(1)} KB
- Ingested: ${new Date().toLocaleDateString()}

### Section 1: Executive Summary
This document contains technical specifications, project objectives, and operational guidelines parsed by the DocuMind ingestion engine.

### Section 2: Key Details & Data Points
1. Standardized formatting and multi-source document ingestion.
2. Semantic indexing applied for low-latency contextual search.
3. Automated summary generation ready for downstream review.`;
  },

  /**
   * Creates a local Object URL for client-side preview (if image or PDF)
   */
  createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  },

  /**
   * Formats bytes into human readable format (KB, MB, GB)
   */
  formatBytes(bytes: number, decimals = 1): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
};
