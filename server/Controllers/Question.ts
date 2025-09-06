import { Request, Response } from "express";
import OpenAI from "openai";
import Question from "../Models/Question.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate questions using AI
export const generatedQuestionsByAi = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { subject, topic, difficulty, type, count = 5, userId } = req.body;

    if (!subject || !topic || !difficulty || !type) {
      res
        .status(400)
        .json({ message: "Subject, topic, difficulty, and type are required" });
    }

    const prompt = `
      Generate ${count} ${difficulty} difficulty ${type} questions about ${topic} in ${subject}.
      Format the response as JSON with this structure:
      {
        "questions": [
          {
            "type": "${type}",
            "subject": "${subject}",
            "topic": "${topic}",
            "difficulty": "${difficulty}",
            "question": "question text",
            "options": ["option1", "option2", ...] (only for multiple_choice),
            "correctAnswer": "correct answer",
            "explanation": "brief explanation"
          }
        ]
      }
    `;

    const completion: any = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful educational assistant that creates exam questions.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 2000,
    });

    const generatedQuestions = JSON.parse(
      completion.choices[0].message.content
    );

    // Save questions to database
    const savedQuestions = await Promise.all(
      generatedQuestions.questions.map((q: any) =>
        new Question({
          ...q,
          user: userId,
        }).save()
      )
    );

    res.json(savedQuestions);
  } catch (error) {
    console.log(process.env.OPENAI_API_KEY);
    console.error("Error generating questions:", error);
    res.status(500).json({ message: "Error generating questions" });
  }
};

// Get questions
// Get user's generated questions
export const getAllQuestions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { subject, topic, difficulty, type, userId } = req.query;

    const filter: any = { user: userId };

    // Handle subject filter (only if provided and not "All")
    if (subject && subject !== "All" && subject !== "") {
      filter.subject = new RegExp(subject as string, "i");
    }

    // Handle topic filter (only if provided and not "All")
    if (topic && topic !== "All" && topic !== "") {
      filter.topic = new RegExp(topic as string, "i");
    }

    // Handle difficulty filter (only if provided and not "All")
    if (difficulty && difficulty !== "All" && difficulty !== "") {
      filter.difficulty = difficulty;
    }

    // Handle type filter (only if provided and not "All")
    if (type && type !== "All" && type !== "") {
      filter.type = type;
    }

    const questions = await Question.find(filter).sort({ createdAt: -1 });
    res.json(questions);
  } catch (error: any) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: error.message });
  }
};

// Save a custom question
export const createCustomQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      type,
      subject,
      topic,
      difficulty,
      question,
      options,
      correctAnswer,
      explanation,
      userId,
    } = req.body;

    const newQuestion = new Question({
      type,
      subject,
      topic,
      difficulty,
      question,
      options,
      correctAnswer,
      explanation,
      user: userId,
    });

    const savedQuestion = await newQuestion.save();
    res.json(savedQuestion);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
// Update a custom question
export const updateQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      type,
      subject,
      topic,
      difficulty,
      question,
      options,
      correctAnswer,
      explanation,
      userId,
    } = req.body;

    // Find the question and verify ownership
    const existingQuestion = await Question.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!existingQuestion) {
      res.status(404).json({ message: "Question not found" });
    }

    // Validate question type and options
    if (type === "multiple_choice" && (!options || options.length < 2)) {
      res.status(400).json({
        message: "Multiple choice questions must have at least 2 options",
      });
    }

    // Update the question
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      {
        type,
        subject,
        topic,
        difficulty,
        question,
        options: type === "multiple_choice" ? options : undefined,
        correctAnswer,
        explanation,
      },
      { new: true, runValidators: true }
    );

    res.json(updatedQuestion);
  } catch (error: any) {
    console.error("Error updating question:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a specific question
export const getSingleQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const question = await Question.findOne({
      _id: req.params.id,
    });

    if (!question) {
      res.status(404).json({ message: "Question not found" });
    }

    res.json(question);
  } catch (error: any) {
    console.error("Error fetching question:", error);

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a question
export const deletedQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedQuestion = await Question.findOneAndDelete({
      _id: req.params.id,
    });

    if (!deletedQuestion) {
      res.status(404).json({ message: "Question not found" });
    }

    res.json({ message: "Question deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
