import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const images = [
  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1742&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1678752717095-08cd0bd1d7e7?q=80&w=1740&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1740&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1740&auto=format&fit=crop",
];

const rooms = [
  {
    id: 1,
    name: "Room 1",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w  =1742&auto=format&fit=crop",
    listedSince: "10/01/2025",
    serviceFee: "12%",
    bookingFee: "None",
    status: "Vacant",
    statusColor: "bg-[#22B07D]",
    weeklyDues: "$163"
  },
  {
    id: 2,
    name: "Room 2",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w  =1742&auto=format&fit=crop",
    listedSince: "10/01/2025",
    serviceFee: "12%",
    bookingFee: "None",
    status: "Occupied",
    statusColor: "bg-[#CC4848]",
    weeklyDues: "$163"
  }
];

const propertyFeatures = [
  "Balcony", "Separate Dining", "Courtyard", "Study",
  "Lock Up Garage", "Air conditioning", "Polished Timber Floor",
  "Internal Laundry", "Rumpus Room"
];

const CustomNextArrow = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg hover:bg-gray-200 transition flex items-center justify-center"
      aria-label="Next image"
    >
      <i className="bi bi-arrow-right-circle-fill text-2xl text-[#16457E]"></i>
    </button>
  );
};

const CustomPrevArrow = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute z-10 top-1/2 left-4 transform -translate-y-1/2 bg-white w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg hover:bg-gray-200 transition flex items-center justify-center"
      aria-label="Previous image"
    >
      <i className="bi bi-arrow-left-circle-fill text-2xl text-[#16457E]"></i>
    </button>
  );
};

function Overview() {
  const [activeTab, setActiveTab] = useState("Property Photos");


  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
  };

  const tabs = ["House Manual", "Property Photos", "Renter Photos"];

  return (
    <div className="w-full min-h-screen flex flex-col gap-5 p-4 md:p-6">
      {/* Main Content Area */}
      <div className="w-full flex flex-col lg:flex-row gap-5">
        {/* Image Slider Section */}
        <div className="w-full lg:w-[58%] h-auto relative">
          <div className="relative">
            <Slider {...settings}>
              {images.map((src, index) => (
                <div key={index} className="w-full aspect-video">
                  <img
                    src={src}
                    alt="Property"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </Slider>
          </div>

          {/* Tabs Navigation */}
          <div className="flex items-center justify-center w-full sm:w-3/4 absolute top-4 left-1/2 transform -translate-x-1/2 bg-[#596574] p-2 sm:p-3 shadow-lg rounded-md">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm sm:text-base px-3 sm:px-4 py-1 border-r border-[#16457E] last:border-r-0 ${activeTab === tab
                  ? "text-[#16457E] font-semibold"
                  : "text-white"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Property Details Section */}
        <div className="w-full lg:w-[42%] flex flex-col gap-5 p-4 sm:p-5 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg text-[#596574] font-semibold">Listed Prices</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#596574]">Listed Prices</p>
                <p className="text-sm font-medium">08 March 2017</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#596574]">Advertised Date</p>
                <p className="text-sm font-medium">$450</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#596574]">Source</p>
                <p className="text-sm font-medium">08 March 2017</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-lg text-[#596574] font-semibold">Last Reviewed Expenses</h3>
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#596574]">Date of review</p>
                <p className="text-sm font-medium">08 March 2017</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#596574]">Rent paid (weekly)</p>
                <p className="text-sm font-medium">$450</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#596574]">Electricity charges (quarterly)</p>
                <p className="text-sm font-medium">08 March 2017</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#596574]">Gas charges (quarterly)</p>
                <p className="text-sm font-medium">None</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-lg text-[#596574] font-semibold">Property Features</h3>
            <div className="flex flex-wrap gap-2">
              {propertyFeatures.map((feature, index) => (
                <span
                  key={index}
                  className="text-xs sm:text-sm text-[#596574] py-2 px-3 sm:px-4 bg-[#F6F6F7] rounded"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Section */}
      <div className="w-full flex flex-col gap-4 p-4 sm:p-5 bg-white rounded-lg shadow-sm">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-3 border-b last:border-b-0"
          >
            <div className="flex items-center gap-4">
              <img
                src={room.image}
                alt={room.name}
                className="w-24 sm:w-36 md:w-48 h-20 sm:h-28 object-cover rounded"
              />
              <div className="flex flex-col gap-1 sm:gap-2">
                <h3 className="text-base sm:text-lg font-semibold">{room.name}</h3>
                <p className="text-xs sm:text-sm">
                  Listed since: {room.listedSince}
                </p>
                <p className="text-xs sm:text-sm">
                  On going service fee: {room.serviceFee}
                </p>
                <p className="text-xs sm:text-sm">
                  Booking Fee: {room.bookingFee}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-2 sm:gap-3 w-full sm:w-auto">
              <span className={`text-sm sm:text-base text-white font-medium py-0.5 w-28 text-center rounded ${room.statusColor}`}>
                {room.status}
              </span>
              <p className="text-xs sm:text-sm font-medium">Weekly Dues</p>
              <p className="text-sm sm:text-base font-medium">{room.weeklyDues}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Overview;