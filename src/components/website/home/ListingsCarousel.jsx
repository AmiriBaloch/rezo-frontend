import { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useGetAllPropertiesQuery } from "../../../features/properties/propertyApiSlice";

export default function ListingsCarousel() {
  const { data, isLoading, isError } = useGetAllPropertiesQuery();
  const sliderRef = useRef(null);

  const properties = data?.data || []; // ✅ Safely extract the actual array

  if (isLoading)
    return (
      <div className="min-h-[350px] bg-gray-100 animate-pulse rounded-xl" />
    );
  if (isError || !Array.isArray(properties))
    return <div className="text-red-500">Failed to load properties.</div>;

  // ✅ Group properties by city and get first photo for each city
  const cityMap = properties.reduce((acc, property) => {
    const city = property.city || "Unknown";
    if (!acc[city]) {
      acc[city] = { count: 0, firstPhoto: null };
    }
    acc[city].count += 1;
    if (!acc[city].firstPhoto && Array.isArray(property.photos) && property.photos[0]) {
      acc[city].firstPhoto = property.photos[0];
    }
    return acc;
  }, {});

  const listings = Object.entries(cityMap).map(([city, data]) => ({
    city,
    count: data.count,
    image: data.firstPhoto || "/images/cities/default.jpg",
  }));

  const CustomPrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute left-0 md:-left-8 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg text-gray-700 hover:bg-primary hover:text-white transition-all duration-300"
      aria-label="Previous slide"
    >
      <FaArrowLeft size={20} />
    </button>
  );

  const CustomNextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute right-0 md:-right-8 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg text-gray-700 hover:bg-primary hover:text-white transition-all duration-300"
      aria-label="Next slide"
    >
      <FaArrowRight size={20} />
    </button>
  );

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 5 } },
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  const handleCityClick = (city) => {
    console.log(`Filtering by city: ${city}`);
    // Add navigation or filter logic here
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Explore our listings
          </h2>
          <p className="text-gray-500 mt-2">
            Find the best properties in top locations
          </p>
        </div>

        {/* Only use a grid layout for city circles, no slider */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-center mt-8">
          {listings.map((listing, index) => (
            <div key={index} className="flex flex-col items-center cursor-pointer group">
              <div className="relative mb-3">
                <img
                  src={listing.image}
                  alt={listing.city}
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white group-hover:border-primary transition-all duration-300 shadow-md"
                  onError={e => { e.target.onerror = null; e.target.src = "/bg.jpg"; }}
                />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base group-hover:text-primary transition-colors">
                {listing.city}
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm">
                {listing.count.toLocaleString()} listings
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6 md:hidden space-x-4">
          <button
            onClick={() => sliderRef.current?.slickPrev()}
            className="bg-white p-2 rounded-full shadow text-gray-700 hover:bg-primary hover:text-white transition-all"
          >
            <FaArrowLeft size={16} />
          </button>
          <button
            onClick={() => sliderRef.current?.slickNext()}
            className="bg-white p-2 rounded-full shadow text-gray-700 hover:bg-primary hover:text-white transition-all"
          >
            <FaArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
