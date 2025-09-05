"use client";
import React, { useState, useEffect } from 'react';

function Listing() {
  // State for property selection and ranking data
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [rankingData, setRankingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch properties and ranking data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Simulate API calls - replace with actual fetch calls
        // const propertiesResponse = await fetch('/api/properties');
        // const rankingResponse = await fetch(`/api/ranking?property=${selectedProperty}`);

        // Mock data
        const mockProperties = [
          { id: '1', name: 'Northridge Parkway' },
          { id: '2', name: 'Sunset Boulevard' },
          { id: '3', name: 'Mountain View Apartments' }
        ];

        const mockRankingData = {
          rating: 'Very Good',
          score: 3.8,
          responses: 8,
          metroAverage: 3.9,
          progressWidth: '80%'
        };

        setProperties(mockProperties);
        setSelectedProperty(mockProperties[0]?.id || '');
        setRankingData(mockRankingData);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedProperty]);

  // Handle property selection change
  const handlePropertyChange = (e) => {
    setSelectedProperty(e.target.value);
  };

  // Rating levels data
  const ratingLevels = [
    { name: 'Poor', color: '#CC4848', width: '19%' },
    { name: 'Fair', color: '#EE8224', width: '19%' },
    { name: 'Good', color: '#FFD400', width: '19%' },
    { name: 'Very Good', color: '#B2FF00', width: '19%' },
    { name: 'Exceptional', color: '#008D36', width: '19%' }
  ];

  if (loading) {
    return (
      <div className="w-full min-h-[90%] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[90%] flex items-center justify-center">
        <div className="bg-red-100 border border-secondary text-secondary px-4 py-3 rounded">
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
      {/* Header with property selection */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-semibold">Listing</h1>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
          <label className="text-base md:text-lg font-medium whitespace-nowrap">Select Property</label>
          <div className="relative w-full md:w-48">
            <select
              value={selectedProperty}
              onChange={handlePropertyChange}
              className="w-full bg-white text-gray-800 text-sm md:text-base p-2 pr-8 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            >
              {properties.map(property => (
                <option key={property.id} value={property.id}>
                  {property.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ranking Section */}
      <div className="flex flex-col gap-5 w-full bg-white p-5 md:p-8 rounded-lg shadow-sm">
        <div className="flex flex-col gap-3">
          <h1 className="text-lg md:text-xl font-semibold">Ranking</h1>
          <p className="text-sm md:text-base font-normal text-gray-600">
            Ranking is based on members House source reviews.
          </p>
        </div>

        <div className="w-full flex flex-col gap-5 mt-5">
          <div className="flex flex-col justify-center items-center gap-6 md:gap-8">
            <div className="flex flex-col justify-center items-center gap-3">
              <h3 className="text-sm md:text-base font-normal">
                The Property Ranking is
              </h3>
              <h1 className="text-2xl md:text-3xl font-semibold">
                {rankingData?.rating || 'Loading...'}
              </h1>
            </div>

            <div className="w-full flex flex-wrap md:flex-nowrap items-center justify-between gap-3 md:gap-0">
              {ratingLevels.map((level, index) => (
                <div
                  key={index}
                  className="w-full md:w-[19%] flex flex-col items-center gap-3 md:gap-4"
                >
                  <div
                    className="w-full h-2 md:h-2.5 rounded-full"
                    style={{ backgroundColor: level.color }}
                  ></div>
                  <h3 className="text-base md:text-lg font-medium">{level.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Score Comparison Section */}
      <div className="flex flex-col md:flex-row justify-between items-stretch gap-5 w-full">
        {/* Property Average */}
        <div className="w-full md:w-[49%] flex flex-col items-center justify-center gap-3 rounded-lg px-5 md:px-6 py-10 md:py-16 bg-gray-100">
          <h3 className="text-sm md:text-base font-normal text-center">
            Your Property's average is
          </h3>
          <h1 className="text-3xl md:text-4xl text-secondary font-semibold">
            {rankingData?.score || '0.0'}
          </h1>
          <div className="w-full h-2.5 bg-white rounded-full">
            <div
              className="h-2.5 bg-blue-800 rounded-full"
              style={{ width: rankingData?.progressWidth || '0%' }}
            ></div>
          </div>
          <h3 className="text-xs md:text-sm font-normal text-center">
            Your Property's average is based on {rankingData?.responses || 0} members response
          </h3>
        </div>

        {/* Metro Area Average */}
        <div className="w-full md:w-[49%] flex flex-col items-center justify-center gap-3 rounded-lg px-5 md:px-6 py-10 md:py-16 bg-gray-100">
          <h3 className="text-sm md:text-base font-normal text-center">
            Metro area average is
          </h3>
          <h1 className="text-3xl md:text-4xl text-secondary font-semibold">
            {rankingData?.metroAverage || '0.0'}
          </h1>
          <div className="w-full h-2.5 bg-white rounded-full">
            <div
              className="h-2.5 bg-blue-800 rounded-full"
              style={{ width: rankingData?.progressWidth || '0%' }}
            ></div>
          </div>
          <h3 className="text-xs md:text-sm font-normal text-center">
            The average age property score across all properties in this metro area.
          </h3>
        </div>
      </div>
    </div>
  );
}

export default Listing;