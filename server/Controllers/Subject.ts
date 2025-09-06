import { Request, Response } from "express";
import Subject from "../Models/Subject.js";

// Get all subjects for a user
export const getAllSubjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const subjects = await Subject.find({ user: req.query.userId }).sort({
      name: 1,
    });
    res.json(subjects);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new subject
export const createNewSubject = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description, color, userId } = req.body;

    // Check if subject already exists for this user
    const existingSubject = await Subject.findOne({
      name: new RegExp(`^${name}$`, "i"),
      user: userId,
    });

    if (existingSubject) {
      res.status(400).json({ message: "Subject already exists" });
      return;
    }

    const newSubject = new Subject({
      name,
      description,
      color,
      user: userId,
    });

    const savedSubject = await newSubject.save();
    res.status(201).json(savedSubject);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update a subject
export const updateSubject = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description, color } = req.body;

    // Check if new name conflicts with existing subject
    if (name) {
      const existingSubject = await Subject.findOne({
        name: new RegExp(`^${name}$`, "i"),
        _id: { $ne: req.params.id },
      });

      if (existingSubject) {
        res.status(400).json({ message: "Subject already exists" });
        return;
      }
    }
    const updatedSubject = await Subject.findOneAndUpdate(
      { _id: req.params.id },
      { name, description, color },
      { new: true, runValidators: true }
    );

    if (!updatedSubject) {
      res.status(404).json({ message: "Subject not found" });
      return;
    }

    res.json(updatedSubject);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a subject
export const deleteSubject = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedSubject = await Subject.findOneAndDelete({
      _id: req.params.id,
    });

    if (!deletedSubject) {
      res.status(404).json({ message: "Subject not found" });
    }

    res.json({ message: "Subject deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
