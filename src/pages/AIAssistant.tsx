
import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, ArrowUp } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Switch to chat mode if this is the first message
    if (!showChat) {
      setShowChat(true);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Simulate AI response for now
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: generateAIResponse(inputMessage),
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
      setIsLoading(false);
    }
  };

  const generateAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes("abstract blockchain") || lowerQuestion.includes("abstract chain")) {
      return "Abstract is a high-performance blockchain network built on Ethereum's security, designed to enable consumer-facing applications. It provides fast transactions, low fees, and developer-friendly tools for building decentralized applications.";
    }
    
    if (lowerQuestion.includes("abstractchainai") || lowerQuestion.includes("platform")) {
      return "AbstractchainAI is a platform that showcases innovative projects at the intersection of AI and blockchain technology. We connect developers, entrepreneurs, and visionaries to share groundbreaking solutions and collaborate on cutting-edge technologies.";
    }
    
    if (lowerQuestion.includes("submit") || lowerQuestion.includes("project")) {
      return "You can submit your project to AbstractchainAI by filling out our submission form on the homepage. We review all submissions and feature approved projects that demonstrate innovation in AI and blockchain integration.";
    }
    
    if (lowerQuestion.includes("how") || lowerQuestion.includes("help")) {
      return "I can help you with information about Abstract Blockchain technology, how to develop applications on Abstract, details about projects featured on AbstractchainAI, and guidance on submitting your own projects to our platform.";
    }
    
    return "That's an interesting question! While I specialize in Abstract Blockchain and AbstractchainAI topics, I'd be happy to help you explore how AI and blockchain technologies can work together. Could you provide more specific details about what you'd like to know?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleExampleClick = (example: string) => {
    setInputMessage(example);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <NavBar />
      <div className="flex-1 pt-16">
        {!showChat ? (
          // Opening Page Design (similar to attached image)
          <div className="max-w-4xl mx-auto p-4 flex flex-col items-center justify-center min-h-[80vh] text-center">
            <div className="mb-8">
              <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">
                Ask AbstractchainAI
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Your guide to Abstract Blockchain, ecosystem,<br />
                applications, and AbstractchainAI projects
              </p>
            </div>

            <div className="w-full max-w-2xl mb-8">
              <div className="relative">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about Abstract Blockchain or AbstractchainAI projects"
                  className="w-full h-16 text-lg bg-gray-900 border-gray-700 focus:border-primary rounded-xl px-6 pr-16"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-primary-hover text-black rounded-lg px-4"
                >
                  <ArrowUp className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center max-w-2xl">
              <Button
                variant="outline"
                onClick={() => handleExampleClick("What is Abstract Blockchain?")}
                className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800 rounded-full"
              >
                What is Abstract Blockchain?
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExampleClick("How do I build on Abstract?")}
                className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800 rounded-full"
              >
                How do I build on Abstract?
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExampleClick("Tell me about AbstractchainAI projects")}
                className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800 rounded-full"
              >
                Tell me about AbstractchainAI projects
              </Button>
            </div>
          </div>
        ) : (
          // Chat Interface
          <div className="max-w-4xl mx-auto p-4 h-full flex flex-col">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">
                AbstractchainAI Assistant
              </h1>
              <p className="text-gray-400">
                Your guide to Abstract Blockchain and AI innovations
              </p>
            </div>

            <div className="flex-1 bg-card/20 rounded-lg border border-gray-800 flex flex-col min-h-[600px]">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.isUser ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.isUser ? "bg-primary" : "bg-gray-700"
                      }`}>
                        {message.isUser ? (
                          <User className="w-4 h-4 text-black" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className={`max-w-[80%] rounded-lg p-3 ${
                        message.isUser 
                          ? "bg-primary text-black ml-auto" 
                          : "bg-gray-800 text-white"
                      }`}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-gray-800">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me about Abstract Blockchain or AbstractchainAI..."
                    className="flex-1 bg-black border-gray-700 focus:border-primary"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-primary hover:bg-primary-hover text-black"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AIAssistant;
