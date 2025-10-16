'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FaShieldAlt, FaChartLine, FaUsers, FaRocket, FaHeart, FaGlobe } from 'react-icons/fa';

export default function AboutPage() {
  const values = [
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: 'Transparency',
      description: 'Every transaction recorded on blockchain for complete accountability',
    },
    {
      icon: <FaHeart className="w-8 h-8" />,
      title: 'Trust',
      description: 'Smart contracts ensure funds reach the right beneficiaries',
    },
    {
      icon: <FaUsers className="w-8 h-8" />,
      title: 'Community',
      description: 'Building a global network of compassionate changemakers',
    },
    {
      icon: <FaChartLine className="w-8 h-8" />,
      title: 'Impact',
      description: 'Real-time tracking of how your donation creates change',
    },
    {
      icon: <FaRocket className="w-8 h-8" />,
      title: 'Innovation',
      description: 'Leveraging cutting-edge Web3 technology for good',
    },
    {
      icon: <FaGlobe className="w-8 h-8" />,
      title: 'Global Reach',
      description: 'Connecting donors and causes across borders',
    },
  ];

  const stats = [
    { value: '$2.5M+', label: 'Total Donated' },
    { value: '150+', label: 'Active Campaigns' },
    { value: '10K+', label: 'Donors' },
    { value: '45', label: 'Countries' },
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      bio: 'Blockchain enthusiast with 10+ years in nonprofit sector',
    },
    {
      name: 'Marcus Johnson',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      bio: 'Smart contract developer and Web3 pioneer',
    },
    {
      name: 'Aisha Patel',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
      bio: 'Expert in global charity operations and compliance',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 top-0 left-1/4 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute w-96 h-96 top-20 right-1/4 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400">
                Redefining Charity
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              We're building the future of transparent, trustworthy charitable giving through blockchain technology
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="glass-effect rounded-3xl p-12 border border-white/10 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-6">Our Mission</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed text-center max-w-3xl mx-auto">
                To revolutionize charitable giving by creating a transparent, secure, and efficient platform
                that connects donors directly with causes they care about. Through blockchain technology, we
                ensure every donation is tracked, verified, and delivers maximum impact to those in need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="glass-effect rounded-2xl p-8 border border-white/10 text-center hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-xl text-gray-300">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <div
                key={index}
                className="glass-effect rounded-2xl p-8 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 group hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <div className="text-white">{value.icon}</div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-300">Passionate innovators making a difference</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <div
                key={index}
                className="glass-effect rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/50 transition-all duration-300 group hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-cyan-400 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="glass-effect rounded-3xl p-12 border border-white/10">
              <h2 className="text-4xl font-bold text-white mb-8 text-center">Our Story</h2>
              <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
                <p>
                  Founded in 2024, CharityChain emerged from a simple observation: traditional charity
                  platforms lack transparency, making it difficult for donors to track where their money goes.
                </p>
                <p>
                  Our founders, experienced in both blockchain technology and nonprofit work, envisioned a
                  platform where every donation is immutably recorded on the blockchain, ensuring complete
                  transparency from donor to beneficiary.
                </p>
                <p>
                  Today, we've grown into a global platform connecting thousands of donors with hundreds of
                  verified charitable campaigns. Every transaction is secure, transparent, and trackable,
                  restoring trust in charitable giving.
                </p>
                <p className="text-cyan-400 font-semibold">
                  Join us in revolutionizing how the world gives back.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass-effect rounded-3xl p-12 border border-white/10 bg-gradient-to-br from-blue-900/20 to-cyan-900/20">
              <h2 className="text-4xl font-bold text-white mb-6">Ready to Make a Difference?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of donors supporting transparent charitable causes
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/campaigns"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                >
                  Browse Campaigns
                </a>
                <a
                  href="/create"
                  className="px-8 py-4 bg-white/5 border border-white/20 rounded-xl font-semibold text-white hover:bg-white/10 transition-all"
                >
                  Start a Campaign
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

