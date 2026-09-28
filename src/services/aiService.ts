import { DocumentItem, DocumentSummary, ChatMessage } from '@/types';

async function callGemini(prompt: string): Promise<string> {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'AI request failed');
  }

  return data.text;
}

export const aiService = {
  async generateSummary(doc: DocumentItem): Promise<DocumentSummary> {
    const documentText =
      (doc as DocumentItem & { extractedText?: string }).extractedText ||
      `Document name: ${doc.name}
Type: ${doc.type}
Pages: ${doc.pageCount || 'Unknown'}
Tags: ${doc.tags.join(', ') || 'None'}`;

    const prompt = `
You are DocuMind AI, an AI document analysis assistant.

Analyze the following document and create a useful summary.

DOCUMENT:
${documentText}

IMPORTANT:
- Use only the information present in the DOCUMENT.
- Do not invent facts.
- Do not use outside knowledge.
- Make the summary specific to this document.

Return ONLY valid JSON in this exact format:

{
  "overview": "A concise 2-4 sentence overview",
  "keyPoints": [
    "Important point 1",
    "Important point 2",
    "Important point 3",
    "Important point 4"
  ],
  "topics": [
    "Topic 1",
    "Topic 2",
    "Topic 3"
  ],
  "suggestedQuestions": [
    "Question 1",
    "Question 2",
    "Question 3",
    "Question 4"
  ]
}
`;

    const result = await callGemini(prompt);

    try {
      const cleaned = result
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      const parsed = JSON.parse(cleaned);

      return {
        overview: parsed.overview,
        keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
        topics: Array.isArray(parsed.topics) ? parsed.topics : [],
        suggestedQuestions: Array.isArray(parsed.suggestedQuestions)
          ? parsed.suggestedQuestions
          : [],
        generatedAt: new Date().toISOString(),
      };
    } catch {
      return {
        overview: result,
        keyPoints: [],
        topics: [],
        suggestedQuestions: [],
        generatedAt: new Date().toISOString(),
      };
    }
  },

  async askQuestion(
    doc: DocumentItem,
    question: string,
    _history: ChatMessage[] = []
  ): Promise<string> {
    const documentText =
      (doc as DocumentItem & { extractedText?: string }).extractedText ||
      `Document name: ${doc.name}
Tags: ${doc.tags.join(', ') || 'None'}`;

    const prompt = `
You are DocuMind AI.

Answer the user's question using ONLY the document content provided below.

DOCUMENT:
${documentText}

USER QUESTION:
${question}

Rules:
- Answer only from the DOCUMENT content provided above.
- Do not use outside knowledge.
- Do not guess, assume, or invent information.
- If the answer is not clearly supported by the DOCUMENT, say:
"This information is not available in the document."
- Keep the answer concise and directly answer the user's question.
- When possible, mention the relevant information from the document.
`;

    return await callGemini(prompt);
  },
};