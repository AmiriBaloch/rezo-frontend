"use client";
import { useState, useEffect, useRef } from "react";
import ProfileSection from "./ProfileSection";
import Notification from "./Notification";
import PromoCodes from "./PromoCodes";
import BookingSetting from "./BookingSetting";

const tabs = [
  { id: "ProfileSection", label: "Personal Information", component: <ProfileSection /> },
  { id: "Notification", label: "Notifications", component: <Notification /> },
  { id: "PromoCodes", label: "Promo Codes", component: <PromoCodes /> },
  { id: "BookingSetting", label: "Booking Settings", component: <BookingSetting /> },
];

function ProfileNavbar() {
  const [activeComponent, setActiveComponent] = useState("ProfileSection");
  const [showScrollHint, setShowScrollHint] = useState(false);
  const tabsContainerRef = useRef(null);

  // Check if scrolling is needed
  useEffect(() => {
    const checkScroll = () => {
      if (tabsContainerRef.current) {
        const container = tabsContainerRef.current;
        setShowScrollHint(container.scrollWidth > container.clientWidth);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  return (
    <div className="w-full">
      {/* Navigation Tabs with Scroll Container */}
      <div className="relative">
        <div
          ref={tabsContainerRef}
          className="flex gap-2 md:gap-4 lg:gap-6 p-2 md:p-4 bg-white rounded-lg shadow-md overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none' }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveComponent(tab.id)}
              className={`flex-shrink-0 text-sm sm:text-base font-medium py-2 px-3 sm:px-4 md:px-5 rounded-md border transition-all duration-300 whitespace-nowrap ${activeComponent === tab.id
                  ? "bg-primary text-white border-primary shadow-md"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                }`}
              aria-current={activeComponent === tab.id ? "page" : undefined}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scroll hint for mobile */}
        {showScrollHint && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="7 10 a.5 1 0 0 1 0-2 h6 a.5 1 0 0 1 0 2 H7 z" />
              <path fillRule="evenodd" d="10 7 a.5 1 0 0 1 1 0 v6 a.5 1 0 0 1-1 0 V7 z" />
            </svg>
          </div>
        )}
      </div>

      {/* Active Component Section */}
      <div className="p-2 sm:p-4 md:p-6 mt-4 bg-white rounded-lg shadow-sm">
        {tabs.find(tab => tab.id === activeComponent)?.component}
      </div>
    </div>
  );
}

export default ProfileNavbar;