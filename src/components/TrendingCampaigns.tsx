import CampaignCard from './CampaignCard';
import { Campaign } from "@/data/campaigns";

// Sample data for trending campaigns
const trendingCampaignsData: Campaign[] = [
  {
    id: '7',
    title: 'Sustainable Fashion Line',
    category: 'Creative',
    description: 'Ethically made clothing using recycled materials and sustainable practices.',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    raised: 38200,
    goal: 45000,
    daysLeft: 7,
    backers: 476,
    creator: '0xA1111E5B1C9D168f815C7856996B9DFA9327b773',
    story: 'Our sustainable fashion line transforms recycled and eco-friendly materials into stylish, high-quality clothing that's good for both people and the planet. With transparent manufacturing and fair labor practices, we're redefining ethical fashion.'
  },
  {
    id: '8',
    title: 'AI-Powered Recycling Robot',
    category: 'Technology',
    description: 'A smart recycling assistant that automatically sorts waste using computer vision technology.',
    image: 'https://images.unsplash.com/photo-1611281385571-d65f3df03008?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    raised: 156000,
    goal: 200000,
    daysLeft: 23,
    backers: 1892,
    creator: '0xA1111E5B1C9D168f815C7856996B9DFA9327b773',
    story: 'Our AI recycling robot uses advanced computer vision to automatically sort and process recyclables, increasing efficiency and reducing contamination in the recycling stream. This technology has the potential to revolutionize waste management globally.'
  },
  {
    id: '9',
    title: 'Mobile Library for Rural Areas',
    category: 'Education',
    description: 'Bringing books and educational resources to underserved communities in rural regions.',
    image: 'https://images.unsplash.com/photo-1533327325824-76bc4e62d560?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    raised: 12800,
    goal: 15000,
    daysLeft: 5,
    backers: 234,
    creator: '0xA1111E5B1C9D168f815C7856996B9DFA9327b773',
    story: 'Our mobile library program brings books, digital resources, and educational workshops to rural communities that lack access to traditional libraries. By fostering literacy and a love of learning, we aim to empower these communities through knowledge and stories.'
  }
];

const TrendingCampaigns = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Trending</span> Now
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            These campaigns are gaining momentum fast. Don't miss your chance to be part of something big!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trendingCampaignsData.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingCampaigns;
