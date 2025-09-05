import mongoose, { Schema, Document, model, ObjectId } from "mongoose";

export interface IBudget extends Document {
  type: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  user: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema: Schema<IBudget> = new Schema<IBudget>(
  {
    type: {
      type: String,
      required: true,
      enum: ["income", "expense"],
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IBudget>("Budget", budgetSchema);
