"use client";

import { useState, useEffect } from "react";
import { GoDotFill } from "react-icons/go";
import { ImHome } from "react-icons/im";
import { IoBed } from "react-icons/io5";
import { PiBathtubLight } from "react-icons/pi";
import { FaCar } from "react-icons/fa";
import Link from "next/link";

// Move these components to `components/Manage/` or similar location
import Overview from "../pages/Manage/Overview";
import HouseManual from "../pages/Manage/HouseManual";
import Earning from "../pages/Manage/Earning";
import Vehicles from "../pages/Manage/Vehicles";
import Promotions from "../pages/Manage/Promotions";

function ManageNavbar() {
  const [activeComponent, setActiveComponent] = useState("Overview");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const tabs = [
    { name: "Overview", component: <Overview /> },
    { name: "HouseManual", component: <HouseManual /> },
    { name: "Earning", component: <Earning /> },
    { name: "Vehicles", component: <Vehicles /> },
    { name: "Promotions", component: <Promotions /> },
  ];

  const formatTabName = (name) => name.replace(/([A-Z])/g, " $1").trim();

  return (
    <div className="w-full flex flex-col">
      {/* Header */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white rounded-md shadow-md gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full md:w-auto">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg md:text-xl font-medium border-r-2 border-red-500 pr-4">
              77 Sparkes Road
            </h2>
            <h2 className="text-lg md:text-xl font-medium">
              Bray Park QLD 4500
            </h2>
          </div>

          <div className="px-2 text-sm bg-green-500 text-white rounded-md flex items-center w-fit">
            <GoDotFill className="text-xs" />
            <span>8.0</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <Link
            href="/addroom"
            className="bg-blue-500 hover:bg-blue-600 py-2 px-4 text-sm md:text-base text-white rounded-md shadow-sm transition-colors w-full sm:w-auto"
          >
            Add Room
          </Link>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-1 text-sm md:text-base border-r-2 border-red-500 pr-2 sm:pr-3">
              <ImHome className="text-red-500 text-sm" />
              <span>House</span>
            </div>
            <div className="flex items-center gap-1 text-sm md:text-base border-r-2 border-red-500 pr-2 sm:pr-3">
              <IoBed className="text-red-500 text-sm" />
              <span>3 Beds</span>
            </div>
            <div className="flex items-center gap-1 text-sm md:text-base border-r-2 border-red-500 pr-2 sm:pr-3">
              <PiBathtubLight className="text-red-500 text-sm" />
              <span>2 baths</span>
            </div>
            <div className="flex items-center gap-1 text-sm md:text-base">
              <FaCar className="text-red-500 text-sm" />
              <span>0 cars</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="w-full overflow-x-auto">
        <div className="flex gap-2 py-2 px-2 min-w-max md:min-w-0 md:justify-between md:flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveComponent(tab.name)}
              className={`text-xs sm:text-sm md:text-base py-2 w-44 rounded-md shadow-md border transition-all ${
                activeComponent === tab.name
                  ? "border-secondary text-secondary font-semibold bg-red-50"
                  : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {formatTabName(tab.name)}
            </button>
          ))}
        </div>
      </div>

      {/* Active Tab Component */}
      <div className="p-2 sm:p-4">
        {tabs.find((tab) => tab.name === activeComponent)?.component}
      </div>
    </div>
  );
}

export default ManageNavbar;
