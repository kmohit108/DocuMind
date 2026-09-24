import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import { DocumentProvider } from '@/context/DocumentContext';

export const metadata: Metadata = {
  title: 'DocuMind — AI Document Management & Analysis Platform',
  description:
    'Ingest, organize, preview, summarize, and converse with your documents using intelligent AI.',
  keywords: [
    'AI Document Management',
    'Document Summarization',
    'RAG Chat',
    'PDF Analysis',
    'DocuMind',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  const theme = localStorage.getItem('documind-theme');

                  if (theme === 'light') {
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.classList.remove('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>

      <body className="text-slate-100 min-h-screen antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        <ToastProvider>
          <AuthProvider>
            <DocumentProvider>{children}</DocumentProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}