import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Mock data that would come from backend
const promotionsData = {
  images: [
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1742&auto=format&fit=crop",
    "https://plus.unsplash.com/premium_photo-1678752717095-08cd0bd1d7e7?q=80&w=1740&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1740&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1740&auto=format&fit=crop",
  ],
  promoInfo: {
    description: "Promo codes are valid for a limited time and must be applied at checkout to receive the discount. Only one promo code can be used per transaction, and they cannot be combined with other offers. Promo codes are non-transferable, cannot be exchanged for cash, and are applicable only to eligible properties as specified.",
    roomStats: {
      totalBedrooms: 4,
      occupancies: "4 Bedrooms Occupied",
      promotions: "2 Active Promotions"
    },
    activePromotions: [
      {
        id: 1,
        room: "77 Sparkes Road (Room 5)",
        status: "Vacant",
        discount: "5% off 6 weeks",
        statusColor: "#CC4848",
        bgColor: "#FFF09B"
      },
      {
        id: 2,
        room: "77 Sparkes Road (Room 3)",
        status: "Occupied",
        discount: "10% off 12 weeks",
        statusColor: "#2E7D32",
        bgColor: "#C8E6C9"
      }
    ]
  },
  flyerOptions: [
    { id: 1, name: "Simple (Clean & Modern)", selected: false },
    { id: 2, name: "Friendly (Clean & Modern)", selected: false },
    { id: 3, name: "Bold (Big & Eye Catching)", selected: false }
  ],
  flyerPreview: {
    title: "Furnished, Affordable Rooms for Rent",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ]
  }
};

const CustomNextArrow = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white w-[45px] h-[45px] rounded-full shadow-lg hover:bg-gray-200 transition focus:outline-none"
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
      className="absolute z-10 top-1/2 left-4 transform -translate-y-1/2 bg-white w-[45px] h-[45px] rounded-full shadow-lg hover:bg-gray-200 transition focus:outline-none"
      aria-label="Previous image"
    >
      <i className="bi bi-arrow-left-circle-fill text-2xl text-[#16457E]"></i>
    </button>
  );
};

const TabMenu = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "promo", label: "Promo Code" },
    { id: "property", label: "Property Photos" },
    { id: "renter", label: "Renter Photos" }
  ];

  return (
    <div className="flex items-center justify-between w-full md:w-[70%] absolute top-[5%] left-[50%] transform translate-x-[-50%] bg-[#596574] p-[10px] shadow-[0px 5px 15px 0px #FFC13B17] rounded-[5px]">
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`text-[14px] ${activeTab === tab.id ? 'text-[#16457E]' : 'text-white'} font-medium pr-[10px] ${index !== tabs.length - 1 ? 'border-r-[1px] border-[#16457E]' : ''}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

function Promotions() {
  const [activeTab, setActiveTab] = useState("promo");
  const [flyerOptions, setFlyerOptions] = useState(promotionsData.flyerOptions);
  const [selectedFlyer, setSelectedFlyer] = useState(null);
  const [showAddPromoModal, setShowAddPromoModal] = useState(false);
  const [newPromoCode, setNewPromoCode] = useState("");

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
  };

  const handleFlyerSelect = (id) => {
    const updatedOptions = flyerOptions.map(option => ({
      ...option,
      selected: option.id === id
    }));
    setFlyerOptions(updatedOptions);
    setSelectedFlyer(id);
  };

  const handleAddPromo = () => {
    setShowAddPromoModal(true);
  };

  const submitPromoCode = () => {
    // Here you would typically send the promo code to your backend
    console.log("Promo code submitted:", newPromoCode);
    setShowAddPromoModal(false);
    setNewPromoCode("");
    // You would then refresh the promotions data from the backend
  };

  return (
    <div className="w-full min-h-screen p-4 flex flex-col gap-5">
      {/* Image Slider and Promo Info Section */}
      <div className="w-full flex flex-col lg:flex-row gap-5">
        {/* Image Slider Section */}
        <div className="w-full lg:w-[58%] h-[300px] sm:h-[400px] md:h-[500px] lg:h-full relative">
          <Slider {...settings}>
            {promotionsData.images.map((src, index) => (
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

        {/* Promo Code Section */}
        <div className="w-full lg:w-[41%] h-full p-5 bg-white rounded-[10px] shadow-sm">
          <h3 className="text-[16px] font-medium">Promo Code</h3>
          <p className="text-[12px] font-normal my-3">
            {promotionsData.promoInfo.description}
          </p>

          <button
            onClick={handleAddPromo}
            className="w-fit flex items-center justify-center gap-2 bg-[#16457E] py-2 px-4 rounded-[5px] text-[12px] font-medium text-white shadow-[0px 1px 2px 0px #1018280D] hover:bg-[#0d2e57] transition"
          >
            <i className="bi bi-plus text-[18px]"></i>
            Add Promo Code
          </button>

          {/* Room Promotion Stats */}
          <div className="mt-5 flex flex-col gap-5">
            <h3 className="text-[16px] font-medium">Room Promotion</h3>
            <div className="flex items-center justify-between text-[12px]">
              <h4 className="text-[#848484] font-medium">Total Bedrooms</h4>
              <h4 className="text-[#848484] font-medium">Occupancies</h4>
              <h4 className="text-[#848484] font-medium">Promotions</h4>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <h4 className="text-[#505050] font-medium">
                {promotionsData.promoInfo.roomStats.totalBedrooms} Bedrooms
              </h4>
              <h4 className="text-[#505050] font-medium">
                {promotionsData.promoInfo.roomStats.occupancies}
              </h4>
              <h4 className="text-[#505050] font-medium">
                {promotionsData.promoInfo.roomStats.promotions}
              </h4>
            </div>
          </div>

          {/* Active Promotions */}
          <div className="mt-5 flex flex-col gap-3">
            {promotionsData.promoInfo.activePromotions.map(promo => (
              <div
                key={promo.id}
                className="w-full flex justify-between items-center p-3 bg-[#F6F6F6] rounded-[5px]"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-[10px] font-medium">{promo.room}</h4>
                  <span
                    className="text-[12px] font-medium py-[2px] px-2 rounded"
                    style={{ color: promo.statusColor, backgroundColor: promo.bgColor }}
                  >
                    {promo.status}
                  </span>
                  <h4 className="text-[10px] font-medium">{promo.discount}</h4>
                </div>
                <button className="text-[10px] text-[#16457E] underline font-medium hover:text-[#0d2e57]">
                  Price Detail
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Flyer Creation Section */}
      <div className="w-full flex flex-col lg:flex-row gap-5">
        {/* Flyer Options */}
        <div className="w-full lg:w-[49%] flex flex-col gap-4 p-5 bg-white rounded-[10px] shadow-sm">
          <h3 className="text-[20px] font-medium">
            Create a flyer for this property
          </h3>
          <h3 className="text-[14px] font-medium">Select a flyer design</h3>

          {flyerOptions.map(option => (
            <div
              key={option.id}
              onClick={() => handleFlyerSelect(option.id)}
              className={`flex items-center gap-5 p-4 rounded-[10px] cursor-pointer transition ${option.selected ? 'border-2 border-[#16457E]' : 'shadow-[0px_0px_4px_0px_#00000040]'}`}
            >
              <input
                type="checkbox"
                checked={option.selected}
                onChange={() => handleFlyerSelect(option.id)}
                className="w-5 h-5 cursor-pointer"
              />
              <h3 className="text-[14px] font-medium">{option.name}</h3>
            </div>
          ))}
        </div>

        {/* Flyer Preview */}
        <div className="w-full lg:w-[49%] flex flex-col gap-4 p-5 bg-white rounded-[10px] shadow-sm">
          <h4 className="text-[14px] font-medium">Preview</h4>
          <div className="w-full flex flex-col gap-4 p-4 border border-gray-200 rounded">
            <h4 className="text-[14px] font-medium">Logo</h4>
            <h2 className="text-[20px] font-medium">
              {promotionsData.flyerPreview.title}
            </h2>

            <div className="flex flex-col sm:flex-row gap-4">
              {promotionsData.flyerPreview.images.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Flyer preview ${index + 1}`}
                  className="w-full sm:w-[49%] object-cover rounded"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Promo Code Modal */}
      {showAddPromoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Add New Promo Code</h3>
            <input
              type="text"
              value={newPromoCode}
              onChange={(e) => setNewPromoCode(e.target.value)}
              placeholder="Enter promo code"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddPromoModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={submitPromoCode}
                className="px-4 py-2 bg-[#16457E] text-white rounded hover:bg-[#0d2e57]"
                disabled={!newPromoCode}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Promotions;