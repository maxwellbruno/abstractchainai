import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const uploadProjectImage = async (image: File): Promise<string> => {
  if (!image) {
    throw new Error('No image provided');
  }

  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    throw new Error('User must be authenticated to upload images');
  }

  // Sanitize the file name to remove non-ASCII characters
  const sanitizedFileName = image.name.replace(/[^\x00-\x7F]/g, '');
  const fileExt = sanitizedFileName.split('.').pop();
  const timestamp = Date.now();
  const filePath = `${crypto.randomUUID()}-${timestamp}.${fileExt}`;

  // Upload the file to Supabase Storage
  const { error: uploadError, data } = await supabase.storage
    .from('project-covers')
    .upload(filePath, image, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw new Error('Failed to upload image: ' + uploadError.message);
  }

  // Get the public URL for the uploaded file
  const { data: { publicUrl } } = supabase.storage
    .from('project-covers')
    .getPublicUrl(filePath);

  if (!publicUrl) {
    throw new Error('Failed to get public URL for uploaded image');
  }

  return publicUrl;
};