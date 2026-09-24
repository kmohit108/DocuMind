'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Mail, Lock, User, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function SignupPage() {
  const router = useRouter();
  const { signup, loginDemo } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setFormError('Please fill out all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await signup(name, email, password);
      success('Account Created', 'Welcome to DocuMind workspace!');
      router.push('/dashboard');
    } catch {
      error('Registration Failed', 'Could not create account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    try {
      await loginDemo();
      success('Demo Session Started', 'Logged in as Demo Explorer.');
      router.push('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-2xl text-white tracking-tight">DocuMind</span>
        </Link>
        <p className="text-xs text-slate-400 mt-2">Create your document management workspace</p>
      </div>

      {/* Signup Card */}
      <div className="w-full max-w-md rounded-2xl bg-slate-900/80 border border-slate-800/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative z-10 space-y-6">
        {/* 1-Click Demo Access Banner */}
        <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold text-white flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Instant Demo Access</span>
            </p>
            <p className="text-[11px] text-indigo-300 mt-0.5">Explore with pre-seeded documents</p>
          </div>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleDemoLogin}
            isLoading={isSubmitting}
            className="text-xs shrink-0"
          >
            1-Click Login
          </Button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[11px] text-slate-500 font-semibold uppercase tracking-wider absolute">
            Or create new account
          </span>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (formError) setFormError('');
            }}
            leftIcon={<User className="w-4 h-4" />}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="jane@company.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (formError) setFormError('');
            }}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
          />

          {formError && <p className="text-xs text-rose-400 font-medium">{formError}</p>}

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            className="w-full justify-center mt-2"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create Free Account
          </Button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-400 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
