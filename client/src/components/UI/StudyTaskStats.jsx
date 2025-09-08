import React from "react";

const StudyTaskStats = ({ stats }) => {
  const priorityLabels = {
    high: "High",
    medium: "Medium",
    low: "Low",
  };
  const priorityColors = {
    high: "bg-red-500",
    medium: "bg-yellow-500",
    low: "bg-blue-500",
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="stat bg-base-100 shadow rounded">
        <div className="stat-title">Total Tasks</div>
        <div className="stat-value">{stats.totalTasks}</div>
      </div>

      <div className="stat bg-base-100 shadow rounded">
        <div className="stat-title">Completed</div>
        <div className="stat-value text-success">{stats.completedTasks}</div>
        <div className="stat-desc">
          {stats.completionRate.toFixed(1)}% Completion Rate
        </div>
      </div>

      <div className="stat bg-base-100 shadow rounded">
        <div className="stat-title">Pending</div>
        <div className="stat-value text-warning">{stats.pendingTasks}</div>
      </div>

      <div className="stat bg-base-100 shadow rounded">
        <div className="stat-title">Overdue</div>
        <div className="stat-value text-error">{stats.overdueTasks}</div>
      </div>

      {/* Priority Statistics */}
      <div className="col-span-full">
        {stats.totalTasks ? (
          <h3 className="text-lg font-semibold mb-3">Tasks by Priority</h3>
        ) : null}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(stats.priorityStats)
            // Sort by priority to maintain consistent order
            .sort(([a], [b]) => {
              const priorityOrder = { high: 0, medium: 1, low: 2 };
              return priorityOrder[a] - priorityOrder[b];
            })
            .map(([priority, data]) => (
              <div key={priority} className="bg-base-100 p-4 rounded shadow">
                <h4 className="font-semibold mb-2">
                  {priorityLabels[priority]} Priority
                </h4>
                <div className="flex justify-between items-center mb-2">
                  <span>Total: {data.total}</span>
                  <span>Completed: {data.completed}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${priorityColors[priority]}`}
                    style={{ width: `${(data.completed / data.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default StudyTaskStats;
