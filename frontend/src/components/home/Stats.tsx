export default function Stats() {
  const stats = [
    {
      icon: '🌍',
      value: '45+',
      label: 'Countries Reached',
      description: 'Global impact across continents'
    },
    {
      icon: '⚡',
      value: '< $0.01',
      label: 'Transaction Fee',
      description: 'Ultra-low blockchain fees'
    },
    {
      icon: '🔒',
      value: '100%',
      label: 'Transparent',
      description: 'Every transaction on-chain'
    },
    {
      icon: '❤️',
      value: '25K+',
      label: 'Donors',
      description: 'Growing community'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center p-6 rounded-xl hover:shadow-lg transition duration-300 border border-gray-100"
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
              <p className="text-lg font-semibold text-gray-700 mb-1">{stat.label}</p>
              <p className="text-sm text-gray-500">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

