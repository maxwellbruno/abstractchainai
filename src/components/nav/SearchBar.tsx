import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SearchBar = () => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <div className={cn(
        "hidden md:flex items-center transition-all duration-300",
        isSearchOpen ? "w-64" : "w-0"
      )}>
        {isSearchOpen && (
          <Input
            type="search"
            placeholder="Search projects..."
            className="bg-gray-900"
            onChange={(e) => {
              if (e.target.value) {
                navigate(`/explore?search=${e.target.value}`);
              }
            }}
          />
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsSearchOpen(!isSearchOpen)}
        className="hidden md:flex"
      >
        {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
      </Button>
    </div>
  );
};