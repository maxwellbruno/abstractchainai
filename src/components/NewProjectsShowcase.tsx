
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Database } from "@/integrations/supabase/types";

type Project = Database['public']['Tables']['projects']['Row'];

export const NewProjectsShowcase = () => {
  const navigate = useNavigate();
  
  const { data: projects, isLoading } = useQuery({
    queryKey: ['new-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name, image_url')
        .eq('approved', true as any)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data as unknown as Project[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg overflow-hidden">
              <Skeleton className="h-48 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const safeProjects = Array.isArray(projects) ? projects : [];

  return (
    <div className="max-w-5xl mx-auto">
      <Carousel className="w-full">
        <CarouselContent>
          {safeProjects.map((project) => (
            <CarouselItem key={project.id} className="md:basis-1/2 lg:basis-1/3">
              <div 
                className="mx-2 cursor-pointer group h-[360px]"
                onClick={() => navigate(`/project/${project.id}`)}
              >
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <img
                    src={project.image_url || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e"}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                    width="400"
                    height="225"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
};
