'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Tabs, TabItem } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  User,
  Sliders,
  Sparkles,
  Save,
} from 'lucide-react';

export default function SettingsPage() {
  const {
    user,
    settings,
    updateSettings,
    updateUser,
  } = useAuth();

  const { success } = useToast();

  const [activeTab, setActiveTab] = useState('profile');

  // Theme
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('documind-theme');
      return savedTheme === 'light' ? 'light' : 'dark';
    }

    return 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle(
      'light',
      theme === 'light'
    );

    localStorage.setItem('documind-theme', theme);
  }, [theme]);

  // Profile Form State
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileDateOfBirth, setProfileDateOfBirth] = useState('');
  const [profileCity, setProfileCity] = useState('');
  const [profileCountry, setProfileCountry] = useState('');

  // AI Form State
  const [aiModel, setAiModel] = useState(settings.aiModel);
  const [aiTemperature, setAiTemperature] = useState(
    settings.aiTemperature
  );

  // Load user data whenever auth user becomes available
  useEffect(() => {
    if (!user) return;

    setProfileName(user.name || '');
    setProfileEmail(user.email || '');
    setProfilePhone(user.phone || '');
    setProfileDateOfBirth(user.dateOfBirth || '');
    setProfileCity(user.city || '');
    setProfileCountry(user.country || '');
  }, [user]);

  // Keep AI settings in sync
  useEffect(() => {
    setAiModel(settings.aiModel);
    setAiTemperature(settings.aiTemperature);
  }, [settings.aiModel, settings.aiTemperature]);

  const tabs: TabItem[] = [
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-4 h-4" />,
    },
    {
      id: 'appearance',
      label: 'Appearance & Notifications',
      icon: <Sliders className="w-4 h-4" />,
    },
    {
      id: 'ai',
      label: 'AI Model Preferences',
      icon: <Sparkles className="w-4 h-4" />,
    },
  ];

  const handleSaveProfile = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!profileName.trim()) {
      return;
    }

    await updateUser({
      name: profileName.trim(),
      phone: profilePhone.trim(),
      dateOfBirth: profileDateOfBirth,
      city: profileCity.trim(),
      country: profileCountry.trim(),
    });

    success(
      'Profile Updated',
      'Your personal information has been saved.'
    );
  };

  const handleSaveAI = (e: React.FormEvent) => {
    e.preventDefault();

    updateSettings({
      aiModel,
      aiTemperature,
    });

    success(
      'AI Settings Saved',
      'Your AI preferences have been updated.'
    );
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto">

        {/* Header */}
        <div className="pb-2 border-b border-slate-800/80">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Workspace Settings
          </h2>

          <p className="text-xs text-slate-400 mt-1">
            Manage your profile, appearance, notifications, and AI preferences.
          </p>
        </div>

        {/* Tabs */}
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* =====================================================
            TAB 1 — PROFILE
        ====================================================== */}
        {activeTab === 'profile' && (
          <form
            onSubmit={handleSaveProfile}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-6 backdrop-blur-md"
          >
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-400" />
                <span>Personal Information</span>
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                Manage the personal information associated with your account.
              </p>
            </div>

            {/* Profile Preview */}
            <div className="flex items-center gap-4 pt-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-indigo-600/20">
                {profileName
                  ? profileName.charAt(0).toUpperCase()
                  : 'U'}
              </div>

              <div>
                <p className="text-sm font-bold text-slate-200">
                  {profileName || 'User'}
                </p>

                <p className="text-xs text-slate-400">
                  {profileEmail || 'Account email'}
                </p>

                <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                  Account Member
                </span>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">

              <Input
                label="Full Name"
                value={profileName}
                onChange={(e) =>
                  setProfileName(e.target.value)
                }
                placeholder="Enter your full name"
                required
              />

              <Input
                label="Email Address"
                type="email"
                value={profileEmail}
                readOnly
                helperText="Your email is managed by your authentication account."
                className="cursor-not-allowed opacity-80"
              />

              <Input
                label="Mobile Number"
                type="tel"
                value={profilePhone}
                onChange={(e) =>
                  setProfilePhone(e.target.value)
                }
                placeholder="Enter your mobile number"
              />

              <Input
                label="Date of Birth"
                type="date"
                value={profileDateOfBirth}
                onChange={(e) =>
                  setProfileDateOfBirth(e.target.value)
                }
              />

              <Input
                label="City"
                value={profileCity}
                onChange={(e) =>
                  setProfileCity(e.target.value)
                }
                placeholder="Enter your city"
              />

              <Input
                label="Country"
                value={profileCountry}
                onChange={(e) =>
                  setProfileCountry(e.target.value)
                }
                placeholder="Enter your country"
              />

            </div>

            {/* Save */}
            <div className="flex justify-end pt-3">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                leftIcon={
                  <Save className="w-3.5 h-3.5" />
                }
              >
                Save Profile Changes
              </Button>
            </div>
          </form>
        )}

        {/* =====================================================
            TAB 2 — APPEARANCE & NOTIFICATIONS
        ====================================================== */}
        {activeTab === 'appearance' && (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-6 backdrop-blur-md">

            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Theme & Preferences</span>
            </h3>

            <div className="space-y-4 text-xs">

              {/* Theme */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/40 border border-slate-800">
                <div>
                  <p className="font-semibold text-slate-200">
                    Interface Theme
                  </p>

                  <p className="text-slate-400 text-[11px]">
                    Choose your dashboard appearance.
                  </p>
                </div>

                <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
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

              {/* AI Summary Alerts */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/40 border border-slate-800">
                <div>
                  <p className="font-semibold text-slate-200">
                    AI Summary Alerts
                  </p>

                  <p className="text-slate-400 text-[11px]">
                    Show notifications when AI completes document processing.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={settings.summaryAlerts}
                  onChange={(e) =>
                    updateSettings({
                      summaryAlerts: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/40 border border-slate-800">
                <div>
                  <p className="font-semibold text-slate-200">
                    Email Notifications
                  </p>

                  <p className="text-slate-400 text-[11px]">
                    Receive important DocuMind account notifications.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) =>
                    updateSettings({
                      emailNotifications: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

            </div>
          </div>
        )}

        {/* =====================================================
            TAB 3 — AI PREFERENCES
        ====================================================== */}
        {activeTab === 'ai' && (
          <form
            onSubmit={handleSaveAI}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-6 backdrop-blur-md"
          >

            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>AI Preferences</span>
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                Configure how DocuMind handles AI-powered document analysis.
              </p>
            </div>

            <div className="space-y-5">

              {/* AI Model */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  AI Model
                </label>

                <select
                  value={aiModel}
                  onChange={(e) =>
                    setAiModel(e.target.value)
                  }
                  className="w-full h-10 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Gemini 3.6 Flash">
                    Gemini 3.6 Flash
                  </option>
                </select>

                <p className="text-[11px] text-slate-500 mt-2">
                  DocuMind currently uses Gemini for AI document processing.
                </p>
              </div>

              {/* Temperature */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <label className="font-semibold text-slate-300 uppercase tracking-wider">
                    Response Temperature
                  </label>

                  <span className="font-mono text-indigo-400 font-bold">
                    {aiTemperature}
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={aiTemperature}
                  onChange={(e) =>
                    setAiTemperature(
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />

                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>0.0 Strict</span>
                  <span>0.5 Balanced</span>
                  <span>1.0 Creative</span>
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-3">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                leftIcon={
                  <Save className="w-3.5 h-3.5" />
                }
              >
                Save AI Settings
              </Button>
            </div>

          </form>
        )}

      </div>
    </AppShell>
  );
}