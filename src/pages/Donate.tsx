
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

const Donate = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <div className="pt-16 px-4 py-20 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">Support AbstractchainAI</h1>
        <p className="text-gray-400 text-lg mb-10 text-center">
          Your donations help us continue to build and improve our platform, bringing together the best AI and blockchain projects.
        </p>
        
        <div className="bg-card rounded-lg p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-4">Why Support Us?</h2>
          <ul className="space-y-3 text-gray-300">
            <li>• Foster innovation in AI and blockchain technology</li>
            <li>• Help us maintain and improve the platform</li>
            <li>• Enable us to build new features and tools</li>
            <li>• Support the community of developers and creators</li>
          </ul>
        </div>
        
        <div className="text-center">
          <Button 
            className="bg-primary hover:bg-primary-hover text-black px-8 py-6 text-xl font-bold"
            onClick={() => window.open("https://buy.stripe.com/test_28odSZ7jMcS8gjK000", "_blank")}
          >
            Donate Now
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Donate;
