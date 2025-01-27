import { Input } from "@/components/ui/input";

interface ProjectWebsiteFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const ProjectWebsiteField = ({ value, onChange }: ProjectWebsiteFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Website</label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-card border-gray-800 focus:border-primary"
        placeholder="https://"
        type="url"
      />
    </div>
  );
};