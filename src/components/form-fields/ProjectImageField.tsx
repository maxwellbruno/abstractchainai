import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef } from "react";

interface ProjectImageFieldProps {
  value: File | null;
  onChange: (file: File | null) => void;
}

export const ProjectImageField = ({ value, onChange }: ProjectImageFieldProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
    }
    onChange(file);
  };

  useEffect(() => {
    // Cleanup previous preview URL when value changes
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, [value]);

  // Create preview URL for the current image
  if (value && !previewUrlRef.current) {
    previewUrlRef.current = URL.createObjectURL(value);
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="project-image" className="block text-sm font-medium">
        Project Cover Image
      </Label>
      <Input
        id="project-image"
        type="file"
        accept="image/*"
        onChange={handleChange}
        ref={fileInputRef}
        className="bg-card border-gray-800 focus:border-primary"
      />
      {value && previewUrlRef.current && (
        <div className="mt-2 relative w-full h-48 rounded-lg overflow-hidden">
          <img
            src={previewUrlRef.current}
            alt="Project cover preview"
            className="object-cover w-full h-full"
          />
        </div>
      )}
    </div>
  );
};