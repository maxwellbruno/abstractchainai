
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

interface DesktopNavProps {
  scrollToAbout: () => void;
}

export const DesktopNav = ({ scrollToAbout }: DesktopNavProps) => (
  <div className="hidden md:flex items-center gap-6">
    <Link 
      to="/" 
      className="text-gray-300 hover:text-primary transition-colors font-medium px-3 py-2 rounded-md hover:bg-gray-800/50"
    >
      Home
    </Link>
    
    <div className="relative group">
      <button 
        className="flex items-center gap-1 text-gray-300 hover:text-primary transition-colors font-medium px-3 py-2 rounded-md hover:bg-gray-800/50"
      >
        Projects <ChevronDown className="h-4 w-4 opacity-70 group-hover:rotate-180 transition-transform duration-200" />
      </button>
      <div className="absolute top-full left-0 mt-1 w-48 rounded-md overflow-hidden shadow-lg bg-gray-900 border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <Link 
          to="/explore" 
          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-primary transition-colors"
        >
          Browse Projects
        </Link>
        <Link 
          to="/explore?category=AI" 
          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-primary transition-colors"
        >
          AI Projects
        </Link>
        <Link 
          to="/explore?category=Blockchain" 
          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-primary transition-colors"
        >
          Blockchain Projects
        </Link>
      </div>
    </div>
    
    <button
      onClick={scrollToAbout}
      className="text-gray-300 hover:text-primary transition-colors font-medium px-3 py-2 rounded-md hover:bg-gray-800/50"
    >
      About
    </button>
    
    <Link 
      to="/donate" 
      className="text-gray-300 hover:text-primary transition-colors font-medium px-3 py-2 rounded-md hover:bg-gray-800/50"
    >
      Donate
    </Link>
  </div>
);
