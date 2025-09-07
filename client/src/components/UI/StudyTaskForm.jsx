import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { days } from "../../Utils";
import useStudyTask from "../../hooks/useStudyTask";
import useAuth from "../../hooks/useAuth";
import useSubject from "../../hooks/useSubject";

const StudyTaskForm = ({ task = null, onClose, onSuccess }) => {
  const { createTask, updateTask } = useStudyTask();
  const { subjects, fetchSubjects } = useSubject();
  const [formData, setFormData] = useState({
    title: task ? task.title : "",
    subject: task ? task.subject : "",
    topic: task ? task.topic : "",
    description: task ? task.description : "",
    priority: task ? task.priority : "medium",
    deadline: task ? new Date(task.deadline).toISOString().split("T")[0] : "",
    estimatedHours: task ? task.estimatedHours : 2,
    timeSlots: task ? task.timeSlots : [],
  });
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [timeSlot, setTimeSlot] = useState({
    day: "Saturday",
    startTime: "09:00",
    endTime: "10:00",
  });

  const priorities = [
    { value: "low", label: "Low", color: "badge-info" },
    { value: "medium", label: "Medium", color: "badge-warning" },
    { value: "high", label: "High", color: "badge-error" },
  ];
  useEffect(() => {
    fetchSubjects();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTimeSlotChange = (e) => {
    const { name, value } = e.target;
    setTimeSlot((prev) => ({ ...prev, [name]: value }));
  };

  const addTimeSlot = () => {
    if (timeSlot.startTime && timeSlot.endTime) {
      if (parseInt(timeSlot.startTime) >= parseInt(timeSlot.endTime)) {
        toast.error("Start time should not be less than or equal End time.");
      } else {
        setFormData((prev) => ({
          ...prev,
          timeSlots: [...prev.timeSlots, { ...timeSlot }],
        }));
        setTimeSlot({ day: "Saturday", startTime: "09:00", endTime: "10:00" });
      }
    }
  };

  const removeTimeSlot = (index) => {
    setFormData((prev) => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.deadline) newErrors.deadline = "Deadline is required";
    if (formData.estimatedHours < 0.5 || formData.estimatedHours > 24) {
      newErrors.estimatedHours = "Estimated hours must be between 0.5 and 24";
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
      const submissionData = {
        ...formData,
        deadline: new Date(formData.deadline),
        estimatedHours: parseFloat(formData.estimatedHours),
        userId: user._id,
      };

      const result = task
        ? await updateTask(task._id, submissionData)
        : await createTask(submissionData);

      if (result.success) {
        toast.success(
          task ? "Task updated successfully!" : "Task created successfully!"
        );
        onSuccess && onSuccess(result.data);
        onClose();
      } else {
        toast.error(
          result.error || `Failed to ${task ? "update" : "create"} task`
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
          {task ? "Edit Study Task" : "Create New Study Task"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title *</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`input input-bordered ${
                  errors.title ? "input-error" : ""
                }`}
                placeholder="e.g., Complete Calculus Chapter 3"
                required
              />
              {errors.title && (
                <span className="text-error text-sm">{errors.title}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Subject *</span>
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`select select-bordered ${
                  errors.subject ? "select-error" : ""
                } mr-2`}
                required
              >
                <option value="">Select a subject</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </select>
              {errors.subject && (
                <span className="text-error text-sm">{errors.subject}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Topic</span>
              </label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className="input input-bordered"
                placeholder="e.g., Differential Equations"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Priority *</span>
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="select select-bordered"
              >
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Deadline *</span>
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className={`input input-bordered ${
                  errors.deadline ? "input-error" : ""
                }`}
                required
              />
              {errors.deadline && (
                <span className="text-error text-sm">{errors.deadline}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Estimated Hours *</span>
              </label>
              <input
                type="number"
                name="estimatedHours"
                value={formData.estimatedHours}
                onChange={handleChange}
                step="0.5"
                min="0.5"
                max="24"
                className={`input input-bordered ${
                  errors.estimatedHours ? "input-error" : ""
                }`}
                required
              />
              {errors.estimatedHours && (
                <span className="text-error text-sm">
                  {errors.estimatedHours}
                </span>
              )}
            </div>
          </div>

          <div className="form-control">
            <label className="label mr-2">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered"
              placeholder="Describe what you need to study..."
              rows={3}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Time Slots (Optional)</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
              <select
                name="day"
                value={timeSlot.day}
                onChange={handleTimeSlotChange}
                className="select select-bordered"
              >
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <input
                type="time"
                name="startTime"
                value={timeSlot.startTime}
                onChange={handleTimeSlotChange}
                className="input input-bordered"
              />
              <input
                type="time"
                name="endTime"
                value={timeSlot.endTime}
                onChange={handleTimeSlotChange}
                className="input input-bordered"
              />
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={addTimeSlot}
            >
              + Add Time Slot
            </button>
          </div>

          {formData.timeSlots.length > 0 && (
            <div className="bg-base-200 p-3 rounded">
              <h4 className="font-semibold mb-2">Scheduled Time Slots:</h4>
              <div className="space-y-1">
                {formData.timeSlots.map((slot, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span>
                      {slot.day}: {slot.startTime} - {slot.endTime}
                    </span>
                    <button
                      type="button"
                      className="btn btn-xs btn-error"
                      onClick={() => removeTimeSlot(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : task ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudyTaskForm;
