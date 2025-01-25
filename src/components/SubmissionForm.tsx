import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export const SubmissionForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    features: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Project Submitted!",
      description: "We'll review your submission and get back to you soon.",
    });
    setFormData({ name: "", description: "", website: "", features: "" });
  };

  return (
    <div id="submission-form" className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Submit Your Project</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Project Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-card border-gray-800 focus:border-primary"
              placeholder="Enter project name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-card border-gray-800 focus:border-primary"
              placeholder="Describe your project"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Website</label>
            <Input
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="bg-card border-gray-800 focus:border-primary"
              placeholder="https://"
              type="url"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Key Features</label>
            <Textarea
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="bg-card border-gray-800 focus:border-primary"
              placeholder="List the main features of your project"
              rows={3}
            />
          </div>
          <Button 
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-black font-semibold"
          >
            Submit Project
          </Button>
        </form>
      </div>
    </div>
  );
};