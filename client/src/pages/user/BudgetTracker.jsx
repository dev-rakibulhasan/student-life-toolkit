import React, { useState, useEffect } from "react";
import useBudget from "../../hooks/useBudget";
import BudgetCharts from "../../components/UI/BudgetCharts";
import BudgetForm from "../../components/UI/BudgetForm";
import { filterBudgetByTimePeriod, getTimeFilterLabel } from "../../Utils";
import moment from "moment";

const BudgetTracker = () => {
  const {
    budgetItems,
    summary,
    fetchBudgetItems,
    fetchBudgetSummary,
    deleteBudgetItem,
  } = useBudget();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [timeFilter, setTimeFilter] = useState("lifetime");

  useEffect(() => {
    fetchBudgetItems();
    fetchBudgetSummary();
  }, []);

  const filteredByTime = filterBudgetByTimePeriod(budgetItems, timeFilter);

  const filteredItems =
    filterType === "all"
      ? filteredByTime
      : filteredByTime.filter((item) => item.type === filterType);

  // Calculate filtered summary
  const calculateFilteredSummary = () => {
    let totalIncome = 0;
    let totalExpense = 0;
    const incomeByCategory = {};
    const expenseByCategory = {};

    filteredByTime.forEach((item) => {
      if (item.type === "income") {
        totalIncome += item.amount;
        incomeByCategory[item.category] =
          (incomeByCategory[item.category] || 0) + item.amount;
      } else {
        totalExpense += item.amount;
        expenseByCategory[item.category] =
          (expenseByCategory[item.category] || 0) + item.amount;
      }
    });

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      incomeByCategory,
      expenseByCategory,
    };
  };

  const filteredSummary = calculateFilteredSummary();

  const handleEdit = (item) => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      await deleteBudgetItem(id);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditItem(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Budget Tracker</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Add New Item
        </button>
      </div>

      {/* Time Filter Section */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            className={`btn btn-sm ${
              timeFilter === "today" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={() => setTimeFilter("today")}
          >
            Today
          </button>
          <button
            className={`btn btn-sm ${
              timeFilter === "yesterday" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={() => setTimeFilter("yesterday")}
          >
            Yesterday
          </button>
          <button
            className={`btn btn-sm ${
              timeFilter === "thisWeek" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={() => setTimeFilter("thisWeek")}
          >
            This Week
          </button>
          <button
            className={`btn btn-sm ${
              timeFilter === "thisMonth" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={() => setTimeFilter("thisMonth")}
          >
            This Month
          </button>
          <button
            className={`btn btn-sm ${
              timeFilter === "thisYear" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={() => setTimeFilter("thisYear")}
          >
            This Year
          </button>
          <button
            className={`btn btn-sm ${
              timeFilter === "lifetime" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={() => setTimeFilter("lifetime")}
          >
            Lifetime
          </button>
        </div>
      </div>

      {/* Charts Section */}
      <BudgetCharts
        summary={filteredSummary}
        timePeriod={getTimeFilterLabel(timeFilter)}
      />

      {/* Type Filter Section */}
      <div className="flex gap-2 mb-4">
        <button
          className={`btn ${
            filterType === "all" ? "btn-primary" : "btn-ghost"
          }`}
          onClick={() => setFilterType("all")}
        >
          All
        </button>
        <button
          className={`btn ${
            filterType === "income" ? "btn-success" : "btn-ghost"
          }`}
          onClick={() => setFilterType("income")}
        >
          Income
        </button>
        <button
          className={`btn ${
            filterType === "expense" ? "btn-error" : "btn-ghost"
          }`}
          onClick={() => setFilterType("expense")}
        >
          Expenses
        </button>
      </div>

      {/* Budget Items List */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item._id}>
                  <td>{moment(item.date).format("ll")}</td>
                  <td>
                    <span
                      className={`badge ${
                        item.type === "income" ? "badge-success" : "badge-error"
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td>{item.category}</td>
                  <td>{item.description || "-"}</td>
                  <td
                    className={`font-bold ${
                      item.type === "income" ? "text-success" : "text-error"
                    }`}
                  >
                    ৳{item.amount.toFixed(2)}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline btn-error"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No transactions found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && <BudgetForm editItem={editItem} onClose={closeForm} />}
    </div>
  );
};

export default BudgetTracker;
