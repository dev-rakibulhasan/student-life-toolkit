import React from "react";

const BudgetCharts = ({ summary, timePeriod = "Lifetime" }) => {
  if (!summary) return null;

  const {
    totalIncome,
    totalExpense,
    balance,
    incomeByCategory,
    expenseByCategory,
  } = summary;

  // Calculate percentages for charts
  const incomeCategories = Object.entries(incomeByCategory).map(
    ([name, value]) => ({
      name,
      value,
      percentage: totalIncome > 0 ? (value / totalIncome) * 100 : 0,
    })
  );

  const expenseCategories = Object.entries(expenseByCategory).map(
    ([name, value]) => ({
      name,
      value,
      percentage: totalExpense > 0 ? (value / totalExpense) * 100 : 0,
    })
  );

  return (
    <div>
      {/* Summary Cards */}
      <div className="stats shadow w-full mb-6">
        <div className="stat">
          <div className="stat-title">Total Income ({timePeriod})</div>
          <div className="stat-value text-success">
            ৳{totalIncome.toFixed(2)}
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">Total Expenses ({timePeriod})</div>
          <div className="stat-value text-error">
            ৳{totalExpense.toFixed(2)}
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">Balance ({timePeriod})</div>
          <div
            className={`stat-value ${
              balance > 0 ? "text-success" : "text-error"
            }`}
          >
            ৳{balance.toFixed(2)}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Income Chart */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Income by Category ({timePeriod})</h3>
            {incomeCategories.length > 0 ? (
              <div className="space-y-2">
                {incomeCategories.map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{item.name}</span>
                      <span>
                        ৳{item.value.toFixed(2)} ({item.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <progress
                      className="progress progress-success w-full"
                      value={item.percentage}
                      max="100"
                    ></progress>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No income data available</p>
            )}
          </div>
        </div>

        {/* Expenses Chart */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Expenses by Category ({timePeriod})</h3>
            {expenseCategories.length > 0 ? (
              <div className="space-y-2">
                {expenseCategories.map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{item.name}</span>
                      <span>
                        ৳{item.value.toFixed(2)} ({item.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <progress
                      className="progress progress-error w-full"
                      value={item.percentage}
                      max="100"
                    ></progress>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No expense data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetCharts;
