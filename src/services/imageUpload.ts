import { supabase } from "@/integrations/supabase/client";

export const uploadProjectImage = async (image: File): Promise<string> => {
  // Sanitize the file name to remove non-ASCII characters
  const sanitizedFileName = image.name.replace(/[^\x00-\x7F]/g, '');
  const fileExt = sanitizedFileName.split('.').pop();
  const filePath = `${crypto.randomUUID()}-${Date.now()}.${fileExt}`;

  // Upload the file to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('project-covers')
    .upload(filePath, image, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw new Error('Failed to upload image');
  }

  // Get the public URL for the uploaded file
  const { data: { publicUrl } } = supabase.storage
    .from('project-covers')
    .getPublicUrl(filePath);

  return publicUrl;
};