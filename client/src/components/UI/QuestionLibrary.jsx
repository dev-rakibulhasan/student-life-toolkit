import React from "react";

const QuestionLibrary = ({
  filteredQuestions,
  questions,
  handleEditQuestion,
  onDelete,
}) => {
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

        {filteredQuestions.map((q) => (
          <div key={q._id} className="bg-base-200 p-3 rounded relative group">
            {/* Question Content */}
            <p className="font-semibold pr-16">{q.question}</p>
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

            {/* Action Buttons - Visible on hover */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex gap-1">
                {/* Edit Button */}
                <button
                  className="btn btn-sm btn-circle btn-outline btn-primary"
                  onClick={() => handleEditQuestion(q)}
                  title="Edit Question"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>

                {/* Delete Button */}
                <button
                  className="btn btn-sm btn-circle btn-outline btn-error"
                  onClick={() => onDelete(q._id)}
                  title="Delete Question"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Always visible mini buttons for mobile */}
            <div className="flex gap-1 mt-2 lg:hidden">
              <button
                className="btn btn-xs btn-outline btn-primary"
                onClick={() => handleEditQuestion(q)}
              >
                Edit
              </button>
              <button
                className="btn btn-xs btn-outline btn-error"
                onClick={() => handleDeleteQuestion(q._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionLibrary;
