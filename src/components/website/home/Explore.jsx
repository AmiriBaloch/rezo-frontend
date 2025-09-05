import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import { useGetAllPropertyOwnersQuery } from "../../../features/propertyOwner/propertyOwnerApiSlice"; // Removed
import { MdLocationOn } from "react-icons/md";

const Explore = () => {
  // Removed property owner fetching logic

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, slidesToScroll: 3, infinite: true },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, slidesToScroll: 2, infinite: true },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  return (
    <div className="flex mx-auto px-4 py-8 font-secondary">
      {/* Left Image Section */}
      <div className="lg:w-1/2 h-96 lg:h-auto">
        <img
          src="/bg.jpg"
          alt="Explore Your Dream Home"
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Right Content Section */}
      <div className="lg:w-1/2 bg-secondary flex flex-col px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-6 lg:mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
            Explore Your Dream Home or Boost Your Investment Portfolio Today -
            Your Future Awaits!
          </h1>
          <p className="text-gray-700 text-sm sm:text-base mt-3 lg:mt-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio,
            beatae hic.
          </p>
        </div>
        {/* Removed dynamic property owners section, add a placeholder */}
        <p>Discover amazing properties and connect with trusted owners.</p>
      </div>
    </div>
  );
};

export default Explore;
