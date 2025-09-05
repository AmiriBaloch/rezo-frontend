"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentToken, setCredentials, updateUser } from "../../../features/auth/authSlice";
import { useUpdateProfilePictureMutation } from "../../../features/profile/profileApiSlice";
import { toast } from "react-hot-toast";
import Container from "../../../components/Container";
import AuthBtn from "../../../components/AuthBtn";
import Cookies from "js-cookie";

export default function UserPhoto() {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector(selectCurrentToken);
  
  const [hydrated, setHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");

  // Use the proper profile API mutation
  const [updateProfilePicture, { isLoading: isUploading }] = useUpdateProfilePictureMutation();

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      dispatch(setCredentials({ accessToken }));
    }
    setHydrated(true);
  }, [dispatch]);

  useEffect(() => {
    if (hydrated) {
      const timeout = setTimeout(() => {
        if (!token) {
          router.push("/login");
        }
      }, 100); 

      return () => clearTimeout(timeout);
    }
  }, [hydrated, token, router]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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

      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photo) {
      toast.error("Please select a photo");
      return;
    }

    if (!token) {
      toast.error("Authentication required. Please login again.");
      router.push("/login");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("avatar", photo);

    try {
      console.log("=== UPLOADING PROFILE PICTURE ===");
      console.log("File:", photo.name, photo.size, photo.type);
      console.log("Token:", token ? "Present" : "Missing");
      
      const result = await updateProfilePicture(formData).unwrap();
      
      console.log("=== UPLOAD RESULT ===");
      console.log("Raw result:", result);
      console.log("Result type:", typeof result);
      console.log("Result keys:", Object.keys(result));
      console.log("Result structure:", JSON.stringify(result, null, 2));
      
      if (result) {
        // Extract avatar URL from the result
        let avatarUrl = null;
        if (result.data?.avatarUrl) {
          avatarUrl = result.data.avatarUrl;
        } else if (result.avatarUrl) {
          avatarUrl = result.avatarUrl;
        } else if (result.data?.secure_url) {
          avatarUrl = result.data.secure_url;
        }
        
        console.log("=== AVATAR URL EXTRACTION ===");
        console.log("Extracted avatar URL:", avatarUrl);
        
        if (avatarUrl) {
          console.log("✅ Avatar URL found, updating...");
          
          // Update Redux store with new avatar URL
          dispatch(updateUser({ avatarUrl }));
          
          // Store in localStorage
          localStorage.setItem("userPhotoUrl", avatarUrl);
          
          toast.success("Profile picture updated successfully!");
          
          // Redirect to next step
          router.push("/additional-info");
        } else {
          console.error("❌ No avatar URL found in result");
          console.error("Available keys:", Object.keys(result));
          console.error("Result values:", Object.values(result));
          toast.error("Profile picture update failed: No avatar URL returned");
        }
      } else {
        console.error("❌ No result returned from upload");
        toast.error("Profile picture update failed: No response from server");
      }
    } catch (error) {
      console.error("=== UPLOAD ERROR ===");
      console.error("Error object:", error);
      console.error("Error message:", error?.message);
      console.error("Error data:", error?.data);
      console.error("Error details:", error?.error);
      
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
    } finally {
      setIsLoading(false);
    }
  };

  if (!hydrated) return <p>Loading...</p>;

  return (
    <Container>
      <h2 className="text-center text-4xl font-semibold text-primary mb-6">
        Upload Profile Photo
      </h2>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-6 flex flex-col items-center">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 flex items-center justify-center">
              <span className="text-gray-500">No photo selected</span>
            </div>
          )}

          <label className="cursor-pointer bg-primary text-white py-2 px-4 rounded hover:bg-hoverprimary">
            Choose Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          
          <p className="text-xs text-gray-500 mt-2 text-center">
            Supported formats: JPEG, PNG, WebP (Max: 5MB)
          </p>
        </div>

        <AuthBtn
          type="submit"
          disabled={isLoading || isUploading || !photo}
          className="w-full py-2 font-semibold disabled:opacity-70"
        >
          {isLoading || isUploading ? "Uploading..." : "Continue"}
        </AuthBtn>
      </form>
    </Container>
  );
}
