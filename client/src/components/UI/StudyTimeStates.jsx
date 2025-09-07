import React from "react";

const StudyTimeStats = ({ stats }) => {
  const formatMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (!stats) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="stat bg-base-100 shadow rounded">
        <div className="stat-title">Total Study Time</div>
        <div className="stat-value text-primary">
          {formatMinutes(stats.totalMinutes)}
        </div>
        <div className="stat-desc">{stats.sessionCount} sessions</div>
      </div>

      <div className="stat bg-base-100 shadow rounded">
        <div className="stat-title">Average per Session</div>
        <div className="stat-value text-secondary">
          {stats.sessionCount > 0
            ? formatMinutes(Math.round(stats.totalMinutes / stats.sessionCount))
            : "0h 0m"}
        </div>
      </div>

      <div className="stat bg-base-100 shadow rounded">
        <div className="stat-title">Subjects Studied</div>
        <div className="stat-value text-accent">
          {stats.subjectStats.length}
        </div>
      </div>

      {/* Subject Breakdown */}
      <div className="col-span-full mt-4">
        <h3 className="text-lg font-semibold mb-3">Study Time by Subject</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {stats.subjectStats.map((subject, index) => (
            <div key={subject._id} className="bg-base-100 p-3 rounded shadow">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{subject._id}</span>
                <span className="text-sm">
                  {formatMinutes(subject.totalMinutes)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{subject.sessionCount} sessions</span>
                <span>
                  Avg:{" "}
                  {formatMinutes(
                    Math.round(subject.totalMinutes / subject.sessionCount)
                  )}
                </span>
              </div>
              <progress
                className="progress progress-primary w-full mt-2"
                value={subject.totalMinutes}
                max={stats.totalMinutes}
              ></progress>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyTimeStats;
