// components/cards/PropertyCarousel.jsx
import React, { useState, useEffect } from "react";
import PropertyCard from "../../PropertyCard"; 
import { useGetPropertiesByTypeQuery } from "../../../features/properties/propertyApiSlice";

const PropertyCarousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [savedProperties, setSavedProperties] = useState([]);

  const { data, isLoading, isError, refetch } = useGetPropertiesByTypeQuery({ 
    listingType: "SALE", 
    page: 1, 
    limit: 20 
  });
  
  // Refetch data when component mounts to ensure fresh data
  useEffect(() => {
    refetch();
  }, [refetch]);
  
  const properties = Array.isArray(data?.data) ? data.data : [];
  // Deduplicate properties by ID
  const uniqueProperties = properties.filter(
    (prop, idx, arr) => arr.findIndex(p => p.id === prop.id) === idx
  );
  
  // Debug logging
  console.log('PropertyCarousel - Properties loaded:', uniqueProperties.length);
  console.log('PropertyCarousel - Properties:', uniqueProperties.map(p => ({ id: p.id, title: p.title, status: p.status })));

  const toggleSaveProperty = (id) => {
    setSavedProperties((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleCompare = (propertyId) => {
    // Handle compare functionality
    console.log("Compare property:", propertyId);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Discover the latest real estate
          </h2>
          <p className="text-gray-500 mt-2">
            Find the best properties in top locations
          </p>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500">Loading properties...</p>
        ) : isError ? (
          <p className="text-center text-red-500">Failed to load properties</p>
        ) : uniqueProperties.length === 0 ? (
          <p className="text-center text-red-500">No properties available</p>
        ) : (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {uniqueProperties.map((property) => (
              <div className="w-full max-w-xs" key={property.id}>
                <PropertyCard
                  property={property}
                  isFavorite={savedProperties.includes(property.id)}
                  onToggleFavorite={toggleSaveProperty}
                  onCompare={handleCompare}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertyCarousel;
