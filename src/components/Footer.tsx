import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);

      if (error) throw error;

      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-card mt-20 py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-bold">AbstractchainAI</h3>
          <p className="text-gray-400">Building the future of AI and blockchain technology.</p>
        </div>
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-primary">About Us</a></li>
            <li><a href="#" className="text-gray-400 hover:text-primary">Projects</a></li>
            <li><a href="#" className="text-gray-400 hover:text-primary">Submit Project</a></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Connect</h4>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-primary">Twitter</a></li>
            <li><a href="#" className="text-gray-400 hover:text-primary">Discord</a></li>
            <li><a href="#" className="text-gray-400 hover:text-primary">GitHub</a></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Newsletter</h4>
          <form onSubmit={handleSubscribe} className="space-y-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-black border-gray-800 focus:border-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary-hover text-black"
              disabled={isSubscribing}
            >
              {isSubscribing ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </div>
      </div>
    </footer>
  );
};