
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
import { Separator } from "@/components/ui/separator";

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
        }, 100);
      }
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <div className="pt-16">
        <HeroSection />
        
        <div className="py-16 px-4 bg-gradient-to-b from-black to-card/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">
                New Projects
              </span>
            </h2>
            <Suspense fallback={<LoadingGrid />}>
              <NewProjectsShowcase />
            </Suspense>
          </div>
        </div>
        
        <Separator className="max-w-7xl mx-auto opacity-30" />
        
        <Suspense fallback={<LoadingGrid />}>
          <ProjectShowcase />
        </Suspense>
        
        <div id="about-section" className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">
              About AbstractchainAI
            </h2>
            <p className="text-gray-400 text-lg md:text-xl">
              AbstractchainAI is a platform that brings together innovative projects at the intersection of artificial intelligence and blockchain technology. We provide a space for developers, entrepreneurs, and visionaries to showcase their groundbreaking solutions and connect with a community of like-minded individuals.
            </p>
          </div>
        </div>
        <SubmissionForm />
        <div className="py-16 px-4 text-center space-y-4">
          <Button
            onClick={() => navigate('/donate')}
            className="bg-primary hover:bg-primary-hover text-black font-semibold px-8 py-4 text-lg"
          >
            Support Our Project
          </Button>
          <br />
          <Button
            onClick={() => window.open('https://dex.abstract.money', '_blank')}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-black font-semibold px-8 py-4 text-lg"
          >
            Buy Token
          </Button>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
