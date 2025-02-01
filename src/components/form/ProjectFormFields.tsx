import { ProjectNameField } from "../form-fields/ProjectNameField";
import { ProjectDescriptionField } from "../form-fields/ProjectDescriptionField";
import { ProjectWebsiteField } from "../form-fields/ProjectWebsiteField";
import { ProjectFeaturesField } from "../form-fields/ProjectFeaturesField";
import { ProjectCategoryField } from "../form-fields/ProjectCategoryField";
import { ProjectImageField } from "../form-fields/ProjectImageField";
import { Button } from "@/components/ui/button";
import { type ProjectCategory } from "@/lib/constants";

interface FormDataType {
  name: string;
  description: string;
  website: string;
  features: string;
  category: ProjectCategory;
}

interface ProjectFormFieldsProps {
  formData: FormDataType;
  selectedImage: File | null;
  isSubmitting: boolean;
  updateField: <K extends keyof FormDataType>(field: K, value: FormDataType[K]) => void;
  setSelectedImage: (file: File | null) => void;
}

export const ProjectFormFields = ({
  formData,
  selectedImage,
  isSubmitting,
  updateField,
  setSelectedImage,
}: ProjectFormFieldsProps) => {
  return (
    <>
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
    </>
  );
};