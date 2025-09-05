"use client";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";

function TimetoFlip() {
  // State for all data
  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [averageDays, setAverageDays] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch data from backend (simulated)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Sample data - in a real app, this would come from an API
        const mockChartData = [
          { name: "Jan", value: 10 },
          { name: "Feb", value: 20 },
          { name: "Mar", value: 30 },
          { name: "Apr", value: 40 },
          { name: "May", value: 35 },
          { name: "Jun", value: 50 },
        ];

        const mockTableData = [
          { id: "SB001", address: "123 Main St", rooms: 3, daysInFlip: 2, missedRevenue: 2000 },
          { id: "SB002", address: "456 Oak Ave", rooms: 2, daysInFlip: 5, missedRevenue: 3500 },
          { id: "SB003", address: "789 Pine Rd", rooms: 4, daysInFlip: 1, missedRevenue: 1500 },
          { id: "SB004", address: "101 Elm St", rooms: 3, daysInFlip: 3, missedRevenue: 2500 },
          { id: "SB005", address: "202 Maple Dr", rooms: 2, daysInFlip: 7, missedRevenue: 4200 },
          { id: "SB006", address: "303 Cedar Ln", rooms: 5, daysInFlip: 4, missedRevenue: 3800 },
        ];

        setChartData(mockChartData);
        setTableData(mockTableData);
        setAverageDays(1024); // This would come from your API
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate pagination values
  const totalItems = tableData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[90%] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#16457E]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[90%] flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-full h-[90%] flex flex-col gap-[20px] p-4 md:p-6">
      <h1 className="text-[24px] md:text-[28px] font-semibold">Time to Flip</h1>

      <div className="w-full flex flex-col items-center gap-[10px] rounded-[10px] p-4 md:p-[25px] bg-white shadow-sm">
        <h1 className="text-[18px] md:text-[20px] font-medium">Average Day to Flip</h1>
        <h1 className="text-[28px] md:text-[32px] font-semibold">{averageDays} days</h1>
      </div>

      <div className="flex flex-col gap-[20px] md:gap-[40px] w-full bg-white shadow-[0px_2px_48px_0px_#00000005] rounded-[5px] p-4 md:p-[30px]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-[#282828] font-semibold text-[16px] md:text-[18px]">
            Average Days to Flip
          </h3>
          <div className="text-white font-normal text-[12px] md:text-[14px] py-[5px] px-[15px] md:px-[20px] bg-[#16457E] rounded-[5px] w-fit">
            Average Days to Flip
          </div>
        </div>

        <div className="w-full h-[300px] md:h-[400px] lg:h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                dataKey="value"
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #EEEEEE',
                  borderRadius: '5px',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="none"
                fill="#fefbfb"
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#D84E4E"
                strokeWidth={2}
                dot={{ r: 4, fill: '#D84E4E' }}
                activeDot={{ r: 6, stroke: '#D84E4E', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-lg shadow-sm">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="text-[12px] md:text-[14px] text-white bg-[#16457E]">
              <th className="font-normal p-3 md:p-[20px] text-left">Tickets ID</th>
              <th className="font-normal p-3 md:p-[20px] text-left">Address</th>
              <th className="font-normal p-3 md:p-[20px] text-left">Rooms</th>
              <th className="font-normal p-3 md:p-[20px] text-left">Days in Flip</th>
              <th className="font-normal p-3 md:p-[20px] text-left">Missed Revenue</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr
                key={item.id}
                className={`text-[12px] md:text-[14px] ${index % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]'}`}
              >
                <td className="font-normal p-3 md:p-[20px]">{item.id}</td>
                <td className="font-normal p-3 md:p-[20px]">{item.address}</td>
                <td className="font-normal p-3 md:p-[20px]">{item.rooms}</td>
                <td className="font-normal p-3 md:p-[20px]">{item.daysInFlip}</td>
                <td className="font-medium p-3 md:p-[20px]">
                  <div className="py-[1px] px-[6px] bg-[#FECDCA] text-[#B42318] rounded-[6px] w-fit">
                    ${item.missedRevenue.toLocaleString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="w-full bg-white flex flex-col md:flex-row justify-between items-center gap-4 py-3 px-4 md:py-[12px] md:px-[24px] rounded-b-lg">
            <div className="text-[12px] md:text-[14px] text-[#B5B7C0] font-normal">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} entries
            </div>

            <div className="flex items-center justify-center gap-2 md:gap-[10px]">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 md:w-[40px] md:h-[40px] flex items-center justify-center rounded-[5px] text-[12px] md:text-[14px] font-medium text-[#667085] disabled:opacity-50 hover:bg-[#F4F4F4]"
              >
                &lt;
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 md:w-[40px] md:h-[40px] flex items-center justify-center rounded-[5px] text-[12px] md:text-[14px] font-medium ${page === currentPage
                      ? 'bg-[#16457E] text-white'
                      : 'text-[#667085] hover:bg-[#F4F4F4]'
                    }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 md:w-[40px] md:h-[40px] flex items-center justify-center rounded-[5px] text-[12px] md:text-[14px] font-medium text-[#667085] disabled:opacity-50 hover:bg-[#F4F4F4]"
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TimetoFlip;