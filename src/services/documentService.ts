import { DocumentItem, Activity, UploadQueueItem } from '@/types';
import { INITIAL_MOCK_DOCUMENTS } from '@/data/mockDocuments';
import { INITIAL_MOCK_ACTIVITIES } from '@/data/mockActivities';
import { storageService } from './storageService';

const STORAGE_DOCS_KEY = 'documind_documents_v1';
const STORAGE_ACTS_KEY = 'documind_activities_v1';

export const documentService = {
  /**
   * Retrieves all documents from local storage or returns initial mock seeds
   */
  async getDocuments(): Promise<DocumentItem[]> {
    if (typeof window === 'undefined') return INITIAL_MOCK_DOCUMENTS;
    try {
      const stored = localStorage.getItem(STORAGE_DOCS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(STORAGE_DOCS_KEY, JSON.stringify(INITIAL_MOCK_DOCUMENTS));
      return INITIAL_MOCK_DOCUMENTS;
    } catch {
      return INITIAL_MOCK_DOCUMENTS;
    }
  },

  /**
   * Fetch single document by ID
   */
  async getDocumentById(id: string): Promise<DocumentItem | null> {
    const docs = await this.getDocuments();
    return docs.find((d) => d.id === id) || null;
  },

  /**
   * Simulates uploading a new document
   */
  async uploadDocument(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<DocumentItem> {
    // Progress simulation
    if (onProgress) {
      for (let p = 15; p <= 90; p += 25) {
        onProgress(p);
        await new Promise((r) => setTimeout(r, 120));
      }
    }

    const type = storageService.detectType(file.name, file.type);
    const extractedText = await storageService.extractText(file);

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: file.name,
      originalName: file.name,
      type,
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
      uploadedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'ready',
      isFavorite: false,
      tags: [type.toUpperCase(), 'Uploaded'],
      pageCount: Math.max(1, Math.ceil(file.size / 150000)),
      author: 'Current User',
      extractedText,
    };

    if (onProgress) onProgress(100);

    const docs = await this.getDocuments();
    const updated = [newDoc, ...docs];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_DOCS_KEY, JSON.stringify(updated));
    }

    await this.addActivity({
      type: 'uploaded',
      documentId: newDoc.id,
      documentName: newDoc.name,
      description: `Uploaded ${file.name} (${storageService.formatBytes(file.size)})`,
    });

    return newDoc;
  },

  /**
   * Updates an existing document
   */
  async updateDocument(id: string, updates: Partial<DocumentItem>): Promise<DocumentItem | null> {
    const docs = await this.getDocuments();
    const index = docs.findIndex((d) => d.id === id);
    if (index === -1) return null;

    const updatedDoc: DocumentItem = {
      ...docs[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    docs[index] = updatedDoc;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_DOCS_KEY, JSON.stringify(docs));
    }
    return updatedDoc;
  },

  /**
   * Renames a document
   */
  async renameDocument(id: string, newName: string): Promise<DocumentItem | null> {
    const doc = await this.getDocumentById(id);
    if (!doc) return null;

    const trimmed = newName.trim();
    if (!trimmed) return doc;

    // Ensure extension remains if user omitted it
    const originalExt = doc.name.includes('.') ? doc.name.split('.').pop() : '';
    let finalName = trimmed;
    if (originalExt && !trimmed.toLowerCase().endsWith(`.${originalExt.toLowerCase()}`)) {
      finalName = `${trimmed}.${originalExt}`;
    }

    const updated = await this.updateDocument(id, { name: finalName });
    if (updated) {
      await this.addActivity({
        type: 'renamed',
        documentId: id,
        documentName: finalName,
        description: `Renamed from "${doc.name}" to "${finalName}"`,
      });
    }
    return updated;
  },

  /**
   * Toggles favorite status
   */
  async toggleFavorite(id: string): Promise<DocumentItem | null> {
    const doc = await this.getDocumentById(id);
    if (!doc) return null;

    const newFav = !doc.isFavorite;
    const updated = await this.updateDocument(id, { isFavorite: newFav });
    if (updated && newFav) {
      await this.addActivity({
        type: 'favorited',
        documentId: id,
        documentName: doc.name,
        description: `Marked as favorite`,
      });
    }
    return updated;
  },

  /**
   * Deletes a document
   */
  async deleteDocument(id: string): Promise<boolean> {
    const docs = await this.getDocuments();
    const doc = docs.find((d) => d.id === id);
    if (!doc) return false;

    const filtered = docs.filter((d) => d.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_DOCS_KEY, JSON.stringify(filtered));
    }

    await this.addActivity({
      type: 'deleted',
      documentId: id,
      documentName: doc.name,
      description: `Deleted document`,
    });

    return true;
  },

  /**
   * Gets favorite documents
   */
  async getFavorites(): Promise<DocumentItem[]> {
    const docs = await this.getDocuments();
    return docs.filter((d) => d.isFavorite);
  },

  /**
   * Gets recent documents
   */
  async getRecentDocuments(limit = 8): Promise<DocumentItem[]> {
    const docs = await this.getDocuments();
    return [...docs]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit);
  },

  /**
   * Retrieves activities
   */
  async getActivities(): Promise<Activity[]> {
    if (typeof window === 'undefined') return INITIAL_MOCK_ACTIVITIES;
    try {
      const stored = localStorage.getItem(STORAGE_ACTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(STORAGE_ACTS_KEY, JSON.stringify(INITIAL_MOCK_ACTIVITIES));
      return INITIAL_MOCK_ACTIVITIES;
    } catch {
      return INITIAL_MOCK_ACTIVITIES;
    }
  },

  /**
   * Adds an activity
   */
  async addActivity(act: Omit<Activity, 'id' | 'createdAt'>): Promise<Activity> {
    const newActivity: Activity = {
      ...act,
      id: `act-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const acts = await this.getActivities();
    const updated = [newActivity, ...acts.slice(0, 49)];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_ACTS_KEY, JSON.stringify(updated));
    }
    return newActivity;
  },

  /**
   * Resets data to initial rich seed state
   */
  async resetToMockData(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_DOCS_KEY, JSON.stringify(INITIAL_MOCK_DOCUMENTS));
      localStorage.setItem(STORAGE_ACTS_KEY, JSON.stringify(INITIAL_MOCK_ACTIVITIES));
    }
  },
};
