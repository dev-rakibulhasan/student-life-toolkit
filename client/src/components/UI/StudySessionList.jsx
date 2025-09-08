import React, { useState } from "react";
import DeleteConfModal from "./DeleteConfModal";
import toast from "react-hot-toast";
import useStudySession from "../../hooks/useStudySession";
import useDeleteConfModal from "../../hooks/useDeleteConfModel";

const StudySessionList = ({ sessions, loading, subjects = [] }) => {
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterSubject, setFilterSubject] = useState("All");
  const [filterDate, setFilterDate] = useState("");
  const { deleteSession } = useStudySession();
  const {
    openDeleteConfModal,
    closeDeleteConfModal,
    isOpenDeleteConfModal,
    targetItemId,
    isDeleting,
    setIsDeleting,
  } = useDeleteConfModal();
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await deleteSession(targetItemId);
      if (res.success) {
        toast.success("Study session deleted successfully.");
      }
      closeDeleteConfModal();
    } catch (e) {
      toast.error("Something went wrong.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <span className="loading loading-spinner loading-lg"></span>
        <span className="ml-2">Loading study sessions...</span>
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex flex-col items-center justify-center">
              <svg
                className="w-16 h-16 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No study sessions yet
              </h3>
              <p className="text-gray-500 mb-4">
                Start tracking your study time to see your sessions here!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Format duration for display
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Calculate total study time
  const totalStudyTime = sessions.reduce(
    (total, session) => total + session.duration,
    0
  );

  // Filter sessions
  const filteredSessions = sessions.filter((session) => {
    const matchesSubject =
      filterSubject === "All" || session.subject === filterSubject;

    let matchesDate = true;
    if (filterDate) {
      const sessionDate = new Date(session.date).toDateString();
      const filterDateObj = new Date(filterDate).toDateString();
      matchesDate = sessionDate === filterDateObj;
    }

    return matchesSubject && matchesDate;
  });

  // Sort sessions
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case "subject":
        aValue = a.subject.toLowerCase();
        bValue = b.subject.toLowerCase();
        break;
      case "duration":
        aValue = a.duration;
        bValue = b.duration;
        break;
      case "date":
      default:
        aValue = new Date(a.date);
        bValue = new Date(b.date);
        break;
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Handle sort change
  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
  };

  // Get sort indicator
  const getSortIndicator = (column) => {
    if (sortBy === column) {
      return sortOrder === "asc" ? "↑" : "↓";
    }
    return "";
  };

  return (
    <div className="card bg-base-100 shadow mt-6">
      <div className="card-body">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="card-title mb-4 md:mb-0">Study Sessions</h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Filter by Subject</span>
              </label>
              <select
                className="select select-bordered select-sm"
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
              >
                <option value="All">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Filter by Date</span>
              </label>
              <input
                type="date"
                className="input input-bordered input-sm"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-base-200 p-4 rounded-lg mb-6">
          <div className="flex flex-wrap gap-4 justify-between">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {filteredSessions.length}
              </div>
              <div className="text-sm text-gray-600">Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                {formatDuration(totalStudyTime)}
              </div>
              <div className="text-sm text-gray-600">Total Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {filteredSessions.length > 0
                  ? formatDuration(
                      Math.round(totalStudyTime / filteredSessions.length)
                    )
                  : "0m"}
              </div>
              <div className="text-sm text-gray-600">Average/Session</div>
            </div>
          </div>
        </div>

        <div className="h-[500px] overflow-x-auto">
          <table className="table table-zebra w-full table-pin-rows">
            <thead>
              <tr>
                <th>
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => handleSortChange("date")}
                  >
                    Date & Time {getSortIndicator("date")}
                  </button>
                </th>
                <th>
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => handleSortChange("subject")}
                  >
                    Subject {getSortIndicator("subject")}
                  </button>
                </th>
                <th>
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => handleSortChange("duration")}
                  >
                    Duration {getSortIndicator("duration")}
                  </button>
                </th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedSessions.map((session) => (
                <tr key={session._id} className="hover">
                  <td>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {new Date(session.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(session.date).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-outline badge-lg">
                      {session.subject}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold">
                        {formatDuration(session.duration)}
                      </span>
                      <div className="flex-1 max-w-xs">
                        <progress
                          className="progress progress-primary"
                          value={session.duration}
                          max={Math.max(...sessions.map((s) => s.duration))}
                        ></progress>
                      </div>
                    </div>
                  </td>
                  <td>
                    {session.notes ? (
                      <div className="tooltip" data-tip={session.notes}>
                        <span className="text-sm line-clamp-1">
                          {session.notes}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-error btn-xs btn-outline"
                      onClick={() => openDeleteConfModal(session._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination or load more could be added here */}
        {filteredSessions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No study sessions match your filters.
            </p>
            <button
              className="btn btn-ghost btn-sm mt-2"
              onClick={() => {
                setFilterSubject("All");
                setFilterDate("");
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
      <DeleteConfModal
        isOpen={isOpenDeleteConfModal}
        onClose={closeDeleteConfModal}
        onConfirm={handleDelete}
        itemName="session"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default StudySessionList;
