import React, { useState } from "react";
import useClass from "../../hooks/useClass";
import useAuth from "../../hooks/useAuth";
import { days, formatTime, timeSlots } from "../../Utils";

const ClassForm = ({ editClass = null, onClose, isTimeSlotBooked }) => {
  const { classes, addClass, updateClass } = useClass();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    subject: editClass ? editClass.subject : "",
    time: editClass ? editClass.time : "08:00",
    day: editClass ? editClass.day : "Monday",
    instructor: editClass ? editClass.instructor : "",
    color: editClass ? editClass.color : "#3B82F6",
    userId: user._id,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.instructor.trim()) {
      newErrors.instructor = "Instructor is required";
    }
    if (!editClass && isTimeSlotBooked(formData.day, formData.time)) {
      newErrors.time = "This time slot is already booked";
    }
    if (editClass) {
      const conflictingClass = classes.find(
        (cls) =>
          cls.day === formData.day &&
          cls.time === formData.time &&
          cls._id !== editClass._id
      );

      if (conflictingClass) {
        newErrors.time = "This time slot is already booked";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const result = editClass
      ? await updateClass(editClass._id, formData)
      : await addClass(formData);

    setLoading(false);
    if (result.success) {
      onClose();
    } else {
      alert(result.error || "Something went wrong");
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">
          {editClass ? "Edit Class" : "Add New Class"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="form-control mb-3">
            <label className="label">
              <span className="label-text mr-2">Subject</span>
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`input input-bordered ${
                errors.subject ? "input-error" : ""
              }`}
              required
            />{" "}
            <br />
            {errors.subject && (
              <span className="text-error text-sm">{errors.subject}</span>
            )}
          </div>

          <div className="form-control mb-3">
            <label className="label">
              <span className="label-text mr-2">Time</span>
            </label>
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={`select select-bordered ${
                errors.time ? "select-error" : ""
              }`}
              required
            >
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {formatTime(time)}
                </option>
              ))}
            </select>
            <br />
            {errors.time && (
              <span className="text-error text-sm">{errors.time}</span>
            )}
          </div>

          <div className="form-control mb-3 mr-2">
            <label className="label mr-2">
              <span className="label-text">Day</span>
            </label>
            <select
              name="day"
              value={formData.day}
              onChange={handleChange}
              className="select select-bordered"
              required
            >
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control mb-3 mr-2">
            <label className="label mr-2">
              <span className="label-text">Instructor</span>
            </label>
            <input
              type="text"
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              className={`input input-bordered ${
                errors.instructor ? "input-error" : ""
              }`}
              required
            />{" "}
            <br />
            {errors.instructor && (
              <span className="text-error text-sm">{errors.instructor}</span>
            )}
          </div>

          <div className="form-control mb-4">
            <label className="label mr-2">
              <span className="label-text">Color</span>
            </label>
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="input input-bordered h-10"
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
              {loading ? "Saving..." : editClass ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ClassForm;
