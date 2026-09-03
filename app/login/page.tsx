'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { loginUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const success = await loginUser(data.email, data.password);
      if (!success) {
        setErrorMsg('Invalid email or password. Hint: Email must be valid & password >= 8 characters.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="main-content" tabIndex={-1} className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-card font-sans">
      {/* Left Column (Brand info, desktop only) */}
      <div className="hidden lg:flex lg:col-span-5 bg-brand-gradient text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Abstract background graphics */}
        <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <Link href="/" className="flex items-center gap-2 text-white w-fit group">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight">
            AI StudyOS
          </span>
        </Link>

        <div className="space-y-6 my-auto">
          <h2 className="text-4xl font-extrabold leading-tight">
            Study Smarter <br />
            with AI
          </h2>
          <p className="text-purple-100 text-sm leading-relaxed max-w-sm">
            Your personalized AI workspace for notes, planning, coding, and exam preparation.
          </p>

          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-purple-200 shrink-0" />
              <span className="text-sm font-medium">AI-powered study tools & notes</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-purple-200 shrink-0" />
              <span className="text-sm font-medium">Personalized learning plans & schedules</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-purple-200 shrink-0" />
              <span className="text-sm font-medium">Track coding streaks & progress</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-purple-200">
          &copy; {new Date().getFullYear()} AI StudyOS. Complete student productivity platform.
        </div>
      </div>

      {/* Right Column (Login form) */}
      <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-8 sm:p-12 md:p-16 bg-background">
        <div className="w-full max-w-md space-y-8 bg-white dark:bg-card p-8 rounded-2xl border border-gray-100 dark:border-border shadow-xl shadow-purple-500/5">
          {/* Logo on mobile only */}
          <div className="flex lg:hidden justify-center mb-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-brand-gradient p-2 rounded-xl text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-gray-900 dark:text-gray-50">
                AI StudyOS
              </span>
            </Link>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-50">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Continue your learning journey.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 dark:bg-red-500/10 text-red-600 text-xs p-3 rounded-xl border border-red-100 font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
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

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-gray-600 dark:text-gray-300">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  {...register('password')}
                  className={`w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-muted border ${
                    errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-250 focus:border-brand-purple'
                  } rounded-xl text-sm transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-300 select-none">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="rounded border-gray-300 dark:border-gray-600 text-brand-purple focus:ring-brand-purple/20 w-4 h-4 cursor-pointer"
                />
                Remember me
              </label>
              <Link 
                href="/forgot-password" 
                className="font-semibold text-brand-purple hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-gradient text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Log In
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-150"></div>
            <span className="flex-shrink mx-4 text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider">OR</span>
            <div className="flex-grow border-t border-gray-150"></div>
          </div>

          {/* Social Sign In */}
          <button
            onClick={() => onSubmit({ email: 'student@university.edu', password: 'password123', rememberMe: true })}
            className="w-full bg-white dark:bg-card border border-gray-200 dark:border-border text-gray-700 dark:text-gray-200 py-3 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-muted hover:border-gray-300 dark:hover:border-gray-600 transition-all flex items-center justify-center gap-2.5 shadow-sm cursor-pointer"
          >
            {/* Google Icon SVG */}
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#ea4335"
                d="M12 5.04c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 1.76 14.93 1 12 1 7.39 1 3.4 3.65 1.4 7.56l3.87 3a7.22 7.22 0 0 1 6.73-5.52z"
              />
              <path
                fill="#4285f4"
                d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.47h6.44a5.52 5.52 0 0 1-2.4 3.62l3.72 2.89c2.18-2 3.73-4.96 3.73-8.62z"
              />
              <path
                fill="#fbbc05"
                d="M5.27 14.56a7.17 7.17 0 0 1 0-5.12l-3.87-3A11.96 11.96 0 0 0 0 12c0 2.05.52 4 1.4 5.76l3.87-3.2z"
              />
              <path
                fill="#34a853"
                d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.72-2.89a7.16 7.16 0 0 1-4.24 1.25c-3.79 0-7-2.53-8.15-5.94l-3.87 3A11.98 11.98 0 0 0 12 23z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Signup Link */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-2">
            Don&apos;t have an account?{' '}
            <Link 
              href="/signup" 
              className="font-bold text-brand-purple hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
