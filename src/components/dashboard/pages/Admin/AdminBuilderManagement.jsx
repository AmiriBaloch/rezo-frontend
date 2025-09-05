"use client";

import React, { useState, useEffect } from 'react';
import { FaEye, FaCheck, FaTimes, FaMoneyBillWave, FaDownload } from 'react-icons/fa';

const AdminBuilderManagement = () => {
  const [activeTab, setActiveTab] = useState('builders');
  const [builders, setBuilders] = useState([]);
  const [workSubmissions, setWorkSubmissions] = useState([]);
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch real data from APIs
  const fetchBuilders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/builder/builders', {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setBuilders(data.data?.builders || []);
      } else {
        const errorData = await response.json();
        setError(`Failed to fetch builders: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching builders:', error);
      setError('Network error while fetching builders');
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkSubmissions = async () => {
    try {
      const response = await fetch('/api/admin/builder/work-submissions', {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setWorkSubmissions(data.data?.submissions || []);
      } else {
        const errorData = await response.json();
        setError(`Failed to fetch work submissions: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching work submissions:', error);
      setError('Network error while fetching work submissions');
    }
  };

  const fetchPaymentRequests = async () => {
    try {
      const response = await fetch('/api/admin/builder/payment-requests', {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPaymentRequests(data.data?.paymentRequests || []);
      } else {
        const errorData = await response.json();
        setError(`Failed to fetch payment requests: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching payment requests:', error);
      setError('Network error while fetching payment requests');
    }
  };

  const fetchWithdrawalRequests = async () => {
    try {
      const response = await fetch('/api/admin/builder/withdrawals', {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setWithdrawalRequests(data.data?.withdrawals || []);
      } else {
        const errorData = await response.json();
        setError(`Failed to fetch withdrawal requests: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching withdrawal requests:', error);
      setError('Network error while fetching withdrawal requests');
    }
  };

  useEffect(() => {
    fetchBuilders();
    fetchWorkSubmissions();
    fetchPaymentRequests();
    fetchWithdrawalRequests();
  }, []);

  const tabs = [
    { id: 'builders', label: 'Builders', icon: '👷', count: builders.length },
    { id: 'work-submissions', label: 'Work Submissions', icon: '📋', count: workSubmissions.length },
    { id: 'payment-requests', label: 'Payment Requests', icon: '💰', count: paymentRequests.length },
    { id: 'withdrawals', label: 'Withdrawal Requests', icon: '🏦', count: withdrawalRequests.length }
  ];

  const handleVerifyBuilder = async (builderId) => {
    try {
      setError(null);
      setSuccessMessage(null);
      const response = await fetch(`/api/admin/builder/builders/${builderId}/verify`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ status: 'VERIFIED' })
      });
      if (response.ok) {
        setSuccessMessage('Builder verified successfully!');
        fetchBuilders(); // Refresh data
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await response.json();
        setError(`Failed to verify builder: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error verifying builder:', error);
      setError('Network error while verifying builder');
    }
  };

  const handleRejectBuilder = async (builderId) => {
    try {
      setError(null);
      setSuccessMessage(null);
      const response = await fetch(`/api/admin/builder/builders/${builderId}/verify`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ status: 'REJECTED' })
      });
      if (response.ok) {
        setSuccessMessage('Builder rejected successfully!');
        fetchBuilders(); // Refresh data
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await response.json();
        setError(`Failed to reject builder: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error rejecting builder:', error);
      setError('Network error while rejecting builder');
    }
  };

  const renderBuilders = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Builder Verification</h3>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading builders...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Company</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Experience</th>
                  <th className="text-left py-2">Rating</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {builders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      No builders found
                    </td>
                  </tr>
                ) : (
                  builders.map((builder) => (
                    <tr key={builder.id} className="border-b">
                      <td className="py-2">{builder.user?.profile?.firstName} {builder.user?.profile?.lastName}</td>
                      <td className="py-2">{builder.companyName}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          builder.status === 'VERIFIED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {builder.status}
                        </span>
                      </td>
                      <td className="py-2">{builder.experienceYears} years</td>
                      <td className="py-2">{builder.rating || 'N/A'} ⭐</td>
                      <td className="py-2">
                        {builder.status === 'PENDING' && (
                          <div className="space-x-2">
                            <button 
                              onClick={() => handleVerifyBuilder(builder.id)}
                              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                            >
                              Verify
                            </button>
                                                         <button 
                               onClick={() => handleRejectBuilder(builder.id)}
                               className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                             >
                               Reject
                             </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const handleReviewWorkSubmission = async (submissionId, status) => {
    try {
      setError(null);
      setSuccessMessage(null);
      const response = await fetch(`/api/admin/builder/work-submissions/${submissionId}/review`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        setSuccessMessage(`Work submission ${status.toLowerCase()} successfully!`);
        fetchWorkSubmissions(); // Refresh data
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await response.json();
        setError(`Failed to review work submission: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error reviewing work submission:', error);
      setError('Network error while reviewing work submission');
    }
  };

  const renderWorkSubmissions = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Work Submission Reviews</h3>
        {workSubmissions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No work submissions found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Builder</th>
                  <th className="text-left py-2">Project</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Submitted</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {workSubmissions.map((submission) => (
                  <tr key={submission.id} className="border-b">
                    <td className="py-2">{submission.builder?.user?.profile?.firstName} {submission.builder?.user?.profile?.lastName}</td>
                    <td className="py-2">{submission.project?.name || 'N/A'}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        submission.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                        submission.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {submission.status}
                      </span>
                    </td>
                    <td className="py-2">{new Date(submission.createdAt).toLocaleDateString()}</td>
                    <td className="py-2">
                      <div className="space-x-2">
                        <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                          <FaEye className="inline mr-1" />
                          View
                        </button>
                        {submission.status === 'PENDING' && (
                          <>
                            <button 
                              onClick={() => handleReviewWorkSubmission(submission.id, 'APPROVED')}
                              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                            >
                              <FaCheck className="inline mr-1" />
                              Approve
                            </button>
                            <button 
                              onClick={() => handleReviewWorkSubmission(submission.id, 'REJECTED')}
                              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                            >
                              <FaTimes className="inline mr-1" />
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const handleProcessPaymentRequest = async (requestId, status) => {
    try {
      setError(null);
      setSuccessMessage(null);
      const response = await fetch(`/api/admin/builder/payment-requests/${requestId}/process`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        setSuccessMessage(`Payment request ${status.toLowerCase()} successfully!`);
        fetchPaymentRequests(); // Refresh data
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await response.json();
        setError(`Failed to process payment request: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error processing payment request:', error);
      setError('Network error while processing payment request');
    }
  };

  const renderPaymentRequests = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Payment Request Processing</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Builder</th>
                <th className="text-left py-2">Amount</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Requested</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paymentRequests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No payment requests found
                  </td>
                </tr>
              ) : (
                paymentRequests.map((request) => (
                  <tr key={request.id} className="border-b">
                    <td className="py-2">{request.builder?.user?.profile?.firstName} {request.builder?.user?.profile?.lastName}</td>
                    <td className="py-2">${request.amount}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        request.status === 'PAID' ? 'bg-green-100 text-green-800' : 
                        request.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="py-2">{new Date(request.createdAt).toLocaleDateString()}</td>
                    <td className="py-2">
                      {request.status === 'PENDING' && (
                        <div className="space-x-2">
                          <button 
                            onClick={() => handleProcessPaymentRequest(request.id, 'PAID')}
                            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                          >
                            <FaMoneyBillWave className="inline mr-1" />
                            Process
                          </button>
                          <button 
                            onClick={() => handleProcessPaymentRequest(request.id, 'REJECTED')}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                          >
                            <FaTimes className="inline mr-1" />
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const handleProcessWithdrawalRequest = async (requestId, status) => {
    try {
      setError(null);
      setSuccessMessage(null);
      const response = await fetch(`/api/admin/builder/withdrawals/${requestId}/process`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        setSuccessMessage(`Withdrawal request ${status.toLowerCase()} successfully!`);
        fetchWithdrawalRequests(); // Refresh data
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await response.json();
        setError(`Failed to process withdrawal request: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error processing withdrawal request:', error);
      setError('Network error while processing withdrawal request');
    }
  };

  const renderWithdrawalRequests = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Withdrawal Request Processing</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Builder</th>
                <th className="text-left py-2">Amount</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Requested</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawalRequests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No withdrawal requests found
                  </td>
                </tr>
              ) : (
                withdrawalRequests.map((request) => (
                  <tr key={request.id} className="border-b">
                    <td className="py-2">{request.builder?.user?.profile?.firstName} {request.builder?.user?.profile?.lastName}</td>
                    <td className="py-2">${request.amount}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        request.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                        request.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                        request.status === 'PROCESSED' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="py-2">{new Date(request.requestedAt).toLocaleDateString()}</td>
                    <td className="py-2">
                      {request.status === 'PENDING' && (
                        <div className="space-x-2">
                          <button 
                            onClick={() => handleProcessWithdrawalRequest(request.id, 'APPROVED')}
                            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                          >
                            <FaCheck className="inline mr-1" />
                            Approve
                          </button>
                          <button 
                            onClick={() => handleProcessWithdrawalRequest(request.id, 'REJECTED')}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                          >
                            <FaTimes className="inline mr-1" />
                            Reject
                          </button>
                        </div>
                      )}
                      {request.status === 'APPROVED' && (
                        <button 
                          onClick={() => handleProcessWithdrawalRequest(request.id, 'PROCESSED')}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                        >
                          <FaDownload className="inline mr-1" />
                          Process
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'builders':
        return renderBuilders();
      case 'work-submissions':
        return renderWorkSubmissions();
      case 'payment-requests':
        return renderPaymentRequests();
      case 'withdrawals':
        return renderWithdrawalRequests();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Builder Management</h1>
              <p className="text-gray-600 mt-2">Manage builders, review work, and process payments</p>
            </div>
            <button
              onClick={() => {
                fetchBuilders();
                fetchWorkSubmissions();
                fetchPaymentRequests();
                fetchWithdrawalRequests();
              }}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh All
            </button>
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError(null)}
                  className="inline-flex text-red-400 hover:text-red-600"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminBuilderManagement;
