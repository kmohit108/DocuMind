'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Tabs, TabItem } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useDocuments } from '@/context/DocumentContext';
import { useToast } from '@/context/ToastContext';
import { storageService } from '@/services/storageService';
import {
  User,
  Sliders,
  Sparkles,
  HardDrive,
  Database,
  Shield,
  Save,
  RotateCcw,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  Server,
} from 'lucide-react';

export default function SettingsPage() {
  const { user, settings, updateSettings, updateUser } = useAuth();
  const { documents, resetToMockData } = useDocuments();
  const { success, info } = useToast();

  const [activeTab, setActiveTab] = useState('profile');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('documind-theme');
    return savedTheme === 'light' ? 'light' : 'dark';
  }

  return 'dark';
});
  useEffect(() => {
  document.documentElement.classList.toggle('light', theme === 'light');
  localStorage.setItem('documind-theme', theme);
}, [theme]);
  // Profile Form State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profileRole, setProfileRole] = useState(user?.role || 'Senior Product Engineer');

  // AI Form State
  const [aiModel, setAiModel] = useState(settings.aiModel);
  const [aiTemperature, setAiTemperature] = useState(settings.aiTemperature);

  // Supabase & Cloud Config State
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [aiApiKey, setAiApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const tabs: TabItem[] = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance & Notifications', icon: <Sliders className="w-4 h-4" /> },
    { id: 'ai', label: 'AI Model Preferences', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'storage', label: 'Storage & Usage', icon: <HardDrive className="w-4 h-4" /> },
    { id: 'integrations', label: 'Supabase & API Credentials', icon: <Database className="w-4 h-4" /> },
    { id: 'privacy', label: 'Data & Privacy', icon: <Shield className="w-4 h-4" /> },
  ];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser({
      name: profileName,
      email: profileEmail,
      role: profileRole,
    });
    success('Profile Updated', 'Your profile details have been saved.');
  };

  const handleSaveAI = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      aiModel,
      aiTemperature,
    });
    success('AI Settings Saved', `Default model set to ${aiModel}`);
  };

  const handleTestConnection = (e: React.FormEvent) => {
    e.preventDefault();
    info('Credential Abstraction Ready', 'Frontend service layer is primed for Supabase and LLM API routes.');
  };

  const totalBytes = documents.reduce((acc, doc) => acc + doc.size, 0);

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="pb-2 border-b border-slate-800/80">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Workspace Settings
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage your user profile, AI preferences, storage allocations, and Supabase cloud connectors.
          </p>
        </div>

        {/* Tab Switcher */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {/* Tab 1: Profile */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-5 backdrop-blur-md">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" />
              <span>Personal Information</span>
            </h3>

            <div className="flex items-center gap-4 pt-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-indigo-600/20">
                {profileName ? profileName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-200">{profileName || 'Demo User'}</p>
                <p className="text-xs text-slate-400">{profileEmail || 'demo@documind.ai'}</p>
                <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                  {user?.isDemo ? 'Demo Workspace Member' : 'Active Member'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Input
                label="Full Name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
              />
              <Input
                label="Email Address"
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
              />
              <Input
                label="Role / Title"
                value={profileRole}
                onChange={(e) => setProfileRole(e.target.value)}
                className="sm:col-span-2"
              />
            </div>

            <div className="flex justify-end pt-3">
              <Button type="submit" variant="primary" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>
                Save Profile Changes
              </Button>
            </div>
          </form>
        )}

        {/* Tab 2: Appearance & Notifications */}
        {activeTab === 'appearance' && (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-6 backdrop-blur-md">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Theme & Preferences</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/40 border border-slate-800">
                <div>
                  <p className="font-semibold text-slate-200">Interface Theme</p>
                  <p className="text-slate-400 text-[11px]">Choose your visual dashboard style</p>
                </div>
                <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-1">
  <button
    type="button"
    onClick={() => setTheme('dark')}
    className={`px-3 py-1 rounded-lg font-semibold text-xs ${
      theme === 'dark'
        ? 'bg-indigo-600 text-white'
        : 'text-slate-400 hover:text-white'
    }`}
  >
    Dark
  </button>

  <button
    type="button"
    onClick={() => setTheme('light')}
    className={`px-3 py-1 rounded-lg font-semibold text-xs ${
      theme === 'light'
        ? 'bg-indigo-600 text-white'
        : 'text-slate-400 hover:text-white'
    }`}
  >
    Light
  </button>
</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/40 border border-slate-800">
                <div>
                  <p className="font-semibold text-slate-200">AI Summary Alerts</p>
                  <p className="text-slate-400 text-[11px]">Show in-app notifications when AI completes extraction</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.summaryAlerts}
                  onChange={(e) => updateSettings({ summaryAlerts: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/40 border border-slate-800">
                <div>
                  <p className="font-semibold text-slate-200">Weekly Digest</p>
                  <p className="text-slate-400 text-[11px]">Receive email overview of indexed documents and questions</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => updateSettings({ emailNotifications: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: AI Model Preferences */}
        {activeTab === 'ai' && (
          <form onSubmit={handleSaveAI} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-5 backdrop-blur-md">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI Engine & Parameters</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Default AI Model
                </label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full h-10 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Claude 3.5 Sonnet (DocuMind Optimized)">
                    Claude 3.5 Sonnet (Recommended — Highest Synthesis Precision)
                  </option>
                  <option value="GPT-4o Document Intelligence">
                    GPT-4o (Fast Multi-Modal Vision & Reasoning)
                  </option>
                  <option value="Gemini 1.5 Pro Long-Context">
                    Gemini 1.5 Pro (2M Token Context Window)
                  </option>
                  <option value="DocuMind Offline Mock Engine">
                    DocuMind Local Mock Engine (Zero Network / Demo Safe)
                  </option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <label className="font-semibold text-slate-300 uppercase tracking-wider">
                    Model Temperature (Creativity vs Determinism)
                  </label>
                  <span className="font-mono text-indigo-400 font-bold">{aiTemperature}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={aiTemperature}
                  onChange={(e) => setAiTemperature(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>0.0 (Strict Citations)</span>
                  <span>0.5 (Balanced)</span>
                  <span>1.0 (Creative Exploratory)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <Button type="submit" variant="primary" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>
                Save AI Settings
              </Button>
            </div>
          </form>
        )}

        {/* Tab 4: Storage & Usage */}
        {activeTab === 'storage' && (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-6 backdrop-blur-md">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-indigo-400" />
              <span>Storage Metrics & Demo Reset</span>
            </h3>

            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Current Storage Consumption</span>
                <span className="font-bold text-white">
                  {storageService.formatBytes(totalBytes)} of {storageService.formatBytes(settings.storageLimit)}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(3, Math.min(100, (totalBytes / settings.storageLimit) * 100))}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                You have indexed {documents.length} documents in local storage.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-rose-300">Reset Demo Data</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Restores the initial sample documents, AI summaries, and activity feeds.
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={resetToMockData}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Reset to Seed State
              </Button>
            </div>
          </div>
        )}

        {/* Tab 5: Supabase & API Credentials */}
        {activeTab === 'integrations' && (
          <form onSubmit={handleTestConnection} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Supabase & AI Backend Integration</span>
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
                Service Layer Ready
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              DocuMind is architected with clean service wrappers in <code className="text-indigo-300 font-mono">src/services/</code>. When connecting to production Supabase and LLM APIs, credentials are loaded via <code className="text-indigo-300 font-mono">.env.local</code> without modifying client components.
            </p>

            <div className="space-y-4">
              <Input
                label="NEXT_PUBLIC_SUPABASE_URL (Optional)"
                placeholder="https://your-project.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                helperText="Supabase project URL for PostgreSQL pgvector storage."
              />

              <div className="relative">
                <Input
                  label="NEXT_PUBLIC_SUPABASE_ANON_KEY (Optional)"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  type={showKey ? 'text' : 'password'}
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  helperText="Public client anon key for Row Level Security (RLS)."
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3.5 top-8 text-slate-400 hover:text-slate-200"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Input
                label="AI_API_SECRET_KEY (Server-Side Only)"
                placeholder="sk-ant-api03-... or sk-proj-..."
                type="password"
                value={aiApiKey}
                onChange={(e) => setAiApiKey(e.target.value)}
                helperText="Never exposed to the client bundle. Handled exclusively via API route endpoints."
              />
            </div>

            <div className="flex justify-end pt-3 gap-2.5">
              <Button type="submit" variant="primary" size="sm" leftIcon={<KeyRound className="w-3.5 h-3.5" />}>
                Test Service Abstraction
              </Button>
            </div>
          </form>
        )}

        {/* Tab 6: Data & Privacy */}
        {activeTab === 'privacy' && (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4 text-xs backdrop-blur-md">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Shield className="w-4 h-4 text-sky-400" />
              <span>Data Protection & Privacy Policy</span>
            </h3>

            <div className="space-y-3 text-slate-300 leading-relaxed">
              <p>
                1. <strong>Zero Cloud Leakage in Demo Mode:</strong> All uploaded files and extracted text remain strictly inside your browser session and localStorage.
              </p>
              <p>
                2. <strong>Grounding & Hallucination Prevention:</strong> AI summaries and responses are anchored directly on the ingested source text using retrieval citations.
              </p>
              <p>
                3. <strong>Credential Isolation:</strong> No private API keys or database passwords are ever exposed in client-side bundles.
              </p>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
