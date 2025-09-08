import React, { useState } from "react";

const useDeleteConfModal = () => {
  const [isOpenDeleteConfModal, setisOpenDeleteConfModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [targetItemId, setTargetItemId] = useState(null);
  const openDeleteConfModal = (id) => {
    setisOpenDeleteConfModal(true);
    setTargetItemId(id);
    console.log(id);
  };
  const closeDeleteConfModal = () => {
    setisOpenDeleteConfModal(false);
  };
  return {
    openDeleteConfModal,
    closeDeleteConfModal,
    isOpenDeleteConfModal,
    targetItemId,
    isDeleting,
    setIsDeleting,
  };
};

export default useDeleteConfModal;
