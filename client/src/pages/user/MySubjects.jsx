import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import SubjectForm from "../../components/UI/SubjectForm";
import useSubject from "../../hooks/useSubject";
import DeleteConfModal from "../../components/UI/DeleteConfModal";
import useDeleteConfModal from "../../hooks/useDeleteConfModel";

const MySubjects = () => {
  const { subjects, loading, fetchSubjects, deleteSubject } = useSubject();
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
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
    fetchSubjects();
  }, []);

  const handleCreateSubject = () => {
    setEditingSubject(null);
    setShowForm(true);
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await deleteSubject(targetItemId);
      if (res.success) {
        toast.success("Subject deleted successfully.");
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
    setEditingSubject(null);
    fetchSubjects();
  };

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (subject.description &&
        subject.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between flex-wrap items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Subjects</h1>
        <input
          type="text"
          placeholder="Search by name or description..."
          className="input input-bordered"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleCreateSubject}>
          Add New Subject
        </button>
      </div>
      {showForm && (
        <SubjectForm
          subject={editingSubject}
          onClose={() => setShowForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
          <span className="ml-2">Loading subjects...</span>
        </div>
      ) : filteredSubjects.length === 0 ? (
        <div className="text-center py-8">
          {subjects.length === 0 ? (
            <>
              <p className="text-gray-500 mb-4">
                No subjects found. Create your first subject to get started!
              </p>
              <button className="btn btn-primary" onClick={handleCreateSubject}>
                Create First Subject
              </button>
            </>
          ) : (
            <p className="text-gray-500">
              No subjects match your search criteria.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubjects.map((subject) => (
            <div key={subject._id} className="card bg-base-100 shadow">
              <div className="card-body">
                <div className="flex items-center justify-between mb-3">
                  <h3
                    className="card-title text-lg font-semibold"
                    style={{ color: subject.color }}
                  >
                    {subject.name}
                  </h3>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: subject.color }}
                  ></div>
                </div>

                {subject.description && (
                  <p className="text-gray-600 mb-4">{subject.description}</p>
                )}

                <div className="card-actions justify-end">
                  <button
                    className="btn btn-sm btn-outline btn-primary"
                    onClick={() => handleEditSubject(subject)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline btn-error"
                    onClick={() => openDeleteConfModal(subject._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <DeleteConfModal
        isOpen={isOpenDeleteConfModal}
        onClose={closeDeleteConfModal}
        onConfirm={handleDelete}
        itemName="subject"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default MySubjects;
