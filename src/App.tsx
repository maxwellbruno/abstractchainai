
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CookieConsent } from "@/components/CookieConsent";
import { FloatingChatButton } from "@/components/FloatingChatButton";

const Index = lazy(() => import("./pages/index"));
const Explore = lazy(() => import("./pages/Explore"));
const Donate = lazy(() => import("./pages/Donate"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const AIAssistant = lazy(() => import("./pages/AIAssistant"));

const LoadingFallback = () => (
  <div className="min-h-screen bg-background p-4 md:p-8">
    <Skeleton className="h-[300px] w-full rounded-lg" />
    <div className="mt-4 space-y-2">
      <Skeleton className="h-6 w-[200px]" />
      <Skeleton className="h-4 w-full max-w-[600px]" />
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppWithSecurity = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
        </Routes>
      </Suspense>
      <CookieConsent />
      <FloatingChatButton />
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppWithSecurity />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
