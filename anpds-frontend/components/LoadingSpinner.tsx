import React from "react";

interface LoadingSpinnerProps {
  overlay?: boolean; 
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ overlay = true }) => {
  return (
    <div
      className={`${
        overlay
          ? "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          : "flex items-center justify-center"
      }`}
    >
      <div className="flex flex-col items-center space-y-2">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white"></div>
        <p className="text-white text-lg font-semibold">Loading</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
