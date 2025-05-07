
import { Link } from "react-router-dom";
import { Database } from "@/integrations/supabase/types";

type Project = Database['public']['Tables']['projects']['Row'];

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Link
      to={`/project/${project.id}`}
      className="block bg-card rounded-lg overflow-hidden transition-transform hover:scale-105 duration-300"
    >
      <div className="relative h-48">
        <img
          src={project.image_url || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e"}
          alt={project.name}
          className="w-full h-full object-cover"
          loading="lazy"
          width="400"
          height="225"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1485827404703-89b55fcc595e";
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
        <p className="text-gray-400 line-clamp-2 text-sm mb-3">{project.description}</p>
        <div className="flex items-center justify-between">
          <span className="bg-primary/20 text-primary text-xs px-3 py-1 rounded-full">
            {project.category}
          </span>
        </div>
      </div>
    </Link>
  );
};
