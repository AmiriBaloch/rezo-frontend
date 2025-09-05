"use client";
import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { GoogleMap, LoadScript, OverlayView } from "@react-google-maps/api";
import { useCreatePropertyMutation } from '../../../../features/properties/propertyApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '@/features/auth/authSlice';

const mapContainerStyle = { width: "100%", height: "400px", overflow: "hidden" };
const center = { lat: 31.5204, lng: 74.3587 };

function AddResidentialSaleProperty() {
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
    sizeSqft: '',
    lotSize: '',
    bedrooms: '',
    bathrooms: '',
    yearBuilt: '',
    parkingSpaces: '',
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
    if (!formData.sizeSqft || isNaN(formData.sizeSqft) || Number(formData.sizeSqft) <= 0) {
      setFormError('Size (sq ft) is required and must be a positive number'); return;
    }
    if (!formData.bedrooms || isNaN(formData.bedrooms) || Number(formData.bedrooms) <= 0) {
      setFormError('Number of bedrooms is required and must be a positive number'); return;
    }
    if (!formData.bathrooms || isNaN(formData.bathrooms) || Number(formData.bathrooms) <= 0) {
      setFormError('Number of bathrooms is required and must be a positive number'); return;
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
      alert('Residential Property created successfully!');
      window.location.href = "/owner/manage";
    } catch (error) {
      setFormError('Error creating property: ' + (error.data?.message || error.message));
    }
  };

  return (
    <form className="max-w-6xl mx-auto p-4" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold text-primary mb-6">Add Residential Property for Sale</h1>

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
                  placeholder="e.g., Beautiful 3-Bedroom Family Home in Prime Location"
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
                  placeholder="Describe your property's best features, amenities, neighborhood highlights, and what makes this home special for potential buyers"
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
                  <option value="duplex">Duplex</option>
                  <option value="studio">Studio</option>
                  <option value="loft">Loft</option>
                  <option value="cabin">Cabin</option>
                  <option value="chalet">Chalet</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Price*</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  placeholder="Enter asking price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Size (sq ft)*</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    placeholder="Living area size"
                    name="sizeSqft"
                    value={formData.sizeSqft}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Lot Size (sq ft)</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    placeholder="Land size"
                    name="lotSize"
                    value={formData.lotSize}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Bedrooms*</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    placeholder="Number of bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    min="0"
                    max="20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bathrooms*</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    placeholder="Number of bathrooms"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    min="0"
                    max="20"
                    step="0.5"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Year Built</label>
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
                    min="0"
                  />
                </div>
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
                Upload photos of: exterior, interior rooms, kitchen, bathrooms, backyard, garage, and any special features
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

        {/* Right Column - Map and Property Details */}
        <div className="space-y-6">
          {/* Interactive Map */}
          <div className="card bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Property Location*</h2>
            <p className="text-sm text-gray-600 mb-4">
              Click on the map to select your residential property location. Show proximity to schools, parks, shopping centers, and public transportation.
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
                    zoom={16}
                    onClick={handleMapClick}
                  >
                    <OverlayView
                      position={selectedLocation}
                      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-56 cursor-pointer ring-2 ring-primary">
                        <div className="bg-primary text-white p-2 text-center">
                          <span className="text-sm font-semibold">Selected Home Location</span>
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

          {/* Property Highlights */}
          <div className="card bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Property Highlights</h2>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Home Sale Focus:</strong> This residential property is being offered for sale to homebuyers. 
                  Highlight the features that make this home perfect for families, professionals, or investors.
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>Location Benefits:</strong> Emphasize proximity to good schools, parks, shopping, 
                  public transportation, and other amenities that families value.
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-700">
                  <strong>Property Features:</strong> Showcase the home's best features like updated kitchen, 
                  spacious bedrooms, large backyard, garage, or any unique architectural elements.
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
          {isLoading ? 'Creating...' : 'Submit Residential Property'}
        </button>
      </div>
    </form>
  );
}

export default AddResidentialSaleProperty;
