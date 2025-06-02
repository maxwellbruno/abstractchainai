
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Link, useNavigate } from "react-router-dom";

interface MobileMenuProps {
  scrollToAbout: () => void;
}

export const MobileMenu = ({ scrollToAbout }: MobileMenuProps) => {
  const navigate = useNavigate();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[280px] sm:w-[350px] bg-black border-gray-800">
        <SheetHeader>
          <SheetTitle className="text-white">Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-6">
          <Link 
            to="/" 
            className="text-lg text-white hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link 
            to="/explore" 
            className="text-lg text-white hover:text-primary transition-colors"
          >
            Projects
          </Link>
          <Link 
            to="/ai-assistant" 
            className="text-lg text-white hover:text-primary transition-colors"
          >
            AI Assistant
          </Link>
          <button 
            onClick={scrollToAbout} 
            className="text-left text-lg text-white hover:text-primary transition-colors"
          >
            About
          </button>
          <Link 
            to="/donate" 
            className="text-lg text-white hover:text-primary transition-colors"
          >
            Donate
          </Link>
          <Button
            onClick={() => window.open('https://believe.app/coin/3m9rUmu4UUavPyuxv7biSmbv89EY2qCcqC7DNxdZVXY9', '_blank')}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-black font-semibold"
          >
            Buy Token
          </Button>
          <div className="mt-4">
            <Input
              type="search"
              placeholder="Search projects..."
              className="bg-card border-gray-800 text-white"
              onChange={(e) => {
                if (e.target.value) {
                  navigate(`/explore?search=${e.target.value}`);
                }
              }}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
