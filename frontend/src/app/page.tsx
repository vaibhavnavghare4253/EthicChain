import Header from '@/components/layout/Header';
import Hero from '@/components/home/Hero';
import FeaturedCampaigns from '@/components/home/FeaturedCampaigns';
import HowItWorks from '@/components/home/HowItWorks';
import Stats from '@/components/home/Stats';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Stats />
        <FeaturedCampaigns />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}

