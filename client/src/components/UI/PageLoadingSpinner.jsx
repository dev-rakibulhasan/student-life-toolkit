import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const PageLoadingSpinner = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex items-center gap-2 text-lg font-medium text-base-content">
        <LoadingSpinner />
        <span>LOADING...</span>
      </div>
    </div>
  );
};

export default PageLoadingSpinner;
