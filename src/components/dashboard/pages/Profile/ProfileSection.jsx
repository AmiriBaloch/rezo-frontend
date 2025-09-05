import { useState, useEffect } from "react";

export default function ProfileSection() {
  const [isEditable, setIsEditable] = useState({
    basicInfo: false,
    bookingRequest: false,
    additionalDetails: false,
  });

  const [profileData, setProfileData] = useState({
    firstName: "Diky",
    lastName: "Micheal",
    email: "diky.micheal@gmail.com",
    gender: "Male",
    phoneNumber: "+12 345 6789",
    nationality: "Pakistani",
    currentAddress: "6789 Oakwood Ave, Los Angeles, CA 90036",
    profileImage: "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
  });

  // Password change states
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Reset password states
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Fetch profile data from backend
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // const response = await fetch('/api/profile');
        // const data = await response.json();
        // setProfileData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Toggle edit mode
  const handleEdit = (section) => {
    setIsEditable((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle profile image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  // Save profile changes
  const handleSave = async (section) => {
    try {
      // await fetch('/api/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(profileData)
      // });

      setIsEditable(prev => ({
        ...prev,
        [section]: false
      }));
      showMessage("Profile updated successfully", "success");
    } catch (error) {
      console.error("Failed to save profile:", error);
      showMessage("Failed to update profile", "error");
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage("New passwords don't match", "error");
      return;
    }

    try {
      // await fetch('/api/change-password', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     currentPassword: passwordData.currentPassword,
      //     newPassword: passwordData.newPassword
      //   })
      // });

      setShowChangePassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      showMessage("Password changed successfully", "success");
    } catch (error) {
      console.error("Failed to change password:", error);
      showMessage("Failed to change password", "error");
    }
  };

  // Reset password
  const handleResetPassword = async () => {
    if (!resetEmail) {
      showMessage("Please enter your email", "error");
      return;
    }

    try {
      // await fetch('/api/reset-password', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email: resetEmail })
      // });

      setShowResetPassword(false);
      setResetEmail("");
      showMessage("Password reset link sent to your email", "success");
    } catch (error) {
      console.error("Failed to reset password:", error);
      showMessage("Failed to send reset link", "error");
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        // await fetch('/api/account', {
        //   method: 'DELETE'
        // });
        // Redirect to home or login page after deletion
        // window.location.href = '/';
      } catch (error) {
        console.error("Failed to delete account:", error);
      }
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    // Implement your sign out logic
    // Example: 
    // localStorage.removeItem('token');
    // window.location.href = '/login';
  };

  // Show message
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-6 md:gap-[50px] w-full p-4 md:p-0">
      {/* Message Alert */}
      {message.text && (
        <div className={`p-4 rounded-md ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start justify-between gap-6 md:gap-0">
        {/* Profile Image Section */}
        <div className="w-full md:w-[29%] bg-white flex flex-col items-center py-6 md:py-[30px] gap-6 md:gap-[50px] rounded-lg shadow-sm md:shadow-md">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative">
              <img
                src={profileData.profileImage}
                alt="Profile"
                className="w-32 h-32 md:w-[150px] md:h-[150px] rounded-full object-cover"
              />
              <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </label>
            </div>
            <div>
              <h2 className="text-lg md:text-xl text-[#484848] font-semibold">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="my-3 text-base md:text-lg text-[#6C6C6C] font-light">
                {profileData.email}
              </p>
              <label className="text-sm md:text-base py-2 md:py-[12px] px-4 md:px-[20px] bg-[#16457E] text-white rounded-md md:rounded-[5px] cursor-pointer">
                Upload new Picture
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:gap-[20px] w-full px-4">
            <button
              onClick={() => setShowChangePassword(true)}
              className="text-sm md:text-base py-2 md:py-[10px] px-3 md:px-[16px] bg-transparent text-[#16457E] rounded-md md:rounded-[5px] border-[#16457E] border"
            >
              Change Password
            </button>
            <button
              onClick={() => setShowResetPassword(true)}
              className="text-sm md:text-base py-2 md:py-[10px] px-3 md:px-[16px] bg-transparent text-[#AA2117] rounded-md md:rounded-[5px] border-[#AA2117] border"
            >
              Reset Password
            </button>
          </div>
          <button
            onClick={handleDeleteAccount}
            className="text-sm md:text-base bg-[#AA2117] text-white rounded-md md:rounded-[5px] shadow-sm py-2 md:py-[10px] px-3 md:px-[16px]"
          >
            Delete Account
          </button>
        </div>

        {/* Basic Info Section */}
        <div className="w-full md:w-[69%] bg-white p-4 md:p-6 rounded-lg shadow-sm md:shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl text-[#484848] font-semibold">
              Basic Info
            </h2>
            {isEditable.basicInfo ? (
              <button
                onClick={() => handleSave("basicInfo")}
                className="bg-green-600 text-white rounded py-2 px-6 text-sm md:text-base font-medium"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => handleEdit("basicInfo")}
                className="bg-[#16457E] text-white rounded py-2 px-6 text-sm md:text-base font-medium"
              >
                Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block font-normal text-sm md:text-base text-[#484848] mb-2"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={profileData.firstName}
                onChange={handleInputChange}
                className="py-2 md:py-[10px] px-3 md:px-[14px] border rounded w-full text-sm md:text-base text-[#667085] focus:outline-none focus:ring-1 focus:ring-[#16457E] placeholder:text-[#667085]"
                placeholder="First Name"
                disabled={!isEditable.basicInfo}
              />
            </div>
            <div>
              <label className="block font-normal text-sm md:text-base text-[#484848] mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={profileData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="py-2 md:py-[10px] px-3 md:px-[14px] border rounded w-full text-sm md:text-base text-[#667085] focus:outline-none focus:ring-1 focus:ring-[#16457E] placeholder:text-[#667085]"
                disabled={!isEditable.basicInfo}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block font-normal text-sm md:text-base text-[#484848] mb-2">
              Gender
            </label>
            <select
              name="gender"
              value={profileData.gender}
              onChange={handleInputChange}
              className="w-full py-2 md:py-[10px] px-3 md:px-[14px] border rounded text-sm md:text-base text-[#667085] focus:outline-none focus:ring-1 focus:ring-[#16457E]"
              disabled={!isEditable.basicInfo}
            >
              <option value="">Choose Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mt-4">
            <label className="block font-normal text-sm md:text-base text-[#484848] mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="py-2 md:py-[10px] px-3 md:px-[14px] border rounded w-full text-sm md:text-base text-[#667085] focus:outline-none focus:ring-1 focus:ring-[#16457E] placeholder:text-[#667085]"
              disabled={!isEditable.basicInfo}
            />
          </div>

          <div className="mt-4">
            <label className="block font-normal text-sm md:text-base text-[#484848] mb-2">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={profileData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Phone Number"
              className="py-2 md:py-[10px] px-3 md:px-[14px] border rounded w-full text-sm md:text-base text-[#667085] focus:outline-none focus:ring-1 focus:ring-[#16457E] placeholder:text-[#667085]"
              disabled={!isEditable.basicInfo}
            />
          </div>

          <div className="mt-4">
            <label className="block font-normal text-sm md:text-base text-[#484848] mb-2">
              Nationality
            </label>
            <select
              name="nationality"
              value={profileData.nationality}
              onChange={handleInputChange}
              className="w-full py-2 md:py-[10px] px-3 md:px-[14px] border rounded text-sm md:text-base text-[#667085] focus:outline-none focus:ring-1 focus:ring-[#16457E]"
              disabled={!isEditable.basicInfo}
            >
              <option value="">Select Nationality</option>
              <option value="Pakistani">Pakistani</option>
              <option value="Indian">Indian</option>
              <option value="American">American</option>
              <option value="British">British</option>
            </select>
          </div>

          <div className="mt-4">
            <label className="block font-normal text-sm md:text-base text-[#484848] mb-2">
              Current Address
            </label>
            <input
              type="text"
              name="currentAddress"
              value={profileData.currentAddress}
              onChange={handleInputChange}
              placeholder="Current Address"
              className="py-2 md:py-[10px] px-3 md:px-[14px] border rounded w-full text-sm md:text-base text-[#667085] focus:outline-none focus:ring-1 focus:ring-[#16457E] placeholder:text-[#667085]"
              disabled={!isEditable.basicInfo}
            />
          </div>

          <div className="w-full flex justify-end mt-6">
            <button
              onClick={handleSignOut}
              className="text-sm md:text-base bg-[#AA2117] text-white rounded-md md:rounded-[5px] shadow-sm py-2 md:py-[10px] px-4 md:px-[16px]"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2 border rounded"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowChangePassword(false)}
                className="px-4 py-2 border rounded text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="px-4 py-2 bg-[#16457E] text-white rounded"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Reset Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter your email"
                />
              </div>
              <p className="text-sm text-gray-600">
                We'll send you a link to reset your password.
              </p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowResetPassword(false)}
                className="px-4 py-2 border rounded text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleResetPassword}
                className="px-4 py-2 bg-[#16457E] text-white rounded"
              >
                Send Reset Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}