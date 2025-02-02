import { ProjectCategory } from "@/lib/constants";

export interface ProjectFormData {
  name: string;
  description: string;
  website: string;
  features: string;
  category: ProjectCategory;
}

export interface ProjectSubmissionData extends ProjectFormData {
  image_url?: string | null;
  user_id?: string | null;
  approved?: boolean;
}