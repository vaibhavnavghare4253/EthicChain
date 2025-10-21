'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { apiService, Campaign } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/LoginModal';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, setShowLoginModal, login } = useAuth();

  // Fetch campaigns from API
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await apiService.getCampaigns();
        setCampaigns(data);
      } catch (err) {
        console.error('Error fetching campaigns:', err);
        // Fallback to mock data if API fails
        setCampaigns([
          {
            id: '1',
            title: 'Clean Water Initiative',
            description: 'Bringing clean water to communities in need across Africa',
            imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
            targetAmount: 100000,
            currentAmount: 65000,
            creatorAddress: '0x1234...5678',
            charityName: 'Water For All',
            category: 'Environment',
            deadline: new Date('2025-12-31').toISOString(),
            isActive: true,
            beneficiaryAddress: '0x1234...5678',
            ipfsHash: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'Education for Underprivileged Children',
            description: 'Providing quality education and resources to children who need it most',
            imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
            targetAmount: 75000,
            currentAmount: 45000,
            creatorAddress: '0x2345...6789',
            charityName: 'EduFuture',
            category: 'Education',
            deadline: new Date('2025-11-30').toISOString(),
            isActive: true,
            beneficiaryAddress: '0x2345...6789',
            ipfsHash: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '3',
            title: 'Medical Aid for Crisis Zones',
            description: 'Emergency medical supplies and healthcare for people in crisis areas',
            imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
            targetAmount: 150000,
            currentAmount: 120000,
            creatorAddress: '0x3456...7890',
            charityName: 'MedAid Global',
            category: 'Healthcare',
            deadline: new Date('2025-10-31').toISOString(),
            isActive: true,
            beneficiaryAddress: '0x3456...7890',
            ipfsHash: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const categories = ['all', 'Healthcare', 'Education', 'Environment', 'Emergency'];

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesCategory = filter === 'all' || campaign.category === filter;
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDonateClick = (e: React.MouseEvent, campaignId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      // User is logged in, navigate to campaign detail page
      window.location.href = `/campaigns/${campaignId}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 -top-48 -left-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute w-96 h-96 -top-48 -right-48 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                Discover Campaigns
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Support transparent, blockchain-verified charitable causes making real impact worldwide
            </p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-5xl mx-auto mb-12">
            <div className="glass-effect rounded-2xl p-6 border border-white/10">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search campaigns..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
                    />
                    <svg
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-purple-500 transition-all appearance-none cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-slate-900">
                        {cat === 'all' ? 'All Categories' : cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campaigns Grid */}
      <section className="relative py-16 -mt-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="glass-effect rounded-2xl p-6 border border-white/10 animate-pulse"
                >
                  <div className="w-full h-48 bg-white/5 rounded-xl mb-4"></div>
                  <div className="h-6 bg-white/5 rounded mb-2"></div>
                  <div className="h-4 bg-white/5 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCampaigns.map((campaign, index) => (
                <div
                  key={campaign.id}
                  className="group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="glass-effect rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 h-full flex flex-col">
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden flex-shrink-0">
                      <img
                        src={campaign.imageUrl}
                        alt={campaign.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-purple-600/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-white">
                        {campaign.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
                        {campaign.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                        {campaign.description}
                      </p>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-purple-400 font-semibold">
                            {Math.round(
                              (campaign.currentAmount / campaign.targetAmount) * 100
                            )}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-cyan-500 h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(
                                (campaign.currentAmount / campaign.targetAmount) * 100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex justify-between items-end mt-auto">
                        <div>
                          <p className="text-2xl font-bold text-white">
                            ${(campaign.currentAmount / 1000).toFixed(1)}k
                          </p>
                          <p className="text-xs text-gray-400">
                            of ${(campaign.targetAmount / 1000).toFixed(1)}k
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={(e) => handleDonateClick(e, campaign.id)}
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all text-sm"
                          >
                            Donate
                          </button>
                          <Link
                            href={`/campaigns/${campaign.id}/transactions`}
                            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg font-semibold text-white hover:bg-white/20 transition-all text-sm"
                          >
                            Track
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredCampaigns.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl">No campaigns found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={useAuth().showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={login}
      />
    </div>
  );
}

