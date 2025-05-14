
import { HeroSection } from "@/components/HeroSection";
import { NewProjectsShowcase } from "@/components/NewProjectsShowcase";
import { ProjectShowcase } from "@/components/ProjectShowcase";
import { SubmissionForm } from "@/components/SubmissionForm";
import { Footer } from "@/components/Footer";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { LoadingGrid } from "@/components/projects/LoadingGrid";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scrolling to about section when navigating from other pages
  useEffect(() => {
    if (location.state && location.state.scrollToAbout) {
      const aboutSection = document.getElementById('about-section');
      if (aboutSection) {
        setTimeout(() => {
          aboutSection.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Small timeout to ensure DOM is ready
      }
      // Clear the state to prevent scrolling on subsequent renders
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <div className="pt-16">
        <HeroSection />
        <div className="space-y-2 md:space-y-4"> {/* Further reduced spacing for better mobile layout */}
          <Suspense fallback={<LoadingGrid />}>
            <NewProjectsShowcase />
          </Suspense>
          <Suspense fallback={<LoadingGrid />}>
            <ProjectShowcase />
          </Suspense>
          <div id="about-section" className="py-6 px-4 md:py-8"> {/* Reduced padding for better spacing */}
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">
                About AbstractchainAI
              </h2>
              <p className="text-gray-400 text-sm md:text-base lg:text-lg px-2">
                AbstractchainAI is a platform that brings together innovative projects at the intersection of artificial intelligence and blockchain technology. We provide a space for developers, entrepreneurs, and visionaries to showcase their groundbreaking solutions and connect with a community of like-minded individuals.
              </p>
            </div>
          </div>
          <SubmissionForm />
          <div className="py-4 md:py-6 px-4 text-center"> {/* Reduced padding for better spacing */}
            <Button
              onClick={() => navigate('/donate')}
              className="bg-primary hover:bg-primary-hover text-black font-semibold px-4 md:px-6 py-2 md:py-3 text-sm md:text-base w-full sm:w-auto"
            >
              Support Our Project
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
