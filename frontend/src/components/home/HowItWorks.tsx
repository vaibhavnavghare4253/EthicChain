export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Connect Wallet',
      description: 'Connect your Web3 wallet (MetaMask, Coinbase Wallet, etc.) in seconds',
      icon: '🔗'
    },
    {
      number: '02',
      title: 'Browse Campaigns',
      description: 'Explore verified charity campaigns with transparent funding goals',
      icon: '🔍'
    },
    {
      number: '03',
      title: 'Donate Crypto',
      description: 'Donate ETH, USDC, or other tokens with ultra-low fees',
      icon: '💸'
    },
    {
      number: '04',
      title: 'Track Impact',
      description: 'Watch your donation at work with real-time on-chain tracking',
      icon: '📊'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Making a difference is easier than ever with blockchain transparency
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary-300 to-accent-300 -z-10"></div>
              )}
              
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition duration-300 border border-gray-100">
                <div className="text-5xl mb-4">{step.icon}</div>
                <div className="text-sm font-bold text-primary-600 mb-2">STEP {step.number}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a 
            href="/how-it-works" 
            className="inline-block px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}

