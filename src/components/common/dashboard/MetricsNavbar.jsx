import { useState, useEffect } from "react";
import PropertyScores from "../Layout/Metrics/PropertyScores";
import MembersRating from "../Layout/Metrics/MembersRating";
import Occupancy from "../Layout/Metrics/Occupancy";
import Tenure from "../Layout/Metrics/Tenure";
import TimetoFlip from "../Layout/Metrics/TimetoFlip";
import PendingRoom from "../Layout/Metrics/PendingRoom";
import Listing from "../Layout/Metrics/Listing";
import Downloads from "../Layout/Metrics/Downloads";

function MetricsNavbar() {
  const [activeComponent, setActiveComponent] = useState("PropertyScore");
  const [isMobile, setIsMobile] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);

  const tabs = [
    { id: "PropertyScore", label: "Property Scores", component: <PropertyScores /> },
    { id: "MembersRating", label: "Members Rating", component: <MembersRating /> },
    { id: "Occupancy", label: "Occupancy", component: <Occupancy /> },
    { id: "Tenure", label: "Tenure", component: <Tenure /> },
    { id: "TimetoFlip", label: "Time to Flip", component: <TimetoFlip /> },
    { id: "PendingRooms", label: "Pending Rooms", component: <PendingRoom /> },
    { id: "Listing", label: "Listing", component: <Listing /> },
    { id: "Download", label: "Download", component: <Downloads /> },
  ];

  // Check if mobile and if scrolling is needed
  useEffect(() => {
    const checkMobileAndScroll = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);

      if (isMobileView) {
        const tabsContainer = document.querySelector('.tabs-container');
        setShowScrollHint(tabsContainer.scrollWidth > tabsContainer.clientWidth);
      }
    };

    checkMobileAndScroll();
    window.addEventListener('resize', checkMobileAndScroll);
    return () => window.removeEventListener('resize', checkMobileAndScroll);
  }, []);

  return (
    <div className="w-full flex flex-col gap-4 md:gap-6">
      {/* Navigation Tabs with Scroll Hint */}
      <div className="relative">
        <div
          className="tabs-container w-full overflow-x-auto pb-2 px-2 flex gap-2 md:flex-wrap md:justify-center scrollbar-hide"
          style={{ scrollbarWidth: 'none' }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveComponent(tab.id)}
              className={`text-sm md:text-base font-medium rounded-md px-4 py-2 transition-all border shadow-sm flex-shrink-0 ${activeComponent === tab.id
                  ? "bg-red-500 text-white border-red-600 hover:bg-red-600"
                  : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
              aria-current={activeComponent === tab.id ? "page" : undefined}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isMobile && showScrollHint && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="7 10a.5 1 0 0 1 0-2h6a.5 1 0 0 1 0 2H7z" />
              <path fillRule="evenodd" d="10 7a.5 1 0 0 1 1 0v6a.5 1 0 0 1-1 0V7z" />
            </svg>
          </div>
        )}
      </div>

      {/* Active Component */}
      <div className="px-2 sm:px-4 pt-2 sm:pt-4 bg-white rounded-lg shadow-sm">
        {tabs.find(tab => tab.id === activeComponent)?.component}
      </div>
    </div>
  );
}

export default MetricsNavbar;