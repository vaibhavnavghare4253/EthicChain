'use client';

import { useState } from 'react';

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: {
    id: string;
    donorAddress: string;
    amount: number;
    txHash: string;
    message?: string;
    isAnonymous: boolean;
    timestamp: string;
    donorName?: string;
  } | null;
}

export default function TransactionDetailsModal({ isOpen, onClose, transaction }: TransactionDetailsModalProps) {
  if (!isOpen || !transaction) return null;

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl glass-effect rounded-3xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Transaction Details</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Transaction Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">Donor</label>
                <p className="text-white font-semibold">
                  {transaction.isAnonymous ? 'Anonymous Donor' : (transaction.donorName || formatAddress(transaction.donorAddress))}
                </p>
                {!transaction.isAnonymous && (
                  <p className="text-gray-400 text-sm font-mono">{formatAddress(transaction.donorAddress)}</p>
                )}
              </div>

              <div>
                <label className="text-gray-400 text-sm">Amount</label>
                <p className="text-2xl font-bold text-green-400">{formatAmount(transaction.amount)}</p>
              </div>

              <div>
                <label className="text-gray-400 text-sm">Date & Time</label>
                <p className="text-white">{formatDate(transaction.timestamp)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">Transaction Hash</label>
                <div className="flex items-center space-x-2">
                  <p className="text-white font-mono text-sm">{formatAddress(transaction.txHash)}</p>
                  <a
                    href={`https://etherscan.io/tx/${transaction.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm">Status</label>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 font-semibold">Confirmed</span>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm">Privacy</label>
                <p className="text-white">
                  {transaction.isAnonymous ? 'Anonymous Donation' : 'Public Donation'}
                </p>
              </div>
            </div>
          </div>

          {/* Message */}
          {transaction.message && (
            <div>
              <label className="text-gray-400 text-sm">Message</label>
              <div className="mt-2 p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-white italic">"{transaction.message}"</p>
              </div>
            </div>
          )}

          {/* Blockchain Verification */}
          <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-blue-400 font-semibold mb-1">Blockchain Verified</h3>
                <p className="text-gray-300 text-sm">
                  This transaction is permanently recorded on the Ethereum blockchain and cannot be altered or deleted.
                </p>
                <a
                  href={`https://etherscan.io/tx/${transaction.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm font-semibold mt-2 inline-block"
                >
                  View on Etherscan →
                </a>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-white/10 border border-white/20 rounded-xl text-white font-semibold hover:bg-white/20 transition-colors"
            >
              Close
            </button>
            <a
              href={`https://etherscan.io/tx/${transaction.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all text-center"
            >
              View on Blockchain
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
