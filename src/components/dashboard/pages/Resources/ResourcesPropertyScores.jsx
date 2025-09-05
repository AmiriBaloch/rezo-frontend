"use client"; 

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 

function ResourcesPropertyScores() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter(); 

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const mockResources = [
          {
            id: 1,
            title: "Compare Properties",
            description: "Calculate your earnings break down difference between income and costs",
            image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=60",
            buttonText: "Calculate Earnings",
            action: "/compare-properties"
          },
          {
            id: 2,
            title: "Where to buy next?",
            description: "Figure out where to buy your next house and home with this map.",
            image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&auto=format&fit=crop&q=60",
            buttonText: "Explore Maps",
            action: "/property-maps"
          },
          {
            id: 3,
            title: "Requirement",
            description: "Each property has its own requirements before it should be listed.",
            image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=60",
            buttonText: "Read Guidelines",
            action: "/listing-requirements"
          }
        ];

        setResources(mockResources);
      } catch (err) {
        setError('Failed to load resources');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const handleAction = (path) => {
    router.push(path); // ✅ Works in App Router
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="bg-red-100 border border-secondary text-hoversecondary px-4 py-3 rounded w-full max-w-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="font-bold text-xl">
              &times;
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 md:gap-10 p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-semibold">Property Scores</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {resources.map((resource) => (
          <div key={resource.id} className="flex flex-col gap-6 md:gap-8 w-full">
            <div className="flex flex-col gap-4 bg-white rounded-lg shadow-md p-4 h-full">
              <img
                src={resource.image}
                alt={resource.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <h3 className="text-lg md:text-xl font-semibold">{resource.title}</h3>
              <p className="text-sm md:text-base font-light text-gray-600">
                {resource.description}
              </p>
            </div>
            <button
              onClick={() => handleAction(resource.action)}
              className="w-full bg-primary hover:bg-hoverprimary text-white font-medium py-3 md:py-4 px-4 rounded-lg text-sm md:text-base"
            >
              {resource.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResourcesPropertyScores;
