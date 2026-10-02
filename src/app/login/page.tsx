'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  ArrowRight,
} from 'lucide-react';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { createClient } from '@/lib/supabase/client';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { login, signup, isLoading } = useAuth();
  const { success, error } = useToast();

  const [isSignUp, setIsSignUp] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');

  /*
   * Read signup mode from URL.
   *
   * /login              -> Sign In
   * /login?mode=signup  -> Sign Up
   */
  useEffect(() => {
    const mode = searchParams.get('mode');

    if (mode === 'signup') {
      setIsSignUp(true);
    } else {
      setIsSignUp(false);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setEmailError('');
    setNameError('');

    if (isSignUp && !name.trim()) {
      setNameError('Please enter your name');
      return;
    }

    if (!email.trim()) {
      setEmailError('Please enter your email address');
      return;
    }

    if (!password.trim()) {
      error(
        isSignUp ? 'Signup Failed' : 'Login Failed',
        'Please enter your password.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSignUp) {
        await signup(name.trim(), email.trim(), password);

        success(
          'Account Created',
          'Your account has been created successfully.'
        );

        router.push('/dashboard');
      } else {
        await login(email.trim(), password);

        success(
          'Welcome Back',
          'Signed in successfully.'
        );

        router.push('/dashboard');
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.';

      error(
        isSignUp ? 'Signup Failed' : 'Login Failed',
        message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const { error: googleError } =
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });

      if (googleError) {
        throw googleError;
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to continue with Google.';

      error('Google Sign In Failed', message);
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    const nextMode = !isSignUp;

    setIsSignUp(nextMode);

    setName('');
    setEmail('');
    setPassword('');
    setEmailError('');
    setNameError('');

    /*
     * Keep URL synchronized with the selected mode.
     */
    if (nextMode) {
      router.replace('/login?mode=signup');
    } else {
      router.replace('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-indigo-500/30 selection:text-indigo-200">

      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-8 relative z-10">

        <Link
          href="/"
          className="inline-flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>

          <span className="font-extrabold text-2xl text-white tracking-tight">
            DocuMind
          </span>

          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-950/80 text-indigo-300 border border-indigo-700/50">
            AI
          </span>
        </Link>

        <p className="text-xs text-slate-400 mt-2">
          {isSignUp
            ? 'Create your document management account'
            : 'Sign in to your document management workspace'}
        </p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md rounded-2xl bg-slate-900/80 border border-slate-800/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative z-10">

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white">
            {isSignUp
              ? 'Create your account'
              : 'Welcome back'}
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            {isSignUp
              ? 'Enter your details to get started.'
              : 'Enter your credentials to continue.'}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* Name - Signup only */}
          {isSignUp && (
            <Input
              label="Full Name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);

                if (nameError) {
                  setNameError('');
                }
              }}
              error={nameError}
              leftIcon={<User className="w-4 h-4" />}
              required
            />
          )}

          {/* Email */}
          <Input
            label="Email Address"
            type="email"
            placeholder="Email..."
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);

              if (emailError) {
                setEmailError('');
              }
            }}
            error={emailError}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          {/* Password */}
          <div className="space-y-1">

            <div className="flex items-center justify-between text-xs">

              <label className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
                Password
              </label>

              {!isSignUp && (
                <Link
                  href="/forgot-password"
                  className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Forgot?
                </Link>
              )}

            </div>

            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              leftIcon={
                <Lock className="w-4 h-4" />
              }
              required
            />

          </div>

          {/* Main Button */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting || isLoading}
            className="w-full justify-center mt-2"
            rightIcon={
              <ArrowRight className="w-4 h-4" />
            }
          >
            {isSignUp
              ? 'Create Account'
              : 'Login'}
          </Button>

        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-6">

          <div className="border-t border-slate-800 w-full" />

          <span className="bg-slate-900 px-3 text-[11px] text-slate-500 font-semibold uppercase tracking-wider absolute">
            OR
          </span>

        </div>

        {/* Google Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isSubmitting || isLoading}
          className="w-full h-11 rounded-lg border border-slate-700 bg-slate-950/50 hover:bg-slate-800 text-white font-semibold text-sm flex items-center justify-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-sm font-bold text-slate-900">
            G
          </span>

          {isSignUp
            ? 'Sign up with Google'
            : 'Sign in with Google'}
        </button>

        {/* Switch Login / Signup */}
        <div className="text-center text-xs text-slate-400 pt-6 mt-6 border-t border-slate-800/80">

          {isSignUp ? (
            <>
              Already have an account?{' '}

              <button
                type="button"
                onClick={switchMode}
                className="text-indigo-400 font-semibold hover:underline"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}

              <button
                type="button"
                onClick={switchMode}
                className="text-indigo-400 font-semibold hover:underline"
              >
                Sign Up
              </button>
            </>
          )}

        </div>

      </div>
    </div>
  );
}
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}