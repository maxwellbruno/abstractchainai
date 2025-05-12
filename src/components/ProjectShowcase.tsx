
import { Button } from "@/components/ui/button";
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Database } from "@/integrations/supabase/types";
import { ProjectCard } from "./projects/ProjectCard";
import { CategoryFilter } from "./projects/CategoryFilter";
import { LoadingGrid } from "./projects/LoadingGrid";

type Project = Database['public']['Tables']['projects']['Row'];

const ITEMS_PER_PAGE = 3;

export const ProjectShowcase = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const location = useLocation();
  const showCategories = location.pathname === "/explore";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ['featured-projects', selectedCategory],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      let query = supabase
        .from('projects')
        .select('*')
        .eq('approved', true as any) // Using type assertion to fix the TS error
        .range(
          pageParam * ITEMS_PER_PAGE, 
          (pageParam + 1) * ITEMS_PER_PAGE - 1
        )
        .order('created_at', { ascending: false });
      
      if (selectedCategory) {
        query = query.eq('category', selectedCategory as any); // Using type assertion to fix the TS error
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Project[];
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < ITEMS_PER_PAGE) return undefined;
      return allPages.length;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep unused data for 10 minutes
  });

  const allProjects = data?.pages.flat() || [];

  if (isLoading) {
    return (
      <div className="py-20 px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Projects</h2>
        <LoadingGrid />
      </div>
    );
  }

  return (
    <div className="py-20 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Featured Projects</h2>
      
      {showCategories && (
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {allProjects.map((project: Project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {hasNextPage && (
        <div className="text-center mt-12">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-black"
          >
            {isFetchingNextPage ? 'Loading more...' : 'Load More Projects'}
          </Button>
        </div>
      )}
    </div>
  );
};
