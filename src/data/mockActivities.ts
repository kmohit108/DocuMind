import { Activity } from '@/types';

export const INITIAL_MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    type: 'uploaded',
    documentId: 'doc-1',
    documentName: 'DocuMind_Product_Requirements.pdf',
    createdAt: '2026-09-05T09:30:00.000Z',
    description: 'Uploaded document via Quick Dropzone'
  },
  {
    id: 'act-2',
    type: 'summary_generated',
    documentId: 'doc-1',
    documentName: 'DocuMind_Product_Requirements.pdf',
    createdAt: '2026-09-05T09:32:00.000Z',
    description: 'Generated Executive AI Summary & Key Takeaways'
  },
  {
    id: 'act-3',
    type: 'question_asked',
    documentId: 'doc-2',
    documentName: 'Distributed_Systems_Notes_2026.pdf',
    createdAt: '2026-09-04T17:10:00.000Z',
    description: 'Asked question: "How does Raft leader election work?"'
  },
  {
    id: 'act-4',
    type: 'favorited',
    documentId: 'doc-4',
    documentName: 'RAG_Architecture_Research_Paper.pdf',
    createdAt: '2026-09-03T14:40:00.000Z',
    description: 'Added document to Favorites collection'
  },
  {
    id: 'act-5',
    type: 'uploaded',
    documentId: 'doc-3',
    documentName: 'Senior_FullStack_Engineer_Resume.pdf',
    createdAt: '2026-09-03T11:00:00.000Z',
    description: 'Uploaded resume document'
  },
  {
    id: 'act-6',
    type: 'summary_generated',
    documentId: 'doc-6',
    documentName: 'Q3_Financial_Projections_and_Budgets.md',
    createdAt: '2026-08-28T10:05:00.000Z',
    description: 'Extracted key SaaS unit economics and runway projections'
  }
];
