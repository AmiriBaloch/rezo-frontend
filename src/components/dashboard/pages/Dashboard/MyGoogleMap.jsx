import { GoogleMap, LoadScript, OverlayView } from "@react-google-maps/api";
import { useEffect, useState, useMemo } from "react";
import { useGetAllPropertiesQuery } from "../../../../features/properties/propertyApiSlice";

const mapContainerStyle = {
  width: "100%",
  height: "596px",
  overflow: "hidden",
};

const center = {
  lat: 31.5204,
  lng: 74.3587,
};

function MyGoogleMap() {
  const [search, setSearch] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);
  const { data, isLoading, isError } = useGetAllPropertiesQuery();

  // Handle backend structure like { success: true, data: [...] }
  const properties = data?.data ?? [];

  const mappedProperties = useMemo(() => {
    return properties
      .filter((item) => {
        // Support both old and new location formats
        if (item.location?.coordinates?.length === 2) {
          return true; // New GeoJSON format
        }
        if (item.location?.lat && item.location?.lng) {
          return true; // Old format
        }
        return false;
      })
      .map((item) => {
        let lat, lng;
        
        // Handle different location formats
        if (item.location?.coordinates?.length === 2) {
          // New GeoJSON format: [lng, lat]
          lng = item.location.coordinates[0];
          lat = item.location.coordinates[1];
        } else if (item.location?.lat && item.location?.lng) {
          // Old format: { lat, lng }
          lat = item.location.lat;
          lng = item.location.lng;
        } else {
          // Fallback to default
          lat = 31.5204;
          lng = 74.3587;
        }

        return {
          id: item.id,
          title: item.title,
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          image: item.photos?.[0] || "/bg.jpg",
          location: `${item.city || 'Unknown'}, ${item.country || 'Unknown'}`,
          price: item.basePrice,
          size: item.sizeSqft || "N/A",
          beds: item.roomSpecs?.[0]?.count || 1,
          baths: item.roomSpecs?.find(spec => spec.type === 'BATHROOM')?.count || 1,
        };
      });
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return mappedProperties.filter((property) =>
      property.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, mappedProperties]);

  if (isLoading) return <p className="p-4">Loading map...</p>;
  if (isError)
    return <p className="p-4 text-red-500">Failed to load properties</p>;

  return (
    <div className="flex flex-col gap-4 p-4 md:p-0">
      <div className="rounded-md">
        <div className="flex flex-col md:flex-row justify-between bg-white px-[30px] py-4 gap-4">
          <h2 className="text-[22px] font-semibold text-f3">Map</h2>
          <div className="relative w-full md:w-[360px]">
            <input
              type="text"
              placeholder="Search property"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#E0EEFC] rounded-[50px] placeholder:text-[#757575] text-sm py-3 px-[40px] focus:outline-none text-[#757575]"
            />
            <i className="bi bi-search text-[#757575] absolute left-4 top-[50%] translate-y-[-50%] text-md"></i>
          </div>
        </div>

        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyBpaYxCRgySSKHODD5RQoxd3V0k6b9jxUw"}
          onLoad={() => setMapLoaded(true)}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center} // ✅ use correct variable
            zoom={12}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            {filteredProperties.map((property) => (
              <OverlayView
                key={property.id}
                position={{ lat: property.lat, lng: property.lng }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div className="bg-white shadow-lg rounded-xl overflow-hidden w-48 md:w-56 hover:scale-105 transition-transform duration-200 cursor-pointer">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-24 md:h-28 object-cover p-1 rounded-xl"
                  />
                  <div className="p-2 md:p-3">
                    <h3 className="text-sm md:text-base font-semibold">
                      {property.title}
                    </h3>
                    <p className="text-xs text-gray-500">{property.location}</p>
                    <div className="flex justify-between items-center mt-1 md:mt-2 text-xs md:text-sm">
                      <span className="text-base md:text-lg font-bold">
                        PKR {property.price}
                      </span>
                      <span className="text-gray-500">{property.size} ft²</span>
                    </div>
                    <div className="flex justify-between text-gray-600 text-xs mt-1 md:mt-2">
                      <span>🛏 {property.beds} Beds</span>
                      <span>🛁 {property.baths} Baths</span>
                    </div>
                  </div>
                </div>
              </OverlayView>
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}

export default MyGoogleMap;
