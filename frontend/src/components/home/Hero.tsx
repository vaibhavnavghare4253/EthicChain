'use client';

import Link from 'next/link';
import { useAccount } from 'wagmi';

export default function Hero() {
  const { isConnected } = useAccount();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Transparent Giving,
                <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent"> Powered by Blockchain</span>
              </h1>
              <p className="text-xl text-gray-600">
                Track every donation on-chain. Support verified charities. Make a real impact with complete transparency.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/campaigns" 
                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition text-center"
              >
                Explore Campaigns
              </Link>
              <Link 
                href={isConnected ? "/create" : "#"} 
                className="px-8 py-4 bg-white text-primary-600 border-2 border-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition text-center"
              >
                Start a Campaign
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold text-gray-900">$2.5M+</p>
                <p className="text-sm text-gray-600">Donated</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">1,200+</p>
                <p className="text-sm text-gray-600">Campaigns</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">100%</p>
                <p className="text-sm text-gray-600">Transparent</p>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition duration-500">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Clean Water for Africa</p>
                    <p className="text-lg font-bold text-gray-900">$45,230 / $50,000</p>
                  </div>
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    💧
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" style={{width: '90%'}}></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">Donors</p>
                    <p className="text-xl font-bold">1,234</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">Days Left</p>
                    <p className="text-xl font-bold">12</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
            <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

