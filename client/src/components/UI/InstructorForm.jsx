import React, { useState } from "react";
import toast from "react-hot-toast";
import useInstructor from "../../hooks/useInstructor";
import useAuth from "../../hooks/useAuth";

const InstructorForm = ({ instructor = null, onClose, onSuccess }) => {
  const { createInstructor, updateInstructor } = useInstructor();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: instructor ? instructor.name : "",
    email: instructor ? instructor.email : "",
    phone: instructor ? instructor.phone : "",
    department: instructor ? instructor.department : "",
    officeHours: instructor ? instructor.officeHours : "",
    officeLocation: instructor ? instructor.officeLocation : "",
    website: instructor ? instructor.website : "",
    notes: instructor ? instructor.notes : "",
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
      newErrors.name = "Instructor name is required";
    }

    if (
      formData.email &&
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    if (
      formData.website &&
      !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
        formData.website
      )
    ) {
      newErrors.website = "Please enter a valid website URL";
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
      const result = instructor
        ? await updateInstructor(instructor._id, formData)
        : await createInstructor(formData);

      if (result.success) {
        toast.success(
          instructor
            ? "Instructor updated successfully!"
            : "Instructor created successfully!"
        );
        onSuccess && onSuccess(result.data);
        onClose();
      } else {
        toast.error(
          result.error ||
            `Failed to ${instructor ? "update" : "create"} instructor`
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
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">
          {instructor ? "Edit Instructor" : "Add New Instructor"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name *</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input input-bordered ${
                  errors.name ? "input-error" : ""
                }`}
                placeholder="e.g., Dr. John Smith"
                required
              />
              {errors.name && (
                <span className="text-error text-sm">{errors.name}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`input input-bordered ${
                  errors.email ? "input-error" : ""
                }`}
                placeholder="instructor@university.edu"
              />
              {errors.email && (
                <span className="text-error text-sm">{errors.email}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Phone</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input input-bordered"
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Department</span>
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="input input-bordered"
                placeholder="e.g., Computer Science"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Office Hours</span>
              </label>
              <input
                type="text"
                name="officeHours"
                value={formData.officeHours}
                onChange={handleChange}
                className="input input-bordered"
                placeholder="e.g., MWF 10:00 AM - 12:00 PM"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Office Location</span>
              </label>
              <input
                type="text"
                name="officeLocation"
                value={formData.officeLocation}
                onChange={handleChange}
                className="input input-bordered"
                placeholder="e.g., Building A, Room 305"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Website</span>
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className={`input input-bordered ${
                errors.website ? "input-error" : ""
              }`}
              placeholder="https://faculty.university.edu/instructor"
            />
            {errors.website && (
              <span className="text-error text-sm">{errors.website}</span>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Notes</span>
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="textarea textarea-bordered"
              placeholder="Additional notes about the instructor..."
              rows={3}
            />
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
              {loading ? "Saving..." : instructor ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstructorForm;
