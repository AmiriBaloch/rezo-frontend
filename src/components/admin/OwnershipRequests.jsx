"use client";
import React from 'react';
import {
  useGetAllOwnershipRequestsQuery,
  useApproveOwnershipRequestMutation,
  useRejectOwnershipRequestMutation,
} from '@/features/propertyOwner/ownershipApiSlice';

export default function OwnershipRequests() {
  const { data: requests, isLoading, refetch, error } = useGetAllOwnershipRequestsQuery();
  const [approveRequest, { isLoading: isApproving }] = useApproveOwnershipRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] = useRejectOwnershipRequestMutation();

  // Debug logging
  console.log('🔍 OwnershipRequests Debug:', {
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
      console.log('Approve request successful:', result);
      refetch();
    } catch (error) {
      console.error('Failed to approve request:', error);
      
      // Provide better error information
      let errorMessage = 'Failed to approve request';
      
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
      console.log('Reject request successful:', result);
      refetch();
    } catch (error) {
      console.error('Failed to reject request:', error);
      
      // Provide better error information
      let errorMessage = 'Failed to reject request';
      
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.error) {
        errorMessage = error.error;
      } else if (error?.status) {
        if (error.status === 500) {
          errorMessage = 'Database constraint error: User already has a rejected request. Please check the database.';
        } else {
          errorMessage = `Request failed with status: ${error.status}`;
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      // Show detailed error in console for debugging
      console.error('Detailed error object:', {
        error,
        status: error?.status,
        data: error?.data,
        message: error?.message
      });
      
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading ownership requests...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Ownership Requests</h1>
            <p className="text-gray-600 mt-1">Manage user requests for property ownership</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests?.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {request.user?.profile?.firstName?.charAt(0) || 
                               request.user?.email?.charAt(0) || 'U'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {request.user?.profile?.firstName} {request.user?.profile?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {request.user?.profile?.phone || 'No phone'}
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
            
            {(!requests || requests.length === 0) && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No ownership requests found</div>
                <div className="text-gray-400 text-sm mt-1">Users will appear here when they request ownership</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 