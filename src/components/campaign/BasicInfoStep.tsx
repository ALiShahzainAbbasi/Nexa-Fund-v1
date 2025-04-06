
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/campaigns";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { isSupabaseConfigured } from "@/lib/supabase";
import { useWallet } from "@/contexts/WalletContext";

interface BasicInfoStepProps {
  formData: {
    title: string;
    category: string;
    description: string;
    image: string;
    ipfsHash: string;
  };
  setFormData: (data: any) => void;
}

const BasicInfoStep = ({ formData, setFormData }: BasicInfoStepProps) => {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { generateIPFSHash } = useWallet();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev: any) => ({
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
    
    setFormData((prev: any) => ({
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
          setFormData((prev: any) => ({
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
      setFormData((prev: any) => ({
        ...prev,
        image: url
      }));
    }
  };

  return (
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
  );
};

export default BasicInfoStep;
