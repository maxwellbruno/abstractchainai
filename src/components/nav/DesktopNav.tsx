
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface DesktopNavProps {
  scrollToAbout: () => void;
}

export const DesktopNav = ({ scrollToAbout }: DesktopNavProps) => (
  <div className="hidden md:flex items-center gap-6">
    <Link to="/" className="text-gray-300 hover:text-primary transition-colors">
      Home
    </Link>
    <Link to="/explore" className="text-gray-300 hover:text-primary transition-colors">
      Projects
    </Link>
    <Link to="/ai-assistant" className="text-gray-300 hover:text-primary transition-colors">
      AI Assistant
    </Link>
    <button
      onClick={scrollToAbout}
      className="text-gray-300 hover:text-primary transition-colors"
    >
      About
    </button>
    <Link to="/donate" className="text-gray-300 hover:text-primary transition-colors">
      Donate
    </Link>
    <Button
      onClick={() => window.open('https://believe.app/coin/3m9rUmu4UUavPyuxv7biSmbv89EY2qCcqC7DNxdZVXY9', '_blank')}
      variant="outline"
      className="border-primary text-primary hover:bg-primary hover:text-black font-semibold"
      size="sm"
    >
      Buy Token
    </Button>
  </div>
);
