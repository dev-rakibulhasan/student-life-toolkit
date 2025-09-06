// components/UI/QuestionDisplay.js
import React, { useState } from "react";

const QuestionDisplay = ({
  questions,
  onDelete,
  onAnswerSubmit,
  userAnswers,
  setUserAnswers,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [shortAnswerInputs, setShortAnswerInputs] = useState({});

  const currentQuestion = questions[currentIndex];

  const handleAnswerSelect = (answer) => {
    if (currentQuestion.type !== "short_answer") {
      setUserAnswers((prev) => ({ ...prev, [currentIndex]: answer }));

      if (onAnswerSubmit) {
        onAnswerSubmit(
          currentQuestion._id,
          answer,
          currentQuestion.correctAnswer
        );
      }
    }
  };

  const handleShortAnswerSubmit = () => {
    const answer = shortAnswerInputs[currentIndex] || "";
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: answer }));

    // Notify parent component about the answer
    if (onAnswerSubmit) {
      onAnswerSubmit(
        currentQuestion._id,
        answer,
        currentQuestion.correctAnswer
      );
    }
  };

  const handleShortAnswerChange = (value) => {
    setShortAnswerInputs((prev) => ({ ...prev, [currentIndex]: value }));
  };

  const checkAnswer = (index = currentIndex) => {
    return userAnswers[index] === questions[index]?.correctAnswer;
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const previousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setUserAnswers({});
    setShortAnswerInputs({});
    setShowResults(false);
  };

  const calculateScore = () => {
    const correct = questions.filter(
      (q, index) => userAnswers[index] === q.correctAnswer
    ).length;
    return (correct / questions.length) * 100;
  };

  if (showResults) {
    return (
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">Quiz Results</h2>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">
              {calculateScore().toFixed(1)}%
            </div>
            <p className="text-lg mt-2">
              You got{" "}
              {
                questions.filter((q, i) => userAnswers[i] === q.correctAnswer)
                  .length
              }
              out of {questions.length} questions correct
            </p>
          </div>
          <div className="card-actions justify-center mt-6">
            <button className="btn btn-primary" onClick={resetQuiz}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">No Questions Available</h2>
          <p>Generate some questions to get started!</p>
        </div>
      </div>
    );
  }

  const isAnswered = userAnswers[currentIndex] !== undefined;
  const isCorrect = isAnswered && checkAnswer();

  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <span className="badge badge-ghost">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span
            className={`badge ${
              currentQuestion.difficulty === "easy"
                ? "badge-success"
                : currentQuestion.difficulty === "medium"
                ? "badge-warning"
                : "badge-error"
            }`}
          >
            {currentQuestion.difficulty}
          </span>
        </div>

        <h3 className="text-xl font-semibold mb-4">
          {currentQuestion.question}
        </h3>

        {currentQuestion.type === "multiple_choice" && (
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`btn btn-block justify-start ${
                  userAnswers[currentIndex] === option
                    ? "btn-primary"
                    : "btn-ghost"
                }`}
                onClick={() => handleAnswerSelect(option)}
                disabled={isAnswered}
              >
                {String.fromCharCode(65 + index)}. {option}
              </button>
            ))}
          </div>
        )}

        {currentQuestion.type === "true_false" && (
          <div className="grid grid-cols-2 gap-2">
            <button
              className={`btn ${
                userAnswers[currentIndex] === "True"
                  ? "btn-primary"
                  : "btn-ghost"
              }`}
              onClick={() => handleAnswerSelect("True")}
              disabled={isAnswered}
            >
              True
            </button>
            <button
              className={`btn ${
                userAnswers[currentIndex] === "False"
                  ? "btn-primary"
                  : "btn-ghost"
              }`}
              onClick={() => handleAnswerSelect("False")}
              disabled={isAnswered}
            >
              False
            </button>
          </div>
        )}

        {currentQuestion.type === "short_answer" && (
          <div className="space-y-3">
            <div className="form-control">
              <textarea
                className="textarea textarea-bordered"
                placeholder="Type your answer here..."
                value={shortAnswerInputs[currentIndex] || ""}
                onChange={(e) => handleShortAnswerChange(e.target.value)}
                rows={3}
                disabled={isAnswered}
              />
            </div>
            {!isAnswered ? (
              <button
                className="btn btn-primary"
                onClick={handleShortAnswerSubmit}
                disabled={!shortAnswerInputs[currentIndex]?.trim()}
              >
                Submit Answer
              </button>
            ) : (
              <div className="mt-4 p-4 bg-base-200 rounded-lg">
                <h4 className="font-semibold">Explanation:</h4>
                <p>{currentQuestion.explanation}</p>
                <p
                  className={`mt-2 font-bold ${
                    isCorrect ? "text-success" : "text-error"
                  }`}
                >
                  {isCorrect
                    ? "✓ Correct!"
                    : "✗ Incorrect. Correct answer: " +
                      currentQuestion.correctAnswer}
                </p>
              </div>
            )}
          </div>
        )}

        {isAnswered && currentQuestion.type !== "short_answer" && (
          <div className="mt-4 p-4 bg-base-200 rounded-lg">
            <h4 className="font-semibold">Explanation:</h4>
            <p>{currentQuestion.explanation}</p>
            <p
              className={`mt-2 font-bold ${
                isCorrect ? "text-success" : "text-error"
              }`}
            >
              {isCorrect
                ? "✓ Correct!"
                : "✗ Incorrect. Correct answer: " +
                  currentQuestion.correctAnswer}
            </p>
          </div>
        )}

        <div className="card-actions justify-between mt-6">
          <button
            className="btn btn-ghost"
            onClick={previousQuestion}
            disabled={currentIndex === 0}
          >
            Previous
          </button>
          <button
            className="btn btn-primary"
            onClick={nextQuestion}
            disabled={!isAnswered}
          >
            {currentIndex === questions.length - 1 ? "Finish" : "Next"}
          </button>
        </div>

        {onDelete && (
          <div className="mt-4">
            <button
              className="btn btn-sm btn-error"
              onClick={() => onDelete(currentQuestion._id)}
            >
              Delete Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDisplay;
