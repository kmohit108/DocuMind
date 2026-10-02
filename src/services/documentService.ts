import { DocumentItem, Activity } from '@/types';
import { INITIAL_MOCK_DOCUMENTS } from '@/data/mockDocuments';
import { INITIAL_MOCK_ACTIVITIES } from '@/data/mockActivities';
import { createClient } from '@/lib/supabase/client';
import { storageService } from './storageService';

const BUCKET_NAME = 'documents';

async function getCurrentUser() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('You must be logged in.');
  }

  return { supabase, user };
}

function mapDocument(row: any): DocumentItem {
  return {
    id: row.id,
    name: row.name,
    originalName: row.original_name,
    type: row.type,
    mimeType: row.mime_type || 'application/octet-stream',
    size: Number(row.size || 0),
    uploadedAt: row.uploaded_at,
    updatedAt: row.updated_at,
    status: row.status,
    isFavorite: row.is_favorite,
    tags: row.tags || [],
    pageCount: row.page_count || undefined,
    author: row.author || undefined,
    summary: row.summary || undefined,
    extractedText: row.extracted_text || '',
  };
}

function mapActivity(row: any): Activity {
  return {
    id: row.id,
    type: row.type,
    documentId: row.document_id || undefined,
    documentName: row.document_name || undefined,
    description: row.description || undefined,
    createdAt: row.created_at,
  };
}

export const documentService = {
  async getDocuments(): Promise<DocumentItem[]> {
    const { supabase, user } = await getCurrentUser();

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map(mapDocument);
  },

  async getDocumentById(id: string): Promise<DocumentItem | null> {
    const { supabase, user } = await getCurrentUser();

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? mapDocument(data) : null;
  },

  async uploadDocument(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<DocumentItem> {
    const { supabase, user } = await getCurrentUser();

    const id = `doc-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 7)}`;

    const type = storageService.detectType(file.name, file.type);
    const extractedText = await storageService.extractText(file);

    if (onProgress) onProgress(20);

    const storagePath = `${user.id}/${id}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, file, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    if (onProgress) onProgress(70);

    const now = new Date().toISOString();

    const documentRow = {
      id,
      user_id: user.id,
      name: file.name,
      original_name: file.name,
      type,
      mime_type: file.type || 'application/octet-stream',
      size: file.size,
      uploaded_at: now,
      updated_at: now,
      status: 'ready',
      is_favorite: false,
      tags: [type.toUpperCase(), 'Uploaded'],
      page_count: Math.max(1, Math.ceil(file.size / 150000)),
      author: user.user_metadata?.name || user.email || 'Current User',
      extracted_text: extractedText,
      storage_path: storagePath,
    };

    const { data, error: dbError } = await supabase
      .from('documents')
      .insert(documentRow)
      .select()
      .single();

    if (dbError) {
      await supabase.storage.from(BUCKET_NAME).remove([storagePath]);
      throw new Error(dbError.message);
    }

    if (onProgress) onProgress(100);

    const newDoc = mapDocument(data);

    await this.addActivity({
      type: 'uploaded',
      documentId: newDoc.id,
      documentName: newDoc.name,
      description: `Uploaded ${file.name} (${storageService.formatBytes(
        file.size
      )})`,
    });

    return newDoc;
  },

  async updateDocument(
    id: string,
    updates: Partial<DocumentItem>
  ): Promise<DocumentItem | null> {
    const { supabase, user } = await getCurrentUser();

    const dbUpdates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.originalName !== undefined)
      dbUpdates.original_name = updates.originalName;
    if (updates.type !== undefined) dbUpdates.type = updates.type;
    if (updates.mimeType !== undefined) dbUpdates.mime_type = updates.mimeType;
    if (updates.size !== undefined) dbUpdates.size = updates.size;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.isFavorite !== undefined)
      dbUpdates.is_favorite = updates.isFavorite;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
    if (updates.pageCount !== undefined)
      dbUpdates.page_count = updates.pageCount;
    if (updates.author !== undefined) dbUpdates.author = updates.author;
    if (updates.summary !== undefined) dbUpdates.summary = updates.summary;
    if (updates.extractedText !== undefined)
      dbUpdates.extracted_text = updates.extractedText;

    const { data, error } = await supabase
      .from('documents')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? mapDocument(data) : null;
  },

  async renameDocument(
    id: string,
    newName: string
  ): Promise<DocumentItem | null> {
    const doc = await this.getDocumentById(id);

    if (!doc) return null;

    const trimmed = newName.trim();

    if (!trimmed) return doc;

    const originalExt = doc.name.includes('.')
      ? doc.name.split('.').pop()
      : '';

    let finalName = trimmed;

    if (
      originalExt &&
      !trimmed
        .toLowerCase()
        .endsWith(`.${originalExt.toLowerCase()}`)
    ) {
      finalName = `${trimmed}.${originalExt}`;
    }

    const updated = await this.updateDocument(id, {
      name: finalName,
    });

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

  async toggleFavorite(id: string): Promise<DocumentItem | null> {
    const doc = await this.getDocumentById(id);

    if (!doc) return null;

    const newFav = !doc.isFavorite;

    const updated = await this.updateDocument(id, {
      isFavorite: newFav,
    });

    if (updated && newFav) {
      await this.addActivity({
        type: 'favorited',
        documentId: id,
        documentName: doc.name,
        description: 'Marked as favorite',
      });
    }

    return updated;
  },

  async deleteDocument(id: string): Promise<boolean> {
    const { supabase, user } = await getCurrentUser();

    const { data: row, error: fetchError } = await supabase
      .from('documents')
      .select('name, storage_path')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (fetchError) throw new Error(fetchError.message);

    if (!row) return false;

    if (row.storage_path) {
      await supabase.storage
        .from(BUCKET_NAME)
        .remove([row.storage_path]);
    }

    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteError) throw new Error(deleteError.message);

    await this.addActivity({
      type: 'deleted',
      documentId: id,
      documentName: row.name,
      description: 'Deleted document',
    });

    return true;
  },

  async getFavorites(): Promise<DocumentItem[]> {
    const docs = await this.getDocuments();

    return docs.filter((doc) => doc.isFavorite);
  },

  async getRecentDocuments(limit = 8): Promise<DocumentItem[]> {
    const docs = await this.getDocuments();

    return [...docs]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() -
          new Date(a.updatedAt).getTime()
      )
      .slice(0, limit);
  },

  async getActivities(): Promise<Activity[]> {
    const { supabase, user } = await getCurrentUser();

    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw new Error(error.message);

    return (data || []).map(mapActivity);
  },

  async addActivity(
    act: Omit<Activity, 'id' | 'createdAt'>
  ): Promise<Activity> {
    const { supabase, user } = await getCurrentUser();

    const activityRow = {
      id: `act-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 7)}`,
      user_id: user.id,
      type: act.type,
      document_id: act.documentId || null,
      document_name: act.documentName || null,
      description: act.description || null,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('activities')
      .insert(activityRow)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return mapActivity(data);
  },

  async resetToMockData(): Promise<void> {
    const { supabase, user } = await getCurrentUser();

    const documents = INITIAL_MOCK_DOCUMENTS.map((doc) => ({
      id: doc.id,
      user_id: user.id,
      name: doc.name,
      original_name: doc.originalName,
      type: doc.type,
      mime_type: doc.mimeType,
      size: doc.size,
      uploaded_at: doc.uploadedAt,
      updated_at: doc.updatedAt,
      status: doc.status,
      is_favorite: doc.isFavorite,
      tags: doc.tags,
      page_count: doc.pageCount || null,
      author: doc.author || null,
      summary: doc.summary || null,
      extracted_text: doc.extractedText || null,
    }));

    const activities = INITIAL_MOCK_ACTIVITIES.map((act) => ({
      id: act.id,
      user_id: user.id,
      type: act.type,
      document_id: act.documentId || null,
      document_name: act.documentName || null,
      description: act.description || null,
      created_at: act.createdAt,
    }));

    const { error: docsError } = await supabase
      .from('documents')
      .upsert(documents);

    if (docsError) throw new Error(docsError.message);

    const { error: actsError } = await supabase
      .from('activities')
      .upsert(activities);

    if (actsError) throw new Error(actsError.message);
  },
};