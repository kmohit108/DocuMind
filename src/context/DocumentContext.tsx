'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { DocumentItem, Activity, UploadQueueItem, DocumentFiltersState, ViewMode, SortOption } from '@/types';
import { documentService } from '@/services/documentService';
import { aiService } from '@/services/aiService';
import { storageService } from '@/services/storageService';
import { useToast } from './ToastContext';

interface DocumentContextType {
  documents: DocumentItem[];
  activities: Activity[];
  isLoading: boolean;
  filteredDocuments: DocumentItem[];
  filters: DocumentFiltersState;
  viewMode: ViewMode;
  uploadQueue: UploadQueueItem[];
  isUploadModalOpen: boolean;
  activeRenameDoc: DocumentItem | null;
  activeDeleteDoc: DocumentItem | null;
  setFilters: React.Dispatch<React.SetStateAction<DocumentFiltersState>>;
  updateFilter: <K extends keyof DocumentFiltersState>(key: K, value: DocumentFiltersState[K]) => void;
  resetFilters: () => void;
  setViewMode: (mode: ViewMode) => void;
  setIsUploadModalOpen: (open: boolean) => void;
  setActiveRenameDoc: (doc: DocumentItem | null) => void;
  setActiveDeleteDoc: (doc: DocumentItem | null) => void;
  handleUploadFiles: (files: FileList | File[]) => Promise<void>;
  cancelUpload: (id: string) => void;
  retryUpload: (id: string) => Promise<void>;
  removeQueueItem: (id: string) => void;
  handleDeleteDocument: (id: string) => Promise<boolean>;
  handleRenameDocument: (id: string, newName: string) => Promise<DocumentItem | null>;
  handleToggleFavorite: (id: string) => Promise<void>;
  handleGenerateSummary: (id: string) => Promise<void>;
  refreshDocuments: () => Promise<void>;
  resetToMockData: () => Promise<void>;
}

const DEFAULT_FILTERS: DocumentFiltersState = {
  search: '',
  type: 'all',
  status: 'all',
  favoritesOnly: false,
  sortBy: 'newest',
  tag: '',
};

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<DocumentFiltersState>(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeRenameDoc, setActiveRenameDoc] = useState<DocumentItem | null>(null);
  const [activeDeleteDoc, setActiveDeleteDoc] = useState<DocumentItem | null>(null);

  const { success, error, info } = useToast();

  const loadData = useCallback(async () => {
    try {
      const [docs, acts] = await Promise.all([
        documentService.getDocuments(),
        documentService.getActivities(),
      ]);
      setDocuments(docs);
      setActivities(acts);
    } catch (err) {
      console.error('Failed to load document data:', err);
      error('Failed to load documents', 'Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateFilter = useCallback(<K extends keyof DocumentFiltersState>(key: K, value: DocumentFiltersState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // Filtered and Sorted Documents
  const filteredDocuments = useMemo(() => {
    let result = [...documents];

    // Search query match across name, tags, and type
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase().trim();
      result = result.filter((doc) => {
        const nameMatch = doc.name.toLowerCase().includes(query);
        const tagMatch = doc.tags.some((t) => t.toLowerCase().includes(query));
        const typeMatch = doc.type.toLowerCase().includes(query);
        const authorMatch = doc.author?.toLowerCase().includes(query);
        return nameMatch || tagMatch || typeMatch || authorMatch;
      });
    }

    // Type filter
    if (filters.type && filters.type !== 'all') {
      result = result.filter((doc) => doc.type.toLowerCase() === filters.type.toLowerCase());
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      result = result.filter((doc) => doc.status.toLowerCase() === filters.status.toLowerCase());
    }

    // Favorites only
    if (filters.favoritesOnly) {
      result = result.filter((doc) => doc.isFavorite);
    }

    // Tag filter
    if (filters.tag) {
      result = result.filter((doc) => doc.tags.includes(filters.tag!));
    }

    // Sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
        case 'oldest':
          return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'size-desc':
          return b.size - a.size;
        case 'size-asc':
          return a.size - b.size;
        default:
          return 0;
      }
    });

    return result;
  }, [documents, filters]);

  // Upload handler with validation & queue management
  const handleUploadFiles = useCallback(
    async (fileInput: FileList | File[]) => {
      const files = Array.from(fileInput);
      if (files.length === 0) return;

      const MAX_SIZE = 20 * 1024 * 1024; // 20 MB PRD limit
      const allowedExts = ['pdf', 'docx', 'doc', 'txt', 'md', 'png', 'jpg', 'jpeg'];

      const newQueueItems: UploadQueueItem[] = files.map((file) => {
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        const isSupported = allowedExts.includes(ext);
        const isOverSize = file.size > MAX_SIZE;

        let status: UploadQueueItem['status'] = 'uploading';
        let errorMessage: string | undefined = undefined;

        if (!isSupported) {
          status = 'failed';
          errorMessage = 'Unsupported file format';
        } else if (isOverSize) {
          status = 'failed';
          errorMessage = 'File exceeds 20 MB demo limit';
        } else if (file.size === 0) {
          status = 'failed';
          errorMessage = 'File is empty';
        }

        return {
          id: `queue-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          file,
          name: file.name,
          size: file.size,
          type: storageService.detectType(file.name, file.type),
          progress: status === 'failed' ? 0 : 5,
          status,
          errorMessage,
        };
      });

      setUploadQueue((prev) => [...newQueueItems, ...prev]);

      // Process valid files sequentially
      for (const item of newQueueItems) {
        if (item.status === 'failed' || !item.file) {
          if (item.errorMessage) {
            error(`Failed to upload ${item.name}`, item.errorMessage);
          }
          continue;
        }

        try {
          // Update progress
          setUploadQueue((prev) =>
            prev.map((q) => (q.id === item.id ? { ...q, status: 'uploading', progress: 30 } : q))
          );

          const newDoc = await documentService.uploadDocument(item.file, (progress) => {
            setUploadQueue((prev) =>
              prev.map((q) => (q.id === item.id ? { ...q, progress } : q))
            );
          });

          // Mark as ready in queue and prepend to documents
          setUploadQueue((prev) =>
            prev.map((q) => (q.id === item.id ? { ...q, status: 'ready', progress: 100 } : q))
          );

          setDocuments((prev) => [newDoc, ...prev]);
          const freshActs = await documentService.getActivities();
          setActivities(freshActs);

          success('Document Uploaded', `"${item.name}" is ready for analysis.`);
        } catch (err) {
          console.error('Upload failed:', err);
          setUploadQueue((prev) =>
            prev.map((q) =>
              q.id === item.id ? { ...q, status: 'failed', errorMessage: 'Upload processing failed' } : q
            )
          );
          error('Upload Error', `Failed to process ${item.name}`);
        }
      }
    },
    [error, success]
  );

  const cancelUpload = useCallback((id: string) => {
    setUploadQueue((prev) => prev.filter((item) => item.id !== id));
    info('Upload Cancelled', 'File removed from queue.');
  }, [info]);

  const retryUpload = useCallback(
    async (id: string) => {
      const item = uploadQueue.find((q) => q.id === id);
      if (!item || !item.file) return;

      setUploadQueue((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: 'uploading', progress: 10, errorMessage: undefined } : q))
      );

      try {
        const newDoc = await documentService.uploadDocument(item.file, (progress) => {
          setUploadQueue((prev) => prev.map((q) => (q.id === id ? { ...q, progress } : q)));
        });

        setUploadQueue((prev) =>
          prev.map((q) => (q.id === id ? { ...q, status: 'ready', progress: 100 } : q))
        );
        setDocuments((prev) => [newDoc, ...prev]);
        const freshActs = await documentService.getActivities();
        setActivities(freshActs);
        success('Document Uploaded', `"${item.name}" has finished processing.`);
      } catch {
        setUploadQueue((prev) =>
          prev.map((q) => (q.id === id ? { ...q, status: 'failed', errorMessage: 'Retry failed' } : q))
        );
        error('Retry Failed', `Could not upload ${item.name}`);
      }
    },
    [uploadQueue, success, error]
  );

  const removeQueueItem = useCallback((id: string) => {
    setUploadQueue((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleDeleteDocument = useCallback(
    async (id: string): Promise<boolean> => {
      const doc = documents.find((d) => d.id === id);
      const name = doc?.name || 'Document';
      
      // Optimistic update
      setDocuments((prev) => prev.filter((d) => d.id !== id));

      try {
        const ok = await documentService.deleteDocument(id);
        if (ok) {
          const freshActs = await documentService.getActivities();
          setActivities(freshActs);
          success('Document Deleted', `"${name}" was permanently removed.`);
          return true;
        } else {
          loadData();
          error('Delete Failed', 'Could not delete document.');
          return false;
        }
      } catch (err) {
        console.error('Delete error:', err);
        loadData();
        error('Delete Failed', 'An unexpected error occurred.');
        return false;
      }
    },
    [documents, loadData, success, error]
  );

  const handleRenameDocument = useCallback(
    async (id: string, newName: string): Promise<DocumentItem | null> => {
      try {
        const updated = await documentService.renameDocument(id, newName);
        if (updated) {
          setDocuments((prev) => prev.map((d) => (d.id === id ? updated : d)));
          const freshActs = await documentService.getActivities();
          setActivities(freshActs);
          success('Document Renamed', `Renamed to "${updated.name}"`);
          return updated;
        }
        return null;
      } catch (err) {
        console.error('Rename error:', err);
        error('Rename Failed', 'Could not rename document.');
        return null;
      }
    },
    [success, error]
  );

  const handleToggleFavorite = useCallback(
    async (id: string) => {
      const doc = documents.find((d) => d.id === id);
      if (!doc) return;

      const newStatus = !doc.isFavorite;

      // Optimistic UI update
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? { ...d, isFavorite: newStatus } : d))
      );

      try {
        await documentService.toggleFavorite(id);
        const freshActs = await documentService.getActivities();
        setActivities(freshActs);
        if (newStatus) {
          success('Added to Favorites', `"${doc.name}" saved to favorites.`);
        } else {
          info('Removed from Favorites', `"${doc.name}" removed from favorites.`);
        }
      } catch {
        loadData();
        error('Action Failed', 'Could not update favorite status.');
      }
    },
    [documents, loadData, success, info, error]
  );

  const handleGenerateSummary = useCallback(
    async (id: string) => {
      const doc = documents.find((d) => d.id === id);
      if (!doc) return;

      try {
        const summary = await aiService.generateSummary(doc);
        const updated = await documentService.updateDocument(id, { summary });
        if (updated) {
          setDocuments((prev) => prev.map((d) => (d.id === id ? updated : d)));
          await documentService.addActivity({
            type: 'summary_generated',
            documentId: id,
            documentName: doc.name,
            description: `Generated AI summary for ${doc.name}`,
          });
          const freshActs = await documentService.getActivities();
          setActivities(freshActs);
          success('Summary Generated', `AI Summary is ready for "${doc.name}".`);
        }
      } catch (err) {
        console.error('Summary generation error:', err);
        error('AI Generation Error', 'Could not generate summary at this time.');
      }
    },
    [documents, success, error]
  );

  const resetToMockData = useCallback(async () => {
    setIsLoading(true);
    try {
      await documentService.resetToMockData();
      await loadData();
      setUploadQueue([]);
      success('Reset Complete', 'Restored sample documents and activity history.');
    } catch {
      error('Reset Failed', 'Could not restore demo data.');
    } finally {
      setIsLoading(false);
    }
  }, [loadData, success, error]);

  return (
    <DocumentContext.Provider
      value={{
        documents,
        activities,
        isLoading,
        filteredDocuments,
        filters,
        viewMode,
        uploadQueue,
        isUploadModalOpen,
        activeRenameDoc,
        activeDeleteDoc,
        setFilters,
        updateFilter,
        resetFilters,
        setViewMode,
        setIsUploadModalOpen,
        setActiveRenameDoc,
        setActiveDeleteDoc,
        handleUploadFiles,
        cancelUpload,
        retryUpload,
        removeQueueItem,
        handleDeleteDocument,
        handleRenameDocument,
        handleToggleFavorite,
        handleGenerateSummary,
        refreshDocuments: loadData,
        resetToMockData,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
}
