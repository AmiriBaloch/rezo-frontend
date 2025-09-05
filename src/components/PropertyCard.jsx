// components/PropertyCard.jsx
import React from "react";
import { useRouter } from "next/navigation";
import { FaBed, FaBath, FaBookmark, FaHeart, FaRegHeart } from "react-icons/fa";
import { MdOutlineSquareFoot, MdLocationOn } from "react-icons/md";

const PropertyCard = ({
  property,
  isFavorite = false,
  onToggleFavorite,
  onCompare,
  onClick,
}) => {
  const router = useRouter();

  const handlePropertyClick = () => {
    if (onClick) {
      onClick(property.id);
    } else {
      // Default navigation to property details page
      router.push(`/properties/${property.id}`);
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full"
      onClick={handlePropertyClick}
    >
      <div className="relative">
        <img
          src={(() => {
            let url = Array.isArray(property.photos) && property.photos.length > 0
              ? (typeof property.photos[0] === 'string'
                  ? property.photos[0]
                  : property.photos[0]?.url)
              : undefined;
            if (!url) return "/bg.jpg";
            // If relative URL, prepend origin
            if (url.startsWith('/')) {
              return (typeof window !== 'undefined' ? window.location.origin : '') + url;
            }
            return url;
          })()}
          onError={e => { e.target.onerror = null; e.target.src = "/bg.jpg"; }}
          alt={property.title}
          className="w-full h-48 sm:h-56 object-cover"
        />
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          {property.featured && (
            <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-r-md shadow-sm">
              Featured
            </span>
          )}
          <span
            className={`${
              property.status === "For Sale" ? "bg-purple-600" : "bg-secondary"
            } text-white text-xs font-semibold px-3 py-1 rounded-r-md shadow-sm`}
          >
            {property.status}
          </span>
        </div>
        <button
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(property.id);
          }}
        >
          {isFavorite ? (
            <FaBookmark className="text-red-500" />
          ) : (
            <FaBookmark className="text-gray-600" />
          )}
        </button>
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 truncate">
          {property.title}
        </h3>
        <p className="text-gray-500 text-sm flex items-center">
          <MdLocationOn className="mr-1 text-gray-600" />
          {property.address}
        </p>
        <p className="text-primary text-xl font-bold mt-3">
          {property.currency} {Number(property.basePrice).toLocaleString()}{" "}
        </p>
        <div className="flex justify-between text-gray-600 text-sm mt-4 border-b pb-4">
          <span className="flex items-center">
            <FaBed className="mr-1" /> {property.roomSpecs} Beds
          </span>
          <span className="flex items-center">
            <FaBath className="mr-1" /> {property.roomSpecs} Baths
          </span>
          <span className="flex items-center">
            <MdOutlineSquareFoot className="mr-1" /> {property.sizeSqft} sqft
          </span>
        </div>
        <div className="flex justify-between items-center pt-3">
          <button
            className="text-primary font-semibold text-sm hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              onCompare(property.id);
            }}
          >
            + Compare
          </button>
          <img
            src={
              property.agentImage ||
              "https://cdn-icons-png.flaticon.com/512/1654/1654220.png"
            }
            alt="Agent"
            className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
          />
          <span className="text-gray-500 text-sm ml-2">
            {(() => {
              const createdDate = new Date(property.createdAt);
              const currentDate = new Date();
              const yearsAgo =
                currentDate.getFullYear() - createdDate.getFullYear();
              return `${yearsAgo} year${yearsAgo !== 1 ? "s" : ""} ago`;
            })()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
