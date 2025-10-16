'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900">CharityChain</span>
          </Link>

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

          {/* Connect Wallet Button */}
          <div className="flex items-center space-x-4">
            <ConnectButton />
            
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
          </div>
        )}
      </nav>
    </header>
  );
}

