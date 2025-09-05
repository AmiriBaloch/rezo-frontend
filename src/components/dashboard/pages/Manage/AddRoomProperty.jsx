"use client";
import { useEffect, useState } from "react";
import { UploadCloud } from "lucide-react";

import {
  GoogleMap,
  LoadScript,
  Marker,
  OverlayView,
} from "@react-google-maps/api";
import { useCreatePropertyMutation } from '../../../../features/properties/propertyApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '@/features/auth/authSlice';

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  overflow: "hidden",
};

const center = {
  lat: 31.5204,
  lng: 74.3587,
};

const hotelsData = [
  {
    id: 1,
    name: "Hotel A",
    title: "Luxury Apartment Downtown",
    lat: 31.5204,
    lng: 74.3587,
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    image:
      "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?q=80&w=1827&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Karachi, Pakistan",
    price: 150,
    size: 55,
    beds: 3,
    baths: 2,
  },
  {
    id: 3,
    name: "Hotel C",
    title: "Cozy Family Home",
    lat: 31.53,
    lng: 74.36,
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Islamabad, Pakistan",
    price: 200,
    size: 70,
    beds: 4,
    baths: 3,
  },
];

function AddRoomProperty() {
  const userId = useSelector(selectCurrentUserId);
  const [createProperty, { isLoading }] = useCreatePropertyMutation();
  // Remove files state, only use photoUrls
  const [selectedLocation, setSelectedLocation] = useState({ lat: 31.5204, lng: 74.3587 });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [search, setSearch] = useState("");
  // Add form state for all fields
  const [formData, setFormData] = useState({
    listingType: 'RENT',
    title: '',
    description: '',
    basePrice: '',
    currency: 'PKR',
    status: 'pending',
    address: '',
    city: '',
    state: '',
    country: 'Pakistan',
    postalCode: '',
    houseRules: '',
    cancellationPolicy: '',
    propertyType: '',
    sizeSqft: '',
    amenities: [],
    roomSpecs: [],
    maxGuests: '',
    minStay: '',
    location: {
      type: 'Point',
      coordinates: [74.3587, 31.5204],
      crs: {
        type: 'name',
        properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
      },
    },
  });
  const [photoUrls, setPhotoUrls] = useState([]);
  const [uploadError, setUploadError] = useState('');
  const [formError, setFormError] = useState('');

  const handleDrop = (event) => {
    event.preventDefault();
    const uploadedFiles = Array.from(event.dataTransfer.files);
    uploadedFiles.forEach(async (file) => {
      await handlePhotoUpload({ target: { files: [file] } });
    });
  };

  const handleFileChange = async (event) => {
    await handlePhotoUpload(event);
  };

  const handleLocationSelect = (hotel) => {
    setSelectedLocation({ lat: hotel.lat, lng: hotel.lng });
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedLocation({ lat, lng });
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const filteredHotels = hotelsData.filter((hotel) =>
    hotel.title.toLowerCase().includes(search.toLowerCase())
  );

  // Add handleInputChange for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add handlePhotoUpload for photo uploads
  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0 || photoUrls.length + files.length > 10) return;
    setUploadError('');
    try {
      const formDataUpload = new FormData();
      files.forEach((file) => formDataUpload.append('photos', file));
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }
      const data = await response.json();
      setPhotoUrls((prev) => [...prev, ...data.urls]);
    } catch (error) {
      setUploadError(error.message);
    }
  };

  // Add onSubmit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    // Validation
    if (!formData.title || formData.title.length < 5) {
      setFormError('Title is required (min 5 characters)'); return;
    }
    if (!formData.description || formData.description.length < 20) {
      setFormError('Description is required (min 20 characters)'); return;
    }
    if (!formData.basePrice || isNaN(formData.basePrice)) {
      setFormError('Base price is required and must be a number'); return;
    }
    if (!formData.address) { setFormError('Address is required'); return; }
    if (!formData.city) { setFormError('City is required'); return; }
    if (!formData.state) { setFormError('State is required'); return; }
    if (!formData.postalCode || !/^\d{5}(-\d{4})?$/.test(formData.postalCode)) {
      setFormError('Postal code is required and must be 5 digits'); return;
    }
    if (!formData.propertyType) { setFormError('Property type is required'); return; }
    if (!formData.maxGuests || isNaN(formData.maxGuests) || Number(formData.maxGuests) <= 0) {
      setFormError('Max guests is required and must be a positive number'); return;
    }
    if (!formData.minStay || isNaN(formData.minStay) || Number(formData.minStay) <= 0) {
      setFormError('Min stay is required and must be a positive number'); return;
    }
    if (!formData.sizeSqft || isNaN(formData.sizeSqft) || Number(formData.sizeSqft) <= 0) {
      setFormError('Size (sq ft) is required and must be a positive number'); return;
    }
    if (photoUrls.length === 0) {
      setFormError('Please upload at least one photo'); return;
    }
    try {
      const validPhotoUrls = photoUrls.filter(url => /^https?:\/\//.test(url));
      const propertyData = {
        ...formData,
        listingType: 'RENT', // Always enforce RENT
        location: {
          type: 'Point',
          coordinates: [selectedLocation.lng, selectedLocation.lat],
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          crs: {
            type: 'name',
            properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
          },
        },
        ownerId: userId,
        basePrice: Number(formData.basePrice),
        sizeSqft: Number(formData.sizeSqft),
        maxGuests: Number(formData.maxGuests),
        minStay: Number(formData.minStay),
        photos: validPhotoUrls,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: {
          profile: {
            firstName: '',
            lastName: '',
            phone: '',
            avatarUrl: '',
          },
        },
      };
      await createProperty(propertyData).unwrap();
      alert('Property created successfully!');
      // Navigate to manage properties page
      window.location.href = "/owner/manage";
      setFormData({
        listingType: 'RENT',
        title: '',
        description: '',
        basePrice: '',
        currency: 'PKR',
        status: 'PENDING',
        address: '',
        city: '',
        state: '',
        country: 'Pakistan',
        postalCode: '',
        houseRules: '',
        cancellationPolicy: '',
        propertyType: '',
        sizeSqft: '',
        amenities: [],
        roomSpecs: [],
        maxGuests: '',
        minStay: '',
        location: {
          type: 'Point',
          coordinates: [74.3587, 31.5204],
          crs: {
            type: 'name',
            properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
          },
        },
      });
      setPhotoUrls([]);
    } catch (error) {
      setFormError('Error creating property: ' + (error.data?.message || error.message));
    }
  };

  return (
    <form className="max-w-6xl mx-auto p-4" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold text-primary mb-6">Add Room Property</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Form */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="card bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            {formError && <div className="text-red-500 font-semibold mb-2">{formError}</div>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Property Title*</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Enter property title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description*</label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows={4}
                  placeholder="Describe your property"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Property Type*</label>
                <select
                  className="w-full p-2 border rounded"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                >
                  <option value="">Select property type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="villa">Villa</option>
                  <option value="cabin">Cabin</option>
                  <option value="chalet">Chalet</option>
                  <option value="studio">Studio</option>
                  <option value="loft">Loft</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                  <option value="duplex">Duplex</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price per Night*</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    placeholder="0"
                    name="basePrice"
                    value={formData.basePrice}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Size (sq ft)*</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    placeholder="0"
                    name="sizeSqft"
                    value={formData.sizeSqft}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Max Guests*</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    placeholder="0"
                    name="maxGuests"
                    value={formData.maxGuests}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Min Stay (days)*</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    placeholder="0"
                    name="minStay"
                    value={formData.minStay}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Address*</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Enter address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City*</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Enter city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">State*</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Enter state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Postal Code*</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="e.g. 54000"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Photos Upload */}
          <div className="card bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Photos*</h2>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-semibold text-gray-900">
                    Drop files here or click to upload
                  </span>
                </label>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                PNG, JPG, GIF up to 10MB each
              </p>
            </div>
            {/* Preview uploaded photo URLs */}
            {photoUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {photoUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Uploaded ${index}`}
                      className="w-full h-24 object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Map */}
        <div className="space-y-6">
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
                    {filteredHotels.map((hotel) => (
                      <OverlayView
                        key={hotel.id}
                        position={{ lat: hotel.lat, lng: hotel.lng }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                      >
                        <div
                          className="bg-white shadow-lg rounded-lg overflow-hidden w-56 cursor-pointer transition-all duration-200 hover:shadow-xl"
                          onClick={() => handleLocationSelect(hotel)}
                        >
                          <img
                            src={hotel.image}
                            alt={hotel.title}
                            className="w-full h-28 object-cover p-1 rounded-xl"
                          />
                          <div className="p-3">
                            <h3 className="text-base font-semibold">{hotel.title}</h3>
                            <p className="text-xs text-gray-500">{hotel.location}</p>
                            <div className="flex justify-between items-center mt-2 text-sm">
                              <span className="text-lg font-bold">${hotel.price}</span>
                              <span className="text-gray-500">{hotel.size}m²</span>
                            </div>
                            <div className="flex justify-between text-gray-600 text-xs mt-2">
                              <span>🛏 {hotel.beds} Beds</span>
                              <span>🛁 {hotel.baths} Baths</span>
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

          {/* Availability Calendar */}
          <div className="card bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Availability</h2>
            <div className="grid grid-cols-7 gap-1">
              {months.map((month, index) => (
                <div
                  key={index}
                  className="p-2 text-center text-sm border rounded cursor-pointer hover:bg-gray-50"
                >
                  {month}
                </div>
            ))}
          </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark"
        >
          Submit Property
        </button>
      </div>
    </form>
  );
}

export default AddRoomProperty;