'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Sparkles, 
  User,
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the Terms and Privacy Policy',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0); // 0-4 scale

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  });

  const passwordVal = watch('password');

  // Watch password changes to compute strength
  useEffect(() => {
    if (!passwordVal) {
      setPasswordStrength(0);
      return;
    }
    let strength = 0;
    if (passwordVal.length >= 8) strength += 1;
    if (/[A-Z]/.test(passwordVal)) strength += 1;
    if (/[0-9]/.test(passwordVal)) strength += 1;
    if (/[^A-Za-z0-9]/.test(passwordVal)) strength += 1;
    setPasswordStrength(strength);
  }, [passwordVal]);

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const success = await registerUser(data.name, data.email, data.password);
      if (!success) {
        setErrorMsg('Registration failed. Please make sure the email is unique.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStrengthText = () => {
    switch (passwordStrength) {
      case 0: return 'Too short';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Excellent';
      default: return '';
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return 'bg-gray-200';
      case 1: return 'bg-red-400';
      case 2: return 'bg-yellow-400';
      case 3: return 'bg-blue-400';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200';
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

      {/* Right Column (Signup form) */}
      <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-8 sm:p-12 md:p-16 bg-background">
        <div className="w-full max-w-md space-y-8 bg-white dark:bg-card p-8 rounded-2xl border border-gray-100 dark:border-border shadow-xl shadow-purple-500/5 my-4">
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
              Create an Account
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Join AI StudyOS and power up your studying.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 dark:bg-red-500/10 text-red-600 text-xs p-3 rounded-xl border border-red-100 font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label htmlFor="name" className="text-xs font-semibold text-gray-600 dark:text-gray-300">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                  <User className="h-4.5 w-4.5" />
                </div>
                <input
                  id="name"
                  type="text"
                  placeholder="Alex Mercer"
                  {...register('name')}
                  className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-muted border ${
                    errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-250 focus:border-brand-purple'
                  } rounded-xl text-sm transition-all`}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs font-medium">{errors.name.message}</p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1">
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
                  className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-muted border ${
                    errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-250 focus:border-brand-purple'
                  } rounded-xl text-sm transition-all`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
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
                  className={`w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-muted border ${
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

              {/* Password Strength Indicator */}
              {passwordVal && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-[10px] text-gray-500 dark:text-gray-400">
                    <span>Password Strength: <strong>{getStrengthText()}</strong></span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 h-1.5 w-full bg-gray-150 rounded-full overflow-hidden">
                    <div className={`h-full ${passwordStrength >= 1 ? getStrengthColor() : 'bg-gray-200'}`} />
                    <div className={`h-full ${passwordStrength >= 2 ? getStrengthColor() : 'bg-gray-200'}`} />
                    <div className={`h-full ${passwordStrength >= 3 ? getStrengthColor() : 'bg-gray-200'}`} />
                    <div className={`h-full ${passwordStrength >= 4 ? getStrengthColor() : 'bg-gray-200'}`} />
                  </div>
                </div>
              )}
              {errors.password && (
                <p className="text-red-500 text-xs font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="text-xs font-semibold text-gray-600 dark:text-gray-300">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  {...register('confirmPassword')}
                  className={`w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-muted border ${
                    errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-250 focus:border-brand-purple'
                  } rounded-xl text-sm transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs font-medium">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms and conditions checkbox */}
            <div className="space-y-1 py-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-500 dark:text-gray-400 select-none">
                <input
                  type="checkbox"
                  {...register('agreeTerms')}
                  className="rounded border-gray-300 dark:border-gray-600 text-brand-purple focus:ring-brand-purple/20 w-4 h-4 cursor-pointer mt-0.5"
                />
                <span>
                  I agree to the{' '}
                  <a href="#" className="font-semibold text-brand-purple hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="font-semibold text-brand-purple hover:underline">Privacy Policy</a>
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-red-500 text-xs font-medium">{errors.agreeTerms.message}</p>
              )}
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
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-1">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="font-bold text-brand-purple hover:underline"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
