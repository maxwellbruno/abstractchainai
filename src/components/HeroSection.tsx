import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">
        AbstractchainAI
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
      <Button 
        className="bg-primary hover:bg-primary-hover text-black font-semibold text-lg px-8 py-6"
        onClick={() => document.getElementById('submission-form')?.scrollIntoView({ behavior: 'smooth' })}
      >
        Submit Your Project
      </Button>
    </div>
  );
};