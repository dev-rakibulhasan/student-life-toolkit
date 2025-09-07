import mongoose, { Schema, Document, model, ObjectId } from "mongoose";

export interface IStudySession extends Document {
  subject: string;
  duration: number;
  date: Date;
  notes: string;
  user: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const studySessionSchema: Schema<IStudySession> = new Schema<IStudySession>(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
    },
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
studySessionSchema.index({ user: 1, date: 1 });
studySessionSchema.index({ user: 1, subject: 1 });

export default model<IStudySession>("StudySession", studySessionSchema);
