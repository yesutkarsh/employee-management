"use client";
// components/UserApprovalModal.js

import React, { useState } from "react";

const UserApprovalModal = ({ user, isOpen, onClose }) => {
  const [secretKey, setSecretKey] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [status, setStatus] = useState("pending");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleApprove = async () => {
    if (secretKey !== "123") {
      alert("Please enter the secret key");
      return;
    }



    setIsLoading(true);
    const docToInsert = {
      email: user.email,
      fullName: user.fullName,
      employeeId,
      department,
      role,
      status,
    };

    try {

      fetch('/api/employee/pending',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(docToInsert)
      })  
      onClose();
      window.location.href = "/dashboard/HR/approve";
    } catch (error) {
      alert("Error approving user: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          &times;
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Approve User</h1>

        <div className="bg-indigo-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500">Name:</p>
          <p className="text-indigo-700 font-medium">{user.fullName}</p>
          <p className="text-sm text-gray-500 mt-2">Email:</p>
          <p className="text-indigo-700 font-medium break-words">{user.email}</p>
        </div>

        <div className="space-y-4">
          <input type="text" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Enter Employee ID" />
          <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Enter Department" />
          <input type="text" value={role} onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Enter Role" />
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="blocked">Blocked</option>
          </select>
          <input type="password" value={secretKey} onChange={(e) => setSecretKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Enter Secret Key" />
        </div>

        <button onClick={handleApprove} disabled={isLoading}
          className={`mt-6 w-full py-2 px-4 rounded-lg text-white font-semibold ${isLoading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}> {isLoading ? "Processing..." : "Submit Approval"}
        </button>
      </div>
    </div>
  );
};

export default UserApprovalModal;
