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
    if (ext === 'md' || mimeType?.includes('markdown')) return 'md';
    if (ext === 'png') return 'png';
    if (ext === 'jpg' || ext === 'jpeg') return 'jpg';

    return 'other';
  },

  /**
   * Extracts text from uploaded files
   */
  async extractText(file: File): Promise<string> {
    const type = this.detectType(file.name, file.type);

    // TXT / Markdown
    if (type === 'txt' || type === 'md') {
      return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = () => {
          resolve((reader.result as string) || '');
        };

        reader.onerror = () => {
          resolve(`Unable to read ${file.name}`);
        };

        reader.readAsText(file);
      });
    }

    // PDF
    // PDF
if (type === 'pdf') {
  try {
    const pdfjsLib = await import('pdfjs-dist');

    pdfjsLib.GlobalWorkerOptions.workerSrc =
      `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
    }).promise;

    let fullText = '';

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();

      const pageText = textContent.items
        .map((item) => {
          if ('str' in item) {
            return item.str;
          }

          return '';
        })
        .join(' ');

      fullText += `\n\n--- Page ${pageNumber} ---\n${pageText}`;
    }

    return fullText.trim() || `No readable text found in ${file.name}`;
  } catch (error) {
    console.error('PDF text extraction failed:', error);

    return `Unable to extract text from ${file.name}`;
  }
}

    // Images
    if (type === 'png' || type === 'jpg' || type === 'jpeg') {
      return `# Image Document: ${file.name}

Image uploaded successfully.

OCR extraction is not available yet for image documents.`;
    }

    // DOCX / DOC / Other
    return `Document name: ${file.name}
File type: ${type}
File size: ${(file.size / 1024).toFixed(1)} KB

Text extraction for this file type is not available yet.`;
  },

  /**
   * Creates a local Object URL for client-side preview
   */
  createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  },

  /**
   * Formats bytes into human readable format
   */
  formatBytes(bytes: number, decimals = 1): string {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;

    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k,));

    return (
      parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) +
      ' ' +
      sizes[i]
    );
  },
};