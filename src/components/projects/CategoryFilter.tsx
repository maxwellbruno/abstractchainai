import { Button } from "@/components/ui/button";
import { PROJECT_CATEGORIES } from "@/lib/constants";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12 max-w-7xl mx-auto">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        onClick={() => onCategoryChange(null)}
        className={selectedCategory === null ? "bg-primary hover:bg-primary-hover text-black" : ""}
      >
        All
      </Button>
      {PROJECT_CATEGORIES.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onCategoryChange(category)}
          className={selectedCategory === category ? "bg-primary hover:bg-primary-hover text-black" : ""}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};