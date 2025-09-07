import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import useStudySession from "../../hooks/useStudySession";
import useSubject from "../../hooks/useSubject";
import useAuth from "../../hooks/useAuth";

const StudyTimer = () => {
  const { createSession } = useStudySession();
  const { subjects, fetchSubjects } = useSubject();
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [notes, setNotes] = useState("");
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, isPaused]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    if (!selectedSubject) {
      toast.error("Please select a subject first");
      return;
    }

    setIsActive(true);
    setIsPaused(false);
    toast.success("Study timer started!");
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    toast.info(isPaused ? "Timer resumed" : "Timer paused");
  };

  const handleStop = async () => {
    if (time > 0) {
      const durationInMinutes = Math.round(time / 60);

      if (durationInMinutes < 1) {
        toast.error("Study session must be at least 1 minute");
        return;
      }

      const result = await createSession({
        subject: selectedSubject,
        duration: durationInMinutes,
        notes,
        userId: user._id,
      });

      if (result.success) {
        toast.success(
          `Study session saved! You studied for ${formatTime(time)}`
        );
      } else {
        toast.error(result.error || "Failed to save study session");
      }
    }

    setIsActive(false);
    setIsPaused(false);
    setTime(0);
    setNotes("");
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setTime(0);
    setNotes("");
  };

  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <h2 className="card-title">Study Timer</h2>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Subject</span>
          </label>
          <select
            className="select select-bordered"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={isActive}
          >
            <option value="">Select a subject</option>
            {subjects.map((subject) => (
              <option key={subject._id} value={subject.name}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-center mb-6">
          <div className="text-4xl font-bold font-mono">{formatTime(time)}</div>
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Notes (Optional)</span>
          </label>
          <textarea
            className="textarea textarea-bordered"
            placeholder="What did you study?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />
        </div>

        <div className="card-actions justify-center">
          {!isActive ? (
            <button
              className="btn btn-primary"
              onClick={handleStart}
              disabled={!selectedSubject}
            >
              Start Studying
            </button>
          ) : (
            <>
              <button className="btn btn-warning" onClick={handlePause}>
                {isPaused ? "Resume" : "Pause"}
              </button>
              <button className="btn btn-success" onClick={handleStop}>
                Finish & Save
              </button>
              <button className="btn btn-error" onClick={handleReset}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyTimer;
