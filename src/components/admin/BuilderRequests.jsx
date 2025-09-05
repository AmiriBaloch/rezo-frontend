"use client";
import React from 'react';
import {
  useGetAllBuilderRequestsQuery,
  useApproveBuilderRequestMutation,
  useRejectBuilderRequestMutation,
} from '@/features/builder/builderApiSlice';

export default function BuilderRequests() {
  const { data: requests, isLoading, refetch, error } = useGetAllBuilderRequestsQuery();
  const [approveRequest, { isLoading: isApproving }] = useApproveBuilderRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] = useRejectBuilderRequestMutation();

  // Debug logging
  console.log('🔍 BuilderRequests Debug:', {
    requests,
    isLoading,
    error,
    requestsLength: requests?.length,
    requestsType: typeof requests,
    requestsKeys: requests ? Object.keys(requests) : null
  });

  const handleApprove = async (id) => {
    try {
      const result = await approveRequest(id).unwrap();
      console.log('Approve builder request successful:', result);
      refetch();
    } catch (error) {
      console.error('Failed to approve builder request:', error);
      
      // Provide better error information
      let errorMessage = 'Failed to approve builder request';
      
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.error) {
        errorMessage = error.error;
      } else if (error?.status) {
        errorMessage = `Request failed with status: ${error.status}`;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      // You can add a toast notification here if you have a toast system
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleReject = async (id) => {
    try {
      const result = await rejectRequest(id).unwrap();
      console.log('Reject builder request successful:', result);
      refetch();
    } catch (error) {
      console.error('Failed to reject builder request:', error);
      
      // Provide better error information
      let errorMessage = 'Failed to reject builder request';
      
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.error) {
        errorMessage = error.error;
      } else if (error?.status) {
        errorMessage = `Request failed with status: ${error.status}`;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      // You can add a toast notification here if you have a toast system
      alert(`Error: ${errorMessage}`);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
        {status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error loading builder requests: {error.message}
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="text-center text-gray-500 p-8">
        <h3 className="text-lg font-medium mb-2">No Builder Requests</h3>
        <p>There are currently no pending builder requests.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Builder Requests</h2>
        <p className="text-sm text-gray-600 mt-1">
          Review and manage builder applications
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applicant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applied Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {request.profile?.firstName?.charAt(0) || request.profile?.lastName?.charAt(0) || 'U'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {request.profile?.firstName} {request.profile?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {request.profile?.phone || 'No phone'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {request.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(request.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(request.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {request.status === 'PENDING' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(request.id)}
                        disabled={isApproving}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
                      >
                        {isApproving ? 'Approving...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        disabled={isRejecting}
                        className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 disabled:opacity-50"
                      >
                        {isRejecting ? 'Rejecting...' : 'Reject'}
                      </button>
                    </div>
                  )}
                  {request.status === 'APPROVED' && (
                    <span className="text-green-600 text-xs">
                      Approved on {new Date(request.approvedAt).toLocaleDateString()}
                    </span>
                  )}
                  {request.status === 'REJECTED' && (
                    <span className="text-red-600 text-xs">
                      Rejected on {new Date(request.rejectedAt).toLocaleDateString()}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
