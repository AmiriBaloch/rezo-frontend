import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Data that could come from backend
const houseData = {
  images: [
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1742&auto=format&fit=crop",
    "https://plus.unsplash.com/premium_photo-1678752717095-08cd0bd1d7e7?q=80&w=1740&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1740&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1740&auto=format&fit=crop",
  ],
  houseRules: [
    "Keep the property clean and tidy at all times.",
    "No loud noises after 10 PM to respect neighbors.",
    "No smoking inside the property",
    "Report any damages or maintenance issues immediately.",
    "Follow the lease agreement regarding guests and pets.",
    "Pay rent on time as per the lease agreement.",
    "Respect shared spaces and maintain good relations with neighbors.",
    "No illegal activities are allowed on the property.",
    "Use appliances and utilities responsibly to avoid damage or waste.",
    "Lock doors and windows when leaving for security.",
    "Dispose of trash properly and follow recycling guidelines."
  ],
  moveInInstructions: "Please contact the property manager to schedule your move-in date. All utilities will be activated prior to your arrival. A walkthrough inspection will be conducted together to document the property's condition.",
  moveOutInstructions: "Provide at least 30 days notice before moving out. The property must be cleaned thoroughly and all personal belongings removed. A final inspection will be conducted to assess any damages.",
  wastePickupInfo: "Trash is collected every Tuesday and Friday morning. Recycling is collected every Wednesday. Please place bins at the curb the night before collection.",
  locks: Array(10).fill({
    room: "Room 1",
    type: "Punch Code Lock",
    code: "64201A"
  })
};

const CustomNextArrow = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white w-[45px] max10:w-[38px] h-[45px] max10:h-[38px] rounded-full shadow-lg hover:bg-gray-200 transition focus:outline-none"
      aria-label="Next image"
    >
      <i className="bi bi-arrow-right-circle-fill text-2xl max10:text-[23px] text-[#16457E]"></i>
    </button>
  );
};

const CustomPrevArrow = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute z-10 top-1/2 left-4 transform -translate-y-1/2 bg-white w-[45px] max10:w-[38px] h-[45px] max10:h-[38px] rounded-full shadow-lg hover:bg-gray-200 transition focus:outline-none"
      aria-label="Previous image"
    >
      <i className="bi bi-arrow-left-circle-fill text-2xl max10:text-[23px] text-[#16457E]"></i>
    </button>
  );
};

const TabMenu = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "manual", label: "House Manual" },
    { id: "property", label: "Property Photos" },
    { id: "renter", label: "Renter Photos" }
  ];

  return (
    <div className="flex items-center justify-between w-full md:w-[70%] absolute top-[5%] left-[50%] transform translate-x-[-50%] bg-[#596574] p-[10px] shadow-[0px 5px 15px 0px #FFC13B17] rounded-[5px]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`text-[14px] ${activeTab === tab.id ? 'text-[#16457E]' : 'text-white'} font-medium pr-[10px] ${tab.id !== tabs[tabs.length - 1].id ? 'border-r-[1px] border-[#16457E]' : ''}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

const CollapsibleSection = ({ title, children, isOpenByDefault = false }) => {
  const [isOpen, setIsOpen] = useState(isOpenByDefault);

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center text-[14px] text-[#5C5C5C] font-medium border-b border-[#D2D2D2] pb-2 focus:outline-none"
      >
        {title}
        <i className={`bi bi-caret-${isOpen ? 'up' : 'down'} text-[20px]`}></i>
      </button>
      {isOpen && (
        <div className="mt-2">
          {children}
        </div>
      )}
    </div>
  );
};

function HouseManual() {
  const [activeTab, setActiveTab] = useState("manual");

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
  };

  return (
    <div className="w-full min-h-[100vh] p-4 flex flex-col gap-5">
      <div className="w-full flex flex-col lg:flex-row gap-5">
        {/* Image Slider Section */}
        <div className="w-full lg:w-[58%] h-[300px] sm:h-[400px] md:h-[500px] lg:h-full relative">
          <Slider {...settings}>
            {houseData.images.map((src, index) => (
              <div className="w-full h-full" key={index}>
                <img
                  src={src}
                  alt={`Property ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </Slider>

          <TabMenu activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* House Rules Section */}
        <div className="w-full lg:w-[41%] h-full p-5 bg-white rounded-[10px] shadow-sm">
          <CollapsibleSection title="House Rules" isOpenByDefault={true}>
            <ul className="flex flex-col gap-2 list-decimal list-inside mt-3">
              {houseData.houseRules.map((rule, index) => (
                <li key={index} className="text-[11px] font-light">
                  {rule}
                </li>
              ))}
            </ul>
          </CollapsibleSection>

          <div className="mt-5 flex flex-col gap-3">
            <CollapsibleSection title="Move-in Instructions">
              <p className="text-[11px] font-light mt-2">
                {houseData.moveInInstructions}
              </p>
            </CollapsibleSection>

            <CollapsibleSection title="Move-Out Instructions">
              <p className="text-[11px] font-light mt-2">
                {houseData.moveOutInstructions}
              </p>
            </CollapsibleSection>

            <CollapsibleSection title="Waste Pickup">
              <p className="text-[11px] font-light mt-2">
                {houseData.wastePickupInfo}
              </p>
            </CollapsibleSection>
          </div>
        </div>
      </div>

      {/* Mechanical Locks Section */}
      <div className="w-full flex flex-col gap-4 p-3">
        <h3 className="text-[15px] font-medium">Mechanical Locks</h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {houseData.locks.map((lock, index) => (
            <div
              key={index}
              className="flex items-center flex-col gap-2 border-[1px] border-[#CC4848] p-3 relative hover:shadow-md transition"
            >
              <button className="absolute top-1 right-1 text-[#16457E] hover:text-[#0d2e57]">
                <i className="bi bi-pencil text-[16px]"></i>
              </button>
              <h4 className="text-[12px] font-medium">{lock.room}</h4>
              <h5 className="text-[10px] font-normal text-center">{lock.type}</h5>
              <h5 className="text-[12px] font-medium">{lock.code}</h5>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HouseManual;