"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { selectCurrentUser, updateUser } from '../../../features/auth/authSlice';
import { useGetProfileQuery, usePartialUpdateProfileMutation, useUpdateProfilePictureMutation } from '../../../features/profile/profileApiSlice';
import { useCreateOwnershipRequestMutation, useGetUserOwnershipRequestQuery, useCheckUserRolesQuery } from '../../../features/propertyOwner/ownershipApiSlice';
import { useCreateBuilderRequestMutation, useGetUserBuilderRequestQuery } from '../../../features/builder/builderApiSlice';
import { FiEdit3, FiSave, FiX, FiUser, FiCamera } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { getImageUrl, getDefaultAvatarUrl } from '../../../utils/imageUtils';

const AccountSettings = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const reduxUser = useSelector(selectCurrentUser);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    cnicNumber: '',
    dateOfBirth: '',
    gender: '',
    currentAddress: '',
    city: '',
    state: '',
    postalCode: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    cnicNumber: '',
    dateOfBirth: '',
    gender: '',
    currentAddress: '',
    city: '',
    state: '',
    postalCode: ''
  });
  const [showProfile, setShowProfile] = useState(true); // Add state to control profile visibility
  const fileInputRef = useRef(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  // Local state to track request status for immediate UI updates
  const [localOwnershipStatus, setLocalOwnershipStatus] = useState('none');
  const [localBuilderStatus, setLocalBuilderStatus] = useState('none');

  // Fetch real-time profile data
  const { data: profileData, isLoading, error, refetch } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = usePartialUpdateProfileMutation();
  const [updateProfilePicture, { isLoading: isUploading }] = useUpdateProfilePictureMutation();

  // Combine user data from Redux and profile API
  const user = profileData || reduxUser;

  // Ownership request hooks
  const [createOwnershipRequest, { isLoading: isCreatingRequest }] = useCreateOwnershipRequestMutation();
  const { data: ownershipData } = useGetUserOwnershipRequestQuery(user?.user?.id || user?.id);
  const { data: userRoleData } = useCheckUserRolesQuery(user?.user?.id || user?.id);
  
  // Builder request hooks
  const [createBuilderRequest, { isLoading: isCreatingBuilderRequest }] = useCreateBuilderRequestMutation();
  const { data: builderData } = useGetUserBuilderRequestQuery(user?.user?.id || user?.id);
  
  // Helper function to get avatar URL from different data structures
  const getAvatarUrl = (userData) => {
    if (!userData) return null;
    
    // Try different possible locations for avatar URL
    if (userData.avatarUrl) return userData.avatarUrl;
    if (userData.profile?.avatarUrl) return userData.profile.avatarUrl;
    if (userData.user?.profile?.avatarUrl) return userData.user.profile.avatarUrl;
    
    return null;
  };
  
  // Get the avatar URL
  const avatarUrl = getAvatarUrl(user);

  // Determine ownership status and button text
  const isOwner = userRoleData?.hasOwnerRole || false;
  const isBuilder = userRoleData?.hasBuilderRole || false;
  const ownershipRequest = ownershipData;
  const ownershipStatus = localOwnershipStatus !== 'none' ? localOwnershipStatus : (ownershipRequest?.status || 'none');
  const builderRequest = builderData;
  const builderStatus = localBuilderStatus !== 'none' ? localBuilderStatus : (builderRequest?.status || 'none');
  
  const getOwnershipButtonText = () => {
    if (isOwner) return '🚀 Owner Dashboard';
    if (ownershipStatus === 'PENDING') return '⏳ Your ownership request is under process';
    if (ownershipStatus === 'REJECTED') return 'Apply for Ownership';
    return 'Apply for Ownership';
  };

  const getBuilderButtonText = () => {
    if (isBuilder) return '🚀 Builder Dashboard';
    if (builderStatus === 'PENDING') return '⏳ Your builder request is under process';
    if (builderStatus === 'REJECTED') return 'Apply for Builder';
    return 'Apply for Builder';
  };

  const getOwnershipButtonAction = () => {
    if (isOwner) return () => router.push('/owner');
    if (ownershipStatus === 'PENDING') return null; // Disabled
    if (ownershipStatus === 'REJECTED' || ownershipStatus === 'none') return handleApplyOwnership;
    return handleApplyOwnership;
  };

  const getBuilderButtonAction = () => {
    if (isBuilder) return () => router.push('/dashboard'); // Temporary redirect as requested
    if (builderStatus === 'PENDING') return null; // Disabled
    if (builderStatus === 'REJECTED' || builderStatus === 'none') return handleApplyBuilder;
    return handleApplyBuilder;
  };

  const getOwnershipButtonDisabled = () => {
    return ownershipStatus === 'PENDING' || isCreatingRequest;
  };

  const getBuilderButtonDisabled = () => {
    return builderStatus === 'PENDING' || isCreatingBuilderRequest;
  };

  const getOwnershipButtonStyle = () => {
    if (isOwner) return 'px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg font-medium';
    if (ownershipStatus === 'PENDING') return 'px-4 py-2 bg-yellow-600 text-white rounded-lg transition-colors shadow-lg font-medium cursor-not-allowed';
    return 'px-4 py-2 bg-[#16457E] text-white rounded-lg hover:bg-[#0f2f5a] transition-colors shadow-lg font-medium';
  };

  const getBuilderButtonStyle = () => {
    if (isBuilder) return 'px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg font-medium';
    if (builderStatus === 'PENDING') return 'px-4 py-2 bg-yellow-600 text-white rounded-lg transition-colors shadow-lg font-medium cursor-not-allowed';
    return 'px-4 py-2 bg-[#16457E] text-white rounded-lg hover:bg-[#0f2f5a] transition-colors shadow-lg font-medium';
  };
  
  // Debug: Log the data structure
  useEffect(() => {
    if (profileData) {
      console.log('Profile API Response:', profileData);
      console.log('Profile Data Structure:', JSON.stringify(profileData, null, 2));
    }
    if (reduxUser) {
      console.log('Redux User Data:', reduxUser);
    }
    if (user) {
      console.log('Combined User Data:', user);
      console.log('User avatarUrl:', user.avatarUrl);
      console.log('User keys:', Object.keys(user));
      console.log('Extracted avatarUrl:', avatarUrl);
    }
    
    // Debug ownership data
    console.log('🔍 Ownership Debug:', {
      ownershipData,
      userRoleData,
      isOwner,
      ownershipStatus,
      ownershipRequest
    });
  }, [profileData, reduxUser, user, avatarUrl, ownershipData, userRoleData, isOwner, ownershipStatus, ownershipRequest]);

  useEffect(() => {
    if (user) {
      // Handle different data structures from backend
      const userData = user.user || user; // Backend returns {user: {...}, ...profile}
      const profileData = user.profile || user; // Profile data might be nested
      
      const initialData = {
        firstName: String(profileData.firstName || userData.firstName || ''),
        lastName: String(profileData.lastName || userData.lastName || ''),
        email: String(userData.email || ''), // Email comes from user object
        phone: String(profileData.phone || userData.phone || ''),
        nationality: String(profileData.nationality || userData.nationality || ''),
        cnicNumber: String(profileData.cnicNumber || userData.cnicNumber || ''),
        dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString().split('T')[0] : userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : '',
        gender: String(profileData.gender || userData.gender || ''),
        currentAddress: String(profileData.currentAddress || userData.currentAddress || ''),
        city: String(profileData.city || userData.city || ''),
        state: String(profileData.state || userData.state || ''),
        postalCode: String(profileData.postalCode || userData.postalCode || ''),
      };
      
      // Ensure all values are strings to avoid controlled/uncontrolled warnings
      const sanitizedData = Object.fromEntries(
        Object.entries(initialData).map(([key, value]) => [key, String(value || '')])
      );
      
      setFormData(sanitizedData);
      setOriginalData(sanitizedData);
    }
  }, [user]);

  // Sync local state with API data
  useEffect(() => {
    if (ownershipData?.status) {
      setLocalOwnershipStatus(ownershipData.status);
    }
  }, [ownershipData]);

  useEffect(() => {
    if (builderData?.status) {
      setLocalBuilderStatus(builderData.status);
    }
  }, [builderData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: String(value || '') }));
  };

  const handleSave = async () => {
    try {
      // Remove email and cnicNumber from update data (read-only fields)
      const updateData = { ...formData };
      delete updateData.email;
      delete updateData.cnicNumber;

      // Validate required fields before sending
      const requiredFields = ['firstName', 'lastName', 'phone', 'dateOfBirth', 'gender'];
      const missingFields = requiredFields.filter(field => !updateData[field]);
      
      if (missingFields.length > 0) {
        toast.error(`Please fill in required fields: ${missingFields.join(', ')}`);
        return;
      }

      console.log('Sending update data:', updateData);
      
      const result = await updateProfile(updateData).unwrap();
      
      console.log('Update result:', result);
      
      // Update Redux store with new user data
      if (result) {
        // Update the user object with the new profile data
        const updatedUser = {
          ...user,
          ...result,
          // Ensure profile fields are also updated at the root level for compatibility
          firstName: result.firstName || user.firstName,
          lastName: result.lastName || user.lastName,
          phone: result.phone || user.phone,
          dateOfBirth: result.dateOfBirth || user.dateOfBirth,
          gender: result.gender || user.gender,
          nationality: result.nationality || user.nationality,
          currentAddress: result.currentAddress || user.currentAddress,
          city: result.city || user.city,
          state: result.state || user.state,
          postalCode: result.postalCode || user.postalCode,
        };
        
        dispatch(updateUser(updatedUser));
        setOriginalData(formData);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
        
        // Refresh the data to ensure consistency
        refetch();
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      
      // Better error message handling
      let errorMessage = 'Failed to update profile';
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.error?.data?.message) {
        errorMessage = error.error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      console.log('=== UPLOADING PROFILE PICTURE ===');
      console.log('File:', file.name, file.size, file.type);
      
      const result = await updateProfilePicture(formData).unwrap();
      
      console.log('=== UPLOAD RESULT ===');
      console.log('Raw result:', result);
      console.log('Result type:', typeof result);
      console.log('Result keys:', Object.keys(result));
      console.log('Result structure:', JSON.stringify(result, null, 2));
      
      if (result) {
        // Extract avatar URL from the result using the same logic
        const newAvatarUrl = getAvatarUrl(result);
        
        console.log('=== AVATAR URL EXTRACTION ===');
        console.log('Extracted avatar URL:', newAvatarUrl);
        console.log('Processed image URL:', newAvatarUrl ? getImageUrl(newAvatarUrl) : 'None');
        
        if (newAvatarUrl) {
          console.log('✅ Avatar URL found, updating...');
          
          // Update Redux store with new avatar URL
          dispatch(updateUser({ ...user, avatarUrl: newAvatarUrl }));
          toast.success('Profile picture updated successfully!');
          refetch(); // Refresh the data
        } else {
          console.error('❌ No avatar URL found in result');
          console.error('Available keys:', Object.keys(result));
          console.error('Result values:', Object.values(result));
          toast.error('Profile picture update failed: No avatar URL returned');
        }
      } else {
        console.error('❌ No result returned from upload');
      }
    } catch (error) {
      console.error('=== UPLOAD ERROR ===');
      console.error('Error object:', error);
      console.error('Error message:', error?.message);
      console.error('Error data:', error?.data);
      console.error('Error details:', error?.error);
      
      // Better error message extraction
      let errorMessage = 'Failed to update profile picture';
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.error?.data?.message) {
        errorMessage = error.error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }

    // Reset file input
    event.target.value = '';
  };

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const hasValidationErrors = () => {
    return !formData.firstName || !formData.lastName || !formData.phone || !formData.dateOfBirth || !formData.gender;
  };

  const getValidationMessage = () => {
    const errors = [];
    if (!formData.firstName) errors.push('First Name');
    if (!formData.lastName) errors.push('Last Name');
    if (!formData.phone) errors.push('Phone');
    if (!formData.dateOfBirth) errors.push('Date of Birth');
    if (!formData.gender) errors.push('Gender');
    
    if (errors.length === 0) return null;
    return `Please fill in: ${errors.join(', ')}`;
  };

  // Handle close profile
  const handleCloseProfile = () => {
    setShowProfile(false);
    // Redirect to home page
    router.push('/');
  };

  // Check if user details are complete
  const isUserDetailsComplete = () => {
    const requiredFields = ['firstName', 'lastName', 'phone', 'dateOfBirth', 'gender'];
    return requiredFields.every(field => formData[field] && formData[field].trim() !== '');
  };

  // Check if user has profile photo
  const hasProfilePhoto = () => {
    return !!avatarUrl;
  };

  // Check if additional details are complete (you can customize this based on your requirements)
  const areAdditionalDetailsComplete = () => {
    const additionalFields = ['nationality', 'currentAddress'];
    return additionalFields.every(field => formData[field] && formData[field].trim() !== '');
  };

  // Check if all required details are complete
  const areAllDetailsComplete = () => {
    return isUserDetailsComplete() && hasProfilePhoto() && areAdditionalDetailsComplete();
  };

  // Helper function to redirect to user details page
  const redirectToUserDetails = () => {
    toast.error('Please complete your profile details first. Redirecting to user details page...');
    // Redirect to user details page after a short delay
    setTimeout(() => {
      window.location.href = '/user-details';
    }, 1500);
  };

  // Handle ownership request application
  const handleApplyOwnership = async () => {
    try {
      // Check if all details are complete
      if (!areAllDetailsComplete()) {
        // Check what's missing and redirect accordingly
        if (!hasProfilePhoto() || !isUserDetailsComplete() || !areAdditionalDetailsComplete()) {
          toast.error('Please complete your profile details first. Redirecting to user details page...');
          // Redirect to user details page after a short delay
          setTimeout(() => {
            window.location.href = '/user-details';
          }, 1500);
          return;
        }
        
        toast.error('Please complete your profile details, upload a photo, and fill additional information before applying for ownership');
        return;
      }

      // Get the actual user ID from the user object, not the profile ID
      const userId = user?.user?.id || user?.id;
      const email = user?.email || user?.user?.email;
      
      if (!userId || !email) {
        toast.error('User information not found');
        return;
      }

      console.log('Submitting ownership request with data:', { userId, email, profile: formData });
      console.log('Current user data:', user);
      console.log('Authentication token:', localStorage.getItem('accessToken'));

      const result = await createOwnershipRequest({
        userId,
        email,
        profile: formData
      }).unwrap();

      console.log('Ownership request result:', result);
      toast.success('Ownership request submitted successfully!');
      
      // Immediately update local state to hide buttons
      setLocalOwnershipStatus('PENDING');
    } catch (error) {
      console.error('Failed to submit ownership request - Full error:', error);
      console.error('Error status:', error?.status);
      console.error('Error data:', error?.data);
      console.error('Error message:', error?.message);
      
      let errorMessage = 'Failed to submit ownership request';
      
      if (error?.status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
      } else if (error?.status === 403) {
        errorMessage = 'Access denied. You may not have permission to submit ownership requests.';
      } else if (error?.status === 404) {
        errorMessage = 'Ownership request endpoint not found. Please contact support.';
      } else if (error?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.error?.data?.message) {
        errorMessage = error.error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  };

  // Handle builder request application
  const handleApplyBuilder = async () => {
    try {
      // Check if all details are complete
      if (!areAllDetailsComplete()) {
        // Check what's missing and redirect accordingly
        if (!hasProfilePhoto() || !isUserDetailsComplete() || !areAdditionalDetailsComplete()) {
          toast.error('Please complete your profile details first. Redirecting to user details page...');
          // Redirect to user details page after a short delay
          setTimeout(() => {
            window.location.href = '/user-details';
          }, 1500);
          return;
        }
        
        toast.error('Please complete your profile details, upload a photo, and fill additional information before applying for builder status');
        return;
      }

      // Get the actual user ID from the user object, not the profile ID
      const userId = user?.user?.id || user?.id;
      const email = user?.email || user?.user?.email;
      
      if (!userId || !email) {
        toast.error('User information not found');
        return;
      }

      console.log('Submitting builder request with data:', { userId, email, profile: formData });
      console.log('Current user data:', user);
      console.log('Authentication token:', localStorage.getItem('accessToken'));

      const result = await createBuilderRequest({
        userId,
        email,
        profile: formData
      }).unwrap();

      console.log('Builder request result:', result);
      toast.success('Builder request submitted successfully!');
      
      // Immediately update local state to hide buttons
      setLocalBuilderStatus('PENDING');
    } catch (error) {
      console.error('Failed to submit builder request - Full error:', error);
      console.error('Error status:', error?.status);
      console.error('Error data:', error?.data);
      console.error('Error message:', error?.message);
      
      let errorMessage = 'Failed to submit builder request';
      
      if (error?.status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
      } else if (error?.status === 404) {
        errorMessage = 'Builder request endpoint not found. Please contact support.';
      } else if (error?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.error?.data?.message) {
        errorMessage = error.error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[url(/bg.jpg)] bg-cover min-h-screen flex items-center justify-center">
        <div className="text-lg text-white">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[url(/bg.jpg)] bg-cover min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-400">Error loading profile. Please try again.</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-[url(/bg.jpg)] bg-cover min-h-screen flex items-center justify-center">
        <div className="text-lg text-white">No user data found</div>
      </div>
    );
  }

  if (!showProfile) {
    return (
      <div className="bg-[url(/bg.jpg)] bg-cover min-h-screen flex items-center justify-center">
        <div className="text-lg text-white">Profile closed</div>
      </div>
    );
  }

  return (
    <div className="bg-[url(/bg.jpg)] bg-cover min-h-screen">
      <div className="w-[90%] mx-auto py-8 px-4">
        {/* Solid background overlay */}
        <div className="bg-[#1e293b] rounded-xl p-8 shadow-2xl relative">
          {/* Edit Icon and Close Button - Top Right Corner */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 bg-primary text-white rounded-full hover:bg-hoverprimary transition-colors shadow-lg"
                title="Edit Profile"
              >
                <FiEdit3 className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex flex-col items-end gap-2">
                {/* Validation Message */}
                {hasValidationErrors() && (
                  <div className="p-2 bg-red-900/20 border border-red-500/30 rounded-lg max-w-xs">
                    <p className="text-red-400 text-xs text-center">
                      {getValidationMessage()}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSave}
                    disabled={!hasChanges() || isUpdating || !formData.firstName || !formData.lastName || !formData.phone || !formData.dateOfBirth || !formData.gender}
                    className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    title={!hasChanges() ? "No changes to save" : "Save Changes"}
                  >
                    {isUpdating ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FiSave className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isUpdating}
                    className="p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Cancel"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            
                        {/* Close Button */}
            <button
              onClick={handleCloseProfile}
              className="p-2 bg-[#99763d] text-white rounded-full hover:bg-[#8a6d35] transition-colors shadow-lg"
              title="Close Profile"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Section */}
          <div className="mb-8 text-center">
            
            <div className="inline-block relative mb-4">
              <div id="profile-photo-section" className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary overflow-hidden border-4 border-white shadow-lg relative">
                {avatarUrl ? (
                  <>
                    {console.log('=== PROFILE PICTURE DEBUG ===')}
                    {console.log('User avatarUrl:', user.avatarUrl)}
                    {console.log('User object:', user)}
                    {console.log('Processed image URL:', getImageUrl(avatarUrl))}
                    
                    {/* Loading State */}
                    {imageLoading && (
                      <div className="absolute inset-0 bg-gray-800/50 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    
                    {/* Error State */}
                    {imageError && (
                      <div className="absolute inset-0 bg-red-900/50 flex items-center justify-center">
                        <FiUser className="w-8 h-8 text-white" />
                      </div>
                    )}
                    
                    <img 
                      src={getImageUrl(avatarUrl)} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.warn('Image failed to load, using fallback');
                        console.warn('Failed URL:', e.target.src);
                        console.warn('Original avatarUrl:', avatarUrl);
                        setImageError(true);
                        e.target.src = getDefaultAvatarUrl();
                        e.target.onerror = null; // Prevent infinite loop
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', getImageUrl(avatarUrl));
                        setImageLoading(false);
                        setImageError(false);
                      }}
                      style={{ display: 'block' }}
                    />
                  </>
                ) : (
                  <>
                    {console.log('No avatarUrl found, showing default icon')}
                    {console.log('User object:', user)}
                    <div className="w-full h-full flex items-center justify-center text-4xl text-white font-bold">
                      <FiUser className="w-12 h-12" />
                    </div>
                  </>
                )}
              </div>
              
              {/* Camera Icon - Outside Profile Picture */}
              <button
                onClick={handleProfilePictureClick}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-white rounded-full hover:bg-hoverprimary transition-colors shadow-lg flex items-center justify-center border-2 border-white"
                title="Change Profile Picture"
              >
                {isUploading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FiCamera className="w-5 h-5" />
                )}
              </button>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-300 mb-4">{user.email}</p>
            
            {/* Apply Buttons - Below user name (Visible on all screen sizes) */}
            <div>
              {/* Show combined ownership/builder button only if not owner and not builder and no pending/approved requests */}
              {!isOwner && !isBuilder && ownershipStatus !== 'PENDING' && builderStatus !== 'PENDING' && ownershipStatus !== 'APPROVED' && builderStatus !== 'APPROVED' && (
                <div className="flex items-center justify-center">
                  <button 
                    onClick={handleApplyOwnership}
                    disabled={getOwnershipButtonDisabled()}
                    className="text-[#99763d] hover:text-[#8a6d35] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Apply for Ownership
                  </button>
                  <span className="text-[#99763d] mx-2">/</span>
                  <button 
                    onClick={handleApplyBuilder}
                    disabled={getBuilderButtonDisabled()}
                    className="text-[#99763d] hover:text-[#8a6d35] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Builder
                  </button>
                </div>
              )}
              
              {/* Show NO buttons if builder request is pending - only status message */}
              {/* This section intentionally left empty to hide all buttons when builder is pending */}
              
              {/* Show NO buttons if ownership request is pending - only status message */}
              {/* This section intentionally left empty to hide all buttons when ownership is pending */}
              
              {/* Show ownership button only if not owner but is builder AND no requests are approved */}
              {!isOwner && isBuilder && ownershipStatus !== 'APPROVED' && builderStatus !== 'APPROVED' && (
                <button 
                  onClick={getOwnershipButtonAction()}
                  disabled={getOwnershipButtonDisabled()}
                  className={getOwnershipButtonStyle()}
                >
                  {getOwnershipButtonText()}
                </button>
              )}
              
              {/* Show builder button only if not builder but is owner AND no requests are approved */}
              {!isBuilder && isOwner && ownershipStatus !== 'APPROVED' && builderStatus !== 'APPROVED' && (
                <button 
                  onClick={getBuilderButtonAction()}
                  disabled={getBuilderButtonDisabled()}
                  className={getBuilderButtonStyle()}
                >
                  {getBuilderButtonText()}
                </button>
              )}
              
              {/* Show status message if any request is pending */}
              {(ownershipStatus === 'PENDING' || builderStatus === 'PENDING') && (
                <div className="text-[#99763d] text-sm font-medium mt-2">
                  {ownershipStatus === 'PENDING' && builderStatus === 'PENDING' 
                    ? 'Wait! Your requests are under process.' 
                    : ownershipStatus === 'PENDING' 
                      ? 'Wait! Your Ownership Request is under process.'
                      : 'Wait! Your Builder Request is under process.'
                  }
                </div>
              )}
              
              {/* Show dashboard buttons when requests are approved */}
              {(ownershipStatus === 'APPROVED' || builderStatus === 'APPROVED') && (
                <div className="text-center mt-2 space-y-2">
                  {ownershipStatus === 'APPROVED' && (
                    <div>
                      <button 
                        onClick={() => window.location.href = '/owner'}
                        className="text-[#99763d] hover:text-[#8a6d35] transition-colors font-medium cursor-pointer text-lg"
                      >
                        🎉Owner dashboard
                      </button>
                    </div>
                  )}
                  
                  {builderStatus === 'APPROVED' && (
                    <div>
                      <button 
                        onClick={() => window.location.href = '/dashboard'}
                        className="text-[#99763d] hover:text-[#8a6d35] transition-colors font-medium cursor-pointer text-lg"
                      >
                        🎉Builder dashboard
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Form Sections */}
          <div className="space-y-8">
            {/* Personal Information */}
            <div id="personal-info-section">
              <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    First Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email (Read-only)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled={true}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date of Birth <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gender <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50"
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nationality</label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">CNIC Number (Read-only)</label>
                  <input
                    type="text"
                    name="cnicNumber"
                    value={formData.cnicNumber}
                    disabled={true}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div id="additional-details-section">
              <h3 className="text-xl font-semibold text-white mb-4">Address Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Current Address</label>
                  <textarea
                    name="currentAddress"
                    value={formData.currentAddress}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="3"
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 resize-none"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">State/Province</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save/Cancel Buttons for Mobile */}
            {isEditing && (
              <div className="flex flex-col sm:hidden gap-3 mt-6">
                {/* Validation Message */}
                {hasValidationErrors() && (
                  <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm text-center">
                      {getValidationMessage()}
                    </p>
                  </div>
                )}
                
                <button
                  onClick={handleSave}
                  disabled={!hasChanges() || isUpdating || !formData.firstName || !formData.lastName || !formData.phone || !formData.dateOfBirth || !formData.gender}
                  className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isUpdating}
                  className="w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FiX className="w-5 h-5" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings; 
