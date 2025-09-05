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

function AddAgriculturalProperty() {
  const userId = useSelector(selectCurrentUserId);
  const [createProperty, { isLoading }] = useCreatePropertyMutation();
  const [selectedLocation, setSelectedLocation] = useState({ lat: 31.5204, lng: 74.3587 });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [search, setSearch] = useState("");
  
  const [formData, setFormData] = useState({
    listingType: 'RENT',
    title: '',
    description: '',
    annualRent: '',
    pricePerAcre: '',
    currency: 'PKR',
    status: 'pending',
    address: '',
    city: '',
    state: '',
    country: 'Pakistan',
    postalCode: '',
    propertyType: '',
    totalAcreage: '',
    soilType: '',
    waterAccess: '',
    zoningDesignation: '',
    leaseStartDate: '',
    leaseEndDate: '',
    growingSeason: '',
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

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedLocation({ lat, lng });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
    if (!formData.annualRent || isNaN(formData.annualRent)) {
      setFormError('Annual rent is required and must be a number'); return;
    }
    if (!formData.address) { setFormError('Address is required'); return; }
    if (!formData.city) { setFormError('City is required'); return; }
    if (!formData.state) { setFormError('State is required'); return; }
    if (!formData.postalCode) { setFormError('Postal code is required'); return; }
    if (!formData.propertyType) { setFormError('Property type is required'); return; }
    if (!formData.totalAcreage || isNaN(formData.totalAcreage) || Number(formData.totalAcreage) <= 0) {
      setFormError('Total acreage is required and must be a positive number'); return;
    }
    if (!formData.soilType) { setFormError('Soil type is required'); return; }
    if (!formData.waterAccess) { setFormError('Water access is required'); return; }
    if (!formData.zoningDesignation) { setFormError('Zoning designation is required'); return; }
    if (!formData.leaseStartDate) { setFormError('Lease start date is required'); return; }
    if (!formData.leaseEndDate) { setFormError('Lease end date is required'); return; }
    if (photoUrls.length === 0) {
      setFormError('Please upload at least one photo'); return;
    }
    
    try {
      const validPhotoUrls = photoUrls.filter(url => /^https?:\/\//.test(url));
      const propertyData = {
        ...formData,
        listingType: 'RENT',
        basePrice: Number(formData.annualRent), // Map annualRent to basePrice for API compatibility
        sizeSqft: Number(formData.totalAcreage) * 43560, // Convert acres to sq ft for API compatibility
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
      alert('Agricultural Land created successfully!');
      window.location.href = "/owner/manage";
    } catch (error) {
      setFormError('Error creating property: ' + (error.data?.message || error.message));
    }
  };

  return (
    <form className="max-w-6xl mx-auto p-4" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold text-primary mb-6">Add Agricultural Land for Rent</h1>

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
                  placeholder="e.g., 50-Acre Fertile Cropland for Lease"
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
                  placeholder="Describe soil quality, water access, previous crops, topography, fencing, existing structures (barns, silos), and permitted uses"
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
                  <option value="land">Land</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="villa">Villa</option>
                  <option value="cabin">Cabin</option>
                  <option value="chalet">Chalet</option>
                  <option value="studio">Studio</option>
                  <option value="loft">Loft</option>
                  <option value="commercial">Commercial</option>
                  <option value="duplex">Duplex</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Annual Rent*</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    placeholder="Enter annual rent"
                    name="annualRent"
                    value={formData.annualRent}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price per Acre</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    placeholder="Price per acre"
                    name="pricePerAcre"
                    value={formData.pricePerAcre}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Total Acreage*</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  placeholder="0"
                  name="totalAcreage"
                  value={formData.totalAcreage}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Soil Type*</label>
                  <select
                    className="w-full p-2 border rounded"
                    name="soilType"
                    value={formData.soilType}
                    onChange={handleInputChange}
                  >
                    <option value="">Select soil type</option>
                    <option value="loam">Loam</option>
                    <option value="clay">Clay</option>
                    <option value="silt">Silt</option>
                    <option value="sandy">Sandy</option>
                    <option value="peaty">Peaty</option>
                    <option value="chalky">Chalky</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Water Access*</label>
                  <select
                    className="w-full p-2 border rounded"
                    name="waterAccess"
                    value={formData.waterAccess}
                    onChange={handleInputChange}
                  >
                    <option value="">Select water access</option>
                    <option value="irrigation">Irrigation</option>
                    <option value="well-water">Well Water</option>
                    <option value="river-access">River Access</option>
                    <option value="pond">Pond</option>
                    <option value="stream">Stream</option>
                    <option value="none">No Water Access</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Zoning/Land Designation*</label>
                <select
                  className="w-full p-2 border rounded"
                  name="zoningDesignation"
                  value={formData.zoningDesignation}
                  onChange={handleInputChange}
                >
                  <option value="">Select zoning designation</option>
                  <option value="agricultural">Agricultural</option>
                  <option value="pasture">Pasture</option>
                  <option value="forestry">Forestry</option>
                  <option value="rural">Rural</option>
                  <option value="mixed-use">Mixed Use</option>
                  <option value="conservation">Conservation</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Address*</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Enter address or rural route"
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
                    placeholder="Enter city or nearest town"
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
              <p className="text-xs text-blue-600 mt-2">
                Upload photos of: fields, soil, water sources, access roads, agricultural structures
              </p>
            </div>
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

        {/* Right Column - Map and Lease Details */}
        <div className="space-y-6">
          {/* Interactive Map */}
          <div className="card bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Property Location*</h2>
            <p className="text-sm text-gray-600 mb-4">
              Click on the map to select your agricultural land location. For large plots, you can mark the center point.
            </p>
            
            <div className="w-full h-96 rounded-lg overflow-hidden shadow-md border border-gray-200">
              <LoadScript
                googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyBpaYxCRgySSKHODD5RQoxd3V0k6b9jxUw"}
                onLoad={() => setMapLoaded(true)}
              >
                {mapLoaded && (
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={selectedLocation}
                    zoom={12}
                    onClick={handleMapClick}
                  >
                    <OverlayView
                      position={selectedLocation}
                      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-56 cursor-pointer ring-2 ring-primary">
                        <div className="bg-primary text-white p-2 text-center">
                          <span className="text-sm font-semibold">Selected Land Location</span>
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
                  </GoogleMap>
                )}
              </LoadScript>
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Selected Location:</p>
              <p className="text-xs text-gray-600">
                Latitude: {selectedLocation.lat.toFixed(6)}, Longitude: {selectedLocation.lng.toFixed(6)}
              </p>
            </div>
          </div>

          {/* Lease Availability */}
          <div className="card bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Lease Availability</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Lease Start Date*</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  name="leaseStartDate"
                  value={formData.leaseStartDate}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Lease End Date*</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  name="leaseEndDate"
                  value={formData.leaseEndDate}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Growing Season</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Available for the 2024 season"
                  name="growingSeason"
                  value={formData.growingSeason}
                  onChange={handleInputChange}
                />
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>Note:</strong> This agricultural land will be available for long-term lease. 
                  Tenants will sign a lease agreement for the specified period, typically covering one or more growing seasons.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Submit Agricultural Land'}
        </button>
      </div>
    </form>
  );
}

export default AddAgriculturalProperty;
