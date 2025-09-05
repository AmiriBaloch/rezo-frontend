"use client";
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '@/features/auth/authSlice';
import { useGetOwnerCompletedTransactionsQuery } from '@/features/properties/propertyApiSlice';
import { MdOutlineAddHome, MdOutlineAddHomeWork, MdEdit, MdDelete, MdVisibility } from 'react-icons/md';
import { FaRupeeSign } from 'react-icons/fa6';
import Link from 'next/link';

export default function OwnerManageProperties() {
  const userId = useSelector(selectCurrentUserId);
  const [activeTab, setActiveTab] = useState('all');
  const [retryCount, setRetryCount] = useState(0);
  
  const { data: transactionsData, isLoading, error, refetch } = useGetOwnerCompletedTransactionsQuery(userId, {
    skip: !userId,
    // Add retry logic
    retry: (failureCount, error) => {
      if (error?.status === 500 && retryCount < 3) {
        setRetryCount(prev => prev + 1);
        return true;
      }
      return false;
    }
  });

  // Debug logging
  console.log('API Response:', { transactionsData, isLoading, error, userId, retryCount });

  const transactions = transactionsData?.data || [];
  
  // Check if we have any data or if there's an error
  const hasData = transactions && transactions.length > 0;
  const hasError = error && error.message;

  // Handle retry manually
  const handleRetry = () => {
    setRetryCount(0);
    refetch();
  };

  // Filter transactions based on active tab
  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab === 'all') return true;
    if (activeTab === 'sale') return transaction.listingType === 'SALE';
    if (activeTab === 'rent') return transaction.listingType === 'RENT';
    if (activeTab === 'completed') return transaction.status === 'COMPLETED';
    return true;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      'APPROVED': { color: 'bg-green-100 text-green-800', text: 'Approved' },
      'REJECTED': { color: 'bg-red-100 text-red-800', text: 'Rejected' },
      'ARCHIVED': { color: 'bg-gray-100 text-gray-800', text: 'Archived' }
    };
    
    const config = statusConfig[status] || statusConfig['PENDING'];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getListingTypeIcon = (listingType) => {
    return listingType === 'SALE' ? (
      <MdOutlineAddHome className="w-5 h-5 text-blue-600" />
    ) : (
      <MdOutlineAddHomeWork className="w-5 h-5 text-green-600" />
    );
  };

  const getListingTypeBadge = (listingType) => {
    const config = listingType === 'SALE' 
      ? { color: 'bg-blue-100 text-blue-800', text: 'For Sale' }
      : { color: 'bg-green-100 text-green-800', text: 'For Rent' };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">
              {hasError ? `Error loading properties: ${error.message}` : 'Error loading properties'}
            </p>
            <p className="text-sm text-red-600 mt-2">
              {retryCount > 0 && `Retry attempt: ${retryCount}/3`}
            </p>
            <button 
              onClick={handleRetry} 
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
          <p className="text-gray-600 mt-2">View your approved properties for sale and rent</p>
        </div>



        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'all', label: 'All Properties', count: transactions.length },
                { id: 'sale', label: 'For Sale', count: transactions.filter(t => t.listingType === 'SALE').length },
                { id: 'rent', label: 'For Rent', count: transactions.filter(t => t.listingType === 'RENT').length },
                { id: 'completed', label: 'Approved', count: transactions.filter(t => t.status === 'APPROVED').length }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 mb-4">
              <MdOutlineAddHome className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-500 mb-6">
              {activeTab === 'all' 
                ? "You haven't added any properties yet. Start by adding properties for sale or rent."
                : `No properties found in the "${activeTab}" category.`
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                         {getListingTypeIcon(transaction.listingType)}
                         <h3 className="text-xl font-semibold text-gray-900">{transaction.title}</h3>
                         {getListingTypeBadge(transaction.listingType)}
                         <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                           Approved
                         </span>
                       </div>
                      
                                             <p className="text-gray-600 mb-4 line-clamp-2">{transaction.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                 <div className="text-sm">
                           <span className="text-gray-500">Location:</span>
                           <p className="font-medium">{transaction.city}, {transaction.state}</p>
                         </div>
                         <div className="text-sm">
                           <span className="text-gray-500">Price:</span>
                           <p className="font-medium flex items-center">
                             <FaRupeeSign className="w-4 h-4 mr-1" />
                             {transaction.transactionAmount || transaction.basePrice} {transaction.currency}
                           </p>
                         </div>
                         {transaction.propertyType && (
                           <div className="text-sm">
                             <span className="text-gray-500">Type:</span>
                             <p className="font-medium capitalize">{transaction.propertyType}</p>
                           </div>
                         )}
                         <div className="text-sm">
                           <span className="text-gray-500">Last Updated:</span>
                           <p className="font-medium">
                             {transaction.completedAt ? 
                                new Date(transaction.completedAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit'
                                }) : 'N/A'
                              }
                            </p>
                          </div>
                      </div>

                                             {transaction.photos && transaction.photos.length > 0 && (
                         <div className="flex gap-2 mb-4">
                           {transaction.photos.slice(0, 3).map((photo, index) => (
                             <img
                               key={index}
                               src={photo}
                               alt={`Property ${index + 1}`}
                               className="w-16 h-16 object-cover rounded-lg"
                             />
                           ))}
                           {transaction.photos.length > 3 && (
                             <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500">
                               +{transaction.photos.length - 3} more
                             </div>
                           )}
                         </div>
                       )}
                    </div>
                    
                                         <div className="flex flex-col gap-2 ml-4">
                         <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                           <MdVisibility className="w-5 h-5" />
                         </button>
                         <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Edit Property">
                           <MdEdit className="w-5 h-5" />
                         </button>
                       </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
