import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useInstructor from "../../hooks/useInstructor";
import InstructorForm from "../../components/UI/InstructorForm";
import useDeleteConfModal from "../../hooks/useDeleteConfModel";
import DeleteConfModal from "../../components/UI/DeleteConfModal";

const MyInstructors = () => {
  const { instructors, loading, fetchInstructors, deleteInstructor } =
    useInstructor();
  const [showForm, setShowForm] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const {
    openDeleteConfModal,
    closeDeleteConfModal,
    isOpenDeleteConfModal,
    targetItemId,
    isDeleting,
    setIsDeleting,
  } = useDeleteConfModal();

  useEffect(() => {
    fetchInstructors();
  }, []);

  const handleCreateInstructor = () => {
    setEditingInstructor(null);
    setShowForm(true);
  };

  const handleEditInstructor = (instructor) => {
    setEditingInstructor(instructor);
    setShowForm(true);
  };
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await deleteInstructor(targetItemId);
      if (res.success) {
        toast.success("Instructor deleted successfully.");
      }
      closeDeleteConfModal();
    } catch (e) {
      toast.error("Something went wrong.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingInstructor(null);
    fetchInstructors();
  };

  const filteredInstructors = instructors.filter(
    (instructor) =>
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (instructor.department &&
        instructor.department
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (instructor.email &&
        instructor.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const ContactInfo = ({ instructor }) => {
    if (!instructor.email && !instructor.phone && !instructor.website) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {instructor.email && (
          <a
            href={`mailto:${instructor.email}`}
            className="badge badge-outline badge-info hover:badge-info hover:text-white"
            title="Send email"
          >
            📧 {instructor.email}
          </a>
        )}
        {instructor.phone && (
          <a
            href={`tel:${instructor.phone}`}
            className="badge badge-outline badge-info hover:badge-info hover:text-white"
            title="Call"
          >
            📞 {instructor.phone}
          </a>
        )}
        {instructor.website && (
          <a
            href={instructor.website}
            target="_blank"
            rel="noopener noreferrer"
            className="badge badge-outline badge-info hover:badge-info hover:text-white"
            title="Visit website"
          >
            🌐 Website
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between flex-wrap items-center mb-6">
        <h1 className="text-2xl font-bold">My Instructors</h1>
        <input
          type="text"
          placeholder="Search by name, department, or email..."
          className="input input-bordered"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleCreateInstructor}>
          Add New Instructor
        </button>
      </div>

      {showForm && (
        <InstructorForm
          instructor={editingInstructor}
          onClose={() => setShowForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
          <span className="ml-2">Loading instructors...</span>
        </div>
      ) : filteredInstructors.length === 0 ? (
        <div className="text-center py-8">
          {instructors.length === 0 ? (
            <>
              <p className="text-gray-500 mb-4">
                No instructors found. Add your first instructor to get started!
              </p>
              <button
                className="btn btn-primary"
                onClick={handleCreateInstructor}
              >
                Add First Instructor
              </button>
            </>
          ) : (
            <p className="text-gray-500">
              No instructors match your search criteria.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInstructors.map((instructor) => (
            <div
              key={instructor._id}
              className="card bg-base-100 shadow hover:shadow-lg transition-shadow"
            >
              <div className="card-body">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="card-title text-lg font-semibold">
                    {instructor.name}
                  </h3>
                  <div className="flex gap-1">
                    <button
                      className="btn btn-sm btn-circle btn-outline btn-primary"
                      onClick={() => handleEditInstructor(instructor)}
                      title="Edit"
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
                    <button
                      className="btn btn-sm btn-circle btn-outline btn-error"
                      onClick={() => openDeleteConfModal(instructor._id)}
                      title="Delete"
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

                {instructor.department && (
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Department:</strong> {instructor.department}
                  </p>
                )}

                <ContactInfo instructor={instructor} />

                {instructor.officeHours && (
                  <p className="text-sm mt-3">
                    <strong>Office Hours:</strong> {instructor.officeHours}
                  </p>
                )}

                {instructor.officeLocation && (
                  <p className="text-sm">
                    <strong>Office:</strong> {instructor.officeLocation}
                  </p>
                )}

                {instructor.notes && (
                  <div className="mt-3 p-2 bg-base-200 rounded">
                    <p className="text-sm">
                      <strong>Notes:</strong> {instructor.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <DeleteConfModal
        isOpen={isOpenDeleteConfModal}
        onClose={closeDeleteConfModal}
        onConfirm={handleDelete}
        itemName="instructor"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default MyInstructors;
