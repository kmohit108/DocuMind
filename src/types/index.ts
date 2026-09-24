export type DocumentType = 'pdf' | 'docx' | 'txt' | 'md' | 'png' | 'jpg' | 'jpeg' | 'other';
export type ProcessingStatus = 'ready' | 'processing' | 'failed';

export interface DocumentSummary {
  overview: string;
  keyPoints: string[];
  topics: string[];
  suggestedQuestions: string[];
  generatedAt: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  originalName: string;
  type: DocumentType;
  mimeType: string;
  size: number;
  url?: string;
  uploadedAt: string;
  updatedAt: string;
  status: ProcessingStatus;
  isFavorite: boolean;
  tags: string[];
  summary?: DocumentSummary;
  extractedText?: string;
  pageCount?: number;
  author?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  isDemo?: boolean;
}

export type ActivityType = 
  | 'uploaded' 
  | 'summary_generated' 
  | 'question_asked' 
  | 'favorited' 
  | 'renamed' 
  | 'deleted';

export interface Activity {
  id: string;
  type: ActivityType;
  documentId: string;
  documentName: string;
  createdAt: string;
  description?: string;
}

export interface ChatMessage {
  id: string;
  documentId: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: string;
  suggestedQuestions?: string[];
  isStreaming?: boolean;
}

export interface UploadQueueItem {
  id: string;
  file?: File;
  name: string;
  size: number;
  type: DocumentType;
  progress: number;
  status: 'uploading' | 'processing' | 'ready' | 'failed';
  errorMessage?: string;
}

export type SortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'size-desc' | 'size-asc';
export type ViewMode = 'grid' | 'list';

export interface DocumentFiltersState {
  search: string;
  type: string;
  status: string;
  favoritesOnly: boolean;
  sortBy: SortOption;
  tag?: string;
}

export interface UserSettings {
  name: string;
  email: string;
  theme: 'dark' | 'light' | 'system';
  density: 'comfortable' | 'compact';
  emailNotifications: boolean;
  summaryAlerts: boolean;
  aiModel: string;
  aiTemperature: number;
  storageUsed: number;
  storageLimit: number;
}
