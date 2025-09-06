import React, { useState, useEffect } from "react";

import QuestionGenerator from "../../components/UI/QuestionGenerator";
import QuestionDisplay from "../../components/UI/QuestionDisplay";
import useQuestion from "../../hooks/ussQuistion";
import ManualQuestionForm from "../../components/UI/ManualQuestionForm";
import QuestionLibrary from "../../components/UI/QuestionLibrary";

const ExamQAGenerator = () => {
  const { questions, fetchQuestions, deleteQuestion } = useQuestion();
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [view, setView] = useState("generate");
  const [filters, setFilters] = useState({
    subject: "All",
    topic: "All",
    difficulty: "All",
    type: "All",
    search: "",
  });

  // Performance tracking state
  const [userAnswers, setUserAnswers] = useState({});
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  useEffect(() => {
    fetchQuestions(filters);
    setUserAnswers({});
  }, [filters]);

  const resetProgress = () => {
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setCurrentStreak(0);
    setBestStreak(0);
    setUserAnswers({});
  };

  const handleAnswerSubmit = (questionId, userAnswer, correctAnswer) => {
    const isCorrect = userAnswer === correctAnswer;

    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: { answer: userAnswer, correct: isCorrect },
    }));

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      setCurrentStreak((prev) => {
        const newStreak = prev + 1;
        if (newStreak > bestStreak) {
          setBestStreak(newStreak);
        }
        return newStreak;
      });
    } else {
      setWrongAnswers((prev) => prev + 1);
      setCurrentStreak(0);
    }
  };

  const totalAnswered = correctAnswers + wrongAnswers;
  const correctPercentage =
    totalAnswered > 0 ? (correctAnswers / totalAnswered) * 100 : 0;
  const wrongPercentage =
    totalAnswered > 0 ? (wrongAnswers / totalAnswered) * 100 : 0;
  // Extract unique filter options from questions
  const filterOptions = {
    subjects: [
      "All",
      ...new Set(questions.map((q) => q.subject).filter(Boolean)),
    ],
    topics: ["All", ...new Set(questions.map((q) => q.topic).filter(Boolean))],
    difficulties: ["All", "easy", "medium", "hard"],
    types: ["All", "multiple_choice", "true_false", "short_answer"],
  };

  const handleQuestionsGenerated = (newQuestions) => {
    setCurrentQuestions(newQuestions);
    setView("practice");
    fetchQuestions();
  };
  const handleDeleteQuestion = async (id) => {
    await deleteQuestion(id);
    setCurrentQuestions(currentQuestions.filter((q) => q._id !== id));
    fetchQuestions();
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      subject: "All",
      topic: "All",
      difficulty: "All",
      type: "All",
      search: "",
    });
  };

  // Filter questions based on all criteria
  const filteredQuestions = questions.filter((q) => {
    const matchesSubject =
      filters.subject === "All" ||
      q.subject.toLowerCase().includes(filters.subject.toLowerCase());

    const matchesTopic =
      filters.topic === "All" ||
      q.topic.toLowerCase().includes(filters.topic.toLowerCase());

    const matchesDifficulty =
      filters.difficulty === "All" || q.difficulty === filters.difficulty;

    const matchesType = filters.type === "All" || q.type === filters.type;

    const matchesSearch =
      !filters.search ||
      q.question.toLowerCase().includes(filters.search.toLowerCase()) ||
      (q.explanation &&
        q.explanation.toLowerCase().includes(filters.search.toLowerCase()));

    return (
      matchesSubject &&
      matchesTopic &&
      matchesDifficulty &&
      matchesType &&
      matchesSearch
    );
  });

  // Check if any filter is active (not "All")
  const isFilterActive = Object.entries(filters).some(
    ([key, value]) => key !== "search" && value !== "All"
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Questions</h1>
        <div className="flex gap-2">
          <button
            className={`btn ${
              view === "generate" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={() => setView("generate")}
          >
            Generate Questions
          </button>
          <button
            className={`btn ${
              view === "create-manually" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={() => setView("create-manually")}
          >
            Create Manually
          </button>
          <button
            className={`btn ${
              view === "practice" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={() => setView("practice")}
          >
            Practice Mode
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="card bg-base-100 shadow mb-6">
        <div className="card-body">
          <h2 className="card-title">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Subject Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Subject</span>
              </label>
              <select
                className="select select-bordered"
                value={filters.subject}
                onChange={(e) => handleFilterChange("subject", e.target.value)}
              >
                {filterOptions.subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Topic</span>
              </label>
              <select
                className="select select-bordered"
                value={filters.topic}
                onChange={(e) => handleFilterChange("topic", e.target.value)}
              >
                {filterOptions.topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Difficulty</span>
              </label>
              <select
                className="select select-bordered"
                value={filters.difficulty}
                onChange={(e) =>
                  handleFilterChange("difficulty", e.target.value)
                }
              >
                {filterOptions.difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Type</span>
              </label>
              <select
                className="select select-bordered"
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
              >
                {filterOptions.types.map((type) => (
                  <option key={type} value={type}>
                    {type === "multiple_choice"
                      ? "Multiple Choice"
                      : type === "true_false"
                      ? "True/False"
                      : type === "short_answer"
                      ? "Short Answer"
                      : type}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Search</span>
              </label>
              <input
                type="text"
                placeholder="Search questions..."
                className="input input-bordered"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="flex justify-end mt-4">
            <button
              className="btn btn-ghost btn-sm"
              onClick={clearFilters}
              disabled={!isFilterActive && !filters.search}
            >
              Clear Filters
            </button>
          </div>

          {/* Active Filters Summary */}
          {isFilterActive && (
            <div className="mt-3">
              <span className="text-sm text-gray-600">Active filters: </span>
              {filters.subject !== "All" && (
                <span className="badge badge-sm badge-info mr-2">
                  Subject: {filters.subject}
                </span>
              )}
              {filters.topic !== "All" && (
                <span className="badge badge-sm badge-info mr-2">
                  Topic: {filters.topic}
                </span>
              )}
              {filters.difficulty !== "All" && (
                <span className="badge badge-sm badge-info mr-2">
                  Difficulty: {filters.difficulty}
                </span>
              )}
              {filters.type !== "All" && (
                <span className="badge badge-sm badge-info mr-2">
                  Type:{" "}
                  {filters.type === "multiple_choice"
                    ? "Multiple Choice"
                    : filters.type === "true_false"
                    ? "True/False"
                    : "Short Answer"}
                </span>
              )}
              {filters.search && (
                <span className="badge badge-sm badge-info mr-2">
                  Search: {filters.search}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {view === "generate" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuestionGenerator onQuestionsGenerated={handleQuestionsGenerated} />
          <QuestionLibrary
            filteredQuestions={filteredQuestions}
            questions={questions}
          />
        </div>
      )}
      {view === "create-manually" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ManualQuestionForm />
          <QuestionLibrary
            filteredQuestions={filteredQuestions}
            questions={questions}
          />
        </div>
      )}
      {view === "practice" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <QuestionDisplay
              questions={
                currentQuestions.length > 0 ? currentQuestions : questions
              }
              onDelete={handleDeleteQuestion}
              onAnswerSubmit={handleAnswerSubmit}
              userAnswers={userAnswers}
              setUserAnswers={setUserAnswers}
            />
          </div>

          <div className="space-y-4">
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h3 className="card-title">Performance Overview</h3>

                {/* Pie Chart Container */}
                <div className="flex flex-col items-center justify-center py-4">
                  {/* Pie Chart SVG */}
                  <div className="relative w-40 h-40">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 100 100"
                      className="transform -rotate-90"
                    >
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="10"
                      />

                      {/* Correct answers segment */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="10"
                        strokeDasharray={`${correctPercentage} ${
                          100 - correctPercentage
                        }`}
                        strokeDashoffset="25"
                        className="transition-all duration-500 ease-in-out"
                      />

                      {/* Wrong answers segment */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="10"
                        strokeDasharray={`${wrongPercentage} ${
                          100 - wrongPercentage
                        }`}
                        strokeDashoffset={25 - correctPercentage}
                        className="transition-all duration-500 ease-in-out"
                      />
                    </svg>

                    {/* Center text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">
                          {totalAnswered > 0
                            ? Math.round((correctAnswers / totalAnswered) * 100)
                            : 0}
                          %
                        </div>
                        <div className="text-xs text-gray-500">Accuracy</div>
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="mt-4 space-y-2 w-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                        <span className="text-sm">Correct</span>
                      </div>
                      <span className="text-sm font-medium">
                        {correctAnswers}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                        <span className="text-sm">Wrong</span>
                      </div>
                      <span className="text-sm font-medium">
                        {wrongAnswers}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <span className="text-sm font-medium">
                        Total Answered
                      </span>
                      <span className="text-sm font-medium">
                        {totalAnswered}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="stat p-2 bg-base-200 rounded">
                    <div className="stat-title text-xs">Current Streak</div>
                    <div className="stat-value text-lg">{currentStreak}</div>
                  </div>

                  <div className="stat p-2 bg-base-200 rounded">
                    <div className="stat-title text-xs">Best Streak</div>
                    <div className="stat-value text-lg">{bestStreak}</div>
                  </div>
                </div>

                {/* Reset Progress Button */}
                <button
                  className="btn btn-sm btn-ghost btn-block mt-4"
                  onClick={resetProgress}
                  disabled={totalAnswered === 0}
                >
                  Reset Progress
                </button>
              </div>
            </div>

            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h3 className="card-title">Quick Actions</h3>
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => setView("generate")}
                >
                  Generate New Questions
                </button>
                <button
                  className="btn btn-ghost btn-block"
                  onClick={() => setCurrentQuestions([])}
                  disabled={currentQuestions.length === 0}
                >
                  Clear Current Set
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamQAGenerator;
