import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import { Error } from "mongoose";
import cookieParser from "cookie-parser";
import "dotenv/config";
import cors from "cors";
import authRouter from "./Routes/Auth.js";
import classRouter from "./Routes/Class.js";
import budgetRouter from "./Routes/Budget.js";
import questionRouter from "./Routes/Question.js";
import subjectRouter from "./Routes/Subject.js";
import studyTaskRouter from "./Routes/StudyTask.js";
import instructorRouter from "./Routes/Instructor.js";

const app: Application = express();
const PORT = process.env.PORT || 8000;

// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err: Error) => console.error("Could not connect to MongoDB", err));

// Define a simple route
app.get("/", (req: Request, res: Response) => {
  res.send("I am running...!");
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/class", classRouter);
app.use("/api/budget", budgetRouter);
app.use("/api/question", questionRouter);
app.use("/api/subject", subjectRouter);
app.use("/api/instructor", instructorRouter);
app.use("/api/study-task", studyTaskRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
