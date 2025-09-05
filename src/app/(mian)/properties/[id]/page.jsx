"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useGetPropertyByIdQuery } from "../../../../features/properties/propertyApiSlice";
import PropertyDetails from "../../../../components/website/PropertyDetails";

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const { data: property, isLoading, isError, error } = useGetPropertyByIdQuery(id);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading property details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Property Not Found</h2>
            <p className="text-gray-600 mb-4">
              {error?.data?.message || "The property you're looking for doesn't exist or has been removed."}
            </p>
            <button 
              onClick={() => window.history.back()}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-gray-500 text-6xl mb-4">🏠</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Property Data</h2>
            <p className="text-gray-600">Unable to load property information.</p>
          </div>
        </div>
      </div>
    );
  }

  return <PropertyDetails property={property} />;
};

export default PropertyDetailsPage;
