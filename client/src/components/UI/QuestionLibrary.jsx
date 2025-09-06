import React from "react";

const QuestionLibrary = ({ filteredQuestions, questions }) => {
  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <h2 className="card-title">Your Question Library</h2>

        <div className="stats shadow mb-4">
          <div className="stat">
            <div className="stat-title">Total Questions</div>
            <div className="stat-value">{filteredQuestions.length}</div>
            <div className="stat-desc">
              {questions.length} total • {filteredQuestions.length} filtered
            </div>
          </div>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {questions.length === 0
                ? "No questions found. Generate some questions to get started!"
                : "No questions match your current filters."}
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredQuestions.map((q) => (
              <div key={q._id} className="bg-base-200 p-3 rounded">
                <p className="font-semibold">{q.question}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <span className="badge badge-sm">{q.subject}</span>
                  <span className="badge badge-sm">{q.topic}</span>
                  <span
                    className={`badge badge-sm ${
                      q.difficulty === "easy"
                        ? "badge-success"
                        : q.difficulty === "medium"
                        ? "badge-warning"
                        : "badge-error"
                    }`}
                  >
                    {q.difficulty}
                  </span>
                  <span className="badge badge-sm">
                    {q.type === "multiple_choice"
                      ? "MCQ"
                      : q.type === "true_false"
                      ? "T/F"
                      : "SA"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionLibrary;
