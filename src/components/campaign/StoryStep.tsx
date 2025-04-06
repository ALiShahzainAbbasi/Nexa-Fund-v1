
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface StoryStepProps {
  formData: {
    story: string;
  };
  setFormData: (data: any) => void;
}

const StoryStep = ({ formData, setFormData }: StoryStepProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [id]: value
    }));
  };

  return (
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
  );
};

export default StoryStep;
