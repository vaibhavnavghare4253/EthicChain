'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CreateCampaignInput } from '@/types/campaign';

export default function CreateCampaignPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CreateCampaignInput>>({
    title: '',
    description: '',
    targetAmount: '',
    category: 'Healthcare',
    charityName: '',
    beneficiaryAddress: '',
    milestones: [],
  });

  const categories = ['Healthcare', 'Education', 'Environment', 'Emergency', 'Community', 'Animals'];

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const addMilestone = () => {
    const milestones = formData.milestones || [];
    milestones.push({
      title: '',
      description: '',
      targetPercentage: 0,
    });
    setFormData({ ...formData, milestones });
  };

  const updateMilestone = (index: number, field: string, value: any) => {
    const milestones = [...(formData.milestones || [])];
    milestones[index] = { ...milestones[index], [field]: value };
    setFormData({ ...formData, milestones });
  };

  const removeMilestone = (index: number) => {
    const milestones = formData.milestones?.filter((_, i) => i !== index);
    setFormData({ ...formData, milestones });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Submitting campaign:', formData);
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
              {[1, 2, 3].map((s) => (
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
                        {s === 1 ? 'Basic Info' : s === 2 ? 'Details' : 'Milestones'}
                      </p>
                    </div>
                  </div>
                  {s < 3 && (
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

                {/* Step 2: Details */}
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

                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Campaign Image
                      </label>
                      <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-purple-500 transition-all cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
                            <svg
                              className="w-8 h-8 text-purple-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <p className="text-white mb-1">Click to upload image</p>
                          <p className="text-gray-400 text-sm">PNG, JPG up to 10MB</p>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Milestones */}
                {step === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-white mb-2">Campaign Milestones</h3>
                      <p className="text-gray-400">
                        Set transparent goals to show donors how funds will be used
                      </p>
                    </div>

                    {formData.milestones?.map((milestone, index) => (
                      <div
                        key={index}
                        className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-white font-semibold">Milestone {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeMilestone(index)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            Remove
                          </button>
                        </div>

                        <input
                          type="text"
                          value={milestone.title}
                          onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                          placeholder="Milestone title"
                        />

                        <textarea
                          value={milestone.description}
                          onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                          rows={3}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                          placeholder="Milestone description"
                        />

                        <div>
                          <label className="block text-white text-sm mb-2">
                            Target Percentage of Goal
                          </label>
                          <input
                            type="number"
                            value={milestone.targetPercentage}
                            onChange={(e) =>
                              updateMilestone(index, 'targetPercentage', Number(e.target.value))
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                            placeholder="25"
                            min="0"
                            max="100"
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addMilestone}
                      className="w-full py-4 border-2 border-dashed border-white/20 rounded-xl text-purple-400 hover:border-purple-500 hover:bg-white/5 transition-all font-semibold"
                    >
                      + Add Milestone
                    </button>
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
                  {step < 3 ? (
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
                      className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all ml-auto"
                    >
                      Launch Campaign 🚀
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

