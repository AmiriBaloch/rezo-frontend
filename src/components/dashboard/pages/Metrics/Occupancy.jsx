"use client";
import { useState } from 'react';

function Occupancy() {
  // Sample data
  const propertiesData = [
    { id: 1, name: '3321 Clear-view Court', occupancy: '30%' },
    { id: 2, name: '4521 Sunny-side Avenue', occupancy: '45%' },
    { id: 3, name: '7890 Mountain-view Drive', occupancy: '60%' },
    { id: 4, name: '1234 Ocean-front Lane', occupancy: '25%' },
    { id: 5, name: '5678 Forest-hill Road', occupancy: '75%' },
    { id: 6, name: '9012 Valley-stream Boulevard', occupancy: '50%' },
    { id: 7, name: '3456 Lake-shore Drive', occupancy: '80%' },
    { id: 8, name: '7891 Hill-top View', occupancy: '35%' },
    { id: 9, name: '2345 River-side Avenue', occupancy: '65%' },
    { id: 10, name: '6789 Park-view Terrace', occupancy: '40%' },
    { id: 11, name: '1235 Meadow-brook Lane', occupancy: '55%' },
    { id: 12, name: '5679 Sunset-boulevard', occupancy: '70%' },
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Calculate pagination values
  const totalItems = propertiesData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = propertiesData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxVisibleBeforeCurrent = Math.floor(maxVisiblePages / 2);
      const maxVisibleAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;

      if (currentPage <= maxVisibleBeforeCurrent) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + maxVisibleAfterCurrent >= totalPages) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - maxVisibleBeforeCurrent;
        endPage = currentPage + maxVisibleAfterCurrent;
      }
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="w-full h-[90%] flex flex-col gap-[20px] p-4 md:p-6">
      <h1 className="text-[24px] md:text-[28px] font-semibold">Occupancy</h1>

      <div className="w-full bg-white py-[20px] md:py-[30px] px-[20px] md:px-[40px] rounded-lg shadow-sm">
        <h1 className="text-[20px] md:text-[24px] font-semibold">Properties</h1>

        <div className="w-full flex flex-col gap-[20px] mt-[20px]">
          <div className="flex justify-between items-center border-b-[1px] border-[#EEEEEE] py-[15px] md:py-[20px]">
            <h3 className="text-[12px] md:text-[14px] text-[#16457E] font-semibold">Name</h3>
            <h3 className="text-[12px] md:text-[14px] text-[#16457E] font-semibold">Occupancy</h3>
          </div>

          {currentItems.map((property) => (
            <div key={property.id} className="flex justify-between items-center border-b-[1px] border-[#EEEEEE] py-[15px] md:py-[20px]">
              <h3 className="text-[12px] md:text-[14px] text-[#292D32] font-normal">{property.name}</h3>
              <h3 className="text-[12px] md:text-[14px] text-[#292D32] font-normal">{property.occupancy}</h3>
            </div>
          ))}

          <div className="w-full bg-white flex flex-col md:flex-row justify-between items-center gap-4 py-[12px] px-[16px] md:px-[24px] rounded-[5px] shadow-[0px_0px_4.7px_0px_#0000004D] mt-4">
            <h3 className="text-[12px] md:text-[14px] text-[#B5B7C0] font-normal">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} entries
            </h3>

            <div className="flex items-center justify-center gap-[8px] md:gap-[10px]">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] flex items-center justify-center rounded-[5px] text-[12px] md:text-[14px] font-medium text-[#667085] disabled:opacity-50 hover:bg-[#F4F4F4]"
              >
                &lt;
              </button>

              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                  className={`w-[30px] h-[30px] md:w-[40px] md:h-[40px] flex items-center justify-center rounded-[5px] text-[12px] md:text-[14px] font-medium ${page === currentPage
                      ? 'bg-[#16457E] text-white'
                      : 'text-[#667085] hover:bg-[#F4F4F4]'
                    }`}
                  disabled={page === '...'}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] flex items-center justify-center rounded-[5px] text-[12px] md:text-[14px] font-medium text-[#667085] disabled:opacity-50 hover:bg-[#F4F4F4]"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Occupancy;