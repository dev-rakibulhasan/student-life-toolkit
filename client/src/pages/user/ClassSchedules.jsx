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
  const [nextClass, setNextClass] = useState(null);
  const [nextClassDisplayDay, setNextClassDisplayDay] = useState("");

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    calculateNextClass();
  }, [classes]);

  // Check if a time slot is already booked
  const isTimeSlotBooked = (day, time) => {
    return classes.some((cls) => cls.day === day && cls.time === time);
  };

  // Calculate the next upcoming class
  const calculateNextClass = () => {
    if (!classes.length) {
      setNextClass(null);
      setNextClassDisplayDay("");
      return;
    }

    const now = new Date();
    const currentDay = now.toLocaleDateString("en-US", { weekday: "long" });
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes

    // Convert day and time to a comparable format
    const classList = classes.map((cls) => {
      const dayIndex = days.indexOf(cls.day);
      const [hours, minutes] = cls.time.split(":").map(Number);
      const timeInMinutes = hours * 60 + minutes;

      return {
        ...cls,
        dayIndex,
        timeInMinutes,
      };
    });

    // Sort classes by day and time
    classList.sort((a, b) => {
      if (a.dayIndex !== b.dayIndex) return a.dayIndex - b.dayIndex;
      return a.timeInMinutes - b.timeInMinutes;
    });

    let nextClassFound = null;
    let displayDay = "";

    const todaysClasses = classList.filter(
      (cls) => cls.day === currentDay && cls.timeInMinutes > currentTime
    );
    if (todaysClasses.length > 0) {
      nextClassFound = todaysClasses[0];
      displayDay = "Today";
    } else {
      const currentDayIndex = days.indexOf(currentDay);
      const futureClasses = classList.filter(
        (cls) => cls.dayIndex > currentDayIndex
      );

      if (futureClasses.length > 0) {
        nextClassFound = futureClasses[0];
        const tomorrowIndex = (currentDayIndex + 1) % 7;
        displayDay =
          nextClassFound.dayIndex === tomorrowIndex
            ? "Tomorrow"
            : nextClassFound.day;
      } else {
        const nextWeekClasses = classList.filter((cls) => cls.dayIndex >= 0);
        nextClassFound = nextWeekClasses[0];
        displayDay = nextClassFound.day;
      }
    }

    setNextClass(nextClassFound);
    setNextClassDisplayDay(displayDay);
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
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Class Schedules</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Add Class
        </button>
      </div>

      {/* Next Class Banner */}
      {nextClass && (
        <div role="alert" className="alert alert-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="h-6 w-6 shrink-0 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>
            Next class: <strong>{nextClass.subject}</strong> on{" "}
            {nextClassDisplayDay} at {formatTime(nextClass.time)}
          </span>
        </div>
      )}

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
