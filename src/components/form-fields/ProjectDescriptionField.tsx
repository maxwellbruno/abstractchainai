import { Textarea } from "@/components/ui/textarea";

interface ProjectDescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const ProjectDescriptionField = ({ value, onChange }: ProjectDescriptionFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Description</label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-card border-gray-800 focus:border-primary"
        placeholder="Describe your project"
        rows={4}
        required
      />
    </div>
  );
};