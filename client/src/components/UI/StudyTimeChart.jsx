import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getSubjectColor } from "../../Utils";

const StudyTimeChart = ({ chartData, subjects }) => {
  if (
    !chartData ||
    chartData.length === 0 ||
    !subjects ||
    subjects.length === 0
  ) {
    return (
      <div className="card bg-base-100 shadow mt-6">
        <div className="card-body">
          <h2 className="card-title">Study Time Progress</h2>
          <div className="text-center py-8 text-gray-500">
            No study data available for the selected time period.
          </div>
        </div>
      </div>
    );
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-base-100 p-3 border border-base-300 rounded shadow">
          <p className="font-bold">{label}</p>
          {payload.map((entry, index) => {
            const totalSeconds = entry.value * 3600; // because Y axis uses hours
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);

            return (
              <p key={index} style={{ color: entry.color }}>
                {entry.name}: {hours}h {minutes}m
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };
  // Format Y-axis label to show hours + minutes
  const formatYAxis = (value) => {
    const totalSeconds = value * 3600;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="card bg-base-100 shadow mt-6">
      <div className="card-body">
        <h2 className="card-title">Study Time Progress</h2>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                label={{
                  value: "Study Hours",
                  angle: -90,
                  position: "insideLeft",
                  offset: -10,
                  style: { textAnchor: "middle" },
                }}
                tickFormatter={formatYAxis}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ paddingBottom: "10px" }}
              />
              {subjects.map((subject) => (
                <Line
                  key={subject}
                  type="monotone"
                  dataKey={subject}
                  stroke={getSubjectColor(subject)}
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2, fill: getSubjectColor(subject) }}
                  activeDot={{
                    r: 6,
                    stroke: getSubjectColor(subject),
                    strokeWidth: 2,
                  }}
                  name={subject}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subject Color Legend */}
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          {subjects.map((subject) => (
            <div key={subject} className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getSubjectColor(subject) }}
              ></div>
              <span className="text-xs">{subject}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyTimeChart;
