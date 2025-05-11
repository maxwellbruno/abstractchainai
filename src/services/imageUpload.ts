
import { supabase } from "@/integrations/supabase/client";
import { handleApiError } from "./api";
import { toast } from "sonner";

// Maximum file size in bytes (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  'image/jpeg', 
  'image/png', 
  'image/webp', 
  'image/gif'
];

// List of known magic bytes for image validation
const MAGIC_BYTES = {
  'image/jpeg': [
    [0xFF, 0xD8, 0xFF],
  ],
  'image/png': [
    [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
  ],
  'image/webp': [
    [0x52, 0x49, 0x46, 0x46],
  ],
  'image/gif': [
    [0x47, 0x49, 0x46, 0x38, 0x37, 0x61],
    [0x47, 0x49, 0x46, 0x38, 0x39, 0x61],
  ],
};

/**
 * Validates file contents against known file signatures
 */
const validateFileSignature = async (file: File): Promise<boolean> => {
  try {
    // Read the first few bytes of the file
    const firstBytes = await readFileHeader(file, 8);
    
    // Get the expected signatures for the claimed MIME type
    const expectedSignatures = MAGIC_BYTES[file.type as keyof typeof MAGIC_BYTES];
    if (!expectedSignatures) return false;
    
    // Check if the file header matches any of the expected signatures
    return expectedSignatures.some(signature => 
      signature.every((byte, i) => i >= firstBytes.length || byte === firstBytes[i])
    );
  } catch (error) {
    console.error("File signature validation error:", error);
    return false;
  }
};

/**
 * Reads the first n bytes of a file
 */
const readFileHeader = async (file: File, bytesToRead: number): Promise<number[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (!e.target?.result) {
          reject(new Error("Failed to read file"));
          return;
        }
        
        const buffer = e.target.result as ArrayBuffer;
        const bytes = Array.from(new Uint8Array(buffer).slice(0, bytesToRead));
        resolve(bytes);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (e) => reject(e);
    reader.readAsArrayBuffer(file.slice(0, bytesToRead));
  });
};

/**
 * Sanitizes a filename to prevent path traversal attacks
 */
const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII
    .replace(/[\/\\]/g, '') // Remove path separators
    .replace(/[.]{2,}/g, '.') // Replace multiple dots with a single dot
    .replace(/[^a-zA-Z0-9._-]/g, '_'); // Replace other special chars
};

/**
 * Enhanced secure file upload with content type verification
 */
export const uploadProjectImage = async (image: File): Promise<string> => {
  try {
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

    // Advanced file content validation
    const isValidSignature = await validateFileSignature(image);
    if (!isValidSignature) {
      throw new Error('File content does not match the declared image type');
    }

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Authentication required to upload images");
    }

    // Sanitize the file name
    const sanitizedFileName = sanitizeFileName(image.name);
    
    const fileExt = sanitizedFileName.split('.').pop();
    const timestamp = Date.now();
    const randomId = crypto.randomUUID();
    const filePath = `${randomId}-${timestamp}.${fileExt}`;

    // Upload the file to Supabase Storage with enhanced security
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

    // Log successful upload (for audit trail)
    console.info('Image uploaded successfully', {
      path: filePath,
      userId: user?.id,
      timestamp: new Date().toISOString()
    });

    return publicUrl;
  } catch (error) {
    const apiError = handleApiError(error);
    toast.error(apiError.message);
    throw error;
  }
};
