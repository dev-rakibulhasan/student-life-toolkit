import React, { useEffect, useState } from "react";
import useQuestion from "../../hooks/ussQuistion";
import useAuth from "../../hooks/useAuth";
import { questionTypes } from "../../Utils";
import useSubject from "../../hooks/useSubject";
import toast from "react-hot-toast";

const QuestionGenerator = ({ onQuestionsGenerated }) => {
  const { generateQuestions, loading } = useQuestion();
  const { subjects, fetchSubjects } = useSubject();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    difficulty: "medium",
    type: "multiple_choice",
    count: 5,
    userId: user._id,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await generateQuestions(formData);

    if (result.success) {
      onQuestionsGenerated && onQuestionsGenerated(result.questions);
      toast.success(`${formData.count} questions created.`);
    } else {
      toast.error(result.error || "Failed to generate questions");
    }
  };
  useEffect(() => {
    fetchSubjects();
  }, []);
  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <h2 className="card-title">Generate Questions By AI</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Subject</span>
            </label>{" "}
            <br />
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="select select-bordered"
              required
            >
              <option value="">Select a subject</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Topic</span>
            </label>{" "}
            <br />
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              className="input input-bordered"
              placeholder="e.g., Quadratic Equations, World War II, Photosynthesis"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Difficulty</span>
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="select select-bordered"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Question Type</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="select select-bordered"
              >
                {questionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Number of Questions</span>
            </label>
            <input
              type="number"
              name="count"
              value={formData.count}
              onChange={handleChange}
              className="input input-bordered"
              min="1"
              max="20"
              required
            />
          </div>

          <div className="form-control mt-6">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Generating...
                </>
              ) : (
                "Generate Questions"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionGenerator;
