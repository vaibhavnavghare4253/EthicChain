'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaGoogle, FaWallet, FaShieldAlt, FaRocket, FaEye, FaEyeSlash } from 'react-icons/fa';
import { apiService } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'google'>('email');
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

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const authResponse = await apiService.loginWithPassword({
        email,
        password,
      });
      
      await login({
        email: authResponse.user.email,
        displayName: authResponse.user.displayName,
        walletAddress: authResponse.user.walletAddress,
      });
      
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (error: any) {
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Simulate Google OAuth - in production, integrate with Google OAuth
      await login({
        email: 'user@gmail.com',
        displayName: 'Google User',
      });
      
      setSuccess('Google login successful! Redirecting...');
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (error: any) {
      setError('Google login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const features = [
    {
      icon: <FaShieldAlt className="w-6 h-6" />,
      title: 'Secure & Transparent',
      description: 'All transactions recorded on blockchain',
    },
    {
      icon: <FaRocket className="w-6 h-6" />,
      title: 'Instant Donations',
      description: 'Send crypto donations instantly',
    },
    {
      icon: <FaWallet className="w-6 h-6" />,
      title: 'Web3 Native',
      description: 'Built for the decentralized future',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute w-96 h-96 -top-48 -right-48 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute w-96 h-96 bottom-0 left-1/2 -translate-x-1/2 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Branding & Features */}
          <div className={`space-y-8 ${isAnimating ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="space-y-6">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <span className="text-2xl font-bold text-white">CharityChain</span>
              </Link>
              
              <div>
                <h1 className="text-5xl md:text-6xl font-bold mb-4">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400">
                    Welcome Back
                  </span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Connect your wallet and start making transparent, impactful donations today
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 glass-effect rounded-xl p-4 border border-white/10 hover:border-purple-500/50 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className={`${isAnimating ? 'animate-slide-up' : 'opacity-0 translate-y-8'}`}>
            <div className="glass-effect rounded-3xl p-8 border border-white/10 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
                <p className="text-gray-400">Choose your preferred login method</p>
              </div>

              {/* Login Method Tabs */}
              <div className="flex space-x-2 mb-6 bg-white/5 rounded-xl p-1">
                <button
                  onClick={() => setLoginMethod('email')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    loginMethod === 'email'
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Email
                </button>
                <button
                  onClick={() => setLoginMethod('google')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    loginMethod === 'google'
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg'
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

              {/* Email Login Form */}
              {loginMethod === 'email' && (
                <form onSubmit={handleEmailLogin} className="space-y-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
                        placeholder="Enter your password"
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

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-purple-600 bg-white/5 border-white/10 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <span className="ml-2 text-gray-400 text-sm">Remember me</span>
                    </label>
                    <Link href="#" className="text-purple-400 hover:text-purple-300 text-sm">
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-60"
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </button>
                </form>
              )}

              {/* Google Login */}
              {loginMethod === 'google' && (
                <div className="space-y-6">
                  <button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 transition-all disabled:opacity-60 flex items-center justify-center space-x-3"
                  >
                    <FaGoogle className="w-5 h-5" />
                    <span>{isLoading ? 'Connecting...' : 'Continue with Google'}</span>
                  </button>
                  
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">
                      By continuing, you agree to our{' '}
                      <Link href="#" className="text-purple-400 hover:text-purple-300">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="#" className="text-purple-400 hover:text-purple-300">
                        Privacy Policy
                      </Link>
                    </p>
                  </div>
                </div>
              )}


              {/* Sign Up Link */}
              <div className="text-center mt-6">
                <p className="text-gray-400">
                  Don't have an account?{' '}
                  <Link href="/register" className="text-purple-400 hover:text-purple-300 font-semibold">
                    Sign up
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
