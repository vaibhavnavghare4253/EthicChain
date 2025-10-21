'use client';

import { useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { FaTimes, FaWallet, FaGoogle, FaEnvelope } from 'react-icons/fa';
import { apiService, User, RegisterRequest, RegisterWithPasswordRequest } from '@/lib/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: Partial<User>) => Promise<void>;
}

export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'google' | 'metamask'>('email');
  const [error, setError] = useState<string | null>(null);
  
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();

  if (!isOpen) return null;

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (password) {
        // Login with email and password
        const authResponse = await apiService.loginWithPassword({
          email,
          password,
        });
        await onLogin(authResponse.user);
      } else {
        // Login without password (simulated)
        await onLogin({
          email,
          displayName: displayName || email.split('@')[0],
        });
      }
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate Google OAuth - replace with actual implementation
      await onLogin({
        email: 'user@gmail.com',
        displayName: 'Google User',
      });
    } catch (error) {
      setError('Google login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMetaMaskConnect = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!isConnected) {
        await connect({ connector: injected() });
      }
      
      if (address) {
        await onLogin({
          walletAddress: address,
          displayName: displayName || 'Wallet User',
        });
      }
    } catch (error) {
      console.error('Failed to connect MetaMask:', error);
      setError('Wallet connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !displayName || !password) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const registerRequest: RegisterWithPasswordRequest = {
        email,
        displayName,
        password,
      };

      const newUser = await apiService.registerWithPassword(registerRequest);
      await onLogin(newUser);
    } catch (error) {
      setError('Registration failed. Email might already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-900 rounded-3xl p-8 max-w-md w-full mx-4 border border-white/10 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <FaTimes className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400">Sign in to continue to CharityChain</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 font-semibold">{error}</p>
          </div>
        )}

        {/* Login Methods */}
        <div className="space-y-4">
          {/* Email Login */}
          {loginMethod === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter your display name"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          )}

          {/* Login Method Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => setLoginMethod('email')}
              className={`w-full py-3 rounded-xl font-semibold transition flex items-center justify-center space-x-3 ${
                loginMethod === 'email'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              <FaEnvelope className="w-5 h-5" />
              <span>Continue with Email</span>
            </button>

            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-semibold text-gray-300 hover:bg-white/10 transition flex items-center justify-center space-x-3 disabled:opacity-50"
            >
              <FaGoogle className="w-5 h-5" />
              <span>{isLoading ? 'Signing In...' : 'Continue with Google'}</span>
            </button>

            <button
              onClick={handleMetaMaskConnect}
              disabled={isLoading}
              className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-semibold text-gray-300 hover:bg-white/10 transition flex items-center justify-center space-x-3 disabled:opacity-50"
            >
              <FaWallet className="w-5 h-5" />
              <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-white/10">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <button 
                onClick={handleRegister}
                disabled={isLoading}
                className="text-purple-400 hover:text-purple-300 font-semibold disabled:opacity-50"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
