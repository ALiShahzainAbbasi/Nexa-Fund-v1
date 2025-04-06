
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface FundingStepProps {
  formData: {
    goal: number;
    startDate: string;
    endDate: string;
  };
  setFormData: (data: any) => void;
}

const FundingStep = ({ formData, setFormData }: FundingStepProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [id]: value
    }));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Funding Details</h2>
      <p className="text-gray-600 mb-6">Set your funding goal and timeline for the campaign.</p>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
            Funding Goal*
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <Input 
              id="goal" 
              type="number" 
              placeholder="5000" 
              className="pl-8" 
              value={formData.goal || ''}
              onChange={handleInputChange}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Set a realistic goal based on your project's needs.
          </p>
        </div>
        
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
            Campaign Duration*
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-xs text-gray-500 mb-1">
                Start Date
              </label>
              <Input 
                id="startDate" 
                type="date" 
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-xs text-gray-500 mb-1">
                End Date
              </label>
              <Input 
                id="endDate" 
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Most successful campaigns run for 30 days or less.
          </p>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium mb-2">Reward Tiers</h3>
          <p className="text-gray-600 text-sm mb-4">
            Define what backers will receive in exchange for their support.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-medium mb-2">Reward Tier #1</h4>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label htmlFor="tier-name" className="block text-xs font-medium mb-1">
                  Tier Name
                </label>
                <Input id="tier-name" placeholder="Early Bird" />
              </div>
              <div>
                <label htmlFor="tier-amount" className="block text-xs font-medium mb-1">
                  Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <Input id="tier-amount" type="number" placeholder="25" className="pl-8" />
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="tier-description" className="block text-xs font-medium mb-1">
                Description
              </label>
              <Textarea id="tier-description" placeholder="What will backers receive?" rows={2} />
            </div>
          </div>
          
          <Button variant="outline" className="w-full">+ Add Another Reward Tier</Button>
        </div>
      </div>
    </div>
  );
};

export default FundingStep;
