import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export const ProjectShowcase = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', selectedCategory],
    queryFn: async () => {
      let query = supabase.from('projects').select('*');
      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const categories = ["AI Tools", "Security", "Infrastructure", "DeFi", "Research"];

  if (isLoading) {
    return <div className="py-20 text-center">Loading projects...</div>;
  }

  return (
    <div className="py-20 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Featured Projects</h2>
      
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => setSelectedCategory(null)}
          className="bg-primary hover:bg-primary-hover text-black"
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? "bg-primary hover:bg-primary-hover text-black" : ""}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {projects?.map((project) => (
          <div
            key={project.id}
            className="bg-card hover:bg-card-hover rounded-lg overflow-hidden transition-all duration-300 group"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={project.image_url || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e"}
                alt={project.name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40" />
            </div>
            <div className="p-6">
              <span className="text-primary text-sm font-medium">{project.category}</span>
              <h3 className="text-xl font-bold mt-2 mb-3">{project.name}</h3>
              <p className="text-gray-400 mb-4">{project.description}</p>
              {project.website && (
                <Button 
                  variant="outline" 
                  className="w-full border-primary text-primary hover:bg-primary hover:text-black"
                  onClick={() => window.open(project.website, '_blank')}
                >
                  Visit Project
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};