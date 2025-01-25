import { HeroSection } from "@/components/HeroSection";
import { SubmissionForm } from "@/components/SubmissionForm";
import { ProjectShowcase } from "@/components/ProjectShowcase";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <HeroSection />
      <ProjectShowcase />
      <SubmissionForm />
      <Footer />
    </div>
  );
};

export default Index;