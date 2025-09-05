"use client";
import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function TeamCom() {
  // State for team data and UI
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('people'); // 'people' or 'property'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Fetch team data from backend
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);

        // Simulate API call - replace with actual fetch
        // const response = await fetch(`/api/team?view=${viewMode}&page=${currentPage}`);
        // const data = await response.json();

        // Mock data - in a real app this would come from your API
        const mockTeamMembers = Array.from({ length: 50 }, (_, i) => ({
          id: i + 1,
          name: i % 3 === 0 ? 'Emily Carter' : i % 3 === 1 ? 'Michael Johnson' : 'Sarah Williams',
          email: i % 3 === 0 ? 'emily.carter@emailhub.com' :
            i % 3 === 1 ? 'michael.johnson@emailhub.com' : 'sarah.williams@emailhub.com',
          assignedTo: i % 3 === 0 ? '3321 Clear-view Court' :
            i % 3 === 1 ? '4456 Pine Valley Dr' : '7890 Oak Tree Lane',
          avatar: `https://i.pravatar.cc/150?img=${i % 10 + 1}`
        }));

        setTeamMembers(mockTeamMembers);
      } catch (err) {
        setError('Failed to load team data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [viewMode, currentPage]);

  // Pagination logic
  const totalPages = Math.ceil(teamMembers.length / itemsPerPage);
  const currentMembers = teamMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Generate page numbers with ellipsis for better UX
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
    <div className="w-full min-h-[90%] flex flex-col gap-5 p-4 md:p-6">
      <div className="w-full bg-white rounded-lg shadow-sm p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-xl md:text-2xl font-semibold">Team</h1>

          <div className="flex items-center gap-3 md:gap-5">
            <button
              onClick={() => setViewMode('people')}
              className={`py-2 px-4 md:px-6 rounded-md text-sm md:text-base font-medium transition-colors ${viewMode === 'people'
                ? 'bg-blue-800 text-white'
                : 'bg-transparent text-red-500 border border-red-500'
                }`}
            >
              By People
            </button>
            <button
              onClick={() => setViewMode('property')}
              className={`py-2 px-4 md:px-6 rounded-md text-sm md:text-base font-medium transition-colors ${viewMode === 'property'
                ? 'bg-blue-800 text-white'
                : 'bg-transparent text-red-500 border border-red-500'
                }`}
            >
              By Property
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="text-sm md:text-base text-blue-800 border-b border-gray-200">
                <th className="font-semibold py-3 px-4 md:px-6 text-left">Name</th>
                <th className="font-semibold py-3 px-4 md:px-6 text-left">Email Address</th>
                <th className="font-semibold py-3 px-4 md:px-6 text-left">Assigned to</th>
              </tr>
            </thead>

            <tbody>
              {currentMembers.map((member) => (
                <tr key={member.id} className="text-sm md:text-base text-gray-800 border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 md:px-6 font-medium flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                    />
                    {member.name}
                  </td>
                  <td className="py-4 px-4 md:px-6 font-medium">{member.email}</td>
                  <td className="py-4 px-4 md:px-6 font-medium">{member.assignedTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="w-full bg-white flex flex-col md:flex-row justify-between items-center gap-4 mt-6 py-3 px-4 md:px-6 rounded-md shadow-xs">
          <div className="text-sm text-gray-500">
            Showing data {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, teamMembers.length)} of{' '}
            {teamMembers.length} entries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <FaChevronLeft className="text-gray-600" />
            </button>

            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' ? setCurrentPage(page) : null}
                className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium ${page === currentPage
                  ? 'bg-blue-50 text-blue-800'
                  : 'text-gray-600 hover:bg-gray-50'
                  } ${page === '...' ? 'cursor-default' : 'cursor-pointer'
                  }`}
                disabled={page === '...'}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <FaChevronRight className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamCom;