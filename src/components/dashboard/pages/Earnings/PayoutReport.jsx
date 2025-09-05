"use client";
import React, { useState, useRef, useEffect } from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function PayoutReport() {
  const payoutData = [
    {
      title: "Annual Income",
      amount: "$86,000",
      change: "16%",
      icon: "bi bi-person",
      color: "text-[#CC4848]",
    },
    {
      title: "Monthly Income",
      amount: "$27,000",
      change: "1%",
      icon: "bi bi-person-check",
      color: "text-[#CC4848]",
    },
    {
      title: "Current Month",
      amount: "$22,000",
      change: "1%",
      icon: "bi bi-tv",
      color: "text-[#CC4848]",
    },
    {
      title: "Payout Accounts",
      amount: "60 Active",
      icon: "bi bi-tv",
      color: "text-[#CC4848]",
    },
  ];

  // Sample data - in a real app, this would come from an API
  const [data, setData] = useState([
    { id: 1, month: "Jan 2025", income: "$59,000", earnings: "$120,000", properties: 14, date: new Date(2025, 0, 1) },
    { id: 2, month: "Feb 2025", income: "$65,000", earnings: "$130,000", properties: 16, date: new Date(2025, 1, 1) },
    { id: 3, month: "Mar 2025", income: "$70,000", earnings: "$140,000", properties: 18, date: new Date(2025, 2, 1) },
    { id: 4, month: "Apr 2025", income: "$75,000", earnings: "$150,000", properties: 20, date: new Date(2025, 3, 1) },
    { id: 5, month: "May 2025", income: "$80,000", earnings: "$160,000", properties: 22, date: new Date(2025, 4, 1) },
    { id: 6, month: "Jun 2025", income: "$85,000", earnings: "$170,000", properties: 24, date: new Date(2025, 5, 1) },
    { id: 7, month: "Jul 2025", income: "$90,000", earnings: "$180,000", properties: 26, date: new Date(2025, 6, 1) },
    { id: 8, month: "Aug 2025", income: "$95,000", earnings: "$190,000", properties: 28, date: new Date(2025, 7, 1) },
    { id: 9, month: "Sep 2025", income: "$100,000", earnings: "$200,000", properties: 30, date: new Date(2025, 8, 1) },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const fromDatepickerRef = useRef(null);
  const toDatepickerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 8;

  // Filter data based on search term and date range
  const filteredData = data.filter(item => {
    const matchesSearch = item.month.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDateRange =
      (!dateRange.from || item.date >= dateRange.from) &&
      (!dateRange.to || item.date <= dateRange.to);
    return matchesSearch && matchesDateRange;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateRange]);

  // In a real app, you would fetch data from the backend here
  const fetchData = async (fromDate, toDate) => {
    setIsLoading(true);
    try {
      // Simulate API call
      // const response = await fetch(`/api/payouts?from=${fromDate}&to=${toDate}`);
      // const data = await response.json();
      // setData(data);

      // For demo, we'll just filter the existing data
      const filtered = data.filter(item => {
        return (!fromDate || item.date >= fromDate) && (!toDate || item.date <= toDate);
      });
      setData(filtered);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateRangeChange = (dates) => {
    const [from, to] = dates;
    setDateRange({ from, to });
    if (from && to) {
      fetchData(from, to);
    }
  };

  const handleDownloadCSV = () => {
    const headers = ["Month", "Income", "Earnings", "Active Properties"];
    const csvContent = [
      headers,
      ...filteredData.map(item => [
        item.month,
        item.income,
        item.earnings,
        item.properties
      ])
    ]
      .map(row => row.join(","))
      .join("\n");

    const dateRangeStr = dateRange.from && dateRange.to
      ? `${dateRange.from.toLocaleDateString()}-${dateRange.to.toLocaleDateString()}`
      : "all-dates";

    const blob = new Blob([csvContent], { type: "text/csv" });
    saveAs(blob, `payout-report-${dateRangeStr}.csv`);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Report title with date range
    let title = "Payout Report";
    if (dateRange.from && dateRange.to) {
      title += ` (${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()})`;
    }

    doc.setFontSize(16);
    doc.text(title, 14, 10);

    // Summary information
    doc.setFontSize(10);
    const totalIncome = filteredData.reduce((sum, item) => {
      return sum + parseInt(item.income.replace(/\D/g, ''), 10);
    }, 0);
    const totalEarnings = filteredData.reduce((sum, item) => {
      return sum + parseInt(item.earnings.replace(/\D/g, ''), 10);
    }, 0);

    doc.text(`Total Income: $${totalIncome.toLocaleString()}`, 14, 20);
    doc.text(`Total Earnings: $${totalEarnings.toLocaleString()}`, 14, 26);
    doc.text(`Properties: ${filteredData.reduce((sum, item) => sum + item.properties, 0)}`, 14, 32);

    // Table data
    autoTable(doc, {
      startY: 40,
      head: [["Month", "Income", "Earnings", "Active Properties"]],
      body: filteredData.map(item => [item.month, item.income, item.earnings, item.properties]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] }
    });

    const dateRangeStr = dateRange.from && dateRange.to
      ? `${dateRange.from.toLocaleDateString()}-${dateRange.to.toLocaleDateString()}`
      : "all-dates";

    doc.save(`payout-report-${dateRangeStr}.pdf`);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 bg-white p-4 rounded-lg shadow-md">
        {payoutData.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-200 rounded-full">
              <i className={`${item.icon} ${item.color} text-2xl`}></i>
            </div>
            <div>
              <h4 className="text-sm text-blue-900 font-semibold">{item.title}</h4>
              <h2 className="text-lg font-medium text-gray-800">{item.amount}</h2>
              {item.change && (
                <h4 className="text-xs text-red-600 font-medium">
                  <i className={`bi bi-arrow-${item.change.includes('-') ? 'down' : 'up'}`}></i>
                  {item.change} <span className="text-gray-700 ml-1">this month</span>
                </h4>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <h4 className="text-2xl font-semibold">
            Payout Report for Period
            {dateRange.from && dateRange.to && (
              <span className="text-lg font-normal ml-2">
                ({dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()})
              </span>
            )}
          </h4>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-3 bg-gray-100 rounded-md py-[8px] px-[15px]">
              <h4 className="text-[12px] font-medium">Date Range</h4>
              <DatePicker
                selectsRange={true}
                startDate={dateRange.from}
                endDate={dateRange.to}
                onChange={handleDateRangeChange}
                placeholderText="Select date range"
                className="bg-transparent text-sm w-48"
                isClearable={true}
              />
              <i className="bi bi-calendar2 text-[#D84E4E] cursor-pointer"></i>
            </div>

            <div className="relative w-full md:w-48">
              <input
                type="text"
                placeholder="Search by month..."
                className="w-full bg-[#EAF3FF] border-[1px] border-[#B5B7C0] rounded-[5px] placeholder:text-[#757575] text-[12px] py-[8px] px-[40px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="bi bi-search text-gray-500 absolute left-3 top-4 translate-y-[-50%] text-sm"></i>
            </div>
          </div>
        </div>

        <div className="w-full bg-white">
          <div className="flex border-b border-gray-400 text-blue-500 text-sm font-semibold">
            {["Month", "Income", "Earnings", "Active Properties", "Action"].map((col, index) => (
              <div key={index} className={`py-3 px-4 ${index === 0 ? 'w-1/5' : index === 3 ? 'w-1/5' : 'w-1/5'}`}>
                {col}
              </div>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : paginatedData.length > 0 ? (
            paginatedData.map((item) => (
              <div key={item.id} className="flex items-center py-2 text-gray-500 border-b border-gray-200">
                <span className="w-1/5 px-4">{item.month}</span>
                <span className="w-1/5 px-4">{item.income}</span>
                <span className="w-1/5 px-4">{item.earnings}</span>
                <span className="w-1/5 px-4">{item.properties}</span>
                <div className="w-1/5 px-4 flex gap-2">
                  <button
                    onClick={handleDownloadCSV}
                    className="flex items-center gap-1 text-white bg-blue-500 px-3 py-1 rounded-lg text-xs"
                    title="Download CSV for this month"
                  >
                    <MdOutlineFileDownload size={14} /> CSV
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-1 text-white bg-blue-500 px-3 py-1 rounded-lg text-xs"
                    title="Download PDF for this month"
                  >
                    <MdOutlineFileDownload size={14} /> PDF
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-4 text-center text-gray-500">No data found for the selected filters</div>
          )}

          {/* Pagination Controls */}
          {filteredData.length > 0 && (
            <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
              <p className="text-gray-600 text-sm">
                Showing {itemsPerPage * (currentPage - 1) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-sm"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 border rounded-md text-sm ${currentPage === page ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PayoutReport;