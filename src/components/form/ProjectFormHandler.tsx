import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useProjectForm } from "@/hooks/useProjectForm";
import { uploadProjectImage } from "@/services/imageUpload";
import { submitProject } from "@/services/projectSubmission";
import { ProjectFormData } from "@/types/project";

interface ProjectFormHandlerProps {
  children: (props: {
    formData: ProjectFormData;
    selectedImage: File | null;
    isSubmitting: boolean;
    updateField: <K extends keyof ProjectFormData>(field: K, value: ProjectFormData[K]) => void;
    setSelectedImage: (file: File | null) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
  }) => React.ReactNode;
}

export const ProjectFormHandler = ({ children }: ProjectFormHandlerProps) => {
  const { toast } = useToast();
  const {
    formData,
    selectedImage,
    isSubmitting,
    setIsSubmitting,
    setSelectedImage,
    updateField,
    resetForm,
  } = useProjectForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!formData.features || formData.features.trim() === '') {
      toast({
        title: "Error",
        description: "Please add at least one tag",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let image_url = null;
      
      if (selectedImage) {
        try {
          image_url = await uploadProjectImage(selectedImage);
        } catch (uploadError: any) {
          console.error('Image upload error:', uploadError);
          toast({
            title: "Image Upload Error",
            description: uploadError.message || "Failed to upload image. Please try again.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }

      const { data: { user } } = await supabase.auth.getUser();

      const projectData = {
        ...formData,
        image_url,
        user_id: user?.id || null,
        approved: false,
      };

      await submitProject(projectData);

      toast({
        title: "Success!",
        description: "Your project has been submitted successfully.",
      });

      resetForm();
    } catch (error: any) {
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