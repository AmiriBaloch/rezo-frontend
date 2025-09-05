import React, { useState, useEffect } from "react";
import { FiMinus, FiPlus, FiSearch, FiFilter, FiMapPin, FiX } from "react-icons/fi";
import { FaBed, FaBath } from "react-icons/fa";
import { GoogleMap, LoadScript, OverlayView } from "@react-google-maps/api";
import { useGetAllPropertiesQuery } from '../../features/properties/propertyApiSlice';
import PropertyCard from '../PropertyCard';

// Main Search Page Component
export default function AfterSearch() {
    return (
        <div className="w-full flex flex-col lg:flex-row justify-between px-4 sm:px-6 lg:px-8 py-6 gap-6">
            {/* Sidebar - Hidden on mobile, shown on larger screens */}
            <div className="hidden lg:block lg:w-1/4 xl:w-1/5">
                <SearchSidebar />
            </div>

            {/* Mobile Filters Button - Shown only on mobile */}
            <div className="lg:hidden">
                <MobileFilterButton />
            </div>

            {/* Main Content Area */}
            <div className="w-full lg:w-3/4 xl:w-4/5 flex flex-col gap-8">
                <MapWithSearch />
                <PropertyListings />
                <FAQSection />
            </div>
        </div>
    );
}

// Mobile Filter Button Component
const MobileFilterButton = () => {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowFilters(true)}
                className="w-full bg-primary text-white py-3 rounded-lg mb-4 flex items-center justify-center gap-2"
            >
                <FiFilter className="text-lg" />
                Show Filters
            </button>

            {/* Mobile Filter Overlay */}
            {showFilters && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
                    <div className="bg-white h-full w-4/5 max-w-sm p-4 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Filters</h2>
                            <button onClick={() => setShowFilters(false)}>
                                <FiX className="text-2xl" />
                            </button>
                        </div>
                        <SearchSidebar />
                        <button
                            onClick={() => setShowFilters(false)}
                            className="w-full bg-primary text-white py-3 rounded-lg mt-4"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

// Search Sidebar Component
const SearchSidebar = () => {
    const [minBudget, setMinBudget] = useState("");
    const [maxBudget, setMaxBudget] = useState("");
    const [showMoreRooms, setShowMoreRooms] = useState(false);
    const [showMoreAmenities, setShowMoreAmenities] = useState(false);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);

    const locations = ["Lisbon", "Porto", "Faro", "Coimbra"];
    const roomTypes = ["Studio", "Apartment", "Private Room", "Shared Room"];
    const amenities = [
        "Heating",
        "Dryer",
        "Air conditioning",
        "Washing Machine",
        "WiFi",
        "Kitchen",
        "TV",
        "Parking"
    ];

    const toggleSelection = (list, setList, item) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    return (
        <div className="w-full bg-white p-4 shadow-md rounded-lg sticky top-4">
            <h2 className="text-xl font-bold mb-4">Filters</h2>

            {/* Location Filter */}
            <div className="mb-6">
                <h3 className="font-semibold mb-3">Location</h3>
                <div className="space-y-2">
                    {locations.map(location => (
                        <label key={location} className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                checked={selectedLocations.includes(location)}
                                onChange={() => toggleSelection(selectedLocations, setSelectedLocations, location)}
                                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <span>{location}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Budget Filter */}
            <div className="mb-6">
                <h3 className="font-semibold mb-3">Budget (per month)</h3>
                <div className="flex space-x-3">
                    <input
                        type="number"
                        placeholder="Min €"
                        className="border p-2 rounded w-1/2 focus:ring-primary focus:border-primary"
                        value={minBudget}
                        onChange={(e) => setMinBudget(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Max €"
                        className="border p-2 rounded w-1/2 focus:ring-primary focus:border-primary"
                        value={maxBudget}
                        onChange={(e) => setMaxBudget(e.target.value)}
                    />
                </div>
            </div>

            {/* Room Type Filter */}
            <div className="mb-6">
                <h3 className="font-semibold mb-3">Room Type</h3>
                <div className="space-y-2">
                    {roomTypes.slice(0, showMoreRooms ? roomTypes.length : 2).map(type => (
                        <label key={type} className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                checked={selectedRoomTypes.includes(type)}
                                onChange={() => toggleSelection(selectedRoomTypes, setSelectedRoomTypes, type)}
                                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <span>{type}</span>
                        </label>
                    ))}
                    <button
                        className="text-primary text-sm font-medium mt-1 flex items-center"
                        onClick={() => setShowMoreRooms(!showMoreRooms)}
                    >
                        {showMoreRooms ? "Show less" : "Show more"}
                    </button>
                </div>
            </div>

            {/* Amenities Filter */}
            <div className="mb-4">
                <h3 className="font-semibold mb-3">Amenities</h3>
                <div className="space-y-2">
                    {amenities.slice(0, showMoreAmenities ? amenities.length : 3).map(amenity => (
                        <label key={amenity} className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                checked={selectedAmenities.includes(amenity)}
                                onChange={() => toggleSelection(selectedAmenities, setSelectedAmenities, amenity)}
                                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <span>{amenity}</span>
                        </label>
                    ))}
                    <button
                        className="text-primary text-sm font-medium mt-1 flex items-center"
                        onClick={() => setShowMoreAmenities(!showMoreAmenities)}
                    >
                        {showMoreAmenities ? "Show less" : "Show more"}
                    </button>
                </div>
            </div>

            <button className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-dark transition">
                Apply Filters
            </button>
        </div>
    );
};

// Map with Search Component
const MapWithSearch = () => {
    const [search, setSearch] = useState("");
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapCenter, setMapCenter] = useState({
        lat: 38.7223,
        lng: -9.1393
    });
    const [savedProperties, setSavedProperties] = useState([]);

    // Fetch approved properties from backend
    const { data, isLoading, error } = useGetAllPropertiesQuery();
    // Deduplicate by property id
    const properties = Array.from(new Map((data?.data || []).map(p => [p.id, p])).values());

    useEffect(() => {
        const results = properties.filter(property =>
            property.title.toLowerCase().includes(search.toLowerCase()) ||
            (property.location?.toLowerCase().includes(search.toLowerCase()) || "")
        );
        setFilteredProperties(results);
    }, [search, properties]);

    const toggleSaveProperty = (id) => {
        setSavedProperties((prev) =>
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        );
    };

    const handleCompare = (propertyId) => {
        // Handle compare functionality
        console.log("Compare property:", propertyId);
    };

    if (isLoading) return <div>Loading properties...</div>;
    if (error) return <div>Error loading properties</div>;

    return (
        <div className="relative rounded-xl overflow-hidden shadow-lg">
            <LoadScript
                googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyBpaYxCRgySSKHODD5RQoxd3V0k6b9jxUw"}
                onLoad={() => setMapLoaded(true)}
            >
                <GoogleMap
                    mapContainerStyle={{
                        width: "100%",
                        height: "500px",
                        borderRadius: "10px"
                    }}
                    center={mapCenter}
                    zoom={13}
                >
                    {filteredProperties.map(property => (
                        <OverlayView
                            key={property.id}
                            position={{ lat: property.location?.lat || 0, lng: property.location?.lng || 0 }}
                            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        >
                            <PropertyCard 
                                property={property}
                                isFavorite={savedProperties.includes(property.id)}
                                onToggleFavorite={toggleSaveProperty}
                                onCompare={handleCompare}
                            />
                        </OverlayView>
                    ))}
                </GoogleMap>
            </LoadScript>

            <div className="absolute top-4 left-0 right-0 px-4">
                <div className="relative max-w-2xl mx-auto">
                    <input
                        type="text"
                        placeholder="Search by location, property type, or amenities..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full py-3 pl-10 pr-4 rounded-full shadow-md border-none focus:ring-2 focus:ring-primary"
                    />
                    <FiSearch className="absolute left-3 top-3.5 text-gray-400 text-xl" />
                </div>
            </div>
        </div>
    );
};

// Property Listings Component
const PropertyListings = () => {
    // Fetch approved properties from backend
    const { data, isLoading, error } = useGetAllPropertiesQuery();
    // Deduplicate by property id
    const properties = Array.from(new Map((data?.data || []).map(p => [p.id, p])).values());

    const [savedProperties, setSavedProperties] = useState([]);

    const toggleSaveProperty = (id) => {
        setSavedProperties((prev) =>
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        );
    };

    const handleCompare = (propertyId) => {
        // Handle compare functionality
        console.log("Compare property:", propertyId);
    };

    if (isLoading) return <div>Loading properties...</div>;
    if (error) return <div>Error loading properties</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Available Properties</h2>
                <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Sort by:</span>
                    <select className="border rounded-lg px-3 py-1 focus:ring-primary focus:border-primary">
                        <option>Price (Low to High)</option>
                        <option>Price (High to Low)</option>
                        <option>Newest</option>
                        <option>Size</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map(property => (
                    <PropertyCard 
                        key={property.id} 
                        property={property}
                        isFavorite={savedProperties.includes(property.id)}
                        onToggleFavorite={toggleSaveProperty}
                        onCompare={handleCompare}
                    />
                ))}
            </div>

            <div className="flex justify-center mt-6">
                <button className="bg-white border border-primary text-primary px-6 py-2 rounded-lg hover:bg-primary hover:text-white transition">
                    Load More
                </button>
            </div>
        </div>
    );
};

// FAQ Section Component
const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "How do I book a property?",
            answer: "You can book directly through our platform by selecting your dates and completing the payment process."
        },
        // Add more FAQs...
    ];

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                        <button
                            className="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100 transition"
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        >
                            <span className="font-medium">{faq.question}</span>
                            {openIndex === index ? <FiMinus /> : <FiPlus />}
                        </button>
                        {openIndex === index && (
                            <div className="p-4 bg-white">
                                <p className="text-gray-600">{faq.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};