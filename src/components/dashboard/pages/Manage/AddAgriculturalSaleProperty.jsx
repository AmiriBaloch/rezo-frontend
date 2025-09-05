"use client";
import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { GoogleMap, LoadScript, OverlayView } from "@react-google-maps/api";
import { useCreatePropertyMutation } from '../../../../features/properties/propertyApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '@/features/auth/authSlice';

const mapContainerStyle = { width: "100%", height: "400px", overflow: "hidden" };
const center = { lat: 31.5204, lng: 74.3587 };

function AddAgriculturalSaleProperty() {
  const userId = useSelector(selectCurrentUserId);
  const [createProperty, { isLoading }] = useCreatePropertyMutation();
  const [selectedLocation, setSelectedLocation] = useState(center);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const [formData, setFormData] = useState({
    listingType: 'SALE',
    title: '',
    description: '',
    price: '',
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
    currentUse: '',
    infrastructure: '',
    developmentPotential: '',
    location: { type: 'Point', coordinates: [74.3587, 31.5204] },
  });
  
  const [photoUrls, setPhotoUrls] = useState([]);
  const [formError, setFormError] = useState('');

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
    
    try {
      const formDataUpload = new FormData();
      files.forEach((file) => formDataUpload.append('photos', file));
      const response = await fetch('/api/upload', { method: 'POST', body: formDataUpload });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      setPhotoUrls((prev) => [...prev, ...data.urls]);
    } catch (error) {
      console.error('Upload error:', error);
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
    if (!formData.price || isNaN(formData.price)) {
      setFormError('Price is required and must be a number'); return;
    }
    if (!formData.address || !formData.city || !formData.state || !formData.postalCode) {
      setFormError('All address fields are required'); return;
    }
    if (!formData.propertyType) {
      setFormError('Property type is required'); return;
    }
    if (!formData.totalAcreage || isNaN(formData.totalAcreage) || Number(formData.totalAcreage) <= 0) {
      setFormError('Total acreage is required and must be a positive number'); return;
    }
    if (!formData.soilType || !formData.waterAccess || !formData.zoningDesignation) {
      setFormError('Soil type, water access, and zoning designation are required'); return;
    }
    if (photoUrls.length === 0) {
      setFormError('Please upload at least one photo'); return;
    }
    
    try {
      const validPhotoUrls = photoUrls.filter(url => /^https?:\/\//.test(url));
      const propertyData = {
        ...formData,
        listingType: 'SALE',
        basePrice: Number(formData.price), // Map price to basePrice for API compatibility
        sizeSqft: Number(formData.totalAcreage) * 43560, // Convert acres to sq ft for API compatibility
        location: {
          type: 'Point',
          coordinates: [selectedLocation.lng, selectedLocation.lat],
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
        },
        ownerId: userId,
        photos: validPhotoUrls,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: { profile: { firstName: '', lastName: '', phone: '', avatarUrl: '' } },
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
      <h1 className="text-2xl font-bold text-primary mb-6">Add Agricultural Land for Sale</h1>

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
                  placeholder="e.g., 50-Acre Prime Farmland for Sale"
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
                  placeholder="Describe soil quality, water access, current crops, topography, infrastructure, development potential, and what makes this land valuable for buyers"
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
              
              <div>
                <label className="block text-sm font-medium mb-1">Price*</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  placeholder="Enter total sale price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                />
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
                  <option value="residential">Residential</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Current Use</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Wheat farming, Cattle grazing, Timber production"
                  name="currentUse"
                  value={formData.currentUse}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Infrastructure</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Fencing, roads, utilities, barns, silos"
                  name="infrastructure"
                  value={formData.infrastructure}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Development Potential</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Subdivision potential, rezoning possibilities, commercial development"
                  name="developmentPotential"
                  value={formData.developmentPotential}
                  onChange={handleInputChange}
                />
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
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
                  onChange={handlePhotoUpload}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB each</p>
              <p className="text-xs text-blue-600 mt-2">
                Upload photos of: fields, soil, water sources, access roads, agricultural structures, and any development potential
              </p>
            </div>
            {photoUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {photoUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img src={url} alt={`Uploaded ${index}`} className="w-full h-24 object-cover rounded" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Map and Land Details */}
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
                          <p className="text-xs text-gray-500">Lat: {selectedLocation.lat.toFixed(6)}</p>
                          <p className="text-xs text-gray-500">Lng: {selectedLocation.lng.toFixed(6)}</p>
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

          {/* Land Investment Highlights */}
          <div className="card bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Land Investment Highlights</h2>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Land Sale Focus:</strong> This agricultural land is being offered for sale to investors, developers, 
                  or farmers. Highlight the land's potential for various uses and investment returns.
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>Agricultural Value:</strong> Emphasize soil quality, water access, current productivity, 
                  and potential for different types of farming or development.
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-700">
                  <strong>Development Potential:</strong> Consider factors like zoning changes, subdivision possibilities, 
                  commercial development, or residential expansion potential.
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

export default AddAgriculturalSaleProperty;
