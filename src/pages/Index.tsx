import { HeroSection } from "@/components/HeroSection";
import { SubmissionForm } from "@/components/SubmissionForm";
import { ProjectShowcase } from "@/components/ProjectShowcase";
import { Footer } from "@/components/Footer";
import { NavBar } from "@/components/NavBar";

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <div className="pt-16"> {/* Add padding to account for fixed navbar */}
        <HeroSection />
        <ProjectShowcase />
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
        <Footer />
      </div>
    </div>
  );
};

export default Index;