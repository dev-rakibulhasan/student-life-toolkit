import React, { useState } from "react";
import useBudget from "../../hooks/useBudget";
import useAuth from "../../hooks/useAuth";

const BudgetForm = ({ editItem = null, onClose }) => {
  const { addBudgetItem, updateBudgetItem } = useBudget();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    type: editItem ? editItem.type : "expense",
    category: editItem ? editItem.category : "",
    amount: editItem ? editItem.amount : "",
    description: editItem ? editItem.description : "",
    user: user._id,
    date: editItem
      ? new Date(editItem.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);

  const incomeCategories = [
    "Allowance",
    "Part-time Job",
    "Scholarship",
    "Gift",
    "Other Income",
  ];
  const expenseCategories = [
    "Food",
    "Transport",
    "Books",
    "Entertainment",
    "Rent",
    "Utilities",
    "Other Expenses",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const budgetData = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date),
    };

    const result = editItem
      ? await updateBudgetItem(editItem._id, budgetData)
      : await addBudgetItem(budgetData);

    setLoading(false);
    if (result.success) {
      onClose();
    } else {
      alert(result.error || "Something went wrong");
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">
          {editItem ? "Edit Budget Item" : "Add New Budget Item"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="form-control mb-3">
            <label className="label mr-2">
              <span className="label-text">Type</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="select select-bordered"
              required
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="form-control mb-3">
            <label className="label mr-2">
              <span className="label-text">Category</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="select select-bordered"
              required
            >
              <option value="">Select a category</option>
              {formData.type === "income"
                ? incomeCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))
                : expenseCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
            </select>
          </div>

          <div className="form-control mb-3">
            <label className="label mr-2">
              <span className="label-text">Amount</span>
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="input input-bordered"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-control mb-3">
            <label className="label mr-2">
              <span className="label-text">Description</span>
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input input-bordered"
              placeholder="Optional description"
            />
          </div>

          <div className="form-control mb-4">
            <label className="label mr-2">
              <span className="label-text">Date</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
          </div>

          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : editItem ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetForm;
