import React from "react";

const DeleteConfModal = ({
  isOpen = false,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  confirmText = "Delete",
  cancelText = "Cancel",
  itemName,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Modal Container */}
      <div className="modal modal-open">
        <div className="modal-box max-w-md">
          {/* Header */}
          <div className="flex items-center mb-4">
            <div className="rounded-full p-2 mr-3 bg-warning bg-opacity-20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold">{title}</h3>
          </div>

          {/* Description */}
          <p className="py-4">
            {`Are you sure you want to delete this ${itemName}? This action cannot be undone.`}
          </p>

          {/* Action Buttons */}
          <div className="modal-action">
            <button
              className={`btn btn-ghost ${isLoading ? "btn-disabled" : ""}`}
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </button>

            <button
              className={`btn btn-error ${isLoading ? "loading" : ""}`}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : confirmText}
            </button>
          </div>
        </div>

        {/* Backdrop click to close */}
        <div className="modal-backdrop" onClick={onClose}></div>
      </div>
    </div>
  );
};

export default DeleteConfModal;
