'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Sparkles, 
  Mail, 
  ArrowLeft, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' }
  });

  const onSubmit = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch {
      setErrorMsg('Failed to send recovery email. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="main-content" tabIndex={-1} className="min-h-screen bg-background flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white dark:bg-card border border-gray-100 dark:border-border rounded-2xl shadow-xl shadow-purple-500/5 p-8 space-y-6 relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100/50 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col items-center text-center space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-brand-gradient p-2 rounded-xl text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-gray-50">
              AI StudyOS
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-50">Forgot Password?</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
            No worries! Enter your email below and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {success ? (
          <div className="space-y-6 text-center py-4">
            <div className="inline-flex bg-emerald-50 text-emerald-500 p-4 rounded-full border border-emerald-100">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg">Reset Link Sent</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
                We&apos;ve sent a password recovery link to your email. Please check your inbox and spam folder.
              </p>
            </div>
            <Link 
              href="/login" 
              className="w-full block bg-brand-gradient text-white py-3 rounded-xl font-bold hover:shadow-md hover:-translate-y-0.5 transition-all text-sm"
            >
              Back to Log In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorMsg && (
              <div className="bg-red-50 dark:bg-red-500/10 text-red-600 text-xs p-3 rounded-xl border border-red-100 font-medium">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-gray-600 dark:text-gray-300">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="name@university.edu"
                  {...register('email')}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-muted border ${
                    errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-250 focus:border-brand-purple'
                  } rounded-xl text-sm transition-all`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs font-medium">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-gradient text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending Link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>

            <Link 
              href="/login" 
              className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-brand-purple transition-colors pt-2 w-fit mx-auto"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Log In
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
