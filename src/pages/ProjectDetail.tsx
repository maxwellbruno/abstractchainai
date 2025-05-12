
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { NavBar } from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Database } from "@/integrations/supabase/types";

type Project = Database['public']['Tables']['projects']['Row'];

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
        .eq('id', id as any) // Using type assertion to fix the TS error
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
      
      return data as Project;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="w-full h-[400px] rounded-lg mb-8" />
            <Skeleton className="h-8 w-2/3 mb-4" />
            <Skeleton className="h-4 w-full mb-6" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-6" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-4 pt-24 pb-8">
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
      </div>
    );
  }

  // Safely access project properties
  const projectImageUrl = project?.image_url || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e";
  const projectName = project?.name || "Project";
  const projectCategory = project?.category || "Unknown";
  const projectDescription = project?.description || "";
  const projectFeatures = project?.features || "";
  const projectWebsite = project?.website;

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <img
              src={projectImageUrl}
              alt={projectName}
              className="w-full h-[400px] object-cover rounded-lg mb-8"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1485827404703-89b55fcc595e";
              }}
            />
            <div className="absolute top-4 right-4">
              <span className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full">
                {projectCategory}
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">{projectName}</h1>
          <p className="text-gray-400 mb-6 leading-relaxed">{projectDescription}</p>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Features</h2>
            <p className="text-gray-400 leading-relaxed">{projectFeatures}</p>
          </div>
          {projectWebsite && (
            <Button
              onClick={() => window.open(projectWebsite, '_blank')}
              className="bg-primary hover:bg-primary-hover text-black"
            >
              Visit Website
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
