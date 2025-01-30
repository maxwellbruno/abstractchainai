import { HeroSection } from "@/components/HeroSection";
import { NewProjectsShowcase } from "@/components/NewProjectsShowcase";
import { ProjectShowcase } from "@/components/ProjectShowcase";
import { SubmissionForm } from "@/components/SubmissionForm";
import { Footer } from "@/components/Footer";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <div className="pt-16">
        <HeroSection />
        <NewProjectsShowcase />
        <ProjectShowcase />
        <div id="about-section" className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">
              About AbstractchainAI
            </h2>
            <p className="text-gray-400 text-lg md:text-xl">
              Abstract is a platform that brings together innovative projects at the intersection of artificial intelligence and blockchain technology. We provide a space for developers, entrepreneurs, and visionaries to showcase their groundbreaking solutions and connect with a community of like-minded individuals.
            </p>
          </div>
        </div>
        <SubmissionForm />
        <div className="py-16 px-4 text-center">
          <Button
            onClick={() => navigate('/donate')}
            className="bg-primary hover:bg-primary-hover text-black font-semibold px-8 py-4 text-lg"
          >
            Support Our Project
          </Button>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Index;