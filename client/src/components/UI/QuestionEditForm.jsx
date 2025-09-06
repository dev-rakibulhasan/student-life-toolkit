import React, { useState, useEffect } from "react";
import { questionTypes } from "../../Utils";
import useQuestion from "../../hooks/ussQuistion";
import useSubject from "../../hooks/useSubject";

const QuestionEditForm = ({ question, onClose, onUpdate }) => {
  const { updateQuestion } = useQuestion();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { subjects, fetchSubjects } = useSubject();
  const [formData, setFormData] = useState({
    type: "multiple_choice",
    subject: "",
    topic: "",
    difficulty: "medium",
    question: "",
    options: ["", ""],
    correctAnswer: "",
    explanation: "",
  });
  useEffect(() => {
    fetchSubjects();
  }, []);
  useEffect(() => {
    setFormData({
      type: question.type,
      subject: question.subject,
      topic: question.topic,
      difficulty: question.difficulty,
      question: question.question,
      options: question.options || ["", ""],
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || "",
    });
  }, [question, onClose]);

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
    setFormData((prev) => ({ ...prev, options: [...prev.options, ""] }));
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, options: newOptions }));

      // If removed option was the correct answer, clear correctAnswer
      if (formData.correctAnswer === formData.options[index]) {
        setFormData((prev) => ({ ...prev, correctAnswer: "" }));
      }
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

    if (!validateForm()) return;

    setLoading(true);

    // Prepare data for submission
    const submissionData = { ...formData };
    if (submissionData.type !== "multiple_choice") {
      delete submissionData.options;
    }

    const result = await updateQuestion(question._id, submissionData);
    console.log(result);

    setLoading(false);

    if (result.success) {
      onUpdate && onUpdate(result.question);
      onClose();
    } else {
      alert(result.error || "Failed to update question");
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Edit Question</h3>

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

            <div className="form-control">
              <label className="label">
                <span className="label-text">Topic</span>
              </label>
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

            <div className="form-control">
              <label className="label">
                <span className="label-text">Question</span>
              </label>
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
            <div className="form-control">
              <label className="label">
                <span className="label-text">Correct Answer</span>
              </label>
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
                <span className="text-error text-sm">
                  {errors.correctAnswer}
                </span>
              )}
            </div>
          </div>

          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionEditForm;
