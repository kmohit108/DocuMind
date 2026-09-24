'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Copy,
  Check,
  HelpCircle,
  ArrowLeft,
  FileText,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { DocumentItem, ChatMessage } from '@/types';
import { aiService } from '@/services/aiService';
import { useDocuments } from '@/context/DocumentContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';

interface AskAIChatProps {
  document: DocumentItem;
  initialQuestion?: string;
}

export function AskAIChat({ document: doc, initialQuestion }: AskAIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { handleGenerateSummary } = useDocuments();
  const { success, info } = useToast();

  const storageKey = `documind_chat_${doc.id}`;

  // Load chat history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        // Initial welcome message
        const welcome: ChatMessage = {
          id: `msg-init-${Date.now()}`,
          documentId: doc.id,
          sender: 'ai',
          content: `Hello! I have indexed **${doc.name}** (${(doc.size / 1024).toFixed(1)} KB). Ask me anything about its content, key points, timeline, or request specific summaries.`,
          timestamp: new Date().toISOString(),
        };
        setMessages([welcome]);
        localStorage.setItem(storageKey, JSON.stringify([welcome]));
      }
    } catch {
      // ignore
    }
  }, [doc.id, doc.name, doc.size, storageKey]);

  // Handle initial query from URL param if present
  useEffect(() => {
    if (initialQuestion && messages.length > 0 && !isAiResponding) {
      sendMessage(initialQuestion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuestion]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiResponding]);

  const saveMessages = (msgs: ChatMessage[]) => {
    setMessages(msgs);
    try {
      localStorage.setItem(storageKey, JSON.stringify(msgs));
    } catch {
      // ignore
    }
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isAiResponding) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      documentId: doc.id,
      sender: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...messages, userMsg];
    saveMessages(newHistory);
    setInput('');
    setIsAiResponding(true);

    try {
      const aiResponseText = await aiService.askQuestion(doc, trimmed, newHistory);

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        documentId: doc.id,
        sender: 'ai',
        content: aiResponseText,
        timestamp: new Date().toISOString(),
      };

      saveMessages([...newHistory, aiMsg]);
    } catch (err) {
      console.error('Chat AI error:', err);
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        documentId: doc.id,
        sender: 'ai',
        content: 'I encountered an error analyzing the document text. Please try again.',
        timestamp: new Date().toISOString(),
      };
      saveMessages([...newHistory, errorMsg]);
    } finally {
      setIsAiResponding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleClearChat = () => {
    const welcome: ChatMessage = {
      id: `msg-init-${Date.now()}`,
      documentId: doc.id,
      sender: 'ai',
      content: `Conversation reset. Ask me anything about **${doc.name}**.`,
      timestamp: new Date().toISOString(),
    };
    saveMessages([welcome]);
    info('Conversation Cleared', 'Chat history has been reset.');
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    success('Copied', 'Message copied to clipboard.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const defaultSuggestions = [
    'What is this document about?',
    'Summarize the key takeaways.',
    'What are the important dates and deadlines?',
    'What action items are mentioned?',
    'Explain this document in simple language.',
  ];

  const suggestedList = doc.summary?.suggestedQuestions?.length
    ? doc.summary.suggestedQuestions
    : defaultSuggestions;

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/documents/${doc.id}`}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Back to Document"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight truncate">
                Ask DocuMind AI
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
                Grounded Mode
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              Querying context of <strong className="text-slate-300">{doc.name}</strong>
            </p>
          </div>
        </div>

        {/* Clear chat action */}
        <button
          onClick={handleClearChat}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Clear Conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                isAi ? 'max-w-3xl mr-auto' : 'max-w-2xl ml-auto flex-row-reverse'
              } animate-in fade-in duration-200`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isAi
                    ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-400'
                    : 'bg-gradient-to-tr from-purple-500 to-indigo-500 text-white shadow-sm'
                }`}
              >
                {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className="group relative min-w-0">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isAi
                      ? 'bg-slate-900/90 text-slate-200 border border-slate-800/80 shadow-md'
                      : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-medium'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                  {/* Message Timestamp */}
                  <div
                    className={`mt-2 flex items-center justify-between gap-4 text-[10px] ${
                      isAi ? 'text-slate-500' : 'text-indigo-200/80'
                    }`}
                  >
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {isAi && (
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.content)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* AI Typing / Streaming indicator */}
        {isAiResponding && (
          <div className="flex items-start gap-3 max-w-3xl mr-auto animate-in fade-in">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 text-xs text-slate-300 flex items-center gap-2 shadow-md">
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
              <span>Analyzing document context and formulating response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Pills */}
      <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/60 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-[11px] font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <HelpCircle className="w-3 h-3" />
            <span>Ask:</span>
          </span>
          {suggestedList.slice(0, 4).map((q, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(q)}
              disabled={isAiResponding}
              className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-indigo-300 hover:bg-indigo-950/30 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 space-y-2">
        <div className="relative flex items-end gap-2 bg-slate-900/90 border border-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 rounded-2xl p-2 transition-all">
          <textarea
            ref={inputRef}
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask any question about "${doc.name}"... (Press Enter to send)`}
            className="w-full bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 resize-none focus:outline-none p-1.5 leading-relaxed"
          />

          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isAiResponding}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:pointer-events-none transition-all shadow-md shadow-indigo-600/20 shrink-0 cursor-pointer"
            aria-label="Send question"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* AI Disclaimer Footer */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
          <span className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-slate-400" />
            <span>DocuMind AI responses are generated from document text. Please verify critical data.</span>
          </span>
          <span className="hidden sm:inline font-mono">Shift + Enter for new line</span>
        </div>
      </div>
    </div>
  );
}
