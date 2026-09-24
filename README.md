# DocuMind — AI Document Management & Analysis Platform

> **DocuMind** is a production-quality, responsive web application for uploading, organizing, searching, previewing, summarizing, and querying documents through an intelligent conversational interface.

---

## 🌟 Features Overview

- **📊 Comprehensive SaaS Dashboard:** Dynamic greetings, KPI metric cards, quick drag-and-drop upload zone, recent documents table, and activity feed.
- **📁 Multi-Faceted Document Library:** Instant full-text search, format filters (PDF, DOCX, TXT, MD, Images), status indicators (Ready, Processing, Failed), multi-criteria sorting, and Grid vs. List view switcher.
- **⚡ Advanced Document Ingestion:** Drag-and-drop file ingestion, client-side format & size validation (20 MB limit), in-flight upload queue with progress bars, retry, and cancellation.
- **📄 Interactive Document Viewer:** Multi-format document viewer with zoom controls (70% - 150%), extracted text copy, simulated PDF pages, Markdown syntax view, and polished Word `.docx` fallbacks.
- **🧠 Executive AI Summary Engine:** Structured summaries, key takeaways checklist, topic/entity extraction, and suggested questions with skeleton loaders.
- **💬 Grounded Ask AI Chat (`/documents/[id]/ask`):** Document-specific multi-turn chat interface with prompt chips, streaming responses, copy actions, clear chat controls, and AI verification disclaimers.
- **⭐ Favorites & 🕒 Recent Activity:** Pinned starred documents and chronological workspace audit log.
- **⚙️ Configurable Workspace Settings:** User profile management, appearance toggles, AI model temperature parameters, storage meter, demo data reset, and Supabase integration panel.
- **🔐 Demo & Production Auth:** 1-Click Demo Login, Sign In, Sign Up, and Forgot Password screens.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 14/15+ (App Router)
- **UI & Logic:** React 19, TypeScript
- **Styling:** Tailwind CSS (Custom Dark SaaS theme, glassmorphism, smooth animations)
- **Icons:** Lucide React
- **State Management:** React Context (`DocumentContext`, `AuthContext`, `ToastContext`)
- **Persistence:** LocalStorage with initial seed fallback
- **Services:** Modular service abstraction layer (`authService`, `documentService`, `aiService`, `storageService`)

---

## 🚀 Getting Started

### 1. Installation

Ensure Node.js (v18+) is installed on your system.

```bash
# Clone or navigate to the project directory
cd documind

# Install dependencies
npm install
```

### 2. Running Locally in Demo Mode

The application works completely out-of-the-box in **Demo Mode** without any backend or external API keys:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout with Toast, Auth & Document providers
│   ├── page.tsx                      # SaaS Landing & overview page
│   ├── dashboard/page.tsx            # Dashboard with stats, recent docs, quick upload
│   ├── documents/
│   │   ├── page.tsx                  # Document library (search, filters, sort, grid/list)
│   │   └── [id]/
│   │       ├── page.tsx              # Document detail (viewer + AI summary + metadata)
│   │       └── ask/page.tsx          # Ask AI chat interface for document
│   ├── favorites/page.tsx            # Filtered favorites view
│   ├── recent/page.tsx               # Recent documents & activity timeline
│   ├── settings/page.tsx             # Profile, Appearance, AI config, Storage, Supabase setup
│   ├── login/page.tsx                # Sign In (with 1-click demo login)
│   ├── signup/page.tsx               # Sign Up with demo registration
│   ├── forgot-password/page.tsx      # Password reset flow
│   └── not-found.tsx                 # 404 handler
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx               # Collapsible desktop sidebar + mobile drawer
│   │   ├── Header.tsx                # Top app bar with search, quick actions, user menu
│   │   └── AppShell.tsx              # Application layout orchestrator
│   ├── dashboard/
│   │   ├── StatsOverview.tsx         # 4 KPI metric cards
│   │   ├── QuickDropzone.tsx         # Dashboard quick drag-and-drop card
│   │   ├── RecentDocumentsTable.tsx  # Quick view table of latest documents
│   │   └── ActivityFeed.tsx          # Real-time activity feed
│   ├── documents/
│   │   ├── DocumentCard.tsx          # Grid view card with badges and actions
│   │   ├── DocumentListItem.tsx      # List view row with metadata
│   │   ├── DocumentFilters.tsx       # Search, type, status, and sort controls
│   │   ├── DocumentViewer.tsx        # Responsive document previewer
│   │   ├── RenameModal.tsx           # Rename document dialog
│   │   └── DeleteConfirmModal.tsx    # Confirmation modal for deletion
│   ├── upload/
│   │   ├── UploadModal.tsx           # Global upload dialog
│   │   ├── Dropzone.tsx              # Drag-and-drop zone with validation
│   │   └── UploadQueue.tsx           # Multi-file queue with progress tracking
│   ├── ai/
│   │   ├── SummaryPanel.tsx          # AI Summary, Key Points, Topics, Questions
│   │   ├── AskAIChat.tsx             # Interactive chat with streaming effect
│   │   ├── SuggestedQuestions.tsx    # One-click prompt pills
│   │   └── AISkeleton.tsx            # AI generation skeleton loader
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Badge.tsx
│       ├── Modal.tsx
│       ├── Dropdown.tsx
│       └── Tabs.tsx
├── context/
│   ├── AuthContext.tsx               # Authentication state & settings
│   ├── DocumentContext.tsx           # Document library state & upload queue
│   └── ToastContext.tsx              # Toast notifications
├── services/
│   ├── authService.ts                # Auth API abstraction
│   ├── documentService.ts            # Document CRUD abstraction
│   ├── aiService.ts                  # AI Summarize & Ask AI engine
│   └── storageService.ts             # File upload simulation & text extraction
├── data/
│   ├── mockDocuments.ts              # Rich realistic sample documents
│   └── mockActivities.ts             # Activity seed data
└── types/
    └── index.ts                      # Core TypeScript definitions
```

---

## 🔒 Security & Service Abstractions

1. **Zero Client Secret Exposure:** No API keys or Supabase secrets are baked into client-side code.
2. **Modular Architecture:** All backend interactions flow through typed services (`src/services/*`), allowing seamless plug-and-play connection to Supabase Auth, PostgreSQL `pgvector`, and server-side LLM endpoints.

---

## ⚡ Production Supabase & AI Setup Guide

To connect a live Supabase backend and AI model APIs:

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Set your Supabase URL and Anon Key in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Set your server-side AI API Key:
   ```env
   ANTHROPIC_API_KEY=sk-ant-api03-...
   # or
   OPENAI_API_KEY=sk-proj-...
   ```
4. Replace `src/services/aiService.ts` and `src/services/documentService.ts` calls with Next.js App Router Route Handlers (`/api/ai/summarize`, `/api/ai/ask`, `/api/documents`) that invoke the server-side SDKs securely.

---

## 🧪 Verification & Build

```bash
# Run production build
npm run build

# Start production server
npm run start
```
