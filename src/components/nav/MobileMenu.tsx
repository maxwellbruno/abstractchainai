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
  );
};