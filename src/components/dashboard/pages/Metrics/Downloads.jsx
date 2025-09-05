"use client";
import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';

function Downloads() {
  // State for room change history filters
  const [selectedProperty, setSelectedProperty] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // State for occupancy by month
  const [selectedYear, setSelectedYear] = useState('');

  // State for loading and error handling
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for properties data (would come from backend)
  const [properties, setProperties] = useState([]);
  const [years, setYears] = useState([]);

  // Fetch properties and years data (simulating API call)
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Simulate API calls - replace with actual fetch calls
        // const propertiesResponse = await fetch('/api/properties');
        // const yearsResponse = await fetch('/api/years');

        // Mock data
        const mockProperties = [
          { id: '1', name: 'Northridge Parkway' },
          { id: '2', name: 'Sunset Boulevard' }
        ];

        const currentYear = new Date().getFullYear();
        const mockYears = Array.from({ length: 5 }, (_, i) => currentYear - i);

        setProperties(mockProperties);
        setYears(mockYears);
        setSelectedProperty(mockProperties[0]?.id || '');
        setSelectedYear(currentYear.toString());
      } catch (err) {
        setError('Failed to load initial data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Handle CSV download for rooms
  const handleRoomsDownload = async () => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual fetch
      // const response = await fetch('/api/download/rooms');
      // const data = await response.json();

      // Mock CSV data
      const csvContent = [
        ['Room ID', 'Name', 'Current Price', 'Occupancy', 'Days on Market'],
        ['101', 'Deluxe Suite', '$250', '85%', '12'],
        ['102', 'Standard Room', '$180', '92%', '8'],
        ['103', 'Executive Suite', '$350', '78%', '15']
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, 'rooms_report.csv');
    } catch (err) {
      setError('Failed to download rooms data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle CSV download for room change history
  const handleRoomHistoryDownload = async () => {
    if (!selectedProperty) {
      setError('Please select a property');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call with filters - replace with actual fetch
      // const params = new URLSearchParams({
      //   propertyId: selectedProperty,
      //   startDate,
      //   endDate
      // });
      // const response = await fetch(`/api/download/room-history?${params}`);
      // const data = await response.json();

      // Mock CSV data
      const csvContent = [
        ['Date', 'Room', 'Change Type', 'Old Value', 'New Value'],
        ['2023-01-15', '101', 'Price Change', '$230', '$250'],
        ['2023-02-20', '102', 'Status Change', 'Available', 'Occupied'],
        ['2023-03-10', '103', 'Price Change', '$320', '$350']
      ].map(row => row.join(',')).join('\n');

      const fileName = `room_history_${selectedProperty}_${startDate || 'all'}_${endDate || 'all'}.csv`;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, fileName);
    } catch (err) {
      setError('Failed to download room history data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle CSV download for occupancy by month
  const handleOccupancyDownload = async () => {
    if (!selectedYear) {
      setError('Please select a year');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call with year filter - replace with actual fetch
      // const response = await fetch(`/api/download/occupancy?year=${selectedYear}`);
      // const data = await response.json();

      // Mock CSV data
      const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

      const csvContent = [
        ['Month', 'Property', 'Occupancy Rate', 'Average Rate'],
        ...months.map(month => [
          month,
          selectedProperty || 'All Properties',
          `${Math.floor(Math.random() * 30) + 70}%`,
          `$${Math.floor(Math.random() * 100) + 150}`
        ])
      ].map(row => row.join(',')).join('\n');

      const fileName = `occupancy_${selectedYear}.csv`;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, fileName);
    } catch (err) {
      setError('Failed to download occupancy data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[90%] flex flex-col gap-5 p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl md:text-3xl font-semibold">Downloads</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button
            onClick={() => setError(null)}
            className="float-right font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* By Room Section */}
      <div className="flex flex-col gap-5 w-full bg-white p-5 md:p-8 rounded-lg shadow-sm">
        <h1 className="text-lg md:text-xl font-medium">By Room</h1>
        <p className="text-sm md:text-base font-normal text-gray-600">
          Point in time information about each of your room, including the
          current and most recent prices, occupancy lengths, days on market and
          many more.
        </p>
        <button
          onClick={handleRoomsDownload}
          disabled={isLoading}
          className="w-fit flex items-center justify-center ml-auto gap-2 bg-primary hover:bg-blue-700 py-2 px-4 rounded text-sm md:text-base font-medium text-white shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="animate-spin">↻</span>
          ) : (
            <i className="bi bi-arrow-down"></i>
          )}
          Download CSV
        </button>
      </div>

      {/* Room Change History Section */}
      <div className="flex flex-col gap-5 w-full bg-white p-5 md:p-8 rounded-lg shadow-sm">
        <h2 className="text-lg md:text-xl font-medium">Room Change History</h2>
        <p className="text-sm md:text-base font-normal text-gray-600">
          A history of any price or status changes to the rooms in a given
          property.
        </p>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 w-full md:w-auto">
            <label className="text-sm md:text-base font-medium whitespace-nowrap">Property</label>
            <div className="relative w-full md:w-48">
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="w-full bg-white text-gray-800 text-sm md:text-base font-normal border border-gray-300 p-2 pr-8 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              >
                <option value="">Select Property</option>
                {properties.map(property => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 w-full md:w-auto">
            <label className="text-sm md:text-base font-medium whitespace-nowrap">Start Time</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full md:w-48 text-gray-800 text-sm md:text-base font-normal border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 w-full md:w-auto">
            <label className="text-sm md:text-base font-medium whitespace-nowrap">End Time</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full md:w-48 text-gray-800 text-sm md:text-base font-normal border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
              min={startDate}
            />
          </div>

          <button
            onClick={handleRoomHistoryDownload}
            disabled={isLoading || !selectedProperty}
            className="w-full md:w-fit flex items-center justify-center ml-auto gap-2 bg-primary hover:bg-blue-700 py-2 px-4 rounded text-sm md:text-base font-medium text-white shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 md:mt-0"
          >
            {isLoading ? (
              <span className="animate-spin">↻</span>
            ) : (
              <i className="bi bi-arrow-down"></i>
            )}
            Download CSV
          </button>
        </div>
      </div>

      {/* Occupancy by Month Section */}
      <div className="flex flex-col gap-5 w-full bg-white p-5 md:p-8 rounded-lg shadow-sm">
        <h2 className="text-lg md:text-xl font-medium">
          Occupancy by Month for Year
        </h2>
        <p className="text-sm md:text-base font-normal text-gray-600">
          Historical Occupancy by month for each of your properties.
        </p>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 w-full md:w-auto">
            <label className="text-sm md:text-base font-medium whitespace-nowrap">Year</label>
            <div className="relative w-full md:w-48">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-white text-gray-800 text-sm md:text-base font-normal border border-gray-300 p-2 pr-8 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              >
                <option value="">Select Year</option>
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleOccupancyDownload}
            disabled={isLoading || !selectedYear}
            className="w-full md:w-fit flex items-center justify-center ml-auto gap-2 bg-primary hover:bg-blue-700 py-2 px-4 rounded text-sm md:text-base font-medium text-white shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 md:mt-0"
          >
            {isLoading ? (
              <span className="animate-spin">↻</span>
            ) : (
              <i className="bi bi-arrow-down"></i>
            )}
            Download CSV
          </button>
        </div>
      </div>
    </div>
  );
}

export default Downloads;