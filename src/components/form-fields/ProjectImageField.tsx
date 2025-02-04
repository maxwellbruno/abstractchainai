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
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        });
        e.target.value = '';
        return;
      }
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Image size should be less than 5MB",
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
        accept="image/*"
        onChange={handleChange}
        className="bg-card border-gray-800 focus:border-primary"
        required
      />
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