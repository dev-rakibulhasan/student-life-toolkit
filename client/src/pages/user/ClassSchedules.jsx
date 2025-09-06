import React, { useState, useEffect } from "react";
import useClass from "../../hooks/useClass";
import ClassForm from "../../components/UI/ClassForm";
import { days, formatTime, timeSlots } from "../../Utils";
import ClassDetails from "../../components/UI/ClassDetails";

const ClassSchedules = () => {
  const { classes, fetchClasses, deleteClass } = useClass();
  const [showForm, setShowForm] = useState(false);
  const [editClass, setEditClass] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  // Check if a time slot is already booked
  const isTimeSlotBooked = (day, time) => {
    return classes.some((cls) => cls.day === day && cls.time === time);
  };

  const handleEdit = (cls) => {
    setEditClass(cls);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      await deleteClass(id);
    }
  };

  const handleClassClick = (cls) => {
    setSelectedClass(cls);
    setShowModal(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditClass(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClass(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Class Schedules</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Add Class
        </button>
      </div>

      {showForm && (
        <ClassForm
          editClass={editClass}
          onClose={closeForm}
          isTimeSlotBooked={isTimeSlotBooked}
        />
      )}

      {/* Weekly Schedule View */}
      <div className="mt-8">
        <div className="h-screen overflow-x-auto">
          <table className="table table-zebra w-full table-pin-rows">
            <thead>
              <tr>
                <th>Time</th>
                {days.map((day) => (
                  <th key={day} className="bg-base-100">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time) => {
                const formattedTime = formatTime(time);

                return (
                  <tr key={time}>
                    <td className="font-bold">{formattedTime}</td>
                    {days.map((day) => {
                      const classAtThisTime = classes.find(
                        (cls) => cls.day === day && cls.time === time
                      );

                      return (
                        <td key={day}>
                          {classAtThisTime ? (
                            <button
                              className="badge p-3 rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                              style={{
                                backgroundColor: `${classAtThisTime.color}20`,
                                borderLeft: `3px solid ${classAtThisTime.color}`,
                                color: "inherit",
                              }}
                              onClick={() => handleClassClick(classAtThisTime)}
                            >
                              <strong>{classAtThisTime.subject}</strong>
                            </button>
                          ) : (
                            "-"
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ClassDetails
        showModal={showModal}
        selectedClass={selectedClass}
        closeModal={closeModal}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default ClassSchedules;
