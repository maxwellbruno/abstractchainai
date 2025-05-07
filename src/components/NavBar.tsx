
import { Logo } from "./nav/Logo";
import { DesktopNav } from "./nav/DesktopNav";
import { SearchBar } from "./nav/SearchBar";
import { MobileMenu } from "./nav/MobileMenu";

export const NavBar = () => {
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
            <Logo />
            <DesktopNav scrollToAbout={scrollToAbout} />
          </div>

          {/* Search and Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <SearchBar />
            </div>
            <MobileMenu scrollToAbout={scrollToAbout} />
          </div>
        </div>
      </div>
    </nav>
  );
};
