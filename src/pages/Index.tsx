
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedCampaigns from "@/components/FeaturedCampaigns";
import TrendingCampaigns from "@/components/TrendingCampaigns";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturedCampaigns />
        <TrendingCampaigns />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
