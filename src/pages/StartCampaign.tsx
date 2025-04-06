import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { categories } from "@/data/campaigns";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Upload } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { createCampaign } from "@/services/campaignService";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { isSupabaseConfigured } from "@/lib/supabase";

const StartCampaign = () => {
  const navigate = useNavigate();
  const { wallet, connect, createCampaign: createCampaignOnChain, generateIPFSHash } = useWallet();
  const [activeStep, setActiveStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    const url = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(url);

    const ipfsHash = generateIPFSHash(file.name);
    
    setFormData(prev => ({
      ...prev,
      ipfsHash
    }));

    if (isSupabaseConfigured()) {
      try {
        setUploadingImage(true);
        
        const fileName = `campaign-${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('campaign-images')
          .upload(fileName, file);
          
        if (error) throw error;
        
        const { data: urlData } = supabase.storage
          .from('campaign-images')
          .getPublicUrl(fileName);
          
        if (urlData) {
          setFormData(prev => ({
            ...prev,
            image: urlData.publicUrl
          }));
        }
        
        toast({
          title: "Image uploaded",
          description: "Your campaign image has been uploaded successfully"
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          title: "Upload failed",
          description: "Failed to upload image. Using local preview only.",
          variant: "destructive"
        });
      } finally {
        setUploadingImage(false);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        image: url
      }));
    }
  };

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
          metadata: { 
            blockchain_id: txHash 
          }
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container max-w-4xl">
          <h1 className="text-3xl font-bold mb-2">Start Your Campaign</h1>
          <p className="text-gray-600 mb-8">Bring your creative project to life</p>
          
          <div className="flex justify-between mb-8">
            <div className="flex items-center">
              <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
                activeStep >= 1 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
              } font-medium`}>1</div>
              <p className={`ml-2 ${activeStep >= 1 ? "text-gray-900" : "text-gray-500"}`}>
                Basics
              </p>
            </div>
            <div className="flex-1 mx-4 flex items-center">
              <div className="h-0.5 w-full bg-gray-200">
                <div className={`h-0.5 bg-green-500`} style={{width: `${activeStep > 1 ? 100 : 0}%`}}></div>
              </div>
            </div>
            <div className="flex items-center">
              <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
                activeStep >= 2 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
              } font-medium`}>2</div>
              <p className={`ml-2 ${activeStep >= 2 ? "text-gray-900" : "text-gray-500"}`}>
                Story
              </p>
            </div>
            <div className="flex-1 mx-4 flex items-center">
              <div className="h-0.5 w-full bg-gray-200">
                <div className={`h-0.5 bg-green-500`} style={{width: `${activeStep > 2 ? 100 : 0}%`}}></div>
              </div>
            </div>
            <div className="flex items-center">
              <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
                activeStep >= 3 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
              } font-medium`}>3</div>
              <p className={`ml-2 ${activeStep >= 3 ? "text-gray-900" : "text-gray-500"}`}>
                Funding
              </p>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-6">
              {activeStep === 1 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Campaign Basics</h2>
                  <p className="text-gray-600 mb-6">Let's start with the fundamental details of your campaign.</p>
                  
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Campaign Title*
                      </label>
                      <Input 
                        id="title" 
                        placeholder="What's your campaign called?" 
                        value={formData.title}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        Category*
                      </label>
                      <select 
                        id="category"
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        value={formData.category}
                        onChange={handleInputChange}
                      >
                        <option value="" disabled>Select a category</option>
                        {categories.filter(c => c !== "All Categories").map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Short Description*
                      </label>
                      <Textarea 
                        id="description" 
                        placeholder="Summarize your campaign in a short sentence"
                        className="resize-none"
                        rows={2}
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Keep it clear, specific and compelling. 100 characters or less.
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                        Campaign Image*
                      </label>
                      <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center ${previewUrl ? 'border-green-300 bg-green-50' : ''}`}>
                        {previewUrl ? (
                          <div className="space-y-4">
                            <img src={previewUrl} alt="Preview" className="mx-auto max-h-48 rounded-md" />
                            <p className="text-green-600">Image selected{formData.ipfsHash ? ` (IPFS Hash: ${formData.ipfsHash.substring(0, 20)}...)` : ''}</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => document.getElementById('image-upload')?.click()}
                              className="bg-white"
                              disabled={uploadingImage}
                            >
                              {uploadingImage ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...
                                </>
                              ) : (
                                <>
                                  Choose Different Image
                                </>
                              )}
                            </Button>
                          </div>
                        ) : (
                          <>
                            <p className="text-gray-600 mb-2">Upload a campaign image</p>
                            <p className="text-xs text-gray-500 mb-4">16:9 ratio recommended. Max file size: 5MB</p>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('image-upload')?.click()}
                              className="bg-white"
                            >
                              <Upload className="h-4 w-4 mr-2" /> Upload Image
                            </Button>
                          </>
                        )}
                        <input 
                          type="file" 
                          id="image-upload" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleImageChange}
                          disabled={uploadingImage}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeStep === 2 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Campaign Story</h2>
                  <p className="text-gray-600 mb-6">Tell potential backers about your project and why it matters.</p>
                  
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="story" className="block text-sm font-medium text-gray-700 mb-1">
                        Campaign Story*
                      </label>
                      <Textarea 
                        id="story"
                        placeholder="Share your story..."
                        rows={8}
                        value={formData.story}
                        onChange={handleInputChange}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Explain what you're raising funds for and why people should contribute.
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Campaign Media (Optional)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <p className="text-gray-600 mb-2">Upload videos or additional images</p>
                        <p className="text-xs text-gray-500 mb-4">Supported formats: JPG, PNG, GIF, MP4</p>
                        <Button variant="outline" size="sm">Add Media</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeStep === 3 && (
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
              )}
              
              <div className="flex justify-between mt-8">
                {activeStep > 1 ? (
                  <Button variant="outline" onClick={prevStep} disabled={isLoading}>
                    Back
                  </Button>
                ) : (
                  <div></div>
                )}
                
                {activeStep < 3 ? (
                  <Button onClick={nextStep} className="bg-green-500 hover:bg-green-600">
                    Continue
                  </Button>
                ) : (
                  <Button 
                    className="bg-green-500 hover:bg-green-600"
                    onClick={handleCreateCampaign}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Campaign...
                      </>
                    ) : (
                      "Submit Campaign"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StartCampaign;
