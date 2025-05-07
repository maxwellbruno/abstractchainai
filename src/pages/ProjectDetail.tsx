
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error loading project",
          description: "Please try again later."
        });
        throw error;
      }
      
      if (!data) {
        toast({
          variant: "destructive",
          title: "Project not found",
          description: "The requested project could not be found."
        });
        return null;
      }
      
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-4 pt-24 pb-8"> {/* Added pt-24 for spacing */}
          <div className="max-w-4xl mx-auto">
            <Skeleton className="w-full h-[400px] rounded-lg mb-8" />
            <Skeleton className="h-8 w-2/3 mb-4" />
            <Skeleton className="h-4 w-full mb-6" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-6" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-4 pt-24 pb-8"> {/* Added pt-24 for spacing */}
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Project not found</h1>
            <p className="text-gray-400 mb-6">The project you're looking for doesn't exist or has been removed.</p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-primary hover:bg-primary-hover text-black"
            >
              Return Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 pt-24 pb-8"> {/* Added pt-24 for spacing */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <img
              src={project.image_url || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e"}
              alt={project.name}
              className="w-full h-[400px] object-cover rounded-lg mb-8"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1485827404703-89b55fcc595e";
              }}
            />
            <div className="absolute top-4 right-4">
              <span className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full">
                {project.category}
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
          <p className="text-gray-400 mb-6 leading-relaxed">{project.description}</p>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Features</h2>
            <p className="text-gray-400 leading-relaxed">{project.features}</p>
          </div>
          {project.website && (
            <Button
              onClick={() => window.open(project.website, '_blank')}
              className="bg-primary hover:bg-primary-hover text-black"
            >
              Visit Website
            </Button>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProjectDetail;
