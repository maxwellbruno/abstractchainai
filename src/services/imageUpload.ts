
import { supabase } from "@/integrations/supabase/client";

// Maximum file size in bytes (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  'image/jpeg', 
  'image/png', 
  'image/webp', 
  'image/gif'
];

export const uploadProjectImage = async (image: File): Promise<string> => {
  if (!image) {
    throw new Error('No image provided');
  }

  // Validate file size
  if (image.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds the 5MB limit');
  }

  // Validate file type using actual MIME type
  if (!ALLOWED_MIME_TYPES.includes(image.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, WebP and GIF images are allowed');
  }

  // Sanitize the file name to remove non-ASCII characters and potential path traversal
  const sanitizedFileName = image.name
    .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII
    .replace(/[\/\\]/g, '') // Remove path separators
    .replace(/[.]{2,}/g, '.'); // Replace multiple dots with a single dot
    
  const fileExt = sanitizedFileName.split('.').pop();
  const timestamp = Date.now();
  const randomId = crypto.randomUUID();
  const filePath = `${randomId}-${timestamp}.${fileExt}`;

  // Upload the file to Supabase Storage
  const { error: uploadError, data } = await supabase.storage
    .from('project-covers')
    .upload(filePath, image, {
      cacheControl: '3600',
      upsert: false,
      contentType: image.type // Explicitly set the content type
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
