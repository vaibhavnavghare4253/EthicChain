'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TransactionDetailsModal from '@/components/TransactionDetailsModal';
import { apiService, Campaign } from '@/lib/api';
import Link from 'next/link';

interface Transaction {
  id: string;
  donorAddress: string;
  amount: number;
  txHash: string;
  message?: string;
  isAnonymous: boolean;
  timestamp: string;
  donorName?: string;
}

interface MoneyUsage {
  id: string;
  description: string;
  amount: number;
  category: string;
  proofUrl?: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'verified';
}

export default function CampaignTransactionsPage() {
  const params = useParams();
  const campaignId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [moneyUsage, setMoneyUsage] = useState<MoneyUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'transactions' | 'usage'>('transactions');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!campaignId) return;
      try {
        const [campaignData, transactionsData, usageData] = await Promise.all([
          apiService.getCampaign(campaignId),
          apiService.getCampaignTransactions(campaignId),
          apiService.getCampaignMoneyUsage(campaignId)
        ]);
        
        setCampaign(campaignData);
        setTransactions(transactionsData);
        setMoneyUsage(usageData);
      } catch (e) {
        setError('Failed to load transaction data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [campaignId]);

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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-400/10';
      case 'verified':
        return 'text-blue-400 bg-blue-400/10';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
        <Header />
        <div className="container mx-auto px-4 pt-24 pb-20">
          <div className="text-center text-gray-300">Loading transaction data...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
        <Header />
        <div className="container mx-auto px-4 pt-24 pb-20">
          <div className="text-center text-red-400">{error || 'Campaign not found.'}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-20">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={`/campaigns/${campaignId}`}
            className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-4 group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Campaign
          </Link>
          
          <h1 className="text-4xl font-bold text-white mb-2">
            Transaction Transparency
          </h1>
          <p className="text-gray-300 text-lg">
            Track every donation and see exactly how funds are being used for "{campaign.title}"
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="glass-effect rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Raised</p>
                <p className="text-2xl font-bold text-white">{formatAmount(campaign.currentAmount)}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="glass-effect rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Donations</p>
                <p className="text-2xl font-bold text-white">{transactions.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="glass-effect rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Funds Used</p>
                <p className="text-2xl font-bold text-white">
                  {formatAmount(moneyUsage.reduce((sum, usage) => sum + usage.amount, 0))}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="glass-effect rounded-2xl p-6 border border-white/10 mb-8">
          <div className="flex space-x-1 mb-6">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'transactions'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All Donations ({transactions.length})
            </button>
            <button
              onClick={() => setActiveTab('usage')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'usage'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Money Usage ({moneyUsage.length})
            </button>
          </div>

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <p className="text-gray-400 text-lg">No donations yet</p>
                  <p className="text-gray-500 text-sm">Be the first to support this campaign!</p>
                </div>
              ) : (
                transactions.map((transaction) => (
                  <div key={transaction.id} className="glass-effect rounded-xl p-4 border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer"
                       onClick={() => {
                         setSelectedTransaction(transaction);
                         setIsModalOpen(true);
                       }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-semibold">
                            {transaction.isAnonymous ? 'Anonymous Donor' : (transaction.donorName || formatAddress(transaction.donorAddress))}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {formatDate(transaction.timestamp)}
                          </p>
                          {transaction.message && (
                            <p className="text-gray-300 text-sm mt-1 italic">"{transaction.message}"</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-400">
                          {formatAmount(transaction.amount)}
                        </p>
                        <a
                          href={`https://etherscan.io/tx/${transaction.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 text-sm font-mono"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {formatAddress(transaction.txHash)}
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Money Usage Tab */}
          {activeTab === 'usage' && (
            <div className="space-y-4">
              {moneyUsage.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-gray-400 text-lg">No fund usage recorded yet</p>
                  <p className="text-gray-500 text-sm">Funds will be tracked as they are used for the campaign</p>
                </div>
              ) : (
                moneyUsage.map((usage) => (
                  <div key={usage.id} className="glass-effect rounded-xl p-4 border border-white/5 hover:border-purple-500/30 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-semibold">{usage.description}</p>
                          <p className="text-gray-400 text-sm">
                            {usage.category} • {formatDate(usage.timestamp)}
                          </p>
                          {usage.proofUrl && (
                            <a
                              href={usage.proofUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-400 hover:text-purple-300 text-sm"
                            >
                              View Proof →
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-blue-400">
                          {formatAmount(usage.amount)}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(usage.status)}`}>
                          {usage.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Blockchain Verification */}
        <div className="glass-effect rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Blockchain Verification</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-2">Campaign Contract</p>
              <a
                href={`https://etherscan.io/address/${campaign.contractAddress || campaign.beneficiaryAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 font-mono text-sm"
              >
                {formatAddress(campaign.contractAddress || campaign.beneficiaryAddress)}
              </a>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Beneficiary Address</p>
              <a
                href={`https://etherscan.io/address/${campaign.beneficiaryAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 font-mono text-sm"
              >
                {formatAddress(campaign.beneficiaryAddress)}
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction}
      />
    </div>
  );
}
