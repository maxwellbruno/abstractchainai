
import { ProjectShowcase } from "@/components/ProjectShowcase";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

const Explore = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <div className="pt-16 pb-8"> {/* Add padding to account for fixed navbar and add bottom padding */}
        <ProjectShowcase />
      </div>
      <Footer />
    </div>
  );
};

export default Explore;
