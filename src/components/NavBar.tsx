
import { Logo } from "./nav/Logo";
import { DesktopNav } from "./nav/DesktopNav";
import { SearchBar } from "./nav/SearchBar";
import { MobileMenu } from "./nav/MobileMenu";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "./ui/navigation-menu";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const scrollToAbout = () => {
    if (location.pathname === "/") {
      const aboutSection = document.getElementById('about-section');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/', { state: { scrollToAbout: true } });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Logo />
            <DesktopNav scrollToAbout={scrollToAbout} />
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <SearchBar />
            </div>
            <MobileMenu scrollToAbout={scrollToAbout} />

            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-white hover:bg-card hover:text-white">
                    Menu
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 w-[200px] bg-black border border-gray-800">
                      <Link
                        to="/"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-card hover:text-white focus:bg-card focus:text-white"
                      >
                        <div className="text-sm font-medium leading-none">Home</div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                          Return to homepage
                        </p>
                      </Link>
                      <Link
                        to="/explore"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-card hover:text-white focus:bg-card focus:text-white"
                      >
                        <div className="text-sm font-medium leading-none">Projects</div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                          Browse all projects
                        </p>
                      </Link>
                      <Link
                        to="/ai-assistant"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-card hover:text-white focus:bg-card focus:text-white"
                      >
                        <div className="text-sm font-medium leading-none">AI Assistant</div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                          Get help with Abstract & AI
                        </p>
                      </Link>
                      <button
                        onClick={scrollToAbout}
                        className="block w-full text-left select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-card hover:text-white focus:bg-card focus:text-white"
                      >
                        <div className="text-sm font-medium leading-none">About</div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                          Learn more about us
                        </p>
                      </button>
                      <Link
                        to="/donate"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-card hover:text-white focus:bg-card focus:text-white"
                      >
                        <div className="text-sm font-medium leading-none">Donate</div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                          Support our project
                        </p>
                      </Link>
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
