import { DocumentItem, DocumentSummary, ChatMessage } from '@/types';

async function callGemini(
  prompt: string,
  temperature?: number
): Promise<string> {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      temperature,
    }),
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

Analyze the following document and create a concise, accurate summary.

DOCUMENT:
${documentText}

IMPORTANT:
- Use ONLY information explicitly present in the DOCUMENT.
- Do not use outside knowledge.
- Do not invent, assume, infer, or guess any facts.
- Preserve names, dates, numbers, qualifications, job titles, education status, project status, and other factual details exactly as stated in the DOCUMENT.
- Do not change the meaning or status of information.
- For example, do not change "completed" to "pursuing", "pursuing" to "completed", "former" to "current", or "current" to "former".
- Do not infer that something is ongoing or completed unless the DOCUMENT explicitly says so.
- Do not add information that is not supported by the DOCUMENT.
- Make the summary specific to this document.
- If a fact is unclear or not explicitly stated, leave it out rather than guessing.

Return ONLY valid JSON in this exact format:

{
  "overview": "A concise 2-4 sentence overview based only on the document",
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
        keyPoints: Array.isArray(parsed.keyPoints)
          ? parsed.keyPoints
          : [],
        topics: Array.isArray(parsed.topics)
          ? parsed.topics
          : [],
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
- Do not guess, assume, infer, or invent information.
- Preserve names, dates, numbers, qualifications, job titles, and other factual details exactly as stated in the DOCUMENT.
- Do not change the meaning or status of information.
- If the answer is not clearly supported by the DOCUMENT, say:
"This information is not available in the document."
- Keep the answer concise and directly answer the user's question.
- When useful, use Markdown formatting such as bold text and bullet points for readability.
`;

    return await callGemini(prompt);
  },
};