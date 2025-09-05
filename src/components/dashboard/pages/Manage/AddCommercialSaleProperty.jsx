"use client";
import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { GoogleMap, LoadScript, OverlayView } from "@react-google-maps/api";
import { useCreatePropertyMutation } from '../../../../features/properties/propertyApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '@/features/auth/authSlice';

const mapContainerStyle = { width: "100%", height: "400px", overflow: "hidden" };
const center = { lat: 31.5204, lng: 74.3587 };

function AddCommercialSaleProperty() {
  const userId = useSelector(selectCurrentUserId);
  const [createProperty, { isLoading }] = useCreatePropertyMutation();
  const [selectedLocation, setSelectedLocation] = useState(center);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const [formData, setFormData] = useState({
    listingType: 'SALE',
    title: '',
    description: '',
    basePrice: '',
    pricePerSqft: '',
    currency: 'PKR',
    status: 'pending',
    address: '',
    city: '',
    state: '',
    country: 'Pakistan',
    postalCode: '',
    propertyType: '',
    commercialSubType: '',
    totalSize: '',
    leasableSize: '',
    yearBuilt: '',
    parkingSpaces: '',
    capRate: '',
    noi: '',
    buildingClass: '',
    zoning: '',
    tenantOccupancy: '',
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
    if (!formData.basePrice || isNaN(formData.basePrice)) {
      setFormError('Base price is required and must be a number'); return;
    }
    if (!formData.address || !formData.city || !formData.state || !formData.postalCode) {
      setFormError('All address fields are required'); return;
    }
    if (!formData.propertyType || !formData.commercialSubType) {
      setFormError('Property type and commercial sub-type are required'); return;
    }
    if (!formData.totalSize || isNaN(formData.totalSize) || Number(formData.totalSize) <= 0) {
      setFormError('Total size is required and must be a positive number'); return;
    }
    if (!formData.yearBuilt || !formData.buildingClass || !formData.zoning) {
      setFormError('Year built, building class, and zoning are required'); return;
    }
    if (photoUrls.length === 0) {
      setFormError('Please upload at least one photo'); return;
    }
    
    try {
      const validPhotoUrls = photoUrls.filter(url => /^https?:\/\//.test(url));
      const propertyData = {
        ...formData,
        listingType: 'SALE',
        sizeSqft: Number(formData.totalSize),
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
      alert('Commercial Property created successfully!');
      window.location.href = "/owner/manage";
    } catch (error) {
      setFormError('Error creating property: ' + (error.data?.message || error.message));
    }
  };

  return (
    <form className="max-w-6xl mx-auto p-4" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold text-primary mb-6">Add Commercial Property for Sale</h1>

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
                  placeholder="e.g., Class-A Office Building for Sale in Downtown"
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
                  placeholder="Describe investment highlights, tenant roster, lease terms, income statements, zoning, building class, and amenities"
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
                  <option value="commercial">Commercial</option>
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
                  <option value="duplex">Duplex</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Commercial Sub-Type*</label>
                <select
                  className="w-full p-2 border rounded"
                  name="commercialSubType"
                  value={formData.commercialSubType}
                  onChange={handleInputChange}
                >
                  <option value="">Select commercial sub-type</option>
                  <option value="office-building">Office Building</option>
                  <option value="retail-strip-mall">Retail Strip Mall</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="shopping-center">Shopping Center</option>
                  <option value="medical-office">Medical Office</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="hotel">Hotel</option>
                  <option value="gas-station">Gas Station</option>
                  <option value="car-wash">Car Wash</option>
                  <option value="storage-facility">Storage Facility</option>
                  <option value="manufacturing">Manufacturing</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Base Price*</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    placeholder="Enter total sale price"
                    name="basePrice"
                    value={formData.basePrice}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price per Sq Ft</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    placeholder="Price per sq ft"
                    name="pricePerSqft"
                    value={formData.pricePerSqft}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Total Size (sq ft)*</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    placeholder="0"
                    name="totalSize"
                    value={formData.totalSize}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Leasable Size (sq ft)</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    placeholder="0"
                    name="leasableSize"
                    value={formData.leasableSize}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Year Built*</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    placeholder="e.g., 2020"
                    name="yearBuilt"
                    value={formData.yearBuilt}
                    onChange={handleInputChange}
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Parking Spaces</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    placeholder="0"
                    name="parkingSpaces"
                    value={formData.parkingSpaces}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">CAP Rate (%)</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    placeholder="e.g., 6.5"
                    name="capRate"
                    value={formData.capRate}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    max="20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Net Operating Income</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    placeholder="Annual NOI"
                    name="noi"
                    value={formData.noi}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Building Class*</label>
                  <select
                    className="w-full p-2 border rounded"
                    name="buildingClass"
                    value={formData.buildingClass}
                    onChange={handleInputChange}
                  >
                    <option value="">Select building class</option>
                    <option value="class-a">Class A</option>
                    <option value="class-b">Class B</option>
                    <option value="class-c">Class C</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Zoning*</label>
                  <select
                    className="w-full p-2 border rounded"
                    name="zoning"
                    value={formData.zoning}
                    onChange={handleInputChange}
                  >
                    <option value="">Select zoning</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                    <option value="mixed-use">Mixed Use</option>
                    <option value="retail">Retail</option>
                    <option value="office">Office</option>
                    <option value="light-industrial">Light Industrial</option>
                    <option value="heavy-industrial">Heavy Industrial</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tenant Occupancy</label>
                <select
                  className="w-full p-2 border rounded"
                  name="tenantOccupancy"
                  value={formData.tenantOccupancy}
                  onChange={handleInputChange}
                >
                  <option value="">Select occupancy status</option>
                  <option value="fully-occupied">Fully Occupied</option>
                  <option value="partially-occupied">Partially Occupied</option>
                  <option value="vacant">Vacant</option>
                  <option value="under-construction">Under Construction</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Address*</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Enter street address"
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
                Upload photos of: building exterior, lobby, common areas, individual units/offices, parking lots, loading docks, floor plans
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

        {/* Right Column - Map and Investment Details */}
        <div className="space-y-6">
          {/* Interactive Map */}
          <div className="card bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Property Location*</h2>
            <p className="text-sm text-gray-600 mb-4">
              Click on the map to select your commercial property location. Show proximity to major highways, competitors, target demographics, and transportation hubs.
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
                    zoom={15}
                    onClick={handleMapClick}
                  >
                    <OverlayView
                      position={selectedLocation}
                      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-56 cursor-pointer ring-2 ring-primary">
                        <div className="bg-primary text-white p-2 text-center">
                          <span className="text-sm font-semibold">Selected Commercial Location</span>
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

          {/* Investment Highlights */}
          <div className="card bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Investment Highlights</h2>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Investment Focus:</strong> This commercial property is being offered for sale as an investment opportunity. 
                  Consider factors like location, tenant mix, lease terms, and potential for appreciation.
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>Location Value:</strong> Commercial real estate value is heavily dependent on location. 
                  Proximity to major roads, public transportation, and target demographics significantly impacts property value.
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-700">
                  <strong>Due Diligence:</strong> Buyers should review financial statements, lease agreements, 
                  property condition reports, and zoning regulations before making an investment decision.
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
          {isLoading ? 'Creating...' : 'Submit Commercial Property'}
        </button>
      </div>
    </form>
  );
}

export default AddCommercialSaleProperty;
