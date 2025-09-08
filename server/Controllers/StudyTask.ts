import { Request, Response } from "express";
import StudyTask from "../Models/StudyTask.js";
import mongoose from "mongoose";

// Get all study tasks for a user with optional filters
export const getAllStudyTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { subject, priority, completed, upcoming, overdue, userId } =
      req.query;
    const filter: any = { user: userId };

    if (subject && subject !== "All") filter.subject = subject;
    if (priority && priority !== "All") filter.priority = priority;
    if (completed !== undefined) filter.completed = completed === "true";

    if (upcoming === "true") {
      filter.deadline = { $gte: new Date() };
    } else if (overdue === "true") {
      filter.deadline = { $lt: new Date() };
      filter.completed = false;
    }

    const tasks = await StudyTask.find(filter).sort({
      priority: -1,
      deadline: 1,
      createdAt: -1,
    });
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get study task statistics
export const getStudyTaskStates = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.query.userId;
    const totalTasks = await StudyTask.countDocuments({ user });
    const completedTasks = await StudyTask.countDocuments({
      user,
      completed: true,
    });
    const pendingTasks = totalTasks - completedTasks;

    const overdueTasks = await StudyTask.countDocuments({
      user,
      deadline: { $lt: new Date() },
      completed: false,
    });

    const priorityStats = await StudyTask.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(user as string) } },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] },
          },
        },
      },
    ]);

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      priorityStats: priorityStats.reduce((acc, curr) => {
        acc[curr._id] = { total: curr.count, completed: curr.completed };
        return acc;
      }, {}),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new study task
export const addNewStudyTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      subject,
      topic,
      description,
      priority,
      deadline,
      estimatedHours,
      timeSlots,
      userId,
    } = req.body;

    const newTask = new StudyTask({
      title,
      subject,
      topic,
      description,
      priority,
      deadline,
      estimatedHours,
      timeSlots,
      user: userId,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update a study task
export const updateStudyTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedTask = await StudyTask.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      res.status(404).json({ message: "Study task not found" });
      return;
    }

    res.json(updatedTask);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle task completion
export const toggleTaskCompletion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const task = await StudyTask.findOne({
      _id: req.params.id,
    });

    if (!task) {
      res.status(404).json({ message: "Study task not found" });
      return;
    }

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date() : null;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a study task
export const deleteStudyTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedTask = await StudyTask.findOneAndDelete({
      _id: req.params.id,
    });

    if (!deletedTask) {
      res.status(404).json({ message: "Study task not found" });
      return;
    }

    res.json({ message: "Study task deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
