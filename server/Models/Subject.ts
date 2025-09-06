import mongoose, { Schema, Document, model, ObjectId } from "mongoose";

export interface ISubject extends Document {
  name: string;
  description: string;
  color: string;
  user: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const subjectSchema: Schema<ISubject> = new mongoose.Schema<ISubject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      default: "#3B82F6",
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

export default model<ISubject>("Subject", subjectSchema);
