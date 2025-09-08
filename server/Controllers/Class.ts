import { Request, Response } from "express";
import Class from "../Models/Class.js";

// Get all classes for a user
export const getAllClasses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.query.userId;
  try {
    const classes = await Class.find({ user }).sort({
      day: 1,
      time: 1,
    });
    res.json(classes);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
// Add a new class
export const addNewClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { subject, time, day, instructor, color, userId } = req.body;

    const newClass = new Class({
      subject,
      time,
      day,
      instructor,
      color,
      user: userId,
    });

    const savedClass = await newClass.save();
    res.json(savedClass);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
// Update class
export const updateClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { subject, time, day, instructor, color, userId } = req.body;

    const updatedClass = await Class.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      { subject, time, day, instructor, color },
      { new: true }
    );

    if (!updatedClass) {
      res.status(404).json({ message: "Class not found" });
      return;
    }

    res.json(updatedClass);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
// Get all classes for a user
export const deleteClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedClass = await Class.findOneAndDelete({
      _id: req.params.id,
    });

    if (!deletedClass) {
      res.status(404).json({ message: "Class not found" });
      return;
    }

    res.json({ message: "Class deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
