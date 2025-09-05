"use client";

import { useState, useEffect } from 'react';
import { MdEdit, MdSave, MdCancel, MdAdd, MdDelete } from 'react-icons/md';
import { BiUser, BiBuilding, BiCalendar, BiStar } from 'react-icons/bi';

const BuilderProfile = () => {
  const [profile, setProfile] = useState({
    companyName: '',
    licenseNumber: '',
    experience: 0,
    specialization: [],
    portfolio: [],
    status: 'PENDING'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newSpecialization, setNewSpecialization] = useState('');
  const [newPortfolioUrl, setNewPortfolioUrl] = useState('');

  useEffect(() => {
    fetchBuilderProfile();
  }, []);

  const fetchBuilderProfile = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/builder/profile');
      // const data = await response.json();
      
      // Mock data for now
      setProfile({
        companyName: 'ABC Construction Co.',
        licenseNumber: 'BC123456',
        experience: 8,
        specialization: ['Residential', 'Commercial', 'Renovation'],
        portfolio: [
          'https://example.com/project1.jpg',
          'https://example.com/project2.jpg',
          'https://example.com/project3.jpg'
        ],
        status: 'VERIFIED'
      });
    } catch (error) {
      console.error('Error fetching builder profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/builder/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(profile)
      // });
      
      setIsEditing(false);
      // Show success message
    } catch (error) {
      console.error('Error updating profile:', error);
      // Show error message
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchBuilderProfile(); // Reset to original data
  };

  const addSpecialization = () => {
    if (newSpecialization.trim() && !profile.specialization.includes(newSpecialization.trim())) {
      setProfile({
        ...profile,
        specialization: [...profile.specialization, newSpecialization.trim()]
      });
      setNewSpecialization('');
    }
  };

  const removeSpecialization = (index) => {
    setProfile({
      ...profile,
      specialization: profile.specialization.filter((_, i) => i !== index)
    });
  };

  const addPortfolioUrl = () => {
    if (newPortfolioUrl.trim() && !profile.portfolio.includes(newPortfolioUrl.trim())) {
      setProfile({
        ...profile,
        portfolio: [...profile.portfolio, newPortfolioUrl.trim()]
      });
      setNewPortfolioUrl('');
    }
  };

  const removePortfolioUrl = (index) => {
    setProfile({
      ...profile,
      portfolio: profile.portfolio.filter((_, i) => i !== index)
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'VERIFIED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'SUSPENDED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Builder Profile</h1>
          <p className="text-gray-600">Manage your company information and portfolio</p>
        </div>
        <div className="flex space-x-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <MdEdit className="text-xl" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <MdSave className="text-xl" />
                <span>Save Changes</span>
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <MdCancel className="text-xl" />
                <span>Cancel</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center space-x-2">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(profile.status)}`}>
          {profile.status}
        </span>
        {profile.status === 'PENDING' && (
          <span className="text-sm text-gray-600">Your profile is under review by admin</span>
        )}
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <BiBuilding className="text-xl" />
              <span>Company Information</span>
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={profile.companyName}
                onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Number
              </label>
              <input
                type="text"
                value={profile.licenseNumber}
                onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                value={profile.experience}
                onChange={(e) => setProfile({ ...profile, experience: parseInt(e.target.value) || 0 })}
                disabled={!isEditing}
                min="0"
                max="50"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* Specializations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <BiStar className="text-xl" />
              <span>Specializations</span>
            </h3>
            
            <div className="space-y-2">
              {profile.specialization.map((spec, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {spec}
                  </span>
                  {isEditing && (
                    <button
                      onClick={() => removeSpecialization(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <MdDelete className="text-lg" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isEditing && (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value)}
                  placeholder="Add specialization"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addSpecialization}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <MdAdd className="text-xl" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Portfolio */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Portfolio</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.portfolio.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Portfolio ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                  }}
                />
                {isEditing && (
                  <button
                    onClick={() => removePortfolioUrl(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MdDelete className="text-sm" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="flex space-x-2">
              <input
                type="url"
                value={newPortfolioUrl}
                onChange={(e) => setNewPortfolioUrl(e.target.value)}
                placeholder="Add portfolio image URL"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addPortfolioUrl}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <MdAdd className="text-xl" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuilderProfile;
