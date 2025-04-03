"use client";

import React, { useState } from "react";

const ProfileModal = ({ isOpen, onClose, user }) => {
  const [editable, setEditable] = useState(false);
  const [fullName, setFullName] = useState(user.fullName);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function updateEmployee() {
    try {
      const response = await fetch('/api/CRUD', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'email': user.email,
          'parameter': 'update',
          'data': JSON.stringify({ fullName })
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Update failed');
      }

      setFullName(result.data.fullName);
      setSuccess(result.message);
      setError(null);
      setEditable(false);

      // Close modal and notify parent to refresh data
      // We add a small delay to show the success message before closing
      setTimeout(() => {
        onClose(true); // Pass true to indicate data was updated and refresh is needed
      }, 1000);

    } catch (err) {
      setError(err.message);
      setSuccess(null);
      setTimeout(() => setError(null), 3000);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full transform transition-all">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          User Profile
        </h2>

        {success && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex justify-center">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={`${user.fullName}'s profile`}
                className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-lg border-2 border-indigo-500">
                No Image
              </div>
            )}
          </div>

          <div className="bg-indigo-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Full Name:</p>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`text-indigo-700 font-medium w-full bg-transparent border-b-2 focus:outline-none transition-colors duration-200 ${
                editable ? "border-indigo-500" : "border-transparent"
              }`}
              readOnly={!editable}
            />

            <p className="text-sm text-gray-500 mt-2">Email:</p>
            <p className="text-indigo-700 font-medium break-words">{user.email}</p>

            <p className="text-sm text-gray-500 mt-2">Employee ID:</p>
            <p className="text-indigo-700 font-medium">{user.employeeId || "Not assigned"}</p>

            <p className="text-sm text-gray-500 mt-2">Department:</p>
            <p className="text-indigo-700 font-medium">{user.department || "Not assigned"}</p>

            <p className="text-sm text-gray-500 mt-2">Role:</p>
            <p className="text-indigo-700 font-medium">{user.role || "Not assigned"}</p>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => {
              setEditable(!editable);
              if (editable) setFullName(user.fullName);
            }}
            className="py-2 px-4 rounded-lg text-white font-semibold bg-yellow-500 hover:bg-yellow-600 transition-colors duration-200"
          >
            {editable ? "Cancel" : "Edit"}
          </button>

          {editable && (
            <button
              onClick={updateEmployee}
              className="py-2 px-4 rounded-lg text-white font-semibold bg-green-600 hover:bg-green-700 transition-colors duration-200"
            >
              Update
            </button>
          )}

          <button
            onClick={() => onClose(false)} // Pass false since we're just closing without updates
            className="py-2 px-4 rounded-lg text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;