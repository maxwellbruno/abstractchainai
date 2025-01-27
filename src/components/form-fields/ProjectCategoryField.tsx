import { PROJECT_CATEGORIES, type ProjectCategory } from "@/lib/constants";

interface ProjectCategoryFieldProps {
  value: ProjectCategory;
  onChange: (value: ProjectCategory) => void;
}

export const ProjectCategoryField = ({ value, onChange }: ProjectCategoryFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Category</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ProjectCategory)}
        className="w-full bg-card border border-gray-800 rounded-md px-3 py-2 focus:border-primary"
        required
      >
        {PROJECT_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};