import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

interface ProjectImageFieldProps {
  value: File | null;
  onChange: (file: File | null) => void;
}

export const ProjectImageField = ({ value, onChange }: ProjectImageFieldProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  // Cleanup object URL when component unmounts or when value changes
  useEffect(() => {
    return () => {
      if (value) {
        URL.revokeObjectURL(URL.createObjectURL(value));
      }
    };
  }, [value]);

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
        className="bg-card border-gray-800 focus:border-primary"
      />
      {value && (
        <div className="mt-2 relative w-full h-48 rounded-lg overflow-hidden">
          <img
            src={URL.createObjectURL(value)}
            alt="Project cover preview"
            className="object-cover w-full h-full"
          />
        </div>
      )}
    </div>
  );
};