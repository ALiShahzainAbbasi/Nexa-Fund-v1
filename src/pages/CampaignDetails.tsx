
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Users, ArrowLeft } from "lucide-react";
import { fetchCampaignById } from "@/services/campaignService";
import { fetchUserById } from "@/services/userService";
import { Skeleton } from "@/components/ui/skeleton";

const CampaignDetails = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: campaign, isLoading: campaignLoading, error: campaignError } = useQuery({
    queryKey: ['campaign', id],
    queryFn: () => id ? fetchCampaignById(id) : Promise.reject('No campaign ID provided'),
    enabled: !!id
  });

  const { data: creator, isLoading: creatorLoading } = useQuery({
    queryKey: ['user', campaign?.creator],
    queryFn: () => campaign?.creator ? fetchUserById(campaign.creator) : Promise.reject('No creator ID'),
    enabled: !!campaign?.creator
  });

  if (campaignLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <div className="bg-gray-50 py-4">
            <div className="container">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-10 w-2/3 mb-2" />
              <Skeleton className="h-5 w-1/2 mb-4" />
            </div>
          </div>
          <div className="container py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="h-96 w-full rounded-lg mb-4" />
                <Skeleton className="h-20 w-full rounded-lg mb-8" />
                <Skeleton className="h-6 w-48 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-2" />
              </div>
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="p-6">
                    <Skeleton className="h-2 w-full mb-2" />
                    <Skeleton className="h-8 w-1/3 mb-1" />
                    <Skeleton className="h-5 w-1/2 mb-4" />
                    <div className="flex justify-between mb-6">
                      <Skeleton className="h-16 w-24" />
                      <Skeleton className="h-16 w-24" />
                    </div>
                    <Skeleton className="h-10 w-full mb-3" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (campaignError || !campaign) {
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
                  <p className="font-medium mb-1">
                    By {creatorLoading ? <Skeleton className="h-4 w-24 inline-block" /> : creator?.name || campaign.creator}
                  </p>
                  <p className="text-gray-600 text-sm">{campaign.category}</p>
                </div>
              </div>

              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold mb-4">About this project</h2>
                <p className="whitespace-pre-line">{campaign.story}</p>
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
