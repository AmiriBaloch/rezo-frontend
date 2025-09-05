import { GoogleMap, LoadScript, OverlayView } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
  overflow: "hidden",
};

const center = {
  lat: 31.5204,
  lng: 74.3587,
};

const samplePropertyData = {
  id: 1,
  title: "Luxury Downtown Apartment",
  size: 75,
  billsIncluded: true,
  billsAmount: "100",
  bedrooms: 2,
  bathrooms: 2,
  price: 1200,
  location: "Lahore, Pakistan",
  lat: 31.5204,
  lng: 74.3587,
  selectedAmenities: ["Toilet", "Shower", "Microwave", "Oven", "Wi-Fi", "Air Conditioning"],
  image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
};

const nearbyProperties = [
  {
    id: 1,
    name: "Hotel A",
    title: "Luxury Apartment Downtown",
    lat: 31.5204,
    lng: 74.3587,
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Lahore, Pakistan",
    price: 120,
    size: 40,
    beds: 2,
    baths: 1,
  },
  {
    id: 2,
    name: "Hotel B",
    title: "Modern Studio Near City Center",
    lat: 31.525,
    lng: 74.35,
    image: "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?q=80&w=1827&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Karachi, Pakistan",
    price: 150,
    size: 55,
    beds: 3,
    baths: 2,
  },
];

const amenitiesSections = [
  {
    name: "Bathroom",
    amenities: ["Toilet", "Shower", "Bath", "Sink", "Hair dryer", "Towels"]
  },
  {
    name: "Kitchen",
    amenities: ["Microwave", "Oven", "Toaster", "Stove", "Fridge", "Freezer", "Kettle", "Dishwasher"]
  },
  {
    name: "Living Space",
    amenities: ["TV", "Sofa", "Wi-Fi", "Air Conditioning", "Heating", "Workspace"]
  },
  {
    name: "Building",
    amenities: ["Elevator", "Free Parking", "Laundry", "Gym", "Security"]
  },
  {
    name: "Outdoor",
    amenities: ["Garden", "Terrace", "Balcony", "BBQ area"]
  }
];

function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(samplePropertyData);
  const [search, setSearch] = useState("");
  const [filteredProperties, setFilteredProperties] = useState(nearbyProperties);
  const [mapLoaded, setMapLoaded] = useState(false);

  // In a real app, you would fetch the property data based on the ID
  useEffect(() => {
    // Simulate loading property data
    console.log(`Loading property with ID: ${id}`);
    // setFormData(fetchedPropertyData);
  }, [id]);

  useEffect(() => {
    const result = nearbyProperties.filter((property) =>
      property.name.toLowerCase().includes(search.toLowerCase()) ||
      property.location.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProperties(result);
  }, [search]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAmenityChange = (amenity, isChecked) => {
    setFormData(prev => {
      if (isChecked) {
        return {
          ...prev,
          selectedAmenities: [...prev.selectedAmenities, amenity]
        };
      } else {
        return {
          ...prev,
          selectedAmenities: prev.selectedAmenities.filter(a => a !== amenity)
        };
      }
    });
  };

  const handleLocationSelect = (property) => {
    setFormData(prev => ({
      ...prev,
      location: property.location,
      lat: property.lat,
      lng: property.lng
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated property:", formData);
    // Here you would typically send the updated data to your backend
    alert("Property updated successfully!");
    navigate('/properties');
  };

  const increment = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: Math.min(prev[field] + 1, 10)
    }));
  };

  const decrement = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: Math.max(prev[field] - 1, 1)
    }));
  };

  return (
    <form
      className="flex flex-col gap-4 w-full max-w-6xl mx-auto p-4 md:p-6"
      onSubmit={handleSubmit}
    >
      <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 px-2">
        <h1 className="text-xl md:text-2xl text-primary font-semibold md:w-1/4">
          Edit Property
        </h1>
        <div className="w-full md:w-3/4 flex items-center gap-3">
          <input
            type="text"
            className="flex-1 p-2 bg-white rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Search nearby properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="bi bi-x-lg text-lg"></i>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Left Column - Form Fields */}
        <div className="w-full lg:w-1/2 space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Apartment Title*</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 bg-white rounded-md border border-gray-300 focus:ring-primary focus:border-primary"
              placeholder="e.g., Luxury Downtown Apartment"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Size (m²)*</label>
            <input
              type="number"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              className="w-full p-2 bg-white rounded-md border border-gray-300 focus:ring-primary focus:border-primary"
              placeholder="e.g., 75"
              required
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="billsIncluded"
                name="billsIncluded"
                checked={formData.billsIncluded}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="billsIncluded" className="text-sm font-medium text-gray-700">
                Bills included up to
              </label>
            </div>
            {formData.billsIncluded && (
              <input
                type="text"
                name="billsAmount"
                value={formData.billsAmount}
                onChange={handleInputChange}
                className="w-20 p-2 bg-white rounded-md border border-gray-300 focus:ring-primary focus:border-primary"
                placeholder="$"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => decrement('bedrooms')}
                  className="border px-3 py-1 text-lg rounded-md hover:bg-gray-100"
                >
                  -
                </button>
                <span className="text-sm w-6 text-center">{formData.bedrooms}</span>
                <button
                  type="button"
                  onClick={() => increment('bedrooms')}
                  className="border px-3 py-1 text-lg rounded-md hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => decrement('bathrooms')}
                  className="border px-3 py-1 text-lg rounded-md hover:bg-gray-100"
                >
                  -
                </button>
                <span className="text-sm w-6 text-center">{formData.bathrooms}</span>
                <button
                  type="button"
                  onClick={() => increment('bathrooms')}
                  className="border px-3 py-1 text-lg rounded-md hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Price per month ($)*</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full p-2 bg-white rounded-md border border-gray-300 focus:ring-primary focus:border-primary"
              placeholder="e.g., 1200"
              required
            />
          </div>

          {/* Amenities Sections */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Amenities</h2>
            {amenitiesSections.map((section, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">{section.name}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {section.amenities.map((item, i) => (
                    <label key={i} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.selectedAmenities.includes(item)}
                        onChange={(e) => handleAmenityChange(item, e.target.checked)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="text-sm font-medium text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Map and Property Image */}
        <div className="w-full lg:w-1/2 space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Location*</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full p-2 bg-white rounded-md border border-gray-300 focus:ring-primary focus:border-primary"
              required
            />
          </div>

          {/* Property Image Preview */}
          <div className="w-full h-48 rounded-lg overflow-hidden">
            <img
              src={formData.image}
              alt="Property"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-full h-96 md:h-[400px] rounded-lg overflow-hidden shadow-md border border-gray-200">
            <LoadScript
              googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyBpaYxCRgySSKHODD5RQoxd3V0k6b9jxUw"}
              onLoad={() => setMapLoaded(true)}
            >
              {mapLoaded && (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={{ lat: formData.lat, lng: formData.lng }}
                  zoom={15}
                >
                  {/* Current Property Marker */}
                  <OverlayView
                    position={{ lat: formData.lat, lng: formData.lng }}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  >
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden w-56 cursor-pointer ring-2 ring-primary">
                      <img
                        src={formData.image}
                        alt={formData.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-3">
                        <h3 className="text-sm font-semibold truncate">{formData.title}</h3>
                        <p className="text-xs text-gray-500 truncate">{formData.location}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm font-bold">${formData.price}</span>
                          <span className="text-xs text-gray-500">{formData.size}m²</span>
                        </div>
                      </div>
                    </div>
                  </OverlayView>

                  {/* Nearby Properties */}
                  {filteredProperties.map((property) => (
                    <OverlayView
                      key={property.id}
                      position={{ lat: property.lat, lng: property.lng }}
                      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                      <div
                        className="bg-white shadow-lg rounded-lg overflow-hidden w-56 cursor-pointer transition-all duration-200 hover:shadow-xl"
                        onClick={() => handleLocationSelect(property)}
                      >
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-3">
                          <h3 className="text-sm font-semibold truncate">{property.title}</h3>
                          <p className="text-xs text-gray-500 truncate">{property.location}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm font-bold">${property.price}</span>
                            <span className="text-xs text-gray-500">{property.size}m²</span>
                          </div>
                        </div>
                      </div>
                    </OverlayView>
                  ))}
                </GoogleMap>
              )}
            </LoadScript>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Property ID: {id}</span>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/properties')}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md shadow-sm hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary text-white px-8 py-2 rounded-md shadow-md hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </form>
  );
}

export default EditProperty;