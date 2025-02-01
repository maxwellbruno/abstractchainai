import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PROJECT_CATEGORIES, type ProjectCategory } from "@/lib/constants";

interface FormData {
  name: string;
  description: string;
  website: string;
  features: string;
  category: ProjectCategory;
}

interface ProjectFormHandlerProps {
  children: (props: {
    formData: FormData;
    selectedImage: File | null;
    isSubmitting: boolean;
    updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
    setSelectedImage: (file: File | null) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
  }) => React.ReactNode;
}

export const ProjectFormHandler = ({ children }: ProjectFormHandlerProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    website: "",
    features: "",
    category: PROJECT_CATEGORIES[0],
  });

  const updateField = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
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

      const { data: { user } } = await supabase.auth.getUser();

      const { error: insertError } = await supabase
        .from('projects')
        .insert([{ 
          ...formData, 
          image_url,
          user_id: user?.id || null,
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

  return children({
    formData,
    selectedImage,
    isSubmitting,
    updateField,
    setSelectedImage,
    handleSubmit,
  });
};