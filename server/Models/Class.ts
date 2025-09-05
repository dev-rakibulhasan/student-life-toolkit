import mongoose, { Schema, Document, model, ObjectId } from "mongoose";

export interface IClass extends Document {
  subject: string;
  time: string;
  day: string;
  instructor: string;
  color: string;
  user: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const classSchema: Schema<IClass> = new Schema<IClass>(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
    },
    day: {
      type: String,
      required: true,
      enum: [
        "Saturday",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
      ],
    },
    instructor: {
      type: String,
      required: true,
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

export default model<IClass>("Class", classSchema);
