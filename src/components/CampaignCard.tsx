
import { CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const CampaignCard = ({
  title,
  category,
  description,
  imageSrc,
  raisedAmount,
  goalAmount,
  daysLeft,
  backers
}: CampaignProps) => {
  const progressPercentage = Math.min(Math.round((raisedAmount / goalAmount) * 100), 100);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
        <div className="absolute top-2 left-2">
          <span className="bg-purple-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            {category}
          </span>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">{title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
        
        <div className="pt-2">
          <div className="flex justify-between items-center mb-1 text-sm">
            <span className="font-medium">${raisedAmount.toLocaleString()}</span>
            <span className="text-gray-500">${goalAmount.toLocaleString()} Goal</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
            <span>{progressPercentage}% Funded</span>
            <span>{backers} Backers</span>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 pt-1">
          <CalendarClock size={16} className="mr-1" />
          <span>{daysLeft} days left</span>
        </div>
        
        <Button className="w-full">
          View Campaign
        </Button>
      </div>
    </div>
  );
};

export default CampaignCard;
