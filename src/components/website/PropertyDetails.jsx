import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// Custom Arrow Components
const CustomNextArrow = ({ onClick }) => (
    <button
        onClick={onClick}
        className="absolute top-1/2 right-4 z-10 transform -translate-y-1/2 bg-white w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-md hover:bg-gray-100 transition-all duration-300 flex items-center justify-center"
        aria-label="Next image"
    >
        <i className="bi bi-chevron-right text-xl text-primary"></i>
    </button>
);

const CustomPrevArrow = ({ onClick }) => (
    <button
        onClick={onClick}
        className="absolute top-1/2 left-4 z-10 transform -translate-y-1/2 bg-white w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-md hover:bg-gray-100 transition-all duration-300 flex items-center justify-center"
        aria-label="Previous image"
    >
        <i className="bi bi-chevron-left text-xl text-primary"></i>
    </button>
);

// RoomDescriptionSlider Component
const RoomDescriptionSlider = ({ property }) => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
    };

    // Use property photos or fallback to default images
    const images = property?.photos && property.photos.length > 0 
        ? property.photos.map(photo => typeof photo === 'string' ? photo : photo?.url || photo)
        : ["/bg.jpg", "/bg.jpg", "/bg.jpg", "/bg.jpg"];

    return (
        <div className="w-full flex flex-col lg:flex-row gap-5">
            {/* Main Slider */}
            <div className="w-full lg:w-[58%]">
                <Slider {...settings}>
                    {images.map((src, index) => (
                        <div key={index} className="w-full aspect-video">
                            <img
                                src={src}
                                alt={`Property image ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/bg.jpg";
                                }}
                            />
                        </div>
                    ))}
                </Slider>
            </div>

            {/* Thumbnail Gallery */}
            <div className="w-full lg:w-[41%] grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3">
                {images.slice(0, 4).map((src, index) => (
                    <div key={index} className="aspect-square">
                        <img
                            src={src}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/bg.jpg";
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

// RoomData Component
const RoomData = ({ property }) => {
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [showFullFacilities, setShowFullFacilities] = useState(false);

    // Generate features from property data
    const roomFeatures = [
        property?.roomSpecs && `${property.roomSpecs} bedrooms`,
        property?.sizeSqft && `${property.sizeSqft} sqft`,
        property?.bathrooms && `${property.bathrooms} bathrooms`,
        property?.furnished && "Furnished",
        property?.cleaningIncluded && "Cleaning Included",
        property?.balcony && "Balcony",
        property?.bedLinen && "Bed Linen/Towels"
    ].filter(Boolean);

    const facilities = [
        { icon: "bi-house", label: "Shared Living Room", show: property?.sharedLivingRoom },
        { icon: "bi-tree", label: "Balcony", show: property?.balcony },
        { icon: "bi-wifi", label: "WiFi", show: property?.wifi },
        { icon: "bi-thermometer-high", label: "Heating", show: property?.heating },
        { icon: "bi-droplet", label: "Washing Machine", show: property?.washingMachine },
        { icon: "bi-wind", label: "Air Conditioner", show: property?.airConditioner },
        { icon: "bi-car-front", label: "Parking", show: property?.parking }
    ].filter(facility => facility.show);

    const landlordRules = [
        { icon: "bi-ban", label: "No smoking allowed", show: property?.noSmoking },
        { icon: "bi-x-circle", label: "Pets are not allowed", show: property?.noPets },
        { icon: "bi-person-check", label: "Overnight guests are allowed", show: property?.overnightGuests }
    ].filter(rule => rule.show !== undefined);

    // Format price with currency
    const formatPrice = (price, currency = "USD") => {
        return `${currency} ${Number(price).toLocaleString()}`;
    };

    return (
        <div className="flex flex-col gap-4 mt-6">
            {/* Room Title and Price */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                    {property?.title || "Property Details"}
                </h1>
                <div className="text-2xl sm:text-3xl font-semibold text-gray-900">
                    {formatPrice(property?.basePrice || 0, property?.currency)} 
                    <span className="text-lg font-normal text-gray-600">
                        {property?.billsIncluded ? "/Bills included" : "/month"}
                    </span>
                </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 text-gray-600">
                <i className="bi bi-geo-alt-fill text-gray-700"></i>
                <span>{property?.address || "Address not available"}</span>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2 overflow-x-auto py-1">
                {roomFeatures.map((feature, index) => (
                    <span key={index} className="text-xs font-medium text-gray-700 bg-gray-100 rounded-full py-1 px-3 whitespace-nowrap">
                        {feature}
                    </span>
                ))}
            </div>

            {/* Description */}
            <div className="border border-gray-300 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
                <p className="text-sm text-gray-700 mb-3">
                    {property?.description ? (
                        showFullDescription ? property.description : 
                        property.description.length > 200 ? 
                        `${property.description.substring(0, 200)}...` : 
                        property.description
                    ) : (
                        "No description available for this property."
                    )}
                </p>
                {property?.description && property.description.length > 200 && (
                    <button 
                        className="text-sm font-medium text-gray-500 bg-gray-100 rounded-full py-1 px-3 inline-flex items-center gap-1"
                        onClick={() => setShowFullDescription(!showFullDescription)}
                    >
                        {showFullDescription ? "Show less" : "Show more"} 
                        <i className={`bi bi-chevron-${showFullDescription ? 'up' : 'down'} text-xs`}></i>
                    </button>
                )}
            </div>

            {/* Facilities */}
            {facilities.length > 0 && (
                <div className="border border-gray-300 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Facilities</h3>
                    <div className="flex flex-wrap gap-2">
                        {facilities.map((facility, index) => (
                            <span key={index} className="text-xs font-medium text-gray-700 bg-gray-100 rounded-full py-1 px-3 inline-flex items-center gap-1">
                                <i className={`bi ${facility.icon}`}></i> {facility.label}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Availability */}
            <div className="border border-gray-300 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-1/4">
                        <p className="text-sm text-gray-600 mb-2">
                            Available from: <span className="font-semibold">
                                {property?.availableFrom ? new Date(property.availableFrom).toLocaleDateString() : "Contact owner"}
                            </span>
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                            Minimum stay: <span className="font-semibold">
                                {property?.minimumStay || "Contact owner"}
                            </span>
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                            Maximum stay: <span className="font-semibold">
                                {property?.maximumStay || "Not specified"}
                            </span>
                        </p>
                        <p className="text-sm text-gray-600">
                            Status: <span className="font-semibold">
                                {property?.status || "Available"}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Landlord Rules */}
            {landlordRules.length > 0 && (
                <div className="border border-gray-300 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">House Rules</h3>
                    <div className="flex flex-wrap gap-2">
                        {landlordRules.map((rule, index) => (
                            <span key={index} className="text-xs font-medium text-gray-700 bg-gray-100 rounded-full py-1 px-3 inline-flex items-center gap-1">
                                <i className={`bi ${rule.icon}`}></i> {rule.label}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// BookingRequest Component
const BookingRequest = ({ property }) => {
    return (
        <div className="w-full border border-gray-300 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Booking Request</h3>
                <div className="flex gap-3">
                    <button className="text-gray-700 hover:text-primary transition" aria-label="Share">
                        <i className="bi bi-share text-lg"></i>
                    </button>
                    <button className="text-gray-700 hover:text-primary transition" aria-label="Save">
                        <i className="bi bi-heart text-lg"></i>
                    </button>
                </div>
            </div>

            <form className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="w-full sm:w-1/2">
                        <label htmlFor="check-in" className="block text-sm font-medium text-gray-700 mb-1">
                            Check In
                        </label>
                        <input
                            type="date"
                            id="check-in"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                    <div className="w-full sm:w-1/2">
                        <label htmlFor="check-out" className="block text-sm font-medium text-gray-700 mb-1">
                            Check Out
                        </label>
                        <input
                            type="date"
                            id="check-out"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-lg transition duration-300"
                >
                    Check Booking
                </button>
            </form>
        </div>
    );
};

// Location Component
const Location = ({ property }) => {
    const [mapLoaded, setMapLoaded] = useState(false);
    
    const containerStyle = {
        width: '100%',
        height: '200px'
    };

    // Use property coordinates or default to Lisbon
    const center = property?.coordinates ? {
        lat: property.coordinates.lat || 38.7223,
        lng: property.coordinates.lng || -9.1393
    } : {
        lat: 38.7223,
        lng: -9.1393
    };

    return (
        <div className="space-y-4">
            {/* Map Section */}
            <div className="border border-gray-300 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Location</h3>
                <div className="flex items-center gap-1 text-gray-600 mb-3">
                    <i className="bi bi-geo-alt-fill text-gray-700"></i>
                    <span>{property?.address || "Address not available"}</span>
                </div>

                <LoadScript
                    googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyBpaYxCRgySSKHODD5RQoxd3V0k6b9jxUw"}
                    onLoad={() => setMapLoaded(true)}
                >
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={15}
                    >
                        <Marker position={center} />
                    </GoogleMap>
                </LoadScript>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Calculate route by public transport to:
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            placeholder="Work/University"
                            className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <button className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition duration-300 whitespace-nowrap">
                            Calculate
                        </button>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="border border-gray-300 rounded-lg p-4 space-y-2">
                {[
                    "Professional Team",
                    "Book a Call",
                    "Verified Room",
                    "Fast and Secure Booking"
                ].map((feature, index) => (
                    <div key={index} className="bg-gray-50 rounded-full py-1 px-3">
                        <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <i className="bi bi-check-circle-fill text-primary"></i>
                            {feature}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Main PropertyDetails Component
const PropertyDetails = ({ property }) => {
    if (!property) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="text-gray-500 text-6xl mb-4">🏠</div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Property Data</h2>
                        <p className="text-gray-600">Unable to load property information.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column (Main Content) */}
                <div className="w-full lg:w-[71%]">
                    <RoomDescriptionSlider property={property} />
                    <RoomData property={property} />
                </div>

                {/* Right Column (Sidebar) */}
                <div className="w-full lg:w-[28%] flex flex-col gap-4">
                    <BookingRequest property={property} />
                    <Location property={property} />
                </div>
            </div>
        </div>
    );
};

export default PropertyDetails;