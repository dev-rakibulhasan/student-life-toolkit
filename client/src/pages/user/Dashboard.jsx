import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { getPlanExpiration, isPlanActive } from "../../Utils";
import moment from "moment";
import PageLoadingSpinner from "../../components/UI/PageLoadingSpinner";

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    dashboardInfo: null,
    totalSavedQuestions: 0,
    recentSavedQuestions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`user/dashboard/${user._id}`);
        setDashboardData(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user._id]);

  // Stats cards data
  const stats = [
    {
      title: "Current Plan",
      value: isPlanActive(dashboardData.dashboardInfo?.planExpiration)
        ? dashboardData.dashboardInfo?.planName
        : "N/A",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
          />
        </svg>
      ),
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Plan Expire",
      value: getPlanExpiration(dashboardData.dashboardInfo?.planExpiration),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      ),
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Account Status",
      value: dashboardData.dashboardInfo?.isBan ? (
        <span className="text-error">Banned</span>
      ) : (
        <span className="text-success">Active</span>
      ),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      ),
      color: dashboardData.dashboardInfo?.isBan
        ? "bg-red-100 text-red-600"
        : "bg-purple-100 text-purple-600",
    },
    {
      title: "Saved Questions",
      value: dashboardData.totalSavedQuestions,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3"
          />
        </svg>
      ),
      color: "bg-orange-100 text-orange-600",
    },
  ];

  if (loading) return <PageLoadingSpinner />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="card shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Questions Table */}
      <div className="card shadow-md">
        <div className="card-body">
          <h2 className="card-title text-lg font-semibold mb-4">
            Recent Questions
          </h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Answer</th>
                  <th>Saved at</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentSavedQuestions.length > 0 ? (
                  dashboardData.recentSavedQuestions.map((question, index) => (
                    <tr key={index}>
                      <td>{question.question}</td>
                      <td>{question.answer || "Not answered yet"}</td>
                      <td>
                        {moment(question.createdAt).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      No recent questions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
