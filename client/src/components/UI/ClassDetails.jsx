import React from "react";
import { formatTime } from "../../Utils";

const ClassDetails = ({
  showModal,
  selectedClass,
  closeModal,
  handleEdit,
  handleDelete,
}) => {
  return (
    <div>
      {showModal && selectedClass && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Class Details</h3>

            <div
              className="p-4 rounded-lg mb-4"
              style={{
                backgroundColor: `${selectedClass.color}20`,
                borderLeft: `4px solid ${selectedClass.color}`,
              }}
            >
              <h4 className="text-xl font-bold">{selectedClass.subject}</h4>
              <p>
                <strong>Time:</strong> {formatTime(selectedClass.time)}
              </p>
              <p>
                <strong>Day:</strong> {selectedClass.day}
              </p>
              <p>
                <strong>Instructor:</strong> {selectedClass.instructor}
              </p>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-sm btn-outline btn-primary"
                onClick={() => {
                  handleEdit(selectedClass);
                  closeModal();
                }}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-outline btn-error"
                onClick={() => {
                  handleDelete(selectedClass._id);
                  closeModal();
                }}
              >
                Delete
              </button>
              <button
                className="btn btn-sm btn-outline btn-ghost"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassDetails;
