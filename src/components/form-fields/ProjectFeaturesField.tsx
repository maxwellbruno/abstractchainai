import { Textarea } from "@/components/ui/textarea";

interface ProjectFeaturesFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const ProjectFeaturesField = ({ value, onChange }: ProjectFeaturesFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Key Features</label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-card border-gray-800 focus:border-primary"
        placeholder="List the main features of your project"
        rows={3}
        required
      />
    </div>
  );
};