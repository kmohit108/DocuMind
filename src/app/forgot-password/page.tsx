'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Mail, ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { success } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    // Simulate reset email transmission
    await new Promise((r) => setTimeout(r, 600));
    setIsSubmitting(false);
    setIsSent(true);
    success('Reset Link Sent', `Password reset instructions sent to ${email}`);
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
        <p className="text-xs text-slate-400 mt-2">Reset your account password</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md rounded-2xl bg-slate-900/80 border border-slate-800/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative z-10 space-y-6">
        {!isSent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Forgot password?</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Enter your registered email address and we will send you instructions to reset your password.
              </p>
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              className="w-full justify-center mt-2"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Send Reset Link
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-4 py-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Check your inbox</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We have sent password recovery instructions to <strong className="text-slate-200">{email}</strong>.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSent(false)}
              className="mt-2"
            >
              Send again
            </Button>
          </div>
        )}

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          <Link href="/login" className="text-indigo-400 font-semibold hover:underline inline-flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
