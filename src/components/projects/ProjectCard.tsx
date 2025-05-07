import { Database } from "@/integrations/supabase/types";
import { useNavigate } from "react-router-dom";

type Project = Database['public']['Tables']['projects']['Row'];

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-card hover:bg-card-hover rounded-lg overflow-hidden transition-all duration-300 group cursor-pointer border border-gray-800 relative h-[360px] w-full"
      onClick={() => navigate(`/project/${project.id}`)}
    >
      {/* Edge borders using pseudo-elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[20%] h-[2px] bg-primary"></div>
        <div className="absolute top-0 right-0 h-[20%] w-[2px] bg-primary"></div>
        <div className="absolute bottom-0 right-0 w-[20%] h-[2px] bg-primary"></div>
        <div className="absolute bottom-0 left-0 h-[20%] w-[2px] bg-primary"></div>
      </div>

      <div className="relative h-48 w-full overflow-hidden bg-muted">
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
      <div className="p-4 space-y-2">
        <h3 className="text-xl font-bold line-clamp-2">{project.name}</h3>
        <p className="text-sm text-gray-400 line-clamp-3">{project.category}</p>
      </div>
    </div>
  );
};