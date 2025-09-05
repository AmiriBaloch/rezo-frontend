"use client";

import React, { useState } from 'react';
import { FaPlus, FaUpload, FaEye, FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import { 
  useGetWorkSubmissionsQuery, 
  useSubmitWorkMutation 
} from '../../../../features/builder/builderApiSlice';

const BuilderWorkSubmissions = () => {
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [formData, setFormData] = useState({
    projectId: '',
    title: '',
    description: '',
    images: [],
    completionReport: ''
  });

  const { data: submissions, isLoading } = useGetWorkSubmissionsQuery();
  const [submitWork, { isLoading: isSubmitting }] = useSubmitWorkMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitWork(formData).unwrap();
      setFormData({
        projectId: '',
        title: '',
        description: '',
        images: [],
        completionReport: ''
      });
      setShowSubmitForm(false);
    } catch (error) {
      console.error('Error submitting work:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'REVISION_REQUESTED':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <FaClock className="h-4 w-4 text-yellow-600" />;
      case 'APPROVED':
        return <FaCheck className="h-4 w-4 text-green-600" />;
      case 'REJECTED':
        return <FaTimes className="h-4 w-4 text-red-600" />;
      case 'REVISION_REQUESTED':
        return <FaTimes className="h-4 w-4 text-orange-600" />;
      default:
        return <FaClock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Work Submissions</h2>
        <button
          onClick={() => setShowSubmitForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="mr-2" />
          Submit Work
        </button>
      </div>

      {/* Submit Work Form */}
      {showSubmitForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Submit Work for Approval</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project ID *
                </label>
                <input
                  type="text"
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter project ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Foundation completed"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="3"
                placeholder="Describe the work completed..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Completion Report
              </label>
              <textarea
                name="completionReport"
                value={formData.completionReport}
                onChange={handleInputChange}
                rows="4"
                placeholder="Detailed report of work completion..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FaUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">Upload work completion images (coming soon)</p>
                <p className="text-sm text-gray-500 mt-2">Support for multiple image uploads will be added</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowSubmitForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Work'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Work Submissions List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : submissions?.data && submissions.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {submissions.data.map((submission) => (
            <div key={submission.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{submission.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(submission.status)}`}>
                    {submission.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Project:</span> {submission.project?.name || 'N/A'}
                  </p>
                  {submission.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{submission.description}</p>
                  )}
                  {submission.completionReport && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      <span className="font-medium">Report:</span> {submission.completionReport}
                    </p>
                  )}
                </div>

                {submission.images && submission.images.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Images:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {submission.images.slice(0, 4).map((image, index) => (
                        <div key={index} className="bg-gray-100 rounded-lg p-2 text-center">
                          <span className="text-xs text-gray-500">Image {index + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {submission.adminNotes && (
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Admin Notes:</h4>
                    <p className="text-sm text-gray-600">{submission.adminNotes}</p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    {getStatusIcon(submission.status)}
                    <span className="ml-2">
                      {submission.reviewedAt 
                        ? `Reviewed: ${new Date(submission.reviewedAt).toLocaleDateString()}`
                        : `Submitted: ${new Date(submission.submittedAt).toLocaleDateString()}`
                      }
                    </span>
                  </div>
                  <button
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <FaEye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Work Submissions Yet</h3>
          <p className="text-gray-600 mb-4">Submit your first work for approval to get started.</p>
          <button
            onClick={() => setShowSubmitForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Work
          </button>
        </div>
      )}
    </div>
  );
};

export default BuilderWorkSubmissions;
