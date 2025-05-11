
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ProjectImageFieldProps {
  value: File | null;
  onChange: (file: File | null) => void;
}

export const ProjectImageField = ({ value, onChange }: ProjectImageFieldProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  // Maximum file size in bytes (5MB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  // Allowed MIME types
  const ALLOWED_MIME_TYPES = [
    'image/jpeg', 
    'image/png', 
    'image/webp', 
    'image/gif'
  ];

  useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Enhanced validation with better error messages
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a valid image file (JPEG, PNG, WebP, or GIF)",
          variant: "destructive",
        });
        e.target.value = '';
        return;
      }
      
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File Too Large",
          description: `Image size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
          variant: "destructive",
        });
        e.target.value = '';
        return;
      }

      // Check for potential XSS in the filename - just an extra precaution
      const dangerousPatterns = /<|>|script|javascript|onerror|onload/i;
      if (dangerousPatterns.test(file.name)) {
        toast({
          title: "Security Warning",
          description: "The file name contains potentially unsafe characters",
          variant: "destructive",
        });
        e.target.value = '';
        return;
      }
    }
    onChange(file);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="project-image" className="block text-sm font-medium">
        Project Cover Image <span className="text-red-500">*</span>
      </Label>
      <Input
        id="project-image"
        type="file"
        accept="image/jpeg, image/png, image/webp, image/gif"
        onChange={handleChange}
        className="bg-card border-gray-800 focus:border-primary"
        required
        aria-describedby="image-requirements"
      />
      <p id="image-requirements" className="text-xs text-gray-500">
        Accepted formats: JPEG, PNG, WebP, GIF. Max size: 5MB.
      </p>
      {previewUrl && (
        <div className="mt-2 relative w-full h-48 rounded-lg overflow-hidden">
          <img
            src={previewUrl}
            alt="Project cover preview"
            className="object-cover w-full h-full"
          />
        </div>
      )}
    </div>
  );
};
