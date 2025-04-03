// components/DeleteModal.js
import React from "react";

const DeleteModal = ({ isOpen, onClose, onConfirm, userName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full transform transition-all">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          Confirm Deletion
        </h2>
        
        <p className="text-gray-600 mb-6 text-center">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-indigo-600">{userName}</span>?
          This action cannot be undone.
        </p>

        <div className="flex justify-center space-x-4">
          {/* Cancel Button */}
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-lg text-gray-700 font-semibold bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
          >
            Cancel
          </button>

          {/* Delete Button */}
          <button
            onClick={onConfirm}
            className="py-2 px-4 rounded-lg text-white font-semibold bg-red-600 hover:bg-red-700 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;