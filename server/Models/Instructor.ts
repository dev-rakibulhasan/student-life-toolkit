import mongoose, { Schema, Document, model, ObjectId } from "mongoose";

export interface IInstructor extends Document {
  name: string;
  email: string;
  phone: string;
  department: string;
  officeHours: string;
  officeLocation: string;
  website: string;
  notes: string;
  user: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const instructorSchema: Schema<IInstructor> = new mongoose.Schema<IInstructor>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phone: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    officeHours: {
      type: String,
      trim: true,
    },
    officeLocation: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
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

export default model<IInstructor>("Instructor", instructorSchema);
