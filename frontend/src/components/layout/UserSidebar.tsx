'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FaUser, FaSignOutAlt, FaCog, FaWallet, FaTimes, FaHistory, FaHeart } from 'react-icons/fa';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserSidebar({ isOpen, onClose }: UserSidebarProps) {
  const { user, logout } = useAuth();

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('.sidebar-container')) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in" />

      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-80 bg-gradient-to-br from-white via-gray-50 to-white shadow-2xl z-50 transform transition-all duration-500 ease-out sidebar-container">
        <div className="flex flex-col h-screen">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <FaUser className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Profile
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-xl transition-all duration-200 hover:scale-110 group"
            >
              <FaTimes className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-200/50 bg-gradient-to-br from-white to-gray-50/50">
            <div className="flex items-center space-x-4 animate-slide-in-left">
              <div className="relative group">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl ring-4 ring-white/50 group-hover:ring-indigo-200/50 transition-all duration-300 group-hover:scale-105">
                  <span className="text-white text-3xl font-bold">
                    {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                {/* Online indicator */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-3 border-white shadow-lg animate-pulse"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900 truncate mb-1">
                  {user?.displayName || 'User'}
                </h3>
                <p className="text-sm text-gray-600 truncate mb-2">
                  {user?.email || 'No email'}
                </p>
                {user?.walletAddress && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <p className="text-xs text-gray-500 font-mono truncate">
                      {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-6 overflow-y-auto">
            <nav className="space-y-3">
              <Link 
                href="/profile" 
                className="w-full flex items-center space-x-4 px-4 py-4 text-left text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all duration-300 hover:shadow-md group animate-slide-in-left" 
                style={{ animationDelay: '0.1s' }}
                onClick={onClose}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <FaUser className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-semibold">Profile Settings</span>
                  <p className="text-xs text-gray-500">Manage your profile</p>
                </div>
              </Link>
              
              <Link 
                href="/donations" 
                className="w-full flex items-center space-x-4 px-4 py-4 text-left text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all duration-300 hover:shadow-md group animate-slide-in-left" 
                style={{ animationDelay: '0.15s' }}
                onClick={onClose}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <FaHistory className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-semibold">My Donations</span>
                  <p className="text-xs text-gray-500">View donation history</p>
                </div>
              </Link>

              <Link 
                href="/campaigns" 
                className="w-full flex items-center space-x-4 px-4 py-4 text-left text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all duration-300 hover:shadow-md group animate-slide-in-left" 
                style={{ animationDelay: '0.2s' }}
                onClick={onClose}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <FaHeart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-semibold">My Campaigns</span>
                  <p className="text-xs text-gray-500">Manage your campaigns</p>
                </div>
              </Link>
              
              <button className="w-full flex items-center space-x-4 px-4 py-4 text-left text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all duration-300 hover:shadow-md group animate-slide-in-left" style={{ animationDelay: '0.25s' }}>
                <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <FaCog className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-semibold">Account Settings</span>
                  <p className="text-xs text-gray-500">Privacy & security</p>
                </div>
              </button>

              <div className="pt-4 animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center space-x-4 px-4 py-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
                    <FaWallet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Wallet Connection</span>
                    <p className="text-xs text-gray-500">Connect your crypto wallet</p>
                  </div>
                </div>
                <div className="px-4 pb-2">
                  <ConnectButton />
                </div>
              </div>
            </nav>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200/50 bg-gradient-to-r from-red-50 to-pink-50">
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 font-semibold group animate-slide-in-left" 
              style={{ animationDelay: '0.4s' }}
            >
              <FaSignOutAlt className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
