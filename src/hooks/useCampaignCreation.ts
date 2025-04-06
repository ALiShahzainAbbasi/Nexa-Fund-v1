
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useWallet } from "@/contexts/WalletContext";
import { createCampaign } from "@/services/campaignService";
import { isSupabaseConfigured } from "@/lib/supabase";

interface CampaignFormData {
  title: string;
  category: string;
  description: string;
  story: string;
  goal: number;
  startDate: string;
  endDate: string;
  image: string;
  ipfsHash: string;
}

export const useCampaignCreation = () => {
  const navigate = useNavigate();
  const { wallet, connect, createCampaign: createCampaignOnChain } = useWallet();
  const [activeStep, setActiveStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<CampaignFormData>({
    title: "",
    category: "",
    description: "",
    story: "",
    goal: 0,
    startDate: "",
    endDate: "",
    image: "",
    ipfsHash: ""
  });

  const nextStep = () => {
    if (activeStep === 1) {
      if (!formData.title || !formData.category || !formData.description) {
        toast({
          title: "Incomplete information",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }
    }
    setActiveStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 1));
  };

  const handleCreateCampaign = async () => {
    if (!wallet.connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a campaign",
        variant: "destructive"
      });
      await connect();
      return;
    }

    try {
      setIsLoading(true);
      
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const durationInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (durationInDays <= 0) {
        throw new Error("End date must be after start date");
      }

      const { txHash } = await createCampaignOnChain({
        title: formData.title,
        description: formData.description,
        goal: formData.goal,
        duration: durationInDays,
        ipfsHash: formData.ipfsHash
      });
      
      if (isSupabaseConfigured()) {
        await createCampaign({
          title: formData.title,
          description: formData.description,
          story: formData.story,
          goal: formData.goal,
          category: formData.category,
          image: formData.image,
          start_date: formData.startDate,
          end_date: formData.endDate,
          creator_id: wallet.address || "anonymous",
          blockchain_id: txHash
        });
      }
      
      toast({
        title: "Campaign created successfully",
        description: `Your campaign "${formData.title}" has been created!`,
      });
      
      navigate("/browse");
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast({
        title: "Failed to create campaign",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    activeStep,
    isLoading,
    nextStep,
    prevStep,
    handleCreateCampaign
  };
};
