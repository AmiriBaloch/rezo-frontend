"use client";
import React, { useState, useEffect } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

function MembersRating() {
  // State for ratings data
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch ratings data
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setLoading(true);
        
        // Simulate API call - replace with actual fetch
        // const response = await fetch('/api/member-ratings');
        // const data = await response.json();
        
        // Mock data
        const mockRatings = [
          {
            id: 1,
            date: '10/01/2025',
            agent: {
              name: 'Agent Bumi',
              avatar: 'https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png'
            },
            property: {
              name: 'Northridge Parkway',
              avatar: 'https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png'
            },
            rating: 4.0,
            status: 'Satisfied'
          },
          {
            id: 2,
            date: '09/15/2025',
            agent: {
              name: 'Agent Smith',
              avatar: 'https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png'
            },
            property: {
              name: 'Sunset Boulevard',
              avatar: 'https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png'
            },
            rating: 2.5,
            status: 'Unsatisfied'
          },
          {
            id: 3,
            date: '09/01/2025',
            agent: {
              name: 'Agent Johnson',
              avatar: 'https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png'
            },
            property: {
              name: 'Mountain View',
              avatar: 'https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png'
            },
            rating: 3.8,
            status: 'Satisfied'
          }
        ];
        
        setRatings(mockRatings);
      } catch (err) {
        setError('Failed to load ratings data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRatings();
  }, []);

  // Determine satisfaction icon based on rating
  const getSatisfactionIcon = (rating) => {
    if (rating >= 3) {
      return <FaThumbsUp className="text-green-500 text-2xl md:text-3xl" />;
    } else {
      return <FaThumbsDown className="text-red-500 text-2xl md:text-3xl" />;
    }
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
      <h1 className="text-2xl md:text-3xl font-semibold">Members Rating</h1>

      <div className="w-full bg-white p-5 md:p-8 rounded-lg shadow-sm">
        <h1 className="text-xl md:text-2xl font-semibold">House Rating</h1>
        <p className="text-base md:text-lg font-normal text-gray-600 mb-5">
          Members are asked to rate their house every 14 days.
        </p>

        <div className="w-full flex flex-col gap-4">
          {ratings.map((rating) => (
            <div 
              key={rating.id} 
              className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50 p-4 rounded-lg"
            >
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <p className="text-xs md:text-sm font-normal text-gray-500">
                  Submitted on {rating.date}
                </p>
                
                <div className="flex items-center gap-3">
                  <img
                    src={rating.agent.avatar}
                    alt={rating.agent.name}
                    className="w-8 h-8 md:w-10 md:h-10 border border-blue-500 rounded-full"
                  />
                  <span className="text-sm md:text-base font-normal">
                    {rating.agent.name}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <img
                    src={rating.property.avatar}
                    alt={rating.property.name}
                    className="w-8 h-8 md:w-10 md:h-10 border border-blue-500 rounded-full"
                  />
                  <span className="text-sm md:text-base font-normal">
                    {rating.property.name}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 md:gap-5 self-end md:self-auto">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm md:text-base font-normal">
                    {rating.rating >= 3 ? 'Satisfied' : 'Unsatisfied'}
                  </span>
                  <span className="text-lg md:text-xl font-semibold">
                    {rating.rating.toFixed(1)}
                  </span>
                </div>
                
                <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-white rounded-full border border-gray-200">
                  {getSatisfactionIcon(rating.rating)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MembersRating;