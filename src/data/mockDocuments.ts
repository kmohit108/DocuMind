import { DocumentItem } from '@/types';

export const INITIAL_MOCK_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    name: 'DocuMind_Product_Requirements.pdf',
    originalName: 'DocuMind_Product_Requirements.pdf',
    type: 'pdf',
    mimeType: 'application/pdf',
    size: 2458000,
    uploadedAt: '2026-09-05T09:30:00.000Z',
    updatedAt: '2026-09-06T14:15:00.000Z',
    status: 'ready',
    isFavorite: true,
    tags: ['Product', 'PRD', 'Architecture', 'AI-SaaS'],
    pageCount: 18,
    author: 'DocuMind Product Team',
    summary: {
      overview: 'Comprehensive Product Requirements Document detailing the frontend-first architecture, component design, responsive layouts, and AI integration workflows for DocuMind. The document emphasizes clean service abstractions for Supabase and LLM APIs.',
      keyPoints: [
        'Modular Next.js 14+ App Router architecture with Tailwind CSS styling and zero hardcoded secrets.',
        'Unified document management featuring instant search, multi-faceted filtering, sorting, and grid/list views.',
        'Asynchronous document upload pipeline with drag-and-drop, client-side validation, and progress tracking.',
        'Context-aware AI Document Assistant providing structured executive summaries and conversational Q&A.',
        'Prepared service abstraction layers for Supabase Auth, Storage, PostgreSQL, and AI Providers.'
      ],
      topics: ['Document AI', 'Frontend Architecture', 'Service Abstractions', 'Supabase Integration', 'Next.js App Router'],
      suggestedQuestions: [
        'What are the key requirements for the upload pipeline?',
        'How should Supabase integration be structured?',
        'What are the primary features of the AI Document Assistant?',
        'What file formats are supported for document analysis?'
      ],
      generatedAt: '2026-09-05T09:32:00.000Z'
    },
    extractedText: `# DocuMind — AI Document Management & Analysis Platform

## Executive Summary
DocuMind is an intelligent document management system designed to streamline document ingestion, semantic search, automated summarization, and multi-turn conversational analysis.

### System Architecture
1. Frontend Client: Next.js 14/15, Tailwind CSS, Lucide Icons, Local State & Persistence.
2. Service Layer: Abstracted connectors for Supabase Storage, Auth, Database, and Multi-Provider AI (OpenAI, Anthropic, Gemini).
3. Document Engine: File parsing, chunking simulation, metadata extraction, and vector index preparation.

### Core User Journeys
- Fast Ingestion: Drag & drop multiple documents with real-time feedback.
- Instant Search: Full-text, tag-based, and type-based instantaneous filtering.
- Deep Insights: Generate hierarchical executive summaries and ask complex analytical questions with grounded citations.`
  },
  {
    id: 'doc-2',
    name: 'Distributed_Systems_Notes_2026.pdf',
    originalName: 'Distributed_Systems_Notes_2026.pdf',
    type: 'pdf',
    mimeType: 'application/pdf',
    size: 4120000,
    uploadedAt: '2026-09-04T16:20:00.000Z',
    updatedAt: '2026-09-04T16:20:00.000Z',
    status: 'ready',
    isFavorite: true,
    tags: ['Engineering', 'Distributed Systems', 'Raft', 'Consensus'],
    pageCount: 34,
    author: 'Prof. J. Henderson (MIT Distributed Lab)',
    summary: {
      overview: 'Comprehensive university-level lecture notes exploring consensus algorithms, Byzantine Fault Tolerance, Raft consensus protocol, vector clocks, and distributed transactions (2PC/3PC).',
      keyPoints: [
        'Detailed comparison between Paxos and Raft leader election and log replication mechanisms.',
        'CAP Theorem practical trade-offs: Consistency vs Availability in partition-prone network environments.',
        'Vector clocks and Lamport timestamps for causal ordering of asynchronous events.',
        'Two-Phase Locking (2PL) vs Optimistic Concurrency Control (OCC) in modern cloud data stores.'
      ],
      topics: ['Raft Consensus', 'CAP Theorem', 'Vector Clocks', 'Distributed Transactions', 'Byzantine Faults'],
      suggestedQuestions: [
        'How does Raft handle network partitions during leader election?',
        'What is the difference between strong consistency and eventual consistency?',
        'Explain the phases of the Two-Phase Commit (2PC) protocol.',
        'How do vector clocks detect concurrent modifications?'
      ],
      generatedAt: '2026-09-04T16:22:30.000Z'
    },
    extractedText: `# Distributed Systems & Consensus Protocols (CS-6824)

## Module 1: Fundamental Consensus & The Raft Protocol
In distributed computing, achieving consensus among independent nodes is critical for state machine replication.

### Raft Consensus Breakdown
1. Leader Election: When a follower misses heartbeat intervals, it transitions to candidate state and requests votes.
2. Log Replication: The leader receives client commands, appends them to its log, and broadcasts AppendEntries RPCs.
3. Safety Invariant: A candidate can only win an election if its log contains all committed entries from prior terms.`
  },
  {
    id: 'doc-3',
    name: 'Senior_FullStack_Engineer_Resume.pdf',
    originalName: 'Senior_FullStack_Engineer_Resume.pdf',
    type: 'pdf',
    mimeType: 'application/pdf',
    size: 512000,
    uploadedAt: '2026-09-03T11:00:00.000Z',
    updatedAt: '2026-09-03T11:00:00.000Z',
    status: 'ready',
    isFavorite: false,
    tags: ['Career', 'Resume', 'FullStack', 'React', 'Next.js'],
    pageCount: 2,
    author: 'Alex Morgan',
    summary: {
      overview: 'Professional resume of a Senior Full Stack Engineer with 6+ years of experience leading engineering teams, developing AI-driven SaaS applications, and architecting scalable cloud platforms.',
      keyPoints: [
        'Specialized in React, Next.js, TypeScript, Node.js, Python, PostgreSQL, and AWS/Vercel cloud ecosystems.',
        'Led frontend architecture at FinTech AI startup, reducing page load latency by 45% and scaling to 250k MAU.',
        'Implemented enterprise-grade RAG pipeline using LangChain, Supabase pgvector, and Claude 3.5 Sonnet.',
        'Championed automated CI/CD testing, design systems, and web accessibility standards (WCAG 2.1 AA).'
      ],
      topics: ['Full Stack Development', 'React & Next.js', 'System Architecture', 'Cloud Deployment', 'Team Leadership'],
      suggestedQuestions: [
        'What are the candidate’s core technical competencies?',
        'What achievements did the candidate accomplish in their previous role?',
        'What experience does the candidate have with AI and RAG architectures?',
        'What educational background and certifications are listed?'
      ],
      generatedAt: '2026-09-03T11:03:00.000Z'
    },
    extractedText: `# Alex Morgan — Senior Full-Stack Engineer
Email: alex.morgan@example.com | GitHub: github.com/alexmorgan | LinkedIn: linkedin.com/in/alexmorgan-dev

## Summary
Passionate Full-Stack Software Engineer with 6+ years of expertise in building enterprise web applications, real-time collaboration platforms, and AI-enabled product ecosystems.

## Technical Skills
- Languages: TypeScript, JavaScript (ES6+), Python, SQL, HTML5, CSS3/Tailwind
- Frameworks: React, Next.js, Node.js, Express, Fastify, FastAPI, Tailwind CSS
- Databases & Cloud: PostgreSQL, Supabase, Redis, Docker, AWS (S3, Lambda, ECS), Vercel`
  },
  {
    id: 'doc-4',
    name: 'RAG_Architecture_Research_Paper.pdf',
    originalName: 'RAG_Architecture_Research_Paper.pdf',
    type: 'pdf',
    mimeType: 'application/pdf',
    size: 1890000,
    uploadedAt: '2026-09-02T18:45:00.000Z',
    updatedAt: '2026-09-02T18:45:00.000Z',
    status: 'ready',
    isFavorite: true,
    tags: ['Research', 'AI', 'RAG', 'VectorDB', 'LLM'],
    pageCount: 14,
    author: 'AI Research Institute',
    summary: {
      overview: 'Research publication investigating hybrid retrieval strategies in Retrieval-Augmented Generation (RAG), combining sparse BM25 indexing with dense semantic vector search and re-ranking.',
      keyPoints: [
        'Demonstrates a 28% reduction in hallucination rates when combining dense embeddings with cross-encoder re-rankers.',
        'Evaluates chunking strategies: hierarchical parent-child chunking vs fixed-size sliding window chunking.',
        'Explores agentic multi-hop query routing and self-reflective query refinement.',
        'Benchmarks latency and cost trade-offs across open-source and proprietary embedding models.'
      ],
      topics: ['Retrieval-Augmented Generation', 'Hybrid Search', 'Cross-Encoder Re-Ranking', 'Hallucination Mitigation'],
      suggestedQuestions: [
        'How does hybrid retrieval improve retrieval accuracy?',
        'What are the findings regarding chunk size and overlap?',
        'What role does the cross-encoder re-ranker play in the pipeline?',
        'How does the paper propose mitigating model hallucinations?'
      ],
      generatedAt: '2026-09-02T18:48:00.000Z'
    },
    extractedText: `# Hybrid Retrieval & Adaptive Re-Ranking for Domain-Specific RAG Systems

## Abstract
Retrieval-Augmented Generation (RAG) significantly empowers Large Language Models (LLMs) with external non-parametric memory. This paper introduces an adaptive hybrid pipeline combining BM25 keyword matching with high-dimensional vector embeddings and cross-encoder scoring.

## Methodology
1. Document Preprocessing: Recursive chunking with contextual metadata enrichment.
2. Dual Indexing: Sparse inverted index paired with HNSW vector index.
3. Reciprocal Rank Fusion: Merging top-K candidates before passing to fine-tuned re-rankers.`
  },
  {
    id: 'doc-5',
    name: 'Enterprise_Master_Services_Agreement.docx',
    originalName: 'Enterprise_Master_Services_Agreement.docx',
    type: 'docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 1140000,
    uploadedAt: '2026-09-01T14:10:00.000Z',
    updatedAt: '2026-09-01T14:10:00.000Z',
    status: 'ready',
    isFavorite: false,
    tags: ['Legal', 'Contract', 'Enterprise', 'Compliance'],
    pageCount: 12,
    author: 'Legal Counsel Group',
    summary: {
      overview: 'Standard B2B Master Services Agreement (MSA) defining service level agreements (SLAs), data security obligations, intellectual property rights, indemnification, and liability caps.',
      keyPoints: [
        'Defines 99.9% monthly service uptime commitment with graduated service credit remedies.',
        'Strict GDPR & SOC2 Type II compliance clauses governing customer confidential data handling.',
        'Mutual indemnification covering third-party IP infringement and data breach liabilities.',
        'Termination clauses specifying a 30-day cure period for material breach and transition assistance.'
      ],
      topics: ['SLA Commitments', 'Data Privacy & GDPR', 'Intellectual Property', 'Liability Caps', 'Termination Terms'],
      suggestedQuestions: [
        'What is the agreed uptime SLA and what are the remedies for breach?',
        'What are the limitations of liability under this agreement?',
        'What data protection standards are mandated for stored customer data?',
        'What are the conditions for termination for cause?'
      ],
      generatedAt: '2026-09-01T14:12:00.000Z'
    },
    extractedText: `# Master Services Agreement (MSA)

This Master Services Agreement is entered into between Provider and Customer as of the Effective Date.

### Section 1: Services & Service Level Agreements
Provider shall deliver cloud platform services with a 99.9% uptime target, calculated on a calendar monthly basis.

### Section 2: Data Protection & Security
Provider agrees to maintain administrative, physical, and technical safeguards in alignment with ISO 27001 and SOC 2 standards.`
  },
  {
    id: 'doc-6',
    name: 'Q3_Financial_Projections_and_Budgets.md',
    originalName: 'Q3_Financial_Projections_and_Budgets.md',
    type: 'md',
    mimeType: 'text/markdown',
    size: 284000,
    uploadedAt: '2026-08-28T10:00:00.000Z',
    updatedAt: '2026-08-28T10:00:00.000Z',
    status: 'ready',
    isFavorite: false,
    tags: ['Finance', 'Q3', 'Budget', 'Projections', 'SaaS Metrics'],
    pageCount: 5,
    author: 'Finance Strategy Directorate',
    summary: {
      overview: 'Quarterly financial forecast analyzing ARR expansion, cloud infrastructure unit economics, customer acquisition costs (CAC), and runway calculations for FY2026.',
      keyPoints: [
        'Projected 38% QoQ ARR growth reaching $2.8M by end of Q3 FY26.',
        'Gross margins improved to 81% following token optimization and database tier caching.',
        'Net Dollar Retention (NDR) sustained at 124% across enterprise tier customers.',
        'Operating runway estimated at 22 months under conservative hiring scenarios.'
      ],
      topics: ['ARR Growth', 'Unit Economics', 'Net Retention', 'Runway Analysis', 'COGS Optimization'],
      suggestedQuestions: [
        'What is the projected ARR for the current quarter?',
        'How did token optimization impact gross margin percentage?',
        'What is the current Net Dollar Retention (NDR) rate?',
        'What are the main budget allocations across R&D and Marketing?'
      ],
      generatedAt: '2026-08-28T10:05:00.000Z'
    },
    extractedText: `# Q3 FY2026 Financial Projections & SaaS Unit Economics

## 1. Executive Summary
Financial forecast for Q3 demonstrates strong expansion metrics, lower customer acquisition costs, and improved gross margins driven by AI infrastructure optimizations.

### Key Metrics Dashboard
- Current ARR: $2.42M
- Projected Q3 ARR: $2.80M (+38% QoQ)
- Gross Margin: 81.4%
- Net Dollar Retention (NDR): 124%
- LTV / CAC Ratio: 4.8x
- Cash Runway: 22 Months`
  }
];
