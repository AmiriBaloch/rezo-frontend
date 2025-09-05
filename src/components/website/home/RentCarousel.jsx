import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PropertyCard from "../../PropertyCard";
import { useGetPropertiesByTypeQuery } from "../../../features/properties/propertyApiSlice";

const RentCarousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [savedProperties, setSavedProperties] = useState([]);
  const { data, isLoading, isError } = useGetPropertiesByTypeQuery({ 
    listingType: "RENT", 
    page: 1, 
    limit: 20 
  });
  const properties = Array.isArray(data?.data) ? data.data : [];

  const toggleSaveProperty = (id) => {
    if (savedProperties.includes(id)) {
      setSavedProperties(
        savedProperties.filter((propertyId) => propertyId !== id)
      );
    } else {
      setSavedProperties([...savedProperties, id]);
    }
  };

  const handleCompare = (propertyId) => {
    // Handle compare functionality
    console.log("Compare property:", propertyId);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    beforeChange: (current, next) => setActiveSlide(next),
    appendDots: (dots) => (
      <div>
        <ul className="flex justify-center mt-4"> {dots} </ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        className={`w-6 h-1 mx-1 transition-all duration-300 ${
          activeSlide === i ? "bg-primary" : "bg-gray-300"
        }`}
      ></div>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        },
      },
    ],
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">
            Featured Property for Rent
          </h2>
          <p className="text-gray-500 mt-2">
            Find the best properties in top locations
          </p>
        </div>
        {isLoading ? (
          <p className="text-center text-gray-500">Loading properties...</p>
        ) : isError ? (
          <p className="text-center text-red-500">Failed to load properties</p>
        ) : properties.length === 0 ? (
          <p className="text-center text-red-500">No properties available</p>
        ) : (
          <div className="px-2">
            <Slider {...settings}>
              {properties.map((property) => (
                <div className="px-4" key={property.id}>
                  <PropertyCard
                    key={property.id}
                    property={property}
                    isFavorite={savedProperties.includes(property.id)}
                    onToggleFavorite={toggleSaveProperty}
                    onCompare={handleCompare}
                  />
                </div>
              ))}
            </Slider>
          </div>
        )}
      </div>
    </section>
  );
};

export default RentCarousel;
