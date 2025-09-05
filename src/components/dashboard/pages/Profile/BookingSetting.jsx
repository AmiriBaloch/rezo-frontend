import { useState, useEffect } from 'react';

function BookingSetting() {
  const [globalSettings, setGlobalSettings] = useState([
    {
      id: 1,
      title: "Enhanced Member Setting",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse",
      enabled: true
    },
    {
      id: 2,
      title: "Booking Approvals",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse",
      enabled: false
    }
  ]);

  const [properties, setProperties] = useState([
    {
      id: 1,
      name: "Northridge Parkway",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YnVpbGRpbmd8ZW58MHx8MHx8fDA%3D",
      enhancedScreening: true,
      bookingApprovals: false
    },
    {
      id: 2,
      name: "Sunset Boulevard",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnVpbGRpbmd8ZW58MHx8MHx8fDA%3D",
      enhancedScreening: false,
      bookingApprovals: true
    }
  ]);

  // Fetch data from backend (example)
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // const response = await fetch('/api/booking-settings');
        // const data = await response.json();
        // setGlobalSettings(data.globalSettings);
        // setProperties(data.properties);
      } catch (error) {
        console.error("Failed to fetch booking settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const toggleGlobalSetting = (id) => {
    setGlobalSettings(prevSettings =>
      prevSettings.map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );

    // Here you would typically make an API call to update the backend
    // updateGlobalSetting(id);
  };

  const togglePropertySetting = (propertyId, settingType) => {
    setProperties(prevProperties =>
      prevProperties.map(property =>
        property.id === propertyId
          ? { ...property, [settingType]: !property[settingType] }
          : property
      )
    );

    // Here you would typically make an API call to update the backend
    // updatePropertySetting(propertyId, settingType);
  };

  // Example API call functions (would be implemented based on your backend)
  /*
  const updateGlobalSetting = async (id) => {
    try {
      await fetch(`/api/global-settings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !globalSettings.find(s => s.id === id).enabled })
      });
    } catch (error) {
      console.error("Failed to update global setting:", error);
    }
  };
 
  const updatePropertySetting = async (propertyId, settingType) => {
    try {
      await fetch(`/api/properties/${propertyId}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [settingType]: !properties.find(p => p.id === propertyId)[settingType] })
      });
    } catch (error) {
      console.error("Failed to update property setting:", error);
    }
  };
  */

  return (
    <div className="flex flex-col gap-6 md:gap-[50px] w-full p-4 md:px-[20px]">
      {/* Global Settings Section */}
      <div className="w-full flex flex-col gap-6 md:gap-[30px]">
        <h3 className="text-xl md:text-2xl font-semibold">Booking setting</h3>

        {globalSettings.map((setting) => (
          <div
            key={setting.id}
            className="w-full flex justify-between items-center bg-white shadow-sm md:shadow-[0px_0px_4px_0px_#00000040] p-4 md:p-[50px] rounded-md md:rounded-[5px]"
          >
            <div className="w-full">
              <div className="w-full flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-[20px]">
                <h3 className="text-lg md:text-xl font-medium mb-2 md:mb-[15px]">
                  {setting.title}
                </h3>
                <button
                  onClick={() => toggleGlobalSetting(setting.id)}
                  className="flex items-center justify-end md:justify-start"
                >
                  <i className={`bi ${setting.enabled ? 'bi-toggle-on text-f2' : 'bi-toggle-off text-gray-400'} text-2xl md:text-3xl ml-0 md:ml-[40px] mr-2 md:mr-[10px]`}></i>
                  <span className="text-sm md:hidden">
                    {setting.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </button>
              </div>

              <p className="text-sm md:text-base font-normal">
                {setting.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Property Settings Section */}
      <div className="w-full flex flex-col gap-6 md:gap-[30px]">
        <h3 className="text-xl md:text-2xl font-semibold">
          Booking setting per property
        </h3>

        {properties.map((property) => (
          <div
            key={property.id}
            className="w-full flex flex-col md:flex-row justify-between items-center bg-white shadow-sm md:shadow-[0px_0px_4px_0px_#00000040] py-2 md:py-[10px] pl-2 md:pl-[10px] pr-4 md:pr-[60px] rounded-md md:rounded-[5px]"
          >
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-[20px] w-full md:w-auto">
              <img
                src={property.image}
                alt={property.name}
                className="w-full md:w-[250px] h-32 md:h-auto object-cover rounded-md"
              />
              <div className="w-full">
                <h4 className="text-base md:text-lg font-semibold mb-2 md:mb-[20px]">
                  {property.name}
                </h4>
                <div className="flex flex-wrap gap-2 md:gap-[10px]">
                  <button
                    onClick={() => togglePropertySetting(property.id, 'enhancedScreening')}
                    className={`text-xs md:text-sm font-medium border py-1 md:py-[8px] px-2 md:px-[27px] rounded ${property.enhancedScreening ? 'bg-f2 bg-opacity-10 border-f2' : 'border-[#ADACAC]'}`}
                  >
                    Enhanced Member Screening
                  </button>
                  <button
                    onClick={() => togglePropertySetting(property.id, 'bookingApprovals')}
                    className={`text-xs md:text-sm font-medium border py-1 md:py-[8px] px-2 md:px-[27px] rounded ${property.bookingApprovals ? 'bg-f2 bg-opacity-10 border-f2' : 'border-[#ADACAC]'}`}
                  >
                    Booking Approvals
                  </button>
                </div>
              </div>
            </div>
            <button className="text-sm md:text-base text-f2 font-medium underline mt-2 md:mt-0 self-end md:self-auto">
              Property Setting
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookingSetting;