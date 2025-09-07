import { Request, Response } from "express";
import StudySession from "../Models/StudySession.js";
import mongoose from "mongoose";

// Get all study sessions for a user with optional filters
export const getAllStudySessions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { subject, timeFilter, userId } = req.query;
    const filter: any = { user: userId };
    // Handle subject filter
    if (subject && subject !== "All") {
      filter.subject = new RegExp(subject as string, "i");
    }
    // Handle time filter
    if (timeFilter && timeFilter !== "lifetime") {
      const now = new Date();
      let startDate;

      switch (timeFilter) {
        case "today":
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          break;
        case "yesterday":
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - 1
          );
          break;
        case "thisWeek":
          const dayOfWeek = now.getDay();
          const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - diffToMonday
          );
          break;
        case "thisMonth":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "thisYear":
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          break;
      }

      if (startDate) {
        filter.date = { $gte: startDate };
      }
    }

    const sessions = await StudySession.find(filter).sort({ date: -1 });
    res.json(sessions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get study session statistics
export const getStudySessionStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { timeFilter = "lifetime", userId } = req.query;

    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const filter: any = { user: new mongoose.Types.ObjectId(userId as string) };

    // Apply time filter
    const now = new Date();
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    switch (timeFilter) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1
        );
        break;
      case "yesterday":
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 1
        );
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "thisWeek": {
        const dayOfWeek = now.getDay();
        const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - diffToMonday
        );
        endDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1
        );
        break;
      }
      case "thisMonth":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        break;
      case "thisYear":
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear() + 1, 0, 1);
        break;
      default:
        break;
    }

    if (startDate && endDate) {
      filter.date = { $gte: startDate, $lt: endDate };
    }

    // Get total study time & session count
    const totalStats = await StudySession.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalMinutes: { $sum: "$duration" },
          sessionCount: { $sum: 1 },
        },
      },
    ]);

    // Get study time by subject
    const subjectStats = await StudySession.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$subject",
          totalMinutes: { $sum: "$duration" },
          sessionCount: { $sum: 1 },
        },
      },
      { $sort: { totalMinutes: -1 } },
    ]);

    // Get daily study time for the last 7 days (independent of timeFilter)
    const sevenDaysAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 6
    );

    const dailyStats = await StudySession.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId as string),
          date: { $gte: sevenDaysAgo },
        },
      },
      {
        $project: {
          date: 1,
          duration: 1,
          dateStr: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$date",
            },
          },
        },
      },
      {
        $group: {
          _id: "$dateStr",
          totalMinutes: { $sum: "$duration" },
          date: { $first: "$date" },
        },
      },
      { $sort: { date: 1 } },
    ]);

    // Build response
    const totalMinutes = totalStats[0]?.totalMinutes || 0;
    const sessionCount = totalStats[0]?.sessionCount || 0;

    res.json({
      totalMinutes,
      sessionCount,
      subjectStats,
      dailyStats: dailyStats.map((stat) => ({
        date: stat.date,
        totalMinutes: stat.totalMinutes,
      })),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new study session
export const createNewStudySession = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { subject, duration, notes, userId } = req.body;

    const newSession = new StudySession({
      subject,
      duration: Math.round(duration),
      notes,
      user: userId,
    });

    const savedSession = await newSession.save();
    res.status(201).json(savedSession);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a study session
export const deleteStudySession = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedSession = await StudySession.findOneAndDelete({
      _id: req.params.id,
    });

    if (!deletedSession) {
      res.status(404).json({ message: "Study session not found" });
      return;
    }

    res.json({ message: "Study session deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
