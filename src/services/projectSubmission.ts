import { supabase } from "@/integrations/supabase/client";
import { ProjectSubmissionData } from "@/types/project";

export const submitProject = async (projectData: ProjectSubmissionData) => {
  const { error: insertError } = await supabase
    .from('projects')
    .insert([projectData]);

  if (insertError) {
    console.error('Insert error:', insertError);
    throw insertError;
  }
};