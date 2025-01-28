import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const NewProjectsShowcase = () => {
  const navigate = useNavigate();
  
  const { data: projects, isLoading } = useQuery({
    queryKey: ['new-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="py-20 text-center">Loading projects...</div>;
  }

  return (
    <div className="py-20 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">
        New Projects
      </h2>
      
      <div className="max-w-5xl mx-auto">
        <Carousel className="w-full">
          <CarouselContent>
            {projects?.map((project) => (
              <CarouselItem key={project.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="bg-card hover:bg-card-hover rounded-lg overflow-hidden transition-all duration-300 h-full mx-2">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.image_url || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e"}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">{project.name}</h3>
                      <p className="text-sm text-gray-200 line-clamp-2">{project.description}</p>
                    </div>
                  </div>
                  <div className="p-4">
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
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
      
      <div className="text-center mt-12">
        <Button 
          variant="outline"
          className="border-primary text-primary hover:bg-primary hover:text-black"
          onClick={() => navigate('/explore')}
        >
          View All Projects
        </Button>
      </div>
    </div>
  );
};