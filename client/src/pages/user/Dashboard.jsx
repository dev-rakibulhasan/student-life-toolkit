import React, { useState, useEffect, useMemo } from "react";
import useAuth from "../../hooks/useAuth";
import api from "../../services/api";
import useStudySession from "../../hooks/useStudySession";
import StudyTimeChart from "../../components/UI/StudyTimeChart";
import { prepareStudyTimeChartData } from "../../Utils";
import FinancialAdvices from "../../components/UI/FinancialAdvices";

const Dashboard = () => {
  const { user } = useAuth();
  const { fetchSessions, sessions } = useStudySession();
  const [dashboardData, setDashboardData] = useState({
    totalClasses: 0,
    totalInstructors: 0,
    currentBalance: 0,
    budgetRecords: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const chartData = useMemo(() => {
    return prepareStudyTimeChartData(sessions);
  }, [sessions]);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/auth/dashboard/${user._id}`);
        setDashboardData(response.data);
        setError("");
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    fetchSessions({ subject: "All", timeFilter: "thisWeek" });
  }, []);
  // Calculate financial metrics
  const totalIncome = dashboardData.budgetRecords
    .filter((r) => r.type === "income")
    .reduce((sum, record) => sum + record.amount, 0);

  const totalExpenses = dashboardData.budgetRecords
    .filter((r) => r.type === "expense")
    .reduce((sum, record) => sum + record.amount, 0);

  const currentBalance = dashboardData.currentBalance;

  // Determine financial status and alert message
  const getFinancialStatus = () => {
    if (totalExpenses > totalIncome) {
      return {
        type: "error",
        message: (
          <span>
            <b>Alert:</b> Your expenses exceed your income. This is not
            sustainable!
          </span>
        ),
      };
    } else if (currentBalance < 100) {
      return {
        type: "warning",
        message: (
          <span>
            <b>Warning:</b> Your balance is very low (less than ৳100). Consider
            reducing expenses.
          </span>
        ),
      };
    } else {
      return {
        type: "success",
        message: (
          <span>
            <b>Good news:</b> Your finances are healthy with a positive balance!
          </span>
        ),
      };
    }
  };

  const financialStatus = getFinancialStatus();
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg my-4">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Schedules Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z"
                />
              </svg>
              Total Schedules
            </h2>
            <p className="text-4xl font-bold">{dashboardData.totalClasses}</p>
            <div className="card-actions justify-end">
              <div className="badge badge-primary">
                {dashboardData.totalClasses <= 1 ? "Class" : "Classes"}
              </div>
            </div>
          </div>
        </div>

        {/* Total Instructors Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Total Instructors
            </h2>
            <p className="text-4xl font-bold">
              {dashboardData.totalInstructors}
            </p>
            <div className="card-actions justify-end">
              <div className="badge badge-secondary">
                {dashboardData.totalInstructors <= 1
                  ? "Instructor"
                  : "Instructors"}
              </div>
            </div>
          </div>
        </div>

        {/* Pending Tasks Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Pending Tasks
            </h2>
            <p className="text-4xl font-bold">{dashboardData.pendingTasks}</p>
            <div className="card-actions justify-end">
              <div className="badge badge-warning">Pending</div>
            </div>
          </div>
        </div>
        {/* Current Balance Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2
              className={`card-title ${
                currentBalance >= 0 ? "text-success" : "text-error"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m8.25 7.5.415-.207a.75.75 0 0 1 1.085.67V10.5m0 0h6m-6 0h-1.5m1.5 0v5.438c0 .354.161.697.473.865a3.751 3.751 0 0 0 5.452-2.553c.083-.409-.263-.75-.68-.75h-.745M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              Current Balance
            </h2>
            <p
              className={`text-4xl font-bold ${
                currentBalance >= 0 ? "text-success" : "text-error"
              }`}
            >
              ৳{currentBalance.toLocaleString()}
            </p>
            <div className="card-actions justify-end">
              <div
                className={`badge ${
                  currentBalance >= 0 ? "badge-success" : "badge-error"
                }`}
              >
                {currentBalance >= 0 ? "Positive" : "Negative"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title">Income vs Expenses</h3>
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <div className="text-success text-2xl font-bold">
                    ৳{totalIncome}
                  </div>
                  <div className="text-sm">Total Income</div>
                </div>
                <div className="text-center">
                  <div className="text-error text-2xl font-bold">
                    ৳{totalExpenses}
                  </div>
                  <div className="text-sm">Total Expenses</div>
                </div>
              </div>
              <div
                role="alert"
                className={`alert alert-soft ${
                  financialStatus.type === "error"
                    ? "alert-error"
                    : financialStatus.type === "warning"
                    ? "alert-warning"
                    : "alert-success"
                }`}
              >
                {financialStatus.type == "warning" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                    />
                  </svg>
                ) : financialStatus.type == "error" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                <span>{financialStatus.message}</span>
              </div>
              <FinancialAdvices />
            </div>
          </div>

          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title">Pending Tasks By Priority</h3>
              <div className="overflow-x-auto">
                <table className="table table-zebra table-sm">
                  <thead>
                    <tr>
                      <th>Priority</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <span className="badge badge-error">High</span>
                      </td>
                      <td>
                        <span className="text-xl">
                          {dashboardData.highPriorityTasks}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="badge badge-warning">Medium</span>
                      </td>
                      <td>
                        <span className="text-xl">
                          {dashboardData.mediumPriorityTasks}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="badge badge-info">Low</span>
                      </td>
                      <td>
                        <span className="text-xl">
                          {dashboardData.lowPriorityTasks}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title">Recent Transactions</h3>
              <div className="overflow-x-auto">
                <table className="table table-zebra table-sm">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.budgetRecords
                      .slice(0, 6)
                      .map((record, index) => (
                        <tr key={index}>
                          <td>
                            <span
                              className={`badge ${
                                record.type === "income"
                                  ? "badge-success"
                                  : "badge-error"
                              } capitalize`}
                            >
                              {record.type}
                            </span>
                          </td>
                          <td>৳{record.amount}</td>
                          <td>{record.description || "No description"}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <StudyTimeChart
            chartData={chartData.chartData}
            subjects={chartData.subjects}
            timeFilter="thisWeek"
            fromDashboad={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
