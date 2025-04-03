import Link from "next/link";
import React from "react";

export default function WaitingApproval({ email, name }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:scale-105 duration-300">
        <div className="text-center">
          {/* Animated waiting icon */}
          <div className="relative flex justify-center mb-6">
            <div className="w-16 h-16 border-4 border-indigo-200 rounded-full animate-pulse"></div>
            <div className="absolute top-0 w-16 h-16 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Awaiting Approval
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            Thank you for signing up,{" "}
            <span className="font-semibold text-indigo-600">
              {name || "name"}
            </span>
            !
          </p>

          {/* Email display */}
          <div className="bg-indigo-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">Registered Email:</p>
            <p className="text-indigo-700 font-medium break-words">
              {email || "email"}
            </p>
          </div>

          {/* Additional info */}
          <div className="text-sm text-gray-500 space-y-2">
            <p>Your account is pending approval from your employer.</p>
            <p>
              You will receive an email notification once your account is
              approved.
            </p>
          </div>
        </div>

      <div className="navigation-options flex flex-col gap-4 w-[100%] max-w-xs">
        <Link href="/dashboard/manageProfile">
          <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-600 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0">
            Go to Profile
          </button>
        </Link>
        <Link href="/dashboard/HR">
          <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-600 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0">
            Go to HR Dashboard
          </button>
        </Link>
        <Link href="/dashboard">
          <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-600 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0">
            Go to Dashboard
          </button>
        </Link>
        <Link href="/dashboard/HR/approve">
          <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-600 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0">
            Approve Employee
          </button>
        </Link>
      </div>
    </div>
    </div>

  );
}
