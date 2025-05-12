
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Twitter, Github, Mail } from "lucide-react";
import { sanitizeHtml, validateEmail, RateLimiter } from "@/utils/security";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

export const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  // Create a rate limiter instance
  const rateLimiter = new RateLimiter(3, 3600000); // 3 attempts per hour

  // Generate CSRF token on component mount
  useEffect(() => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    setCsrfToken(token);
    sessionStorage.setItem('newsletter_csrf', token);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate CSRF token
    const storedToken = sessionStorage.getItem('newsletter_csrf');
    if (storedToken !== csrfToken) {
      toast({
        title: "Security error",
        description: "Please refresh the page and try again.",
        variant: "destructive",
      });
      return;
    }
    
    // Email validation with our security utility
    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    // Check rate limiting
    const clientIp = 'client'; // In a real app, you'd use the client IP
    if (rateLimiter.isRateLimited(clientIp)) {
      const timeUntilReset = Math.ceil(rateLimiter.getTimeUntilReset(clientIp) / 60000);
      toast({
        title: "Too many attempts",
        description: `Please try again in approximately ${timeUntilReset} minutes.`,
        variant: "destructive",
      });
      return;
    }
    
    setIsSubscribing(true);

    try {
      // Sanitize the email input
      const sanitizedEmail = sanitizeHtml(email).trim().toLowerCase();
      
      // Fixed: Properly type the insert data according to the database schema
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ 
          email: sanitizedEmail 
        } as Database['public']['Tables']['newsletter_subscribers']['Insert']);

      if (error) {
        // Check if error is due to duplicate email
        if (error.code === '23505') {
          toast({
            title: "Already subscribed",
            description: "This email is already subscribed to our newsletter.",
          });
        } else {
          console.error("Newsletter subscription database error:", error);
          throw error;
        }
      } else {
        // Generate a new CSRF token after successful submission
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        const newToken = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        setCsrfToken(newToken);
        sessionStorage.setItem('newsletter_csrf', newToken);

        toast({
          title: "Subscribed!",
          description: "Thank you for subscribing to our newsletter.",
        });
        setEmail("");
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
              aria-label="Email for newsletter"
              required
            />
            <input type="hidden" name="csrf_token" value={csrfToken} />
            <Button 
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover text-black"
              disabled={isSubscribing}
              aria-label="Subscribe to newsletter"
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
