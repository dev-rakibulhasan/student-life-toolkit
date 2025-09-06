import React, { useState } from "react";
import toast from "react-hot-toast";
import useQuestion from "../../hooks/ussQuistion";
import useAuth from "../../hooks/useAuth";
import { questionTypes } from "../../Utils";
import useSubject from "../../hooks/useSubject";

const ManualQuestionForm = () => {
  const { addQuestion, fetchQuestions } = useQuestion();
  const { subjects, fetchSubjects } = useSubject();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    type: "multiple_choice",
    subject: "",
    topic: "",
    difficulty: "medium",
    question: "",
    options: ["", ""],
    correctAnswer: "",
    explanation: "",
    userId: user._id,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData((prev) => ({ ...prev, options: [...prev.options, ""] }));
    }
  };
  useEffect(() => {
    fetchSubjects();
  }, []);
  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        options: newOptions,
        // Clear correct answer if it was the removed option
        correctAnswer:
          formData.correctAnswer === formData.options[index]
            ? ""
            : formData.correctAnswer,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.topic.trim()) newErrors.topic = "Topic is required";
    if (!formData.question.trim()) newErrors.question = "Question is required";
    if (!formData.correctAnswer.trim())
      newErrors.correctAnswer = "Correct answer is required";

    if (formData.type === "multiple_choice") {
      if (formData.options.some((opt) => !opt.trim())) {
        newErrors.options = "All options must be filled";
      }
      if (formData.options.length < 2) {
        newErrors.options = "At least 2 options are required";
      }
      if (!formData.options.includes(formData.correctAnswer)) {
        newErrors.correctAnswer = "Correct answer must be one of the options";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      const submissionData = { ...formData };
      if (submissionData.type !== "multiple_choice") {
        delete submissionData.options;
      }

      const result = await addQuestion(submissionData);

      if (result.success) {
        toast.success("Question created successfully!");
        // Reset form
        setFormData({
          type: "multiple_choice",
          subject: "",
          topic: "",
          difficulty: "medium",
          question: "",
          options: ["", ""],
          correctAnswer: "",
          explanation: "",
          userId: user._id,
        });
        setErrors({});
        fetchQuestions("");
      } else {
        toast.error(result.error || "Failed to create question");
      }
    } catch (error) {
      console.log(error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <h2 className="card-title">Create Question Manually</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Subject</span>
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`select select-bordered ${
                  errors.subject ? "select-error" : ""
                }`}
                required
              >
                <option value="">Select a subject</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              {errors.subject && (
                <span className="text-error text-sm">{errors.subject}</span>
              )}
            </div>

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
              className={`input input-bordered ${
                errors.topic ? "input-error" : ""
              }`}
              placeholder="e.g., Quadratic Equations, World War II"
              required
            />
            {errors.topic && (
              <span className="text-error text-sm">{errors.topic}</span>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Question Type</span>
            </label>{" "}
            <br />
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

          <div className="form-control">
            <label className="label">
              <span className="label-text">Question</span>
            </label>
            <br />
            <textarea
              name="question"
              value={formData.question}
              onChange={handleChange}
              className={`textarea textarea-bordered h-24 ${
                errors.question ? "textarea-error" : ""
              }`}
              placeholder="Enter your question here..."
              required
            />
            {errors.question && (
              <span className="text-error text-sm">{errors.question}</span>
            )}
          </div>

          {formData.type === "multiple_choice" && (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Options</span>
                {errors.options && (
                  <span className="text-error text-sm">{errors.options}</span>
                )}
              </label>
              <div className="space-y-2">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      className={`input input-bordered flex-1 ${
                        errors.options ? "input-error" : ""
                      }`}
                      placeholder={`Option ${index + 1}`}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-error"
                      onClick={() => removeOption(index)}
                      disabled={formData.options.length <= 2}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={addOption}
                  disabled={formData.options.length >= 6}
                >
                  + Add Option
                </button>
              </div>
            </div>
          )}

          <div className="form-control">
            <label className="label">
              <span className="label-text">Correct Answer</span>
            </label>{" "}
            <br />
            {formData.type === "multiple_choice" ? (
              <select
                name="correctAnswer"
                value={formData.correctAnswer}
                onChange={handleChange}
                className={`select select-bordered ${
                  errors.correctAnswer ? "select-error" : ""
                }`}
                required
              >
                <option value="">Select correct answer</option>
                {formData.options.map((option, index) => (
                  <option key={index} value={option}>
                    {String.fromCharCode(65 + index)}. {option}
                  </option>
                ))}
              </select>
            ) : formData.type === "true_false" ? (
              <select
                name="correctAnswer"
                value={formData.correctAnswer}
                onChange={handleChange}
                className={`select select-bordered ${
                  errors.correctAnswer ? "select-error" : ""
                }`}
                required
              >
                <option value="">Select correct answer</option>
                <option value="True">True</option>
                <option value="False">False</option>
              </select>
            ) : (
              <input
                type="text"
                name="correctAnswer"
                value={formData.correctAnswer}
                onChange={handleChange}
                className={`input input-bordered ${
                  errors.correctAnswer ? "input-error" : ""
                }`}
                placeholder="Enter correct answer"
                required
              />
            )}
            {errors.correctAnswer && (
              <span className="text-error text-sm">{errors.correctAnswer}</span>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Explanation (Optional)</span>
            </label>
            <textarea
              name="explanation"
              value={formData.explanation}
              onChange={handleChange}
              className="textarea textarea-bordered h-20"
              placeholder="Explain why this answer is correct..."
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
                  Creating...
                </>
              ) : (
                "Create Question"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualQuestionForm;
