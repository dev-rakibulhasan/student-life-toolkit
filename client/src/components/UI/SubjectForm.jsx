import React, { useState } from "react";
import toast from "react-hot-toast";
import useSubject from "../../hooks/useSubject";
import useAuth from "../../hooks/useAuth";

const SubjectForm = ({ subject = null, onClose, onSuccess }) => {
  const { createSubject, updateSubject } = useSubject();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: subject ? subject.name : "",
    description: subject ? subject.description : "",
    color: subject ? subject.color : "#3B82F6",
    userId: user._id,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Subject name is required";
    }

    if (formData.name.length > 50) {
      newErrors.name = "Subject name must be less than 50 characters";
    }

    if (formData.description.length > 200) {
      newErrors.description = "Description must be less than 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setLoading(true);

    try {
      const result = subject
        ? await updateSubject(subject._id, formData)
        : await createSubject(formData);

      if (result.success) {
        toast.success(
          subject
            ? "Subject updated successfully!"
            : "Subject created successfully!"
        );
        onSuccess && onSuccess(result.data);
        onClose();
      } else {
        console.log(result);
        toast.error(
          result.error || `Failed to ${subject ? "update" : "create"} subject`
        );
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">
          {subject ? "Edit Subject" : "Create New Subject"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Subject Name</span>
            </label>{" "}
            <br />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input input-bordered ${
                errors.name ? "input-error" : ""
              }`}
              placeholder="e.g., Mathematics, Physics"
              required
            />
            {errors.name && (
              <span className="text-error text-sm">{errors.name}</span>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Description (Optional)</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`textarea textarea-bordered ${
                errors.description ? "textarea-error" : ""
              }`}
              placeholder="Brief description of the subject"
              rows={3}
            />
            {errors.description && (
              <span className="text-error text-sm">{errors.description}</span>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Color</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <span className="text-sm">{formData.color}</span>
            </div>
          </div>

          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : subject ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectForm;
