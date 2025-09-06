// routes/instructors.js

import { Request, Response } from "express";
import Instructor from "../Models/Instructor.js";

// Get all instructors for a user
export const getAllInstructors = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const instructors = await Instructor.find({ user: req.query.userId }).sort({
      name: 1,
    });
    res.json(instructors);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific instructor
export const getSingleInstructor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const instructor = await Instructor.findOne({
      _id: req.params.id,
    });

    if (!instructor) {
      res.status(404).json({ message: "Instructor not found" });
      return;
    }

    res.json(instructor);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new instructor
export const addNewInstructor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      email,
      phone,
      department,
      officeHours,
      officeLocation,
      website,
      notes,
      userId,
    } = req.body;

    const newInstructor = new Instructor({
      name,
      email,
      phone,
      department,
      officeHours,
      officeLocation,
      website,
      notes,
      user: userId,
    });

    const savedInstructor = await newInstructor.save();
    res.status(201).json(savedInstructor);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Update an instructor
export const updateInstructor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      email,
      phone,
      department,
      officeHours,
      officeLocation,
      website,
      notes,
      userId,
    } = req.body;

    // Check if new name conflicts with existing instructor
    if (name) {
      const existingInstructor = await Instructor.findOne({
        name: new RegExp(`^${name}$`, "i"),
        user: userId,
        _id: { $ne: req.params.id },
      });

      if (existingInstructor) {
        res.status(400).json({ message: "Instructor already exists" });
        return;
      }
    }

    const updatedInstructor = await Instructor.findOneAndUpdate(
      { _id: req.params.id },
      {
        name,
        email,
        phone,
        department,
        officeHours,
        officeLocation,
        website,
        notes,
      },
      { new: true, runValidators: true }
    );

    if (!updatedInstructor) {
      res.status(404).json({ message: "Instructor not found" });
      return;
    }

    res.json(updatedInstructor);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an instructor
export const deleteInstructor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedInstructor = await Instructor.findOneAndDelete({
      _id: req.params.id,
    });

    if (!deletedInstructor) {
      res.status(404).json({ message: "Instructor not found" });
      return;
    }

    res.json({ message: "Instructor deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
