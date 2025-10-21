'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { apiService, Campaign } from '@/lib/api';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/LoginModal';

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [donationAmount, setDonationAmount] = useState<string>('50');
  const [isDonating, setIsDonating] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const { isLoggedIn, setShowLoginModal, login } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!campaignId) return;
      try {
        const data = await apiService.getCampaign(campaignId);
        setCampaign(data);
      } catch (e) {
        setError('Failed to load campaign.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [campaignId]);

  const handleDonate = async () => {
    if (!campaign) return;
    
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    
    const amountNum = Number(donationAmount);
    if (!amountNum || amountNum <= 0) return;

    try {
      setIsDonating(true);
      setTxHash(null);
      const res = await apiService.makeDonation({
        campaignId: campaign.id,
        amount: amountNum,
        isAnonymous: false,
      });
      setTxHash(res.txHash);
    } catch (e) {
      setError('Donation failed. Please try again.');
    } finally {
      setIsDonating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-20">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/campaigns"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Campaigns
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-gray-300">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-400">{error}</div>
        ) : !campaign ? (
          <div className="text-center text-gray-300">Campaign not found.</div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left: Image and details */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl overflow-hidden border border-white/10 glass-effect">
                <div className="relative h-80 bg-white/5">
                  {campaign.imageUrl && (
                    <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-8">
                  <div className="mb-4">
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white border border-white/10">
                      {campaign.category}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{campaign.title}</h1>
                  <p className="text-gray-300 mb-6 leading-relaxed">{campaign.description}</p>

                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-semibold">
                        ${campaign.currentAmount.toLocaleString()}
                      </span>
                      <span className="text-gray-400">of ${campaign.targetAmount.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                        style={{
                          width: `${Math.min(
                            (campaign.currentAmount / campaign.targetAmount) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-gray-400 text-sm">
                    <span>Charity: <span className="text-white font-semibold">{campaign.charityName}</span></span>
                    <span>Beneficiary: <span className="font-mono text-white">{campaign.beneficiaryAddress}</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Donate panel */}
            <div>
              <div className="glass-effect rounded-3xl p-6 border border-white/10 sticky top-24">
                <h2 className="text-xl font-bold text-white mb-4">Donate</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Amount (USD)</label>
                    <input
                      type="number"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      min="1"
                    />
                  </div>
                  <button
                    onClick={handleDonate}
                    disabled={isDonating}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-60"
                  >
                    {isDonating ? 'Processing...' : 'Donate Now'}
                  </button>

                  <Link
                    href={`/campaigns/${campaign.id}/transactions`}
                    className="w-full py-3 bg-white/10 border border-white/20 rounded-xl text-white font-semibold hover:bg-white/20 transition text-center block"
                  >
                    View All Transactions
                  </Link>

                  {txHash && (
                    <div className="text-sm text-gray-300">
                      Transaction submitted: <span className="font-mono">{txHash}</span>
                    </div>
                  )}

                  <div className="text-sm text-gray-400">
                    By donating, you agree to our
                    {' '}
                    <Link href="#" className="text-purple-400 hover:text-purple-300">terms</Link>.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

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


