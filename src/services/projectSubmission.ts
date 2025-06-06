
import { supabase } from "@/integrations/supabase/client";
import { ProjectSubmissionData } from "@/types/project";
import { handleApiError, sanitizeData } from "./api";
import { toast } from "sonner";

/**
 * Submits a project without requiring authentication
 */
export const submitProject = async (projectData: ProjectSubmissionData) => {
  try {
    // Sanitize input data to prevent XSS
    const sanitizedData = sanitizeData(projectData);
    
    // Generate a random user ID for unauthenticated users if none provided
    if (!sanitizedData.user_id) {
      sanitizedData.user_id = crypto.randomUUID();
    }
    
    // Attempt project insertion with logging
    const { error: insertError } = await supabase
      .from('projects')
      .insert(sanitizedData as any);

    if (insertError) {
      console.error('Project submission error:', insertError);
      
      // Check for specific error types and provide clear messages
      if (insertError.code === '23505') {
        throw new Error("A project with this name already exists");
      } else if (insertError.code === '23503') {
        throw new Error("Invalid reference in project data");
      } else if (insertError.code?.startsWith('P0001')) {
        throw new Error(insertError.message || "Database validation failed");
      } else if (insertError.code === '42501') {
        throw new Error("Permission denied. You may not have the required access rights");
      }
      
      throw insertError;
    }
    
    // Log successful submission (for audit trail)
    console.info('Project submitted successfully', {
      projectId: sanitizedData.name,
      userId: sanitizedData.user_id,
      timestamp: new Date().toISOString()
    });
    
    return { success: true, projectId: sanitizedData.name };
  } catch (error) {
    const apiError = handleApiError(error);
    toast.error(apiError.message);
    throw error;
  }
};
