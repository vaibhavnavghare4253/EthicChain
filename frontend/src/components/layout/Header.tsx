'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UserSidebar from './UserSidebar';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLoggedIn, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side - Profile & Logo */}
          <div className="flex items-center space-x-4">
            {/* Profile Button - Leftmost */}
            {isLoggedIn && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="relative group p-1 hover:scale-110 transition-all duration-300 ease-out"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/20 hover:ring-indigo-300/50 transition-all duration-300">
                  <span className="text-white text-lg font-bold">
                    {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                {/* Hover indicator */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            )}
            
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900">CharityChain</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/campaigns" className="text-gray-600 hover:text-primary-600 transition">
              Campaigns
            </Link>
            <Link href="/create" className="text-gray-600 hover:text-primary-600 transition">
              Create Campaign
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-primary-600 transition">
              About
            </Link>
            <Link href="/how-it-works" className="text-gray-600 hover:text-primary-600 transition">
              How It Works
            </Link>
          </div>

          {/* Right Side - Auth & Wallet */}
          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <div className="hidden md:flex items-center space-x-3">
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-gray-600 hover:text-primary-600 transition font-medium"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg hover:shadow-lg transition font-medium"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Connect Wallet Button - Rightmost */}
                <div className="hidden md:block">
                  <ConnectButton />
                </div>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link href="/campaigns" className="block text-gray-600 hover:text-primary-600">
              Campaigns
            </Link>
            <Link href="/create" className="block text-gray-600 hover:text-primary-600">
              Create Campaign
            </Link>
            <Link href="/about" className="block text-gray-600 hover:text-primary-600">
              About
            </Link>
            <Link href="/how-it-works" className="block text-gray-600 hover:text-primary-600">
              How It Works
            </Link>
            <div className="pt-4 border-t border-gray-200 space-y-3">
              {!isLoggedIn ? (
                <>
                  <Link 
                    href="/login" 
                    className="block px-4 py-2 text-gray-600 hover:text-primary-600 transition font-medium"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/register" 
                    className="block px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg hover:shadow-lg transition font-medium text-center"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <div className="px-4 py-2">
                    <ConnectButton />
                  </div>
                  <button
                    onClick={() => {
                      setIsSidebarOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200 w-full text-left group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                      <span className="text-white text-lg font-bold">
                        {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 font-medium">
                        {user?.displayName || user?.email || 'User'}
                      </p>
                      <p className="text-sm text-gray-500">View Profile</p>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      
      {/* User Sidebar */}
      <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </header>
  );
}

