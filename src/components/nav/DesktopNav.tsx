
import { Link } from "react-router-dom";

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
  </div>
);
