"use client";

import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaTimes, FaStar, FaUpload } from 'react-icons/fa';
import { 
  useGetBuilderProfileQuery, 
  useCreateBuilderProfileMutation, 
  useUpdateBuilderProfileMutation 
} from '../../../../features/builder/builderApiSlice';

const BuilderProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    licenseNumber: '',
    experience: '',
    specialization: [],
    portfolio: []
  });

  const { data: profile, isLoading, error } = useGetBuilderProfileQuery();
  const [createProfile, { isLoading: isCreating }] = useCreateBuilderProfileMutation();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateBuilderProfileMutation();

  useEffect(() => {
    if (profile?.data) {
      setFormData({
        companyName: profile.data.companyName || '',
        licenseNumber: profile.data.licenseNumber || '',
        experience: profile.data.experience?.toString() || '',
        specialization: profile.data.specialization || [],
        portfolio: profile.data.portfolio || []
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecializationChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setFormData(prev => ({
        ...prev,
        specialization: [...prev.specialization, value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        specialization: prev.specialization.filter(item => item !== value)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (profile?.data) {
        await updateProfile(formData).unwrap();
      } else {
        await createProfile(formData).unwrap();
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleCancel = () => {
    if (profile?.data) {
      setFormData({
        companyName: profile.data.companyName || '',
        licenseNumber: profile.data.licenseNumber || '',
        experience: profile.data.experience?.toString() || '',
        specialization: profile.data.specialization || [],
        portfolio: profile.data.portfolio || []
      });
    } else {
      setFormData({
        companyName: '',
        licenseNumber: '',
        experience: '',
        specialization: [],
        portfolio: []
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !profile?.data) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error loading profile. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Builder Profile</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaEdit className="mr-2" />
            {profile?.data ? 'Edit Profile' : 'Create Profile'}
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Number *
              </label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience *
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specializations
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['Residential', 'Commercial', 'Industrial', 'Infrastructure', 'Renovation', 'New Construction'].map((spec) => (
                <label key={spec} className="flex items-center">
                  <input
                    type="checkbox"
                    value={spec}
                    checked={formData.specialization.includes(spec)}
                    onChange={handleSpecializationChange}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{spec}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Portfolio Images
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FaUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">Upload portfolio images (coming soon)</p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaTimes className="mr-2 inline" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <FaSave className="mr-2 inline" />
              {isCreating || isUpdating ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {profile?.data ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Company Information</h3>
                  <p className="text-gray-600"><span className="font-medium">Name:</span> {profile.data.companyName}</p>
                  <p className="text-gray-600"><span className="font-medium">License:</span> {profile.data.licenseNumber}</p>
                  <p className="text-gray-600"><span className="font-medium">Experience:</span> {profile.data.experience} years</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.data.specialization?.map((spec) => (
                      <span key={spec} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {profile.data.reviews && profile.data.reviews.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-4">Reviews & Ratings</h3>
                  <div className="space-y-3">
                    {profile.data.reviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            by {review.reviewer?.profile?.firstName || 'Anonymous'}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Profile Created</h3>
              <p className="text-gray-600 mb-4">Create your builder profile to get started with projects.</p>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Profile
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BuilderProfile;
