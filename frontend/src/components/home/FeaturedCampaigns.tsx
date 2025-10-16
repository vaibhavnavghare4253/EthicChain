'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { apiService, Campaign } from '@/lib/api';

export default function FeaturedCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await apiService.getActiveCampaigns();
        // Take only the first 3 campaigns for featured section
        setCampaigns(data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching campaigns:', err);
        setError('Failed to load campaigns');
        // Fallback to mock data if API fails
        setCampaigns([
          {
            id: '1',
            title: 'Clean Water for Rural Communities',
            description: 'Bringing clean water to communities in need',
            charityName: 'WaterAid',
            imageUrl: 'https://images.unsplash.com/photo-1617396900799-f4ec2b43c7ae?w=500',
            currentAmount: 45230,
            targetAmount: 50000,
            creatorAddress: '0x1234...5678',
            category: 'Water & Sanitation',
            deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true,
            beneficiaryAddress: '0x1234...5678',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'Education for Underprivileged Children',
            description: 'Providing quality education and resources',
            charityName: 'Education First',
            imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500',
            currentAmount: 32100,
            targetAmount: 60000,
            creatorAddress: '0x2345...6789',
            category: 'Education',
            deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true,
            beneficiaryAddress: '0x2345...6789',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '3',
            title: 'Medical Supplies for Disaster Relief',
            description: 'Emergency medical supplies for crisis areas',
            charityName: 'Health Heroes',
            imageUrl: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=500',
            currentAmount: 78500,
            targetAmount: 100000,
            creatorAddress: '0x3456...7890',
            category: 'Healthcare',
            deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true,
            beneficiaryAddress: '0x3456...7890',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Featured Campaigns</h2>
            <p className="text-gray-600">Make an impact today with these verified campaigns</p>
          </div>
          <Link 
            href="/campaigns" 
            className="hidden md:block px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-gray-600">Using sample data for demonstration</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((campaign) => {
              const progress = (campaign.currentAmount / campaign.targetAmount) * 100;
              const daysLeft = Math.ceil((new Date(campaign.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              
              return (
                <div 
                  key={campaign.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 border border-gray-100"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-200">
                    {campaign.imageUrl && (
                      <img 
                        src={campaign.imageUrl} 
                        alt={campaign.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700">
                        {campaign.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <p className="text-sm text-primary-600 font-semibold mb-1">{campaign.charityName}</p>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {campaign.title}
                      </h3>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-bold text-gray-900">
                          ${campaign.currentAmount.toLocaleString()}
                        </span>
                        <span className="text-gray-600">
                          of ${campaign.targetAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                      <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}</span>
                      <span>{Math.round(progress)}% funded</span>
                    </div>

                    {/* CTA */}
                    <Link 
                      href={`/campaigns/${campaign.id}`}
                      className="block w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white text-center rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition"
                    >
                      Donate Now
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link 
            href="/campaigns" 
            className="inline-block px-8 py-3 border-2 border-primary-600 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition"
          >
            View All Campaigns
          </Link>
        </div>
      </div>
    </section>
  );
}

