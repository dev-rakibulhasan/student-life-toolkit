import mongoose, { Schema, Document, model, ObjectId } from "mongoose";

export interface IStudyTask extends Document {
  title: string;
  subject: string;
  topic: string;
  description: string;
  priority: string;
  deadline: Date;
  estimatedHours: number;
  explanation: string;
  completed: boolean;
  completedAt: Date | null;
  date: Date;
  timeSlots: [
    {
      day: string;
      startTime: string;
      endTime: string;
    }
  ];
  user: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const studyTaskSchema: Schema<IStudyTask> = new mongoose.Schema<IStudyTask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    priority: {
      type: String,
      required: true,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    deadline: {
      type: Date,
      required: true,
    },
    estimatedHours: {
      type: Number,
      min: 0.5,
      max: 24,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    timeSlots: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
        startTime: {
          type: String,
          match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        },
        endTime: {
          type: String,
          match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
studyTaskSchema.index({ user: 1, deadline: 1 });
studyTaskSchema.index({ user: 1, completed: 1 });

export default model<IStudyTask>("StudyTask", studyTaskSchema);
