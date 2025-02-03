import { useState } from "react";
import { ProjectFormData } from "@/types/project";
import { PROJECT_CATEGORIES } from "@/lib/constants";

export const useProjectForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    website: "",
    features: "",
    category: PROJECT_CATEGORIES[0],
  });

  const updateField = <K extends keyof ProjectFormData>(
    field: K,
    value: ProjectFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      website: "",
      features: "",
      category: PROJECT_CATEGORIES[0],
    });
    setSelectedImage(null);
    setIsSubmitting(false);
  };

  return {
    formData,
    selectedImage,
    isSubmitting,
    setIsSubmitting,
    setSelectedImage,
    updateField,
    resetForm,
  };
};