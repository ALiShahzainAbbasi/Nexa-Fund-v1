
import { useState } from 'react';
import CampaignCard from './CampaignCard';
import CategoryFilter from './CategoryFilter';
import { Campaign } from "@/data/campaigns";

// Sample data for featured campaigns
const featuredCampaignsData: Campaign[] = [
  {
    id: '1',
    title: 'Eco-Friendly Water Purifier',
    category: 'Environment',
    description: 'An innovative water purification system that removes contaminants without using harmful chemicals.',
    image: 'https://images.unsplash.com/photo-1581089778245-3ce67677f718?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    raised: 25750,
    goal: 50000,
    daysLeft: 15,
    backers: 358
  },
  {
    id: '2',
    title: 'Virtual Reality Education Platform',
    category: 'Education',
    description: 'Making education more accessible and engaging through immersive VR experiences.',
    image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2012&q=80',
    raised: 42000,
    goal: 60000,
    daysLeft: 12,
    backers: 542
  },
  {
    id: '3',
    title: 'Community Art Center',
    category: 'Community',
    description: 'Creating a space where local artists can showcase their work and the community can engage with art.',
    image: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1972&q=80',
    raised: 31200,
    goal: 40000,
    daysLeft: 8,
    backers: 289
  },
  {
    id: '4',
    title: 'Smart Home Energy Monitor',
    category: 'Technology',
    description: 'A device that helps you track and reduce your home energy consumption with real-time monitoring.',
    image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    raised: 28900,
    goal: 35000,
    daysLeft: 21,
    backers: 415
  },
  {
    id: '5',
    title: 'Independent Film Production',
    category: 'Creative',
    description: 'Supporting an independent filmmaker in bringing their unique story to life on the big screen.',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2059&q=80',
    raised: 64000,
    goal: 80000,
    daysLeft: 10,
    backers: 712
  },
  {
    id: '6',
    title: 'Accessible Playground Project',
    category: 'Community',
    description: 'Building an inclusive playground where children of all abilities can play together.',
    image: 'https://images.unsplash.com/photo-1571210862729-78a52d3779a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    raised: 18500,
    goal: 25000,
    daysLeft: 18,
    backers: 203
  }
];

const FeaturedCampaigns = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredCampaigns = selectedCategory === 'all'
    ? featuredCampaignsData
    : featuredCampaignsData.filter(campaign => 
        campaign.category.toLowerCase() === selectedCategory);

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Featured</span> Campaigns
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover innovative projects from creators around the world and help bring their ideas to life.
          </p>
        </div>

        <CategoryFilter onSelectCategory={setSelectedCategory} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCampaigns;
