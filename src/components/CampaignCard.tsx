
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Campaign } from "@/data/campaigns";

export interface CampaignProps {
  id: string;
  title: string;
  category: string;
  description: string;
  imageSrc: string;
  raisedAmount: number;
  goalAmount: number;
  daysLeft: number;
  backers: number;
}

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard = ({ campaign }: CampaignCardProps) => {
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
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link to={`/campaign/${campaign.id}`}>
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={campaign.image} 
            alt={campaign.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
          <div className="absolute top-2 right-2 bg-white py-1 px-2 rounded-full text-xs font-medium">
            {campaign.category}
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold line-clamp-2 mb-2">{campaign.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign.description}</p>
          
          <div className="mb-2">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
              <div 
                className="bg-green-500 rounded-full h-2" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-green-600">{formatCurrency(campaign.raised)}</span>
              <span className="text-gray-500">{progress}% of {formatCurrency(campaign.goal)}</span>
            </div>
          </div>
        </CardContent>
      </Link>
      
      <CardFooter className="p-4 pt-0 flex justify-between text-sm text-gray-500">
        <span>{campaign.backers} backers</span>
        <span>{campaign.daysLeft} days left</span>
      </CardFooter>
    </Card>
  );
};

export default CampaignCard;
