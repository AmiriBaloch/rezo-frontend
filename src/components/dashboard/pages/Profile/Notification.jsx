import { useState, useEffect } from 'react';

function Notification() {
  // State for notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    messages: {
      email: true,
      sms: false
    },
    tasks: {
      email: true,
      sms: false
    }
  });

  // Fetch initial settings from backend
  useEffect(() => {
    const fetchNotificationSettings = async () => {
      try {
        // const response = await fetch('/api/notification-settings');
        // const data = await response.json();
        // setNotificationSettings(data);
      } catch (error) {
        console.error("Failed to fetch notification settings:", error);
      }
    };

    fetchNotificationSettings();
  }, []);

  // Toggle notification setting
  const toggleNotification = (category, type) => {
    const newSettings = {
      ...notificationSettings,
      [category]: {
        ...notificationSettings[category],
        [type]: !notificationSettings[category][type]
      }
    };

    setNotificationSettings(newSettings);

    // Update backend
    updateNotificationSettings(category, type, !notificationSettings[category][type]);
  };

  // Example API call to update settings
  const updateNotificationSettings = async (category, type, value) => {
    try {
      /*
      await fetch('/api/notification-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          type,
          value
        })
      });
      */
    } catch (error) {
      console.error("Failed to update notification settings:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6 md:gap-[50px] w-full p-4 md:p-0">
      {/* Messages Notification */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center bg-white shadow-sm md:shadow-[0px_0px_4px_0px_#00000040] p-4 md:p-[50px] rounded-lg">
        <div className="w-full md:w-auto mb-4 md:mb-0">
          <h3 className="text-lg md:text-xl font-medium mb-2 md:mb-[15px]">Messages</h3>
          <p className="text-sm md:text-base font-normal">
            Choose how you get notified when someone messages you in chat.
          </p>
        </div>

        <div className="w-full md:w-auto flex flex-col gap-2 md:gap-[5px]">
          <div className="flex justify-between items-center pb-2 md:pb-0 border-b border-gray-300 md:border-[#8D8D8D]">
            <span className="text-sm md:text-base font-medium">Email</span>
            <button
              onClick={() => toggleNotification('messages', 'email')}
              className="flex items-center"
            >
              <i className={`bi ${notificationSettings.messages.email ? 'bi-toggle-on text-f2' : 'bi-toggle-off text-gray-300'} text-2xl md:text-3xl ml-4 md:ml-[40px] mr-2 md:mr-[10px]`}></i>
              <span className="text-sm md:text-base">
                {notificationSettings.messages.email ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base font-medium">SMS</span>
            <button
              onClick={() => toggleNotification('messages', 'sms')}
              className="flex items-center"
            >
              <i className={`bi ${notificationSettings.messages.sms ? 'bi-toggle-on text-f2' : 'bi-toggle-off text-gray-300'} text-2xl md:text-3xl ml-4 md:ml-[40px] mr-2 md:mr-[10px]`}></i>
              <span className="text-sm md:text-base">
                {notificationSettings.messages.sms ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Tasks Notification */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center bg-white shadow-sm md:shadow-[0px_0px_4px_0px_#00000040] p-4 md:p-[50px] rounded-lg">
        <div className="w-full md:w-auto mb-4 md:mb-0">
          <h3 className="text-lg md:text-xl font-medium mb-2 md:mb-[15px]">Tasks</h3>
          <p className="text-sm md:text-base font-normal">
            Choose how you get notified about tasks.
          </p>
        </div>

        <div className="w-full md:w-auto flex flex-col gap-2 md:gap-[5px]">
          <div className="flex justify-between items-center pb-2 md:pb-0 border-b border-gray-300 md:border-[#8D8D8D]">
            <span className="text-sm md:text-base font-medium">Email</span>
            <button
              onClick={() => toggleNotification('tasks', 'email')}
              className="flex items-center"
            >
              <i className={`bi ${notificationSettings.tasks.email ? 'bi-toggle-on text-f2' : 'bi-toggle-off text-gray-300'} text-2xl md:text-3xl ml-4 md:ml-[40px] mr-2 md:mr-[10px]`}></i>
              <span className="text-sm md:text-base">
                {notificationSettings.tasks.email ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base font-medium">SMS</span>
            <button
              onClick={() => toggleNotification('tasks', 'sms')}
              className="flex items-center"
            >
              <i className={`bi ${notificationSettings.tasks.sms ? 'bi-toggle-on text-f2' : 'bi-toggle-off text-gray-300'} text-2xl md:text-3xl ml-4 md:ml-[40px] mr-2 md:mr-[10px]`}></i>
              <span className="text-sm md:text-base">
                {notificationSettings.tasks.sms ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notification;