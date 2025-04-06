
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { campaigns } from "@/data/campaigns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Users, ArrowLeft } from "lucide-react";

const CampaignDetails = () => {
  const { id } = useParams<{ id: string }>();
  const campaign = campaigns.find((c) => c.id === id);

  if (!campaign) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Campaign not found</h1>
          <p className="mb-8">The campaign you're looking for doesn't exist or has been removed.</p>
          <Link to="/browse">
            <Button>Browse Campaigns</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate progress percentage
  const progress = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-gray-50 py-4">
          <div className="container">
            <Link to="/browse" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
              <ArrowLeft size={16} className="mr-1" />
              Back to campaigns
            </Link>
            <h1 className="text-3xl font-bold mb-2">{campaign.title}</h1>
            <p className="text-gray-600 mb-4">{campaign.description}</p>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-8">
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-full h-auto rounded-lg mb-4"
                />
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium mb-1">By {campaign.creator}</p>
                  <p className="text-gray-600 text-sm">{campaign.category}</p>
                </div>
              </div>

              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold mb-4">About this project</h2>
                <p className="mb-6">{campaign.story}</p>
                <p className="mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                      <div
                        className="bg-green-500 rounded-full h-2.5"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="font-bold text-2xl text-green-600 mb-1">
                      {formatCurrency(campaign.raised)}
                    </p>
                    <p className="text-gray-500 mb-4">
                      raised of {formatCurrency(campaign.goal)} goal
                    </p>

                    <div className="flex justify-between mb-6">
                      <div className="flex items-center">
                        <Users size={18} className="text-gray-500 mr-2" />
                        <div>
                          <p className="font-medium">{campaign.backers}</p>
                          <p className="text-gray-500 text-sm">Backers</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <CalendarDays size={18} className="text-gray-500 mr-2" />
                        <div>
                          <p className="font-medium">{campaign.daysLeft}</p>
                          <p className="text-gray-500 text-sm">Days left</p>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full mb-3 bg-green-500 hover:bg-green-600">
                      Back this project
                    </Button>
                    <Button variant="outline" className="w-full">
                      Share this project
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CampaignDetails;
