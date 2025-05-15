
import { supabase } from "@/integrations/supabase/client";
import { sanitizeHtml } from "@/utils/security";

// Maximum allowed file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed image MIME types
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg', 
  'image/png', 
  'image/webp', 
  'image/gif',
  'image/svg+xml'
];

/**
 * Validates file type and returns its extension
 */
export const validateImageType = (file: File): string => {
  const fileType = file.type.toLowerCase();
  
  // Check if the file type is in our allowed list
  if (!ALLOWED_IMAGE_TYPES.includes(fileType)) {
    throw new Error(`Unsupported file type: ${fileType}. Please use JPEG, PNG, WebP, GIF, or SVG.`);
  }
  
  // Extract extension from mime type
  let extension = fileType.split('/')[1];
  
  // Handle special cases
  if (extension === 'jpeg') extension = 'jpg';
  if (extension === 'svg+xml') extension = 'svg';
  
  return extension;
};

/**
 * Sanitize a filename to prevent path traversal and other attacks
 */
export const sanitizeFileName = (fileName: string): string => {
  // Remove any path information
  let safeName = fileName.replace(/^.*[\\\/]/, '');
  
  // Remove any special characters that could be used for attacks
  // Allow only alphanumeric, spaces, hyphens, underscores, and dots
  safeName = safeName.replace(/[^\w\s.-]/g, '');
  
  // Limit the length
  if (safeName.length > 100) {
    const extension = safeName.includes('.') 
      ? safeName.substring(safeName.lastIndexOf('.')) 
      : '';
    safeName = safeName.substring(0, 100 - extension.length) + extension;
  }
  
  // Ensure no double dots to prevent sneaky extensions
  safeName = safeName.replace(/\.{2,}/g, '.');
  
  // Fallback if name is somehow empty after sanitization
  if (!safeName || safeName.length === 0) {
    safeName = 'file_' + Date.now();
  }
  
  return sanitizeHtml(safeName);
};

/**
 * Reads a file to check if it's really what it claims to be
 */
export const validateFileContent = async (file: File): Promise<boolean> => {
  // Only perform deep validation for certain file types
  if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
    return true;
  }
  
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const arr = new Uint8Array(e.target!.result as ArrayBuffer);
      
      // Check file signatures (magic numbers)
      if (file.type === 'image/jpeg' && arr[0] === 0xFF && arr[1] === 0xD8 && arr[2] === 0xFF) {
        resolve(true);
      } else if (file.type === 'image/png' && 
                arr[0] === 0x89 && arr[1] === 0x50 && arr[2] === 0x4E && arr[3] === 0x47) {
        resolve(true);
      } else if (file.type === 'image/gif' && 
                arr[0] === 0x47 && arr[1] === 0x49 && arr[2] === 0x46 && arr[3] === 0x38) {
        resolve(true);
      } else {
        resolve(false);
      }
    };
    
    reader.onerror = () => resolve(false);
    
    // Read only the first few bytes
    reader.readAsArrayBuffer(file.slice(0, 4));
  });
};

/**
 * Enhanced secure file upload with content type verification, doesn't require authentication
 */
export const uploadProjectImage = async (image: File): Promise<string> => {
  try {
    // Size validation
    if (image.size > MAX_FILE_SIZE) {
      throw new Error(`File too large: ${(image.size / 1024 / 1024).toFixed(2)}MB. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
    }
    
    // Check file type and get extension
    const fileExt = validateImageType(image);
    
    // Additional security check to prevent harmful uploads
    const isValidContent = await validateFileContent(image);
    if (!isValidContent) {
      throw new Error('File content does not match the declared image type');
    }

    // Sanitize the file name
    const sanitizedFileName = sanitizeFileName(image.name);
    
    // Generate a unique file name with timestamp to prevent collisions
    const timestamp = Date.now();
    const randomId = crypto.randomUUID();
    const filePath = `${randomId}-${timestamp}.${fileExt}`;

    // Upload the file to Supabase Storage with enhanced security, allowing anonymous uploads
    const { error: uploadError, data } = await supabase.storage
      .from('project-covers')
      .upload(filePath, image, {
        cacheControl: '3600',
        contentType: image.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(uploadError.message || 'Failed to upload image');
    }

    if (!data?.path) {
      throw new Error('Upload failed - no path returned');
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('project-covers')
      .getPublicUrl(data.path);

    if (!urlData?.publicUrl) {
      throw new Error('Failed to get public URL for uploaded file');
    }

    // Log successful upload (for audit trail)
    console.info('Image uploaded successfully', {
      path: filePath,
      timestamp: new Date().toISOString()
    });

    return urlData.publicUrl;
  } catch (error: any) {
    console.error('Image upload error:', error);
    throw error;
  }
};
