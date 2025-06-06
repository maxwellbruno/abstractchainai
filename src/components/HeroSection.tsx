import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">
        Discover AI on Abstract Blockchain
      </h1>
      <div className="h-[32px] md:h-[40px] overflow-hidden mb-8">
        <div className="animate-text-slide">
          <div className="text-xl md:text-2xl font-medium">Build the future</div>
          <div className="text-xl md:text-2xl font-medium">Transform AI</div>
          <div className="text-xl md:text-2xl font-medium">Innovate blockchain</div>
          <div className="text-xl md:text-2xl font-medium">Create value</div>
          <div className="text-xl md:text-2xl font-medium">Scale globally</div>
          <div className="text-xl md:text-2xl font-medium">Build the future</div>
        </div>
      </div>
      <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-8">
        Join the next generation of AI and blockchain innovation. Submit your project and become part of something extraordinary.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          className="bg-primary hover:bg-primary-hover text-black font-semibold text-base md:text-lg px-6 py-2"
          onClick={() => document.getElementById('submission-form')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Submit Your Project
        </Button>
        <Button 
          variant="outline"
          className="border-primary text-primary hover:bg-primary hover:text-black font-semibold text-base md:text-lg px-6 py-2"
          onClick={() => navigate('/explore')}
        >
          Explore Projects
        </Button>
      </div>
    </div>
  );
};