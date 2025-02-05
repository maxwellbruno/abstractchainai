import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem("cookieConsent");
    if (!hasAccepted) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowBanner(false);
    toast({
      title: "Preferences saved",
      description: "Your cookie preferences have been saved.",
    });
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 border-t border-gray-800 p-4 z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-300">
          We use cookies to enhance your browsing experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => setShowBanner(false)}
            className="text-sm"
          >
            Decline
          </Button>
          <Button
            onClick={acceptCookies}
            className="text-sm bg-primary hover:bg-primary/90"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};