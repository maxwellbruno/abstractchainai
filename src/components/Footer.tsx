import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Twitter, Github, Mail } from "lucide-react";
import DOMPurify from "dompurify";

export const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [lastSubmissionTime, setLastSubmissionTime] = useState(0);

  // Load rate limiting data from localStorage
  useEffect(() => {
    const storedCount = localStorage.getItem('newsletter_submission_count');
    const storedTime = localStorage.getItem('newsletter_last_submission');
    
    if (storedCount) setSubmissionCount(parseInt(storedCount, 10));
    if (storedTime) setLastSubmissionTime(parseInt(storedTime, 10));
    
    // Reset count if it's been more than an hour
    if (Date.now() - lastSubmissionTime > 3600000) {
      setSubmissionCount(0);
      localStorage.removeItem('newsletter_submission_count');
      localStorage.removeItem('newsletter_last_submission');
    }
  }, [lastSubmissionTime]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation with more comprehensive regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    // Rate limiting - max 3 attempts per hour
    const currentTime = Date.now();
    if (submissionCount >= 3 && currentTime - lastSubmissionTime < 3600000) {
      toast({
        title: "Too many attempts",
        description: "Please try again later.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubscribing(true);

    try {
      // Sanitize the email input
      const sanitizedEmail = DOMPurify.sanitize(email).trim().toLowerCase();
      
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email: sanitizedEmail }]);

      if (error) {
        // Check if error is due to duplicate email
        if (error.code === '23505') {
          toast({
            title: "Already subscribed",
            description: "This email is already subscribed to our newsletter.",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Subscribed!",
          description: "Thank you for subscribing to our newsletter.",
        });
        setEmail("");
        
        // Update rate limiting data
        const newCount = submissionCount + 1;
        setSubmissionCount(newCount);
        setLastSubmissionTime(currentTime);
        localStorage.setItem('newsletter_submission_count', newCount.toString());
        localStorage.setItem('newsletter_last_submission', currentTime.toString());
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  const scrollToSubmissionForm = () => {
    const submissionForm = document.getElementById('submission-form');
    if (submissionForm) {
      submissionForm.scrollIntoView({ behavior: 'smooth' });
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
            <li><a href="#about-section" className="text-gray-400 hover:text-primary">About Us</a></li>
            <li><Link to="/explore" className="text-gray-400 hover:text-primary">Projects</Link></li>
            <li><a href="#submission-form" onClick={scrollToSubmissionForm} className="text-gray-400 hover:text-primary">Submit Project</a></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Connect</h4>
          <ul className="space-y-2">
            <li>
              <a 
                href="https://x.com/AIonAbstract" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-primary flex items-center gap-2"
              >
                <Twitter className="h-4 w-4" />
                Twitter
              </a>
            </li>
            <li>
              <a 
                href="https://github.com/maxwellbruno/abstractchainai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </li>
            <li>
              <a 
                href="mailto:contact@abstractchainai.com" 
                className="text-gray-400 hover:text-primary flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Email Us
              </a>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Newsletter</h4>
          <p className="text-gray-400 text-sm">Subscribe to receive updates on new projects and features.</p>
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
          <p className="text-xs text-gray-500">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </div>
    </footer>
  );
};
