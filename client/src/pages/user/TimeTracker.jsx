import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { getTimeFilterLabel, prepareStudyTimeChartData } from "../../Utils";
import useStudySession from "../../hooks/useStudySession";
import StudyTimer from "../../components/UI/StudyTimer";
import StudyTimeStats from "../../components/UI/StudyTimeStates";
import StudyTimeChart from "../../components/UI/StudyTimeChart";
import StudySessionList from "../../components/UI/StudySessionList";

const TimeTracker = () => {
  const {
    sessions,
    stats,
    loading,
    filters,
    fetchSessions,
    fetchStats,
    deleteSession,
    updateFilters,
  } = useStudySession();
  const [subjects, setSubjects] = useState([]);
  const chartData = useMemo(() => {
    return prepareStudyTimeChartData(sessions, filters.timeFilter);
  }, [sessions, filters.timeFilter]);

  useEffect(() => {
    fetchSessions(filters);
    fetchStats(filters.timeFilter);
  }, [filters]);

  useEffect(() => {
    const uniqueSubjects = [
      ...new Set(sessions.map((session) => session.subject)),
    ].sort();
    setSubjects(uniqueSubjects);
  }, [sessions]);

  const handleFilterChange = (filterType, value) => {
    updateFilters({ ...filters, [filterType]: value });
  };

  const handleDeleteSession = async (id) => {
    if (window.confirm("Are you sure you want to delete this study session?")) {
      const result = await deleteSession(id);
      if (result.success) {
        toast.success("Study session deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete study session");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Study Time Tracker</h1>
        <div className="flex gap-2">
          <span className="badge badge-primary">
            {getTimeFilterLabel(filters.timeFilter)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study Timer */}
        <div className="lg:col-span-1">
          <StudyTimer />
        </div>

        {/* Stats and Filters */}
        <div className="lg:col-span-2">
          {/* Filters */}
          <div className="card bg-base-100 shadow mb-6">
            <div className="card-body">
              <h2 className="card-title">Filters</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Time Period</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={filters.timeFilter}
                    onChange={(e) =>
                      handleFilterChange("timeFilter", e.target.value)
                    }
                  >
                    <option value="lifetime">Lifetime</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="thisWeek">This Week</option>
                    <option value="thisMonth">This Month</option>
                    <option value="thisYear">This Year</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Subject</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={filters.subject}
                    onChange={(e) =>
                      handleFilterChange("subject", e.target.value)
                    }
                  >
                    <option value="All">All Subjects</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <StudyTimeStats stats={stats} />
        </div>
      </div>

      {/* Study Sessions List */}
      <StudySessionList
        sessions={sessions}
        loading={loading}
        onDeleteSession={handleDeleteSession}
        subjects={subjects}
      />

      {/* Study Time Chart */}
      <StudyTimeChart
        chartData={chartData.chartData}
        subjects={chartData.subjects}
        timeFilter={filters.timeFilter}
      />
    </div>
  );
};

export default TimeTracker;
