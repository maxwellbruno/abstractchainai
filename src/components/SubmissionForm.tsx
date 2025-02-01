import { ProjectFormHandler } from "./form/ProjectFormHandler";
import { ProjectFormFields } from "./form/ProjectFormFields";

export const SubmissionForm = () => {
  return (
    <div id="submission-form" className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Submit Your Project</h2>
        <ProjectFormHandler>
          {({ formData, selectedImage, isSubmitting, updateField, setSelectedImage, handleSubmit }) => (
            <form onSubmit={handleSubmit} className="space-y-6">
              <ProjectFormFields
                formData={formData}
                selectedImage={selectedImage}
                isSubmitting={isSubmitting}
                updateField={updateField}
                setSelectedImage={setSelectedImage}
              />
            </form>
          )}
        </ProjectFormHandler>
      </div>
    </div>
  );
};