'use client';

import { useState, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CreateCampaignInput } from '@/types/campaign';
import { apiService, CreateCampaignData } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/LoginModal';

export default function CreateCampaignPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const { isLoggedIn, setShowLoginModal, login } = useAuth();
  
  const [formData, setFormData] = useState<Partial<CreateCampaignInput>>({
    title: '',
    description: '',
    targetAmount: '',
    category: 'Healthcare',
    charityName: '',
    beneficiaryAddress: '',
  });

  const categories = ['Healthcare', 'Education', 'Environment', 'Emergency', 'Community', 'Animals'];

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    
    if (!isConnected || !address) {
      setError('Please connect your wallet to create a campaign');
      return;
    }

    if (!formData.title || !formData.description || !formData.targetAmount || 
        !formData.charityName || !formData.beneficiaryAddress || !formData.deadline) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // For now, we'll use a placeholder image URL
      // In a real app, you'd upload the image to a service like IPFS or AWS S3
      let imageUrl = '';
      if (imageFile) {
        // This is a placeholder - in production you'd upload to IPFS or cloud storage
        imageUrl = imagePreview || '';
      }

      const campaignData: CreateCampaignData = {
        title: formData.title,
        description: formData.description,
        targetAmount: parseFloat(formData.targetAmount),
        category: formData.category || 'Healthcare',
        charityName: formData.charityName,
        beneficiaryAddress: formData.beneficiaryAddress,
        deadline: formData.deadline.toISOString(),
        creatorAddress: address,
        imageUrl: imageUrl || undefined,
        milestones: [] // Empty milestones array
      };

      const createdCampaign = await apiService.createCampaign(campaignData);
      
      // Redirect to the created campaign page
      router.push(`/campaigns/${createdCampaign.id}`);
    } catch (err) {
      console.error('Error creating campaign:', err);
      setError('Failed to create campaign. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 top-0 left-1/4 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute w-96 h-96 top-0 right-1/4 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-700"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Create Your Campaign
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Launch your transparent, blockchain-powered fundraising campaign
            </p>
          </div>

          {/* Progress Steps */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-between">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div className="flex items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                        step >= s
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-500/50'
                          : 'bg-white/5 text-gray-500 border border-white/10'
                      }`}
                    >
                      {s}
                    </div>
                    <div className="ml-3 text-left">
                      <p className={`font-semibold ${step >= s ? 'text-white' : 'text-gray-500'}`}>
                        {s === 1 ? 'Basic Info' : 'Details & Image'}
                      </p>
                    </div>
                  </div>
                  {s < 2 && (
                    <div
                      className={`flex-1 h-1 mx-4 rounded-full transition-all ${
                        step > s ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-white/10'
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="glass-effect rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl">
                
                {/* Wallet Connection Status */}
                {!isLoggedIn && (
                  <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                    <p className="text-yellow-400 font-semibold">
                      ⚠️ Please sign in to create a campaign
                    </p>
                  </div>
                )}

                {isLoggedIn && !isConnected && (
                  <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                    <p className="text-yellow-400 font-semibold">
                      ⚠️ Please connect your wallet to create a campaign
                    </p>
                  </div>
                )}

                {/* Error Display */}
                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-red-400 font-semibold">
                      ❌ {error}
                    </p>
                  </div>
                )}
                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Campaign Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
                        placeholder="e.g., Clean Water for Rural Communities"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Charity/Organization Name *
                      </label>
                      <input
                        type="text"
                        value={formData.charityName}
                        onChange={(e) => handleInputChange('charityName', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
                        placeholder="Your organization name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-purple-500 transition-all"
                        required
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat} className="bg-slate-900">
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Target Amount (USD) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
                          $
                        </span>
                        <input
                          type="number"
                          value={formData.targetAmount}
                          onChange={(e) => handleInputChange('targetAmount', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
                          placeholder="50000"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Details & Image */}
                {step === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Campaign Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={6}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all resize-none"
                        placeholder="Describe your campaign, its goals, and the impact it will make..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Beneficiary Wallet Address *
                      </label>
                      <input
                        type="text"
                        value={formData.beneficiaryAddress}
                        onChange={(e) => handleInputChange('beneficiaryAddress', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all font-mono text-sm"
                        placeholder="0x..."
                        required
                      />
                      <p className="text-gray-400 text-sm mt-2">
                        Ethereum address where funds will be sent
                      </p>
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Campaign End Date *
                      </label>
                      <input
                        type="date"
                        onChange={(e) =>
                          handleInputChange('deadline', new Date(e.target.value))
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-purple-500 transition-all"
                        required
                      />
                    </div>

                    {/* Image Upload Section */}
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Campaign Image
                      </label>
                      
                      {!imagePreview ? (
                        <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-purple-500/50 transition-all cursor-pointer"
                             onClick={() => fileInputRef.current?.click()}>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-gray-400 font-semibold mb-2">Upload Campaign Image</p>
                          <p className="text-gray-500 text-sm">Click to browse or drag and drop</p>
                          <p className="text-gray-500 text-xs mt-2">PNG, JPG, GIF up to 5MB</p>
                        </div>
                      ) : (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Campaign preview"
                            className="w-full h-64 object-cover rounded-xl border border-white/10"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-4 right-4 bg-red-500/90 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                            <p className="text-white text-sm font-semibold">
                              {imageFile?.name}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <p className="text-gray-400 text-sm mt-2">
                        Optional: Upload an image to represent your campaign
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-10 pt-6 border-t border-white/10">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 transition-all"
                    >
                      Previous
                    </button>
                  )}
                  {step < 2 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step + 1)}
                      className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all ml-auto"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isLoading || !isConnected}
                      className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Creating Campaign...' : 'Launch Campaign 🚀'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
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

