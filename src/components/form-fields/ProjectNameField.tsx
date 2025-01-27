import { Input } from "@/components/ui/input";

interface ProjectNameFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const ProjectNameField = ({ value, onChange }: ProjectNameFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Project Name</label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-card border-gray-800 focus:border-primary"
        placeholder="Enter project name"
        required
      />
    </div>
  );
};