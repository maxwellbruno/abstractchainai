import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { NavBar } from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-[400px] w-full rounded-lg mb-8" />
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-full max-w-2xl mb-8" />
          <Skeleton className="h-12 w-40" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Project not found</h1>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <img
            src={project.image_url || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e"}
            alt={project.name}
            className="w-full h-[400px] object-cover rounded-lg mb-8"
          />
          <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
          <p className="text-gray-400 mb-6">{project.description}</p>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Features</h2>
            <p className="text-gray-400">{project.features}</p>
          </div>
          {project.website && (
            <Button 
              onClick={() => window.open(project.website, '_blank')}
              className="bg-primary hover:bg-primary-hover text-black font-semibold"
            >
              Visit Project
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;