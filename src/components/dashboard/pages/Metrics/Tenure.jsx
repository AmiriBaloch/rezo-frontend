"use client";
import { useState } from 'react';

function Tenure() {
  // Sample data for tenure by properties
  const propertiesData = [
    { id: 1, address: '3321 Clear-view Court', tenure: 30 },
    { id: 2, address: '4521 Sunny-side Avenue', tenure: 45 },
    { id: 3, address: '7890 Mountain-view Drive', tenure: 60 },
    { id: 4, address: '1234 Ocean-front Lane', tenure: 25 },
    { id: 5, address: '5678 Forest-hill Road', tenure: 75 },
    { id: 6, address: '9012 Valley-stream Boulevard', tenure: 50 },
    { id: 7, address: '3456 Lake-shore Drive', tenure: 80 },
    { id: 8, address: '7891 Hill-top View', tenure: 35 },
    { id: 9, address: '2345 River-side Avenue', tenure: 65 },
    { id: 10, address: '6789 Park-view Terrace', tenure: 40 },
    { id: 11, address: '1235 Meadow-brook Lane', tenure: 55 },
    { id: 12, address: '5679 Sunset-boulevard', tenure: 70 },
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
      <h1 className="text-[24px] md:text-[28px] font-semibold">Tenure</h1>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full md:w-[49%] flex flex-col gap-[10px] rounded-[10px] p-4 md:p-[25px] bg-white">
          <h1 className="text-[20px] md:text-[24px] font-medium">Property Tenure</h1>
          <h1 className="text-[28px] md:text-[32px] font-semibold">1024 days</h1>
          <h1 className="text-[12px] md:text-[14px] font-normal">
            This is, on average how long a member stays within an Owner's Portfolio.
          </h1>
        </div>
        <div className="w-full md:w-[49%] flex flex-col gap-[10px] rounded-[10px] p-4 md:p-[25px] bg-white">
          <h1 className="text-[20px] md:text-[24px] font-medium">Average Property Age</h1>
          <h1 className="text-[28px] md:text-[32px] font-semibold">1061 days</h1>
          <h1 className="text-[12px] md:text-[14px] font-normal">
            This is, on average how long a property listed on our Platform.
          </h1>
        </div>
      </div>

      <div className="w-full bg-white py-[20px] md:py-[30px] px-[20px] md:px-[40px] rounded-lg shadow-sm">
        <h1 className="text-[20px] md:text-[24px] font-semibold">Tenure By Properties</h1>

        <div className="w-full flex flex-col gap-[20px] mt-[20px]">
          <div className="flex justify-between items-center border-b-[1px] border-[#EEEEEE] py-[15px] md:py-[20px]">
            <h3 className="text-[12px] md:text-[14px] text-[#16457E] font-semibold">Address</h3>
            <h3 className="text-[12px] md:text-[14px] text-[#16457E] font-semibold">Average Tenure (Days)</h3>
          </div>

          {currentItems.map((property) => (
            <div key={property.id} className="flex justify-between items-center border-b-[1px] border-[#EEEEEE] py-[15px] md:py-[20px]">
              <h3 className="text-[12px] md:text-[14px] text-[#292D32] font-normal">{property.address}</h3>
              <h3 className="text-[12px] md:text-[14px] text-[#292D32] font-normal">{property.tenure}</h3>
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

export default Tenure;