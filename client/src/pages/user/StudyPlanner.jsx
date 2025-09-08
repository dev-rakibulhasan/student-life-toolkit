import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useStudyTask from "../../hooks/useStudyTask";
import StudyTaskCard from "../../components/UI/StudyTaskCard";
import StudyTaskForm from "../../components/UI/StudyTaskForm";
import StudyTaskStats from "../../components/UI/StudyTaskStats";
import useDeleteConfModal from "../../hooks/useDeleteConfModel";
import DeleteConfModal from "../../components/UI/DeleteConfModal";

const StudyPlanner = () => {
  const {
    tasks,
    stats,
    loading,
    filters,
    fetchTasks,
    fetchStats,
    updateFilters,
    toggleTask,
    deleteTask,
  } = useStudyTask();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const {
    openDeleteConfModal,
    closeDeleteConfModal,
    isOpenDeleteConfModal,
    targetItemId,
    isDeleting,
    setIsDeleting,
  } = useDeleteConfModal();
  useEffect(() => {
    fetchTasks(filters);
    fetchStats();
  }, [filters]);

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleToggleTask = async (id) => {
    const result = await toggleTask(id);
    if (result.success) {
      toast.success("Task status updated");
    } else {
      toast.error(result.error || "Failed to update task");
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await deleteTask(targetItemId);
      if (res.success) {
        toast.success("Task deleted successfully.");
      }
      closeDeleteConfModal();
    } catch (e) {
      toast.error("Something went wrong.");
    } finally {
      setIsDeleting(false);
    }
  };
  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleFilterChange = (filterType, value) => {
    updateFilters({ ...filters, [filterType]: value });
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSubject =
      filters.subject === "All" || task.subject === filters.subject;
    const matchesPriority =
      filters.priority === "All" || task.priority === filters.priority;
    const matchesStatus =
      filters.status === "All" ||
      (filters.status === "completed" && task.completed) ||
      (filters.status === "pending" && !task.completed);

    return matchesSubject && matchesPriority && matchesStatus;
  });

  const subjects = [
    "All",
    ...new Set(tasks.map((task) => task.subject).filter(Boolean)),
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Study Planner</h1>
        <button className="btn btn-primary" onClick={handleCreateTask}>
          Add New Task
        </button>
      </div>

      {/* Statistics */}
      {stats && <StudyTaskStats stats={stats} />}

      {/* Filters */}
      <div className="card bg-base-100 shadow mb-6">
        <div className="card-body">
          <h2 className="card-title">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Subject</span>
              </label>
              <select
                className="select select-bordered"
                value={filters.subject}
                onChange={(e) => handleFilterChange("subject", e.target.value)}
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Priority</span>
              </label>
              <select
                className="select select-bordered"
                value={filters.priority}
                onChange={(e) => handleFilterChange("priority", e.target.value)}
              >
                <option value="All">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Status</span>
              </label>
              <select
                className="select select-bordered"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <StudyTaskForm
          task={editingTask}
          onClose={() => setShowForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
          <span className="ml-2">Loading tasks...</span>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-8">
          {tasks.length === 0 ? (
            <>
              <p className="text-gray-500 mb-4">
                No study tasks found. Create your first task to get started!
              </p>
              <button className="btn btn-primary" onClick={handleCreateTask}>
                Create First Task
              </button>
            </>
          ) : (
            <p className="text-gray-500">
              No tasks match your current filters.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredTasks.map((task) => (
            <StudyTaskCard
              key={task._id}
              task={task}
              onEdit={() => handleEditTask(task)}
              onToggle={() => handleToggleTask(task._id)}
              onDelete={() => openDeleteConfModal(task._id)}
            />
          ))}
        </div>
      )}
      <DeleteConfModal
        isOpen={isOpenDeleteConfModal}
        onClose={closeDeleteConfModal}
        onConfirm={handleDelete}
        itemName="subject"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default StudyPlanner;
