import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../Models/User.js";
import { JWT_SECRET } from "../utils.js";
import Class from "../Models/Class.js";
import Instructor from "../Models/Instructor.js";
import Budget from "../Models/Budget.js";
import StudySession from "../Models/StudySession.js";
import StudyTask from "../Models/StudyTask.js";

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const user = req.params.userId;
    // Fetch all data in parallel
    const [
      totalClasses,
      totalInstructors,
      budgetRecords,
      pendingTasks,
      highPriorityTasks,
      mediumPriorityTasks,
      lowPriorityTasks,
    ] = await Promise.all([
      Class.countDocuments({ user }),
      Instructor.countDocuments({ user }),
      Budget.find({ user }).sort({ date: -1 }),
      StudyTask.countDocuments({ user, completed: false }),
      StudyTask.countDocuments({ user, completed: false, priority: "high" }),
      StudyTask.countDocuments({ user, completed: false, priority: "medium" }),
      StudyTask.countDocuments({ user, completed: false, priority: "low" }),
    ]);
    // Calculate current balance from budget records
    let currentBalance = 0;
    budgetRecords.forEach((record) => {
      if (record.type === "income") {
        currentBalance += record.amount;
      } else if (record.type === "expense") {
        currentBalance -= record.amount;
      }
    });
    res.json({
      totalClasses,
      totalInstructors,
      pendingTasks,
      highPriorityTasks,
      mediumPriorityTasks,
      lowPriorityTasks,
      currentBalance,
      budgetRecords,
    });
  } catch (error) {
    console.error("Dashboard data error:", error);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
};
// Register User
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    // Validate input
    if (!name || !email || !password) {
      res.status(400).json({ error: "Name, email and password are required" });
      return;
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: "Email already in use" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(201).json({
      success: true,
      token,
      user,
      message: "Registration successful",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error during registration" });
  }
};
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
      return;
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res
      .status(200)
      .json({ success: true, message: "Login successful", user, token });
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
};
export const verify = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
