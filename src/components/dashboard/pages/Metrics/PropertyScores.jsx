"use client";
import React, { useState, useEffect } from 'react';

function PropertyScores() {
  // State for properties data
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Fetch properties data
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);

        // Simulate API call - replace with actual fetch
        // const response = await fetch('/api/properties');
        // const data = await response.json();

        // Mock data
        const mockProperties = Array.from({ length: 20 }, (_, i) => ({
          id: i + 1,
          name: `Property ${i + 1}`,
          image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          memberSatisfaction: (Math.random() * 5).toFixed(1),
          maintenance: (Math.random() * 10).toFixed(1),
          moveInExperience: (Math.random() * 5).toFixed(1),
          paymentExperience: (Math.random() * 5).toFixed(1),
          status: (Math.random() * 10).toFixed(1)
        }));

        setProperties(mockProperties);
      } catch (err) {
        setError('Failed to load properties data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Handle property selection
  const handlePropertySelect = (propertyId) => {
    setSelectedProperties(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  // Handle select all/none
  const handleSelectAll = () => {
    if (selectedProperties.length === currentProperties.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(currentProperties.map(p => p.id));
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(properties.length / itemsPerPage);
  const currentProperties = properties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="w-full min-h-[90%] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[90%] flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button
            onClick={() => setError(null)}
            className="float-right font-bold"
          >
            &times;
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[90%] flex flex-col gap-5 p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl md:text-3xl font-semibold">Property Scores</h1>

      <div className="w-full bg-white rounded-lg overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="text-xs md:text-sm text-gray-500 bg-white">
              <th className="font-medium py-3 px-6">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedProperties.length === currentProperties.length && currentProperties.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 cursor-pointer accent-blue-500"
                  />
                  Name
                </div>
              </th>
              <th className="font-medium py-3 px-6">
                Members Sat <i className="bi bi-question-circle ml-1"></i>
              </th>
              <th className="font-medium py-3 px-6">Maintenance</th>
              <th className="font-medium py-3 px-6">Move-In Exp</th>
              <th className="font-medium py-3 px-6">Payment Ext.</th>
              <th className="font-medium py-3 px-6">
                Status <i className="bi bi-arrow-down ml-1"></i>
              </th>
            </tr>
          </thead>

          <tbody>
            {currentProperties.map((property) => (
              <tr
                key={property.id}
                className="text-sm text-gray-700 odd:bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedProperties.includes(property.id)}
                      onChange={() => handlePropertySelect(property.id)}
                      className="w-4 h-4 cursor-pointer accent-blue-500"
                    />
                    <div className="w-10 h-10 flex-shrink-0">
                      <img
                        src={property.image}
                        alt={property.name}
                        className="w-full h-full object-cover rounded-sm"
                      />
                    </div>
                    <span className="font-medium text-gray-900">
                      {property.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 font-medium">{property.memberSatisfaction}</td>
                <td className="py-4 px-6 font-medium">{property.maintenance}</td>
                <td className="py-4 px-6 font-medium">{property.moveInExperience}</td>
                <td className="py-4 px-6 font-medium">{property.paymentExperience}</td>
                <td className="py-4 px-6">
                  <div className="flex justify-center">
                    <div className={`py-0.5 px-2 rounded-md w-fit flex items-center ${parseFloat(property.status) >= 7
                        ? 'bg-green-50 text-green-700'
                        : parseFloat(property.status) >= 4
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                      <i className={`bi bi-dot text-2xl ${parseFloat(property.status) >= 7
                          ? 'text-green-500'
                          : parseFloat(property.status) >= 4
                            ? 'text-yellow-500'
                            : 'text-red-500'
                        }`}></i>
                      {property.status}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="w-full bg-white flex flex-col md:flex-row justify-between items-center gap-4 py-3 px-6 rounded-lg shadow-sm">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="py-2 px-4 border border-gray-300 flex items-center gap-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className="bi bi-arrow-left"></i>
          Previous
        </button>

        <div className="flex items-center justify-center gap-2">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' ? setCurrentPage(page) : null}
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium ${page === currentPage
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
                } ${page === '...' ? 'cursor-default' : 'cursor-pointer'
                }`}
              disabled={page === '...'}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="py-2 px-4 border border-gray-300 flex items-center gap-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}

export default PropertyScores;