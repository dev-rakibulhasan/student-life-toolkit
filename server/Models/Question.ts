import mongoose, { Schema, Document, model, ObjectId } from "mongoose";

export interface IQuestion extends Document {
  type: string;
  subject: string;
  topic: string;
  difficulty: string;
  question: string;
  options: [string];
  correctAnswer: string;
  explanation: string;
  date: Date;
  user: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema: Schema<IQuestion> = new mongoose.Schema<IQuestion>(
  {
    type: {
      type: String,
      required: true,
      enum: ["multiple_choice", "true_false", "short_answer"],
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["easy", "medium", "hard"],
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      validate: {
        validator: function (v) {
          return this.type !== "multiple_choice" || v.length >= 2;
        },
        message: "Multiple choice questions must have at least 2 options",
      },
    },
    correctAnswer: {
      type: String,
      required: true,
    },
    explanation: {
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

export default model<IQuestion>("Question", questionSchema);
