'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  FaWallet,
  FaSearch,
  FaHeart,
  FaChartLine,
  FaShieldAlt,
  FaCheckCircle,
  FaLightbulb,
  FaRocket,
} from 'react-icons/fa';

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<'donors' | 'creators'>('donors');

  const donorSteps = [
    {
      icon: <FaWallet className="w-10 h-10" />,
      title: 'Connect Your Wallet',
      description: 'Link your Web3 wallet using MetaMask, WalletConnect, or other supported providers.',
      details: [
        'Secure connection via industry-standard protocols',
        'No personal information required',
        'Maintain full control of your funds',
      ],
    },
    {
      icon: <FaSearch className="w-10 h-10" />,
      title: 'Browse Campaigns',
      description: 'Explore verified campaigns across various categories and causes you care about.',
      details: [
        'All campaigns verified on blockchain',
        'Filter by category, location, or impact',
        'View detailed campaign information',
      ],
    },
    {
      icon: <FaHeart className="w-10 h-10" />,
      title: 'Make Your Donation',
      description: 'Donate any amount in cryptocurrency with instant blockchain confirmation.',
      details: [
        'Transparent transaction fees',
        'Instant confirmation on-chain',
        'Tax receipt automatically generated',
      ],
    },
    {
      icon: <FaChartLine className="w-10 h-10" />,
      title: 'Track Your Impact',
      description: 'Follow your donation in real-time and see the direct impact of your contribution.',
      details: [
        'Real-time fund allocation tracking',
        'Milestone completion notifications',
        'Direct updates from beneficiaries',
      ],
    },
  ];

  const creatorSteps = [
    {
      icon: <FaLightbulb className="w-10 h-10" />,
      title: 'Plan Your Campaign',
      description: 'Define your goals, target amount, and create transparent milestones for donors.',
      details: [
        'Set clear, achievable goals',
        'Define project milestones',
        'Prepare supporting documentation',
      ],
    },
    {
      icon: <FaRocket className="w-10 h-10" />,
      title: 'Launch on Blockchain',
      description: 'Deploy your campaign as a smart contract with built-in transparency and security.',
      details: [
        'Automatic smart contract creation',
        'Immutable campaign terms',
        'Built-in fund security',
      ],
    },
    {
      icon: <FaShieldAlt className="w-10 h-10" />,
      title: 'Get Verified',
      description: 'Our team verifies your campaign to ensure legitimacy and build donor trust.',
      details: [
        'Quick verification process',
        'Identity and cause validation',
        'Increased donor confidence',
      ],
    },
    {
      icon: <FaCheckCircle className="w-10 h-10" />,
      title: 'Receive & Report',
      description: 'Receive funds as milestones are met and provide transparent progress updates.',
      details: [
        'Milestone-based fund release',
        'Easy progress reporting',
        'Direct donor communication',
      ],
    },
  ];

  const features = [
    {
      title: 'Blockchain Transparency',
      description: 'Every transaction is recorded on the blockchain, providing immutable proof of all donations.',
      icon: '🔗',
    },
    {
      title: 'Smart Contract Security',
      description: 'Funds are secured in audited smart contracts, released only when milestones are met.',
      icon: '🛡️',
    },
    {
      title: 'Zero Middlemen',
      description: 'Direct donor-to-beneficiary transfers minimize fees and maximize impact.',
      icon: '⚡',
    },
    {
      title: 'Global Access',
      description: 'Anyone, anywhere can donate or create campaigns without geographic restrictions.',
      icon: '🌍',
    },
    {
      title: 'Real-time Tracking',
      description: 'Monitor fund allocation and campaign progress in real-time on the blockchain.',
      icon: '📊',
    },
    {
      title: 'Automated Reporting',
      description: 'Smart contracts automatically generate reports and receipts for all transactions.',
      icon: '📄',
    },
  ];

  const faqs = [
    {
      question: 'What cryptocurrencies can I use to donate?',
      answer:
        'We currently accept ETH (Ethereum) and major ERC-20 tokens. We\'re constantly adding support for more currencies.',
    },
    {
      question: 'How do I know my donation reached the intended beneficiary?',
      answer:
        'Every donation is recorded on the blockchain with a unique transaction hash. You can track your donation from your wallet to the beneficiary address in real-time.',
    },
    {
      question: 'What fees does CharityChain charge?',
      answer:
        'We charge a minimal 2% platform fee to cover operational costs. Additionally, standard blockchain gas fees apply. All fees are clearly displayed before you donate.',
    },
    {
      question: 'Can I get a tax receipt for my donation?',
      answer:
        'Yes! For verified charitable organizations, we automatically generate tax receipts. The blockchain record serves as additional proof of your contribution.',
    },
    {
      question: 'How are campaigns verified?',
      answer:
        'Our team conducts thorough verification including identity checks, organization validation, and cause legitimacy. Verified campaigns display a blue checkmark.',
    },
    {
      question: 'What if a campaign doesn\'t reach its goal?',
      answer:
        'Campaign creators can choose between "All-or-Nothing" and "Keep What You Raise" models. This is clearly indicated on each campaign page.',
    },
  ];

  const steps = activeTab === 'donors' ? donorSteps : creatorSteps;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 top-0 left-1/3 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute w-96 h-96 top-20 right-1/3 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
                How It Works
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Transparent, secure, and simple charitable giving powered by blockchain
            </p>
          </div>
        </div>
      </section>

      {/* Tab Selector */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto glass-effect rounded-2xl p-2 border border-white/10">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveTab('donors')}
                className={`py-4 rounded-xl font-semibold transition-all ${
                  activeTab === 'donors'
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                For Donors
              </button>
              <button
                onClick={() => setActiveTab('creators')}
                className={`py-4 rounded-xl font-semibold transition-all ${
                  activeTab === 'creators'
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                For Campaign Creators
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="glass-effect rounded-2xl p-8 border border-white/10 hover:border-violet-500/50 transition-all duration-300 group animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                        {step.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-violet-400 font-bold text-2xl">0{index + 1}</span>
                        <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                      </div>
                      <p className="text-gray-300 mb-4 leading-relaxed">{step.description}</p>
                      <ul className="space-y-2">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                            <span className="text-violet-400 mt-1">✓</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why CharityChain is Different
            </h2>
            <p className="text-xl text-gray-300">
              Leveraging blockchain technology for maximum transparency and impact
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-effect rounded-2xl p-8 border border-white/10 hover:border-violet-500/50 transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="glass-effect rounded-3xl p-12 border border-white/10">
              <h2 className="text-4xl font-bold text-white mb-8 text-center">Our Technology</h2>
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl">⚙️</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Ethereum Blockchain</h3>
                  <p className="text-gray-400 text-sm">
                    Secure, decentralized platform for transparent transactions
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl">📜</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Smart Contracts</h3>
                  <p className="text-gray-400 text-sm">
                    Audited code ensuring funds are used as intended
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl">🔐</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">IPFS Storage</h3>
                  <p className="text-gray-400 text-sm">
                    Decentralized storage for campaign documents and proof
                  </p>
                </div>
              </div>
              <p className="text-center text-gray-300 leading-relaxed">
                All our smart contracts are open-source and audited by leading blockchain security firms
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-300">Everything you need to know</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="glass-effect rounded-2xl p-8 border border-white/10 hover:border-violet-500/50 transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <h3 className="text-xl font-bold text-white mb-3">{faq.question}</h3>
                <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass-effect rounded-3xl p-12 border border-white/10 bg-gradient-to-br from-violet-900/20 to-fuchsia-900/20">
              <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Join the future of transparent charitable giving today
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/campaigns"
                  className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-fuchsia-500/50 transition-all"
                >
                  Start Donating
                </a>
                <a
                  href="/create"
                  className="px-8 py-4 bg-white/5 border border-white/20 rounded-xl font-semibold text-white hover:bg-white/10 transition-all"
                >
                  Create Campaign
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

