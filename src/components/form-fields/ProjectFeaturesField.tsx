import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

interface ProjectFeaturesFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const ProjectFeaturesField = ({ value, onChange }: ProjectFeaturesFieldProps) => {
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // Initialize tags from value prop
  useEffect(() => {
    if (value) {
      setTags(value.split(',').map(tag => tag.trim()).filter(Boolean));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const newTag = inputValue.trim();
    if (newTag && !tags.includes(newTag)) {
      const updatedTags = [...tags, newTag];
      setTags(updatedTags);
      onChange(updatedTags.join(','));
      setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);
    onChange(updatedTags.join(','));
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Tags</label>
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2 min-h-[2rem]">
          {tags.map((tag, index) => (
            <Badge 
              key={index} 
              variant="secondary"
              className="px-2 py-1 text-sm flex items-center gap-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-1 hover:text-destructive focus:outline-none"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onBlur={addTag}
          className="bg-card border-gray-800 focus:border-primary"
          placeholder="Add tags (press Enter or comma to add)"
        />
      </div>
    </div>
  );
};