"use client";

import React, { useState, useEffect, useRef } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { user: kindeUser } = useKindeBrowserClient();
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    department: "",
    skills: "",
    description: "",
    profileImage: ""
  });

  // Fetch user data on component mount
  useEffect(() => {
    async function fetchUserData() {
      if (!kindeUser?.email) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/employee/all', {
          method: 'POST',
          headers: {
            'email': kindeUser.email
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await response.json();
        setUser(userData);
        
        // Initialize form data with user data
        setFormData({
          fullName: userData.fullName || kindeUser.given_name + " " + kindeUser.family_name || "",
          department: userData.department || "",
          skills: Array.isArray(userData.skills) 
            ? userData.skills.join(", ") 
            : userData.skills || "",
          description: userData.description || "",
          profileImage: userData.profileImage || kindeUser.picture || ""
        });
      } catch (err) {
        setError("Failed to load profile data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (kindeUser) {
      fetchUserData();
    }
  }, [kindeUser]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle profile image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError("Please upload an image file (PNG, JPG, JPEG)");
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }
    
    setImageUploading(true);
    setError(null);
    
    try {
      // Create form data for upload
      const formData = new FormData();
      formData.append('file', file);
      
      // Send to your server-side API endpoint (corrected URL)
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }
      
      const data = await response.json();
      
      // Set profile image URL from the response
      setFormData(prev => ({
        ...prev,
        profileImage: data.secure_url
      }));
      
      setSuccess("Profile image uploaded successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to upload image. Please try again.");
      console.error("Image upload error:", err);
    } finally {
      setImageUploading(false);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!kindeUser?.email) {
      setError("User email not available. Please sign in again.");
      return;
    }
    
    try {
      // Format skills as an array if needed by your backend
      const dataToSend = {
        ...formData,
        skills: formData.skills.split(",").map(skill => skill.trim()).filter(Boolean),
        profileImage: formData.profileImage // Include profile image URL
      };
      
      const response = await fetch('/api/CRUD', {
        method: 'POST',
        headers: {
          'email': kindeUser.email,
          'parameter': 'update',
          'data': JSON.stringify(dataToSend)
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Update failed');
      }

      // Update local user data
      setUser({
        ...user,
        ...result.data,
      });

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || "Failed to update profile. Please try again.");
      setTimeout(() => setError(null), 3000);
    }
  };

  // Toggle edit mode
  const toggleEdit = () => {
    if (isEditing) {
      // Reset form data when canceling edit
      setFormData({
        fullName: user.fullName || "",
        department: user.department || "",
        skills: Array.isArray(user.skills) 
          ? user.skills.join(", ") 
          : user.skills || "",
        description: user.description || "",
        profileImage: user.profileImage || ""
      });
    }
    setIsEditing(!isEditing);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-indigo-600 font-semibold text-lg">Loading profile...</div>
      </div>
    );
  }

  if (!kindeUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg shadow-md max-w-md w-full">
          <p>You must be signed in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-md max-w-md w-full">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-indigo-600 rounded-t-2xl p-6 text-white">
          <h1 className="text-2xl font-bold text-center">My Profile</h1>
        </div>
        
        {/* Profile content */}
        <div className="bg-white rounded-b-2xl shadow-xl p-6">
          {/* Notification messages */}
          {success && (
            <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-lg">
              {success}
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          {/* Profile header with image */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              {formData.profileImage ? (
                <div className="relative">
                  <img
                    src={formData.profileImage}
                    alt={`${formData.fullName}'s profile`}
                    className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500"
                  />
                  {isEditing && (
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700"
                      title="Change profile picture"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl border-4 border-indigo-500">
                    {formData.fullName?.charAt(0) || kindeUser?.given_name?.charAt(0) || "?"}
                  </div>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700"
                      title="Upload profile picture"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
              
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              
              {/* Loading indicator for image upload */}
              {imageUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800">
              {formData.fullName || kindeUser?.given_name + " " + kindeUser?.family_name || "Employee"}
            </h2>
            <p className="text-gray-500">{kindeUser?.email || ""}</p>
            <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium mt-2">
              ID: {user?.employeeId || "Not assigned"}
            </div>
            {user?.status && (
              <div className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                user.status === "approved" ? "bg-green-100 text-green-700" : 
                user.status === "pending" ? "bg-yellow-100 text-yellow-700" : 
                "bg-gray-100 text-gray-700"
              }`}>
                Status: {user.status}
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Personal Information Section */}
              <div className="bg-indigo-50 rounded-xl p-5 col-span-1 md:col-span-2">
                <h3 className="text-indigo-800 font-semibold text-lg mb-4">Personal Information</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                      required
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{formData.fullName || "Not set"}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Department</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{formData.department || "Not set"}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Skills (comma-separated)</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="e.g. JavaScript, React, NextJS"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(user?.skills) && user.skills.length > 0 ? (
                        user.skills.map((skill, index) => (
                          <span 
                            key={index} 
                            className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">No skills listed</p>
                      )}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Description / Bio</label>
                  {isEditing ? (
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                      placeholder="Tell us about yourself..."
                    ></textarea>
                  ) : (
                    <p className="text-gray-800">
                      {formData.description || "No description available."}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={toggleEdit}
                className="py-2 px-6 rounded-lg text-white font-semibold bg-yellow-500 hover:bg-yellow-600 transition-colors duration-200"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
              
              {isEditing && (
                <button
                  type="submit"
                  className="py-2 px-6 rounded-lg text-white font-semibold bg-green-600 hover:bg-green-700 transition-colors duration-200"
                >
                  Save Changes
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}