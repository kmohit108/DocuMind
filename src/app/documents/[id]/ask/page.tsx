'use client';

import React, { use, useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { AskAIChat } from '@/components/ai/AskAIChat';
import { useDocuments } from '@/context/DocumentContext';
import { DocumentItem } from '@/types';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AskAIPageProps {
  params: Promise<{ id: string }>;
}

function AskAIPageContent({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const initialQuestion = searchParams.get('initial') || undefined;

  const { documents, isLoading } = useDocuments();
  const [document, setDocument] = useState<DocumentItem | null>(null);

  useEffect(() => {
    if (documents.length > 0) {
      const found = documents.find((d) => d.id === id);
      setDocument(found || null);
    }
  }, [documents, id]);

  if (isLoading) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 max-w-lg mx-auto my-12 space-y-4">
        <h3 className="text-lg font-bold text-white">Document Not Found</h3>
        <p className="text-xs text-slate-400">
          The requested document could not be loaded for AI conversation.
        </p>
        <Link href="/documents">
          <Button variant="primary" size="sm" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
            Back to Documents
          </Button>
        </Link>
      </div>
    );
  }

  return <AskAIChat document={document} initialQuestion={initialQuestion} />;
}

export default function AskAIPage({ params }: AskAIPageProps) {
  const resolvedParams = use(params);

  return (
    <AppShell>
      <Suspense
        fallback={
          <div className="h-[500px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        }
      >
        <AskAIPageContent id={resolvedParams.id} />
      </Suspense>
    </AppShell>
  );
}
