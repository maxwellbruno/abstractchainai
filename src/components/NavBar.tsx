import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

export const NavBar = () => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and primary navigation */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/placeholder.svg"
                alt="Logo"
                className="h-8 w-8"
              />
              <span className="text-primary font-bold text-xl">AbstractAI</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-gray-300 hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/explore" className="text-gray-300 hover:text-primary transition-colors">
                Projects
              </Link>
              <button
                onClick={scrollToAbout}
                className="text-gray-300 hover:text-primary transition-colors"
              >
                About
              </button>
            </div>
          </div>

          {/* Search and Menu */}
          <div className="flex items-center gap-4">
            <div className={cn(
              "hidden md:flex items-center transition-all duration-300",
              isSearchOpen ? "w-64" : "w-0"
            )}>
              {isSearchOpen && (
                <Input
                  type="search"
                  placeholder="Search projects..."
                  className="bg-gray-900"
                  onChange={(e) => {
                    if (e.target.value) {
                      navigate(`/explore?search=${e.target.value}`);
                    }
                  }}
                />
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hidden md:flex"
            >
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-4">
                  <Link to="/" className="text-lg">
                    Home
                  </Link>
                  <Link to="/explore" className="text-lg">
                    Projects
                  </Link>
                  <button onClick={scrollToAbout} className="text-left text-lg">
                    About
                  </button>
                  <Input
                    type="search"
                    placeholder="Search projects..."
                    className="mt-2"
                    onChange={(e) => {
                      if (e.target.value) {
                        navigate(`/explore?search=${e.target.value}`);
                      }
                    }}
                  />
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Navigation Menu */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 w-[200px]">
                      <Link
                        to="/"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Home</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Return to homepage
                        </p>
                      </Link>
                      <Link
                        to="/explore"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Projects</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Browse all projects
                        </p>
                      </Link>
                      <button
                        onClick={scrollToAbout}
                        className="block w-full text-left select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">About</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Learn more about us
                        </p>
                      </button>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};