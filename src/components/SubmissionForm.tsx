import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PROJECT_CATEGORIES, type ProjectCategory } from "@/lib/constants";
import { ProjectNameField } from "./form-fields/ProjectNameField";
import { ProjectDescriptionField } from "./form-fields/ProjectDescriptionField";
import { ProjectWebsiteField } from "./form-fields/ProjectWebsiteField";
import { ProjectFeaturesField } from "./form-fields/ProjectFeaturesField";
import { ProjectCategoryField } from "./form-fields/ProjectCategoryField";
import { ProjectImageField } from "./form-fields/ProjectImageField";

export const SubmissionForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    features: "",
    category: PROJECT_CATEGORIES[0] as ProjectCategory,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to submit a project.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      let image_url = null;

      if (selectedImage) {
        const fileExt = selectedImage.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('project-covers')
          .upload(filePath, selectedImage);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error('Failed to upload image');
        }

        const { data: { publicUrl } } = supabase.storage
          .from('project-covers')
          .getPublicUrl(filePath);

        image_url = publicUrl;
      }

      const { error: insertError } = await supabase
        .from('projects')
        .insert([{ 
          ...formData, 
          image_url,
          user_id: user.id,
          approved: false
        }]);

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      toast({
        title: "Project Submitted!",
        description: "We'll review your submission and get back to you soon.",
      });
      
      // Reset form
      setFormData({ 
        name: "", 
        description: "", 
        website: "", 
        features: "", 
        category: PROJECT_CATEGORIES[0] 
      });
      setSelectedImage(null);
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div id="submission-form" className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Submit Your Project</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <ProjectImageField
            value={selectedImage}
            onChange={setSelectedImage}
          />
          <ProjectNameField
            value={formData.name}
            onChange={(value) => updateField("name", value)}
          />
          <ProjectDescriptionField
            value={formData.description}
            onChange={(value) => updateField("description", value)}
          />
          <ProjectWebsiteField
            value={formData.website}
            onChange={(value) => updateField("website", value)}
          />
          <ProjectFeaturesField
            value={formData.features}
            onChange={(value) => updateField("features", value)}
          />
          <ProjectCategoryField
            value={formData.category}
            onChange={(value) => updateField("category", value)}
          />
          <Button 
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-black font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Project"}
          </Button>
        </form>
      </div>
    </div>
  );
};