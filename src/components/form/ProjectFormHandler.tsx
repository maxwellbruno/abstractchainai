
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useProjectForm } from "@/hooks/useProjectForm";
import { uploadProjectImage } from "@/services/imageUpload";
import { submitProject } from "@/services/projectSubmission";
import { ProjectFormData } from "@/types/project";
import { useState, useEffect } from "react";
import { detectSuspiciousActivity, sanitizeHtml } from "@/utils/security";
import { toast } from "sonner";

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

  // Security enhancement: Check for suspicious activity
  useEffect(() => {
    const checkSecurity = async () => {
      const suspicious = detectSuspiciousActivity();
      if (suspicious) {
        console.warn("Suspicious activity detected");
        toast({
          title: "Security Alert",
          description: "Unusual activity detected. Please refresh the page if you experience issues.",
          variant: "destructive",
        });
      }
    };
    
    checkSecurity();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!formData.name || !formData.description || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Name length validation
    if (formData.name.length < 3 || formData.name.length > 100) {
      toast({
        title: "Invalid Project Name",
        description: "Project name must be between 3 and 100 characters",
        variant: "destructive",
      });
      return;
    }

    // Description length validation
    if (formData.description.length < 10 || formData.description.length > 5000) {
      toast({
        title: "Invalid Description",
        description: "Description must be between 10 and 5000 characters",
        variant: "destructive",
      });
      return;
    }

    if (!selectedImage) {
      toast({
        title: "Error",
        description: "A project cover image is required for submission",
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

    // Website URL validation if provided
    if (formData.website) {
      try {
        const url = new URL(formData.website);
        if (!url.protocol.startsWith('http')) {
          throw new Error("Invalid protocol");
        }
      } catch (e) {
        toast({
          title: "Invalid Website URL",
          description: "Please enter a valid URL (include https://)",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Rate limiting check - would be better implemented on the backend
      const submissionKey = 'last_project_submission';
      const lastSubmission = localStorage.getItem(submissionKey);
      
      if (lastSubmission) {
        const lastSubmitTime = parseInt(lastSubmission, 10);
        const currentTime = Date.now();
        const timeDiff = currentTime - lastSubmitTime;
        
        // Limit to one submission every 60 seconds
        if (timeDiff < 60000) {
          toast({
            title: "Rate Limited",
            description: "Please wait before submitting another project",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }
      
      let image_url = null;
      
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

      // Enhanced input sanitization with strict settings for XSS prevention
      const sanitizedData = {
        ...formData,
        name: sanitizeHtml(formData.name),
        description: sanitizeHtml(formData.description),
        website: formData.website ? sanitizeHtml(formData.website) : null,
        features: sanitizeHtml(formData.features),
      };

      // Check if user is authenticated, but don't require it
      let userId = null;
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          userId = data.user.id;
        }
      } catch (error) {
        console.log("User not authenticated, continuing as guest");
      }

      const projectData = {
        ...sanitizedData,
        image_url,
        user_id: userId, // This can be null now that we removed the foreign key constraint
        approved: false,
      };

      // Submit the project
      const result = await submitProject(projectData);
      
      // Record the submission time for rate limiting
      localStorage.setItem(submissionKey, Date.now().toString());

      // Show success message
      toast({
        title: "Success!",
        description: "Your project has been submitted successfully.",
      });

      // Reset the form after successful submission
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
