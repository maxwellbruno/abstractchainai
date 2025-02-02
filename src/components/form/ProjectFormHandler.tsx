import { useToast } from "@/components/ui/use-toast";
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
    setIsSubmitting(true);

    try {
      let image_url = null;
      if (selectedImage) {
        try {
          image_url = await uploadProjectImage(selectedImage);
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          toast({
            title: "Error",
            description: "Failed to upload image. Please try again.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }

      const { data: { user } } = await supabase.auth.getUser();

      await submitProject({
        ...formData,
        image_url,
        user_id: user?.id || null,
        approved: false,
      });

      toast({
        title: "Success!",
        description: "Your project has been submitted successfully.",
      });

      resetForm();
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Error",
        description: "Failed to submit project. Please try again.",
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