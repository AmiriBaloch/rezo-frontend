"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaSearch,
  FaFilter,
  FaHome,
  FaBuilding,
  FaBriefcase,
  FaHotel,
} from "react-icons/fa";

export default function HeroSection() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("buy");
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const propertyOptions = {
    buy: [
      { value: "house", label: "House" },
      { value: "villa", label: "Villa" },
      { value: "office", label: "Office" },
      { value: "apartment", label: "Apartment" },
    ],
    rent: [
      { value: "house", label: "House" },
      { value: "apartment", label: "Apartment" },
      { value: "condo", label: "Condo" },
      { value: "studio", label: "Studio" },
    ],
  };

  const propertyCategories = {
    buy: [
      { icon: FaHome, label: "Houses", value: "house" },
      { icon: FaBuilding, label: "Villa", value: "villa" },
      { icon: FaBriefcase, label: "Office", value: "office" },
      { icon: FaHotel, label: "Apartments", value: "apartment" },
    ],
    rent: [
      { icon: FaHome, label: "Houses", value: "house" },
      { icon: FaHotel, label: "Apartments", value: "apartment" },
      { icon: FaBuilding, label: "Condos", value: "condo" },
      { icon: FaHotel, label: "Studios", value: "studio" },
    ],
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPropertyType("");
  };

  const handlePropertyCategory = (category) => {
    setPropertyType(category);
  };

  const handleSearch = () => {
    const params = new URLSearchParams({
      type: activeTab,
      propertyType,
      location,
      searchKeyword,
    });

    router.push(`/search-results?${params.toString()}`);
  };

  return (
    <div className="relative h-[90vh] min-h-[600px] bg-[url('/bg.jpg')] bg-cover bg-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-10"></div>

      {/* Content Container */}
      <div className="relative flex flex-col md:flex-row items-center justify-center h-full text-white px-4 md:px-6 lg:w-3/4 gap-6 md:gap-8 mx-auto py-16">
        {/* Left Text */}
        <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Find Your Perfect Property with Us
          </h1>
          <p className="text-sm md:text-base mt-4 max-w-lg mx-auto md:mx-0">
            Discover Your Dream Property with Us – Where Perfect Meets Possible in Every Home.
          </p>
        </div>

        {/* Right Search Card */}
        <div className="w-full md:w-1/2">
          {/* Rent/Buy Tabs */}
          <div className="flex max-w-md mx-auto md:mx-0">
            <button
              className={`py-2 px-6 text-sm font-semibold transition-all rounded-tl-lg ${
                activeTab === "rent"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => handleTabChange("rent")}
            >
              Rent
            </button>
            <button
              className={`py-2 px-6 text-sm font-semibold transition-all rounded-tr-lg ${
                activeTab === "buy"
                  ? "bg-secondary text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => handleTabChange("buy")}
            >
              Buy
            </button>
          </div>

          {/* Search Box */}
          <div className="bg-white p-4 sm:p-6 rounded-r-2xl rounded-bl-2xl shadow-lg max-w-md mx-auto md:mx-0">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Type keyword..."
                className="w-full p-3 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />

              <select
                className="w-full p-3 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="">Property type</option>
                {propertyOptions[activeTab].map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                className="w-full p-3 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="">Location</option>
                <option value="newyork">New York</option>
                <option value="losangeles">Los Angeles</option>
                <option value="chicago">Chicago</option>
                <option value="miami">Miami</option>
              </select>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  className="flex-1 bg-secondary text-white py-3 rounded-md flex items-center justify-center gap-2 transition"
                  onClick={() => console.log("Filters clicked")}
                >
                  <FaFilter /> Filters
                </button>
                <button
                  className="flex-1 bg-primary text-white py-3 rounded-md flex items-center justify-center gap-2 transition"
                  onClick={handleSearch}
                >
                  <FaSearch /> Search Now
                </button>
              </div>
            </div>
          </div>

          {/* Property Quick Category Buttons */}
          <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-2 text-white text-sm">
            {propertyCategories[activeTab].map((item, index) => (
              <button
                key={index}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition ${
                  propertyType === item.value
                    ? "bg-primary"
                    : "bg-secondary hover:bg-hoversecondary"
                }`}
                onClick={() => handlePropertyCategory(item.value)}
              >
                <item.icon className="text-xs" /> {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
