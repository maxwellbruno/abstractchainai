import { ProjectShowcase } from "@/components/ProjectShowcase";
import { NavBar } from "@/components/NavBar";

const Explore = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <div className="pt-16"> {/* Add padding to account for fixed navbar */}
        <ProjectShowcase />
      </div>
    </div>
  );
};

export default Explore;