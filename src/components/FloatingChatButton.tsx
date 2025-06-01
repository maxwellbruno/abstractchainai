
import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useNavigate } from "react-router-dom";

export const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate("/ai-assistant");
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full w-14 h-14 bg-primary hover:bg-primary-hover text-black shadow-lg transition-all duration-300 hover:scale-110"
          size="icon"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </Button>
      </div>

      {/* Welcome Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 animate-fade-in">
          <Card className="p-4 max-w-sm bg-black border border-gray-800 shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-black" />
                </div>
                <h3 className="font-semibold text-white">AbstractchainAI Assistant</h3>
              </div>
              <p className="text-gray-300 text-sm">
                👋 Welcome! I'm here to help you with questions about Abstract Blockchain, blockchain applications, and AbstractchainAI projects.
              </p>
              <Button 
                onClick={handleChatClick}
                className="w-full bg-primary hover:bg-primary-hover text-black"
              >
                Start Chat
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};
