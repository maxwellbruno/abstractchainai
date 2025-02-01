import { Button } from "@/components/ui/button";
import { Database } from "@/integrations/supabase/types";

type Project = Database['public']['Tables']['projects']['Row'];

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div
      className="bg-card hover:bg-card-hover rounded-lg overflow-hidden transition-all duration-300 group"
    >
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={project.image_url || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e"}
          alt={project.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1485827404703-89b55fcc595e";
          }}
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
  );
};