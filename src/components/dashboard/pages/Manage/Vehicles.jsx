import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Arrow components (moved outside)
const CustomNextArrow = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white w-[45px] max10:w-[38px] h-[45px] max10:h-[38px] rounded-full shadow-lg hover:bg-gray-200 transition"
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
      className="absolute z-10 top-1/2 left-4 transform -translate-y-1/2 bg-white w-[45px] max10:w-[38px] h-[45px] max10:h-[38px] rounded-full shadow-lg hover:bg-gray-200 transition"
      aria-label="Previous image"
    >
      <i className="bi bi-arrow-left-circle-fill text-2xl max10:text-[23px] text-[#16457E]"></i>
    </button>
  );
};

const Vehicles = () => {
  // State for vehicles data
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Property Photos");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    color: "",
    plateNumber: "",
    image: "",
    owner: {
      name: "",
      room: ""
    }
  });

  // Mock data
  const mockVehicles = [
    {
      id: 1,
      make: "Honda",
      model: "Civic",
      color: "White",
      plateNumber: "ABC123",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1742&auto=format&fit=crop",
      owner: {
        name: "Daniel Foster",
        avatar: "https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png",
        room: "1"
      }
    },
    {
      id: 2,
      make: "Honda",
      model: "Civic",
      color: "White",
      plateNumber: "ABC123",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1742&auto=format&fit=crop",
      owner: {
        name: "Daniel Foster",
        avatar: "https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png",
        room: "1"
      }
    },
    {
      id: 3,
      make: "Honda",
      model: "Civic",
      color: "White",
      plateNumber: "ABC123",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1742&auto=format&fit=crop",
      owner: {
        name: "Daniel Foster",
        avatar: "https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png",
        room: "1"
      }
    },
    {
      id: 4,
      make: "Honda",
      model: "Civic",
      color: "White",
      plateNumber: "ABC123",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1742&auto=format&fit=crop",
      owner: {
        name: "Daniel Foster",
        avatar: "https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png",
        room: "1"
      }
    },
  ];

  const images = [
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1742&auto=format&fit=crop",
    "https://plus.unsplash.com/premium_photo-1678752717095-08cd0bd1d7e7?q=80&w=1740&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1740&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1740&auto=format&fit=crop",
  ];

  // Fetch vehicles data
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setVehicles(mockVehicles);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch vehicles data");
        setLoading(false);
        console.error(err);
      }
    };

    fetchVehicles();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('owner.')) {
      const ownerField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        owner: {
          ...prev.owner,
          [ownerField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.make || !formData.model || !formData.plateNumber) {
      alert("Please fill in all required fields");
      return;
    }

    // Create new vehicle object
    const newVehicle = {
      id: vehicles.length + 1,
      ...formData,
      owner: {
        ...formData.owner,
        avatar: "https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png"
      }
    };

    // Add to vehicles list
    setVehicles(prev => [...prev, newVehicle]);

    // Reset form and close modal
    setFormData({
      make: "",
      model: "",
      color: "",
      plateNumber: "",
      image: "",
      owner: {
        name: "",
        room: ""
      }
    });
    setShowAddModal(false);

    // In a real app, you would make an API call here to save to backend
    console.log("New vehicle added:", newVehicle);
  };

  // Slider settings
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
  };

  // Render vehicle cards
  const renderVehicleCards = () => {
    if (loading) {
      return <div className="w-full flex justify-center py-10">Loading...</div>;
    }

    if (error) {
      return <div className="w-full text-center py-10 text-red-500">{error}</div>;
    }

    if (vehicles.length === 0) {
      return <div className="w-full text-center py-10 text-gray-500">No vehicles registered yet.</div>;
    }

    return vehicles.map((vehicle, index) => (
      <div key={vehicle.id} className="w-full md:w-[49%] border-[1px] border-[#CC4848] rounded-[5px] p-[5px] mb-4">
        <div className="flex flex-col sm:flex-row items-center gap-[20px]">
          <img
            src={vehicle.image}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full sm:w-[140px] h-auto object-cover rounded"
          />

          <div className="flex-1 flex flex-col gap-[5px]">
            <h3 className="text-[12px] sm:text-[14px] font-medium">
              {vehicle.make} {vehicle.model}
            </h3>
            <h4 className="text-[10px] sm:text-[12px] font-normal">
              Color: {vehicle.color}
            </h4>
            <h3 className="text-[12px] sm:text-[14px] font-medium">
              Plate: {vehicle.plateNumber}
            </h3>
          </div>

          <div className="flex flex-col items-center justify-center gap-[10px]">
            <div className="flex items-center gap-[10px]">
              <img
                src={vehicle.owner.avatar}
                alt={vehicle.owner.name}
                className="w-[38px] h-[38px] border-blue border-[1px] rounded-[50%]"
              />
              <h4 className="text-[#242424] text-[12px] sm:text-[14px] font-normal">
                {vehicle.owner.name}
              </h4>
            </div>
            <h4 className="text-[12px] font-medium">Room: {vehicle.owner.room}</h4>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="w-full min-h-[100vh] flex flex-col gap-[20px] p-4">
      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Vehicle</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Make*</label>
                  <input
                    type="text"
                    name="make"
                    value={formData.make}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Model*</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Color</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Plate Number*</label>
                  <input
                    type="text"
                    name="plateNumber"
                    value={formData.plateNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    placeholder="https://example.com/vehicle.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Owner Name</label>
                  <input
                    type="text"
                    name="owner.name"
                    value={formData.owner.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Room Number</label>
                  <input
                    type="text"
                    name="owner.room"
                    value={formData.owner.room}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#16457E] text-white rounded hover:bg-[#0d2e57]"
                >
                  Add Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rest of your component remains the same */}
      <div className="flex flex-col lg:flex-row items-stretch gap-[20px]">
        {/* Image Slider Section */}
        <div className="w-full lg:w-[58%] h-auto lg:min-h-[60vh] relative">
          <Slider {...settings}>
            {images.map((src, index) => (
              <div className="w-full h-full" key={index}>
                <img
                  src={src}
                  alt={`Property ${index + 1}`}
                  className="w-full h-[300px] sm:h-[400px] lg:h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </Slider>

          {/* Tabs */}
          <div className="flex items-center justify-between w-full sm:w-[70%] absolute top-[5%] left-[50%] transform translate-x-[-50%] bg-[#596574] p-[10px] shadow-[0px 5px 15px 0px #FFC13B17] rounded-[5px]">
            {["House Manual", "Property Photos", "Renter Photos"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[12px] sm:text-[14px] ${activeTab === tab ? "text-[#16457E]" : "text-white"
                  } ${tab !== "Renter Photos" ? "border-r-[1px] border-[#16457E] pr-[10px]" : "pr-[10px]"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Parking Info Section */}
        <div className="w-full lg:w-[41%] h-full p-[20px] bg-white rounded-[10px] shadow-sm">
          <h3 className="text-[14px] font-medium border-b-[1px] border-[#D2D2D2] pb-[10px]">
            Vehicles
          </h3>
          <div className="flex flex-col gap-[10px] mt-4">
            <h3 className="text-[14px] font-medium mb-[10px]">
              Parking Availability
            </h3>
            <h4 className="text-[12px] font-light">Street: 6 parking spots</h4>
            <h4 className="text-[12px] font-light">
              Driveway: 0 parking spots
            </h4>
            <h4 className="text-[12px] font-light">Garage: 0 parking spots</h4>
          </div>

          <div className="flex flex-col gap-[15px] mt-6">
            <h3 className="text-[14px] font-medium">Property Features</h3>
            <ul className="flex flex-col gap-[6px] list-decimal list-inside">
              <li className="text-[12px] font-light">
                Park only in designated areas assigned to you.
              </li>
              <li className="text-[12px] font-light">
                No blocking driveways, walkways, or emergency access routes.
              </li>
              <li className="text-[12px] font-light">
                Visitor parking is limited to designated spots and timeframes.
              </li>
              <li className="text-[12px] font-light">
                Maintain your vehicle to prevent oil leaks or damage to the
                property.
              </li>
              <li className="text-[12px] font-light">
                Unauthorized vehicles will be towed at the owner's expense.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Registered Vehicles Section */}
      <div className="w-full flex flex-col gap-[15px] p-[20px] bg-white rounded-[10px] shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h3 className="text-[15px] font-medium">
            Registered Vehicles
          </h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-fit flex items-center justify-center gap-[10px] bg-[#16457E] py-[8px] px-[14px] rounded-[5px] text-[14px] font-medium text-white shadow-[0px 1px 2px 0px #1018280D] hover:bg-[#0d2e57] transition"
          >
            <i className="bi bi-plus text-[18px]"></i>
            Add Vehicle
          </button>
        </div>

        <div className="w-full flex flex-wrap gap-[20px] mt-4">
          {renderVehicleCards()}
        </div>
      </div>
    </div>
  );
};

export default Vehicles;