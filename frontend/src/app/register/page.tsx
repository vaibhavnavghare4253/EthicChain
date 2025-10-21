'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaGoogle, FaWallet, FaShieldAlt, FaRocket, FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { apiService } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registerMethod, setRegisterMethod] = useState<'email' | 'google'>('email');
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();
  const { login, isLoggedIn } = useAuth();

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const newUser = await apiService.registerWithPassword({
        email: formData.email,
        displayName: `${formData.firstName} ${formData.lastName}`,
        password: formData.password,
      });
      
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error: any) {
      setError(error.message || 'Registration failed. Email might already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Simulate Google OAuth - in production, integrate with Google OAuth
      await login({
        email: 'user@gmail.com',
        displayName: 'Google User',
      });
      
      setSuccess('Google registration successful! Redirecting...');
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (error: any) {
      setError('Google registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const benefits = [
    {
      icon: <FaShieldAlt className="w-6 h-6" />,
      title: 'Secure Account',
      description: 'Your data is protected with enterprise-grade security',
    },
    {
      icon: <FaRocket className="w-6 h-6" />,
      title: 'Instant Access',
      description: 'Start donating immediately after registration',
    },
    {
      icon: <FaWallet className="w-6 h-6" />,
      title: 'Web3 Ready',
      description: 'Connect multiple wallets and manage your donations',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute w-96 h-96 -top-48 -right-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute w-96 h-96 bottom-0 left-1/2 -translate-x-1/2 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Branding & Benefits */}
          <div className={`space-y-8 ${isAnimating ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="space-y-6">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <span className="text-2xl font-bold text-white">CharityChain</span>
              </Link>
              
              <div>
                <h1 className="text-5xl md:text-6xl font-bold mb-4">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                    Join the Future
                  </span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Create your account and become part of the transparent charity revolution
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 glass-effect rounded-xl p-4 border border-white/10 hover:border-indigo-500/50 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{benefit.title}</h3>
                    <p className="text-gray-400 text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className={`${isAnimating ? 'animate-slide-up' : 'opacity-0 translate-y-8'}`}>
            <div className="glass-effect rounded-3xl p-8 border border-white/10 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                <p className="text-gray-400">Choose your preferred registration method</p>
              </div>

              {/* Registration Method Tabs */}
              <div className="flex space-x-2 mb-6 bg-white/5 rounded-xl p-1">
                <button
                  onClick={() => setRegisterMethod('email')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    registerMethod === 'email'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Email
                </button>
                <button
                  onClick={() => setRegisterMethod('google')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    registerMethod === 'google'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Google
                </button>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 mb-6">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              
              {success && (
                <div className="bg-green-500/10 border border-green-500/50 rounded-xl p-4 mb-6">
                  <p className="text-green-400 text-sm">{success}</p>
                </div>
              )}

              {/* Email Registration Form */}
              {registerMethod === 'email' && (
                <form onSubmit={handleEmailRegister} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">First Name</label>
                      <div className="relative">
                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all"
                          placeholder="John"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">Last Name</label>
                      <div className="relative">
                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all"
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Email Address</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Password</label>
                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all"
                        placeholder="Create a strong password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Confirm Password</label>
                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all"
                        placeholder="Confirm your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                      className="w-5 h-5 text-indigo-600 bg-white/5 border-white/10 rounded focus:ring-indigo-500 focus:ring-2 mt-1"
                      required
                    />
                    <label className="text-gray-400 text-sm">
                      I agree to the{' '}
                      <Link href="#" className="text-indigo-400 hover:text-indigo-300">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="#" className="text-indigo-400 hover:text-indigo-300">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all disabled:opacity-60"
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>
              )}

              {/* Google Registration */}
              {registerMethod === 'google' && (
                <div className="space-y-6">
                  <button
                    onClick={handleGoogleRegister}
                    disabled={isLoading}
                    className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 transition-all disabled:opacity-60 flex items-center justify-center space-x-3"
                  >
                    <FaGoogle className="w-5 h-5" />
                    <span>{isLoading ? 'Creating Account...' : 'Sign up with Google'}</span>
                  </button>
                  
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">
                      By creating an account, you agree to our{' '}
                      <Link href="#" className="text-indigo-400 hover:text-indigo-300">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="#" className="text-indigo-400 hover:text-indigo-300">
                        Privacy Policy
                      </Link>
                    </p>
                  </div>
                </div>
              )}


              {/* Sign In Link */}
              <div className="text-center mt-6">
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
