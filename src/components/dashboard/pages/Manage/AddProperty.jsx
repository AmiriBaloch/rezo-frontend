"use client";
import { useState } from "react";
import { GoogleMap, LoadScript, OverlayView } from "@react-google-maps/api";
import { useCreatePropertyMutation } from "../../../../features/properties/propertyApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "@/features/auth/authSlice";

const propertyTypes = [
  "apartment", "house", "condo", "townhouse", "villa", "cabin", "chalet", "studio", "loft", "land", "commercial", "duplex"
];
const pakistanStates = [
  "Punjab",
  "Sindh",
  "KPK",
  "Balochistan",
  "Azad Kashmir",
  "Gilgit Baltistan",
];

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  overflow: "hidden",
};

const center = {
  lat: 31.5204,
  lng: 74.3587,
};

// Sample nearby properties for map display
const nearbyProperties = [
  {
    id: 1,
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
  {
    id: 3,
    title: "Cozy Family Home",
    lat: 31.53,
    lng: 74.36,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Islamabad, Pakistan",
    price: 200,
    size: 70,
    beds: 4,
    baths: 3,
  },
];

export default function AddProperty() {
  const userId = useSelector(selectCurrentUserId);
  const [createProperty, { isLoading }] = useCreatePropertyMutation();

  const [formData, setFormData] = useState({
    listingType: "SALE",
    title: "",
    description: "",
    basePrice: "",
    currency: "PKR",
    status: "PENDING",
    address: "",
    city: "",
    state: "",
    country: "Pakistan",
    postalCode: "",
    houseRules: "",
    cancellationPolicy: "",
    propertyType: "",
    sizeSqft: "",
    amenities: [],
    roomSpecs: [],
    location: {
      type: "Point",
      coordinates: [74.3587, 31.5204], // Default to Lahore
      crs: {
        type: "name",
        properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
      },
    },
  });

  const [selectedLocation, setSelectedLocation] = useState({ lat: 31.5204, lng: 74.3587 });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [photoUrls, setPhotoUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [search, setSearch] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = (property) => {
    setSelectedLocation({ lat: property.lat, lng: property.lng });
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: [property.lng, property.lat],
      },
    }));
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedLocation({ lat, lng });
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: [lng, lat],
      },
    }));
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0 || photoUrls.length + files.length > 10) return;

    setIsUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("photos", file));

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await response.json();
      setPhotoUrls((prev) => [...prev, ...data.urls]);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = (index) => {
    setPhotoUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAmenityChange = (amenity, isChecked) => {
    setFormData((prev) => ({
      ...prev,
      amenities: isChecked
        ? [...prev.amenities, amenity]
        : prev.amenities.filter((a) => a !== amenity),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (photoUrls.length === 0) {
      setUploadError("Please upload at least one photo");
      return;
    }

    // Location validation
    if (!selectedLocation.lat || !selectedLocation.lng) {
      alert("Please select a location on the map");
      return;
    }

    try {
      const validPhotoUrls = photoUrls.filter(url => /^https?:\/\//.test(url));
      const propertyData = {
        ...formData,
        location: {
          type: "Point",
          coordinates: [selectedLocation.lng, selectedLocation.lat],
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          crs: {
            type: "name",
            properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
          },
        },
        ownerId: userId,
        basePrice: Number(formData.basePrice),
        sizeSqft: Number(formData.sizeSqft),
        photos: validPhotoUrls,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: {
          profile: {
            firstName: "", // Owner data is not available here, so set to empty
            lastName: "",
            phone: "",
            avatarUrl: "",
          },
        },
      };

      // Remove unnecessary fields for land properties
      if (formData.propertyType === "Land") {
        delete propertyData.amenities;
        delete propertyData.roomSpecs;
      }

      await createProperty(propertyData).unwrap();
      alert("Property created successfully!");
      // Navigate to manage properties page
      window.location.href = "/owner/manage";
    } catch (error) {
      console.error("Error creating property:", error);
      alert(
        "Error creating property: " + (error.data?.message || error.message)
      );
    }
  };

  const filteredProperties = nearbyProperties.filter((property) =>
    property.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 max-w-6xl mx-auto p-4"
    >
      <h1 className="text-2xl font-bold text-primary">Add Property for Sale</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="card bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Property Type*
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Property Type</option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Title*
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description*
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Base Price*
                  </label>
                  <input
                    type="number"
                    name="basePrice"
                    value={formData.basePrice}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Size (sq ft)*
                  </label>
                  <input
                    type="number"
                    name="sizeSqft"
                    value={formData.sizeSqft}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>




            </div>
          </div>

          {/* Location Info */}
          <div className="card bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Location Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    City*
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    State*
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select State</option>
                    {pakistanStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Address*
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Photos */}
          <div className="card bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Photos*</h2>
            <div className="space-y-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="w-full p-2 border rounded"
                disabled={isUploading || photoUrls.length >= 10}
              />
              {isUploading && (
                <p className="text-sm text-gray-600">Uploading photos...</p>
              )}
              {uploadError && (
                <p className="text-sm text-red-500">{uploadError}</p>
              )}
              <div className="grid grid-cols-3 gap-2">
                {photoUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Property ${index}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Amenities (conditional) */}
          {formData.propertyType && formData.propertyType !== "Land" && (
            <div className="card bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Bathroom</h3>
                  {["Toilet", "Shower", "Bath", "Sink"].map((item) => (
                    <label key={item} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(item)}
                        onChange={(e) =>
                          handleAmenityChange(item, e.target.checked)
                        }
                        className="w-4 h-4"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Kitchen</h3>
                  {["Microwave", "Oven", "Stove", "Fridge"].map((item) => (
                    <label key={item} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(item)}
                        onChange={(e) =>
                          handleAmenityChange(item, e.target.checked)
                        }
                        className="w-4 h-4"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Interactive Map */}
          <div className="card bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Property Location*</h2>
            <p className="text-sm text-gray-600 mb-4">
              Click on the map to select your property location or choose from nearby properties
            </p>
            
            {/* Search for nearby properties */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search nearby properties..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Map */}
            <div className="w-full h-96 rounded-lg overflow-hidden shadow-md border border-gray-200">
              <LoadScript
                googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyBpaYxCRgySSKHODD5RQoxd3V0k6b9jxUw"}
                onLoad={() => setMapLoaded(true)}
              >
                {mapLoaded && (
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={selectedLocation}
                    zoom={15}
                    onClick={handleMapClick}
                  >
                    {/* Selected Location Marker */}
                    <OverlayView
                      position={selectedLocation}
                      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-56 cursor-pointer ring-2 ring-primary">
                        <div className="bg-primary text-white p-2 text-center">
                          <span className="text-sm font-semibold">Selected Location</span>
                        </div>
                        <div className="p-3">
                          <p className="text-xs text-gray-500">
                            Lat: {selectedLocation.lat.toFixed(6)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Lng: {selectedLocation.lng.toFixed(6)}
                          </p>
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
                            <div className="flex justify-between text-gray-600 text-xs mt-1">
                              <span>🛏 {property.beds} Beds</span>
                              <span>🛁 {property.baths} Baths</span>
                            </div>
                          </div>
                        </div>
                      </OverlayView>
                    ))}
                  </GoogleMap>
                )}
              </LoadScript>
            </div>
            
            {/* Selected Location Info */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Selected Location:</p>
              <p className="text-xs text-gray-600">
                Latitude: {selectedLocation.lat.toFixed(6)}, Longitude: {selectedLocation.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark disabled:bg-gray-400"
        >
          {isLoading ? "Submitting..." : "Submit Property"}
        </button>
      </div>
    </form>
  );
}
