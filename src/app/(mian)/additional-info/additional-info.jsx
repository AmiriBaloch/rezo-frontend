"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUpdateAdditionalInfoMutation, useGetProfileQuery } from "../../../features/auth/authApiSlice";
import { toast } from "react-hot-toast";
import Container from "../../../components/Container";
import Input from "../../../components/Input";
import AuthBtn from "../../../components/AuthBtn";
import { useDispatch } from "react-redux";
import { setCredentials, updateUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../../features/auth/authSlice";

export default function AdditionalInfo() {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector(selectCurrentToken);
  const [updateInfo, { isLoading }] = useUpdateAdditionalInfoMutation();
  const { refetch: refetchProfile } = useGetProfileQuery(undefined, {
    skip: !token,
  });

  const [formData, setFormData] = useState({
    isStudyingOrWorking: "",
    institutionOrCompany: "",
    about: "",
    document: null,
    cnicFront: null,
    cnicBack: null,
  });
  const [errors, setErrors] = useState({});

  const handleFileChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.isStudyingOrWorking)
      newErrors.isStudyingOrWorking = "This field is required";
    if (!formData.institutionOrCompany)
      newErrors.institutionOrCompany = "This field is required";
    if (!formData.document) newErrors.document = "Document is required";
    if (!formData.cnicFront) newErrors.cnicFront = "CNIC front is required";
    if (!formData.cnicBack) newErrors.cnicBack = "CNIC back is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("isStudyingOrWorking", formData.isStudyingOrWorking);
    formDataToSend.append(
      "institutionOrCompany",
      formData.institutionOrCompany
    );
    formDataToSend.append("about", formData.about);
    formDataToSend.append("document", formData.document);
    formDataToSend.append("cnicFront", formData.cnicFront);
    formDataToSend.append("cnicBack", formData.cnicBack);

    try {
      const response = await updateInfo(formDataToSend).unwrap();
      if (response?.documentUrl) localStorage.setItem("userDocumentUrl", response.documentUrl);
      if (response?.cnicFrontUrl) localStorage.setItem("userCnicFrontUrl", response.cnicFrontUrl);
      if (response?.cnicBackUrl) localStorage.setItem("userCnicBackUrl", response.cnicBackUrl);
      toast.success("Information saved successfully!");
      // Fetch latest user profile and update Redux
      if (token) {
        try {
          const profileResult = await refetchProfile();
          console.log("Profile fetch response:", profileResult);
          if (profileResult.data && profileResult.data.data) {
            // Extract user data from the nested response structure
            const userData = profileResult.data.data;
            console.log("Extracted user data:", userData);
            
            // Ensure the user object has the required fields for dashboard
            const userWithProfile = {
              id: userData.id,
              email: userData.email,
              isVerified: userData.isVerified,
              // Map profile fields to root level
              firstName: userData.firstName || userData.profile?.firstName,
              lastName: userData.lastName || userData.profile?.lastName,
              phone: userData.phone || userData.profile?.phone,
              nationality: userData.nationality || userData.profile?.nationality || "Pakistan",
              avatarUrl: userData.avatarUrl || userData.profile?.avatarUrl,
              cnicNumber: userData.cnicNumber || userData.profile?.cnicNumber,
              // Add any other fields that might be in the profile
              ...userData
            };
            
            console.log("Final user object for Redux:", userWithProfile);
            dispatch(updateUser(userWithProfile));
            
            // Also update localStorage to ensure persistence
            localStorage.setItem('user', JSON.stringify(userWithProfile));
          } else {
            console.log("No user data in profile response, using fallback");
            // Create a basic user object with available data
            const basicUser = {
              id: localStorage.getItem('userId') || 'unknown',
              email: localStorage.getItem('userEmail') || 'unknown',
              isVerified: true,
              firstName: 'User',
              lastName: 'Name',
              phone: '+923000000000',
              nationality: 'Pakistan',
              avatarUrl: '',
              cnicNumber: '0000000000000'
            };
            dispatch(updateUser(basicUser));
            localStorage.setItem('user', JSON.stringify(basicUser));
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
      router.push("/");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to save information");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container>
      <h2 className="text-center text-4xl font-semibold text-primary mb-6">
        Additional Information
      </h2>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Do You Study or Work?
          </label>
          <select
            name="isStudyingOrWorking"
            value={formData.isStudyingOrWorking}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Option</option>
            <option value="studying">Studying</option>
            <option value="working">Working</option>
            <option value="none">None</option>
          </select>
          {errors.isStudyingOrWorking && (
            <p className="text-red-500 text-xs mt-1">
              {errors.isStudyingOrWorking}
            </p>
          )}
        </div>

        {formData.isStudyingOrWorking && (
          <div className="mb-6">
            <Input
              type="text"
              label={
                formData.isStudyingOrWorking === "studying"
                  ? "Where Are You Studying?"
                  : "Where Are You Working?"
              }
              name="institutionOrCompany"
              required
              value={formData.institutionOrCompany}
              onChange={handleChange}
              error={errors.institutionOrCompany}
            />
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tell Us About Yourself
          </label>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            className="w-full p-2 border rounded min-h-[100px]"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Documents (Passport/ID Card) - PDF
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange("document")}
            className="w-full p-2 border rounded"
            required
          />
          {errors.document && (
            <p className="text-red-500 text-xs mt-1">{errors.document}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Front of CNIC - PDF
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange("cnicFront")}
              className="w-full p-2 border rounded"
              required
            />
            {errors.cnicFront && (
              <p className="text-red-500 text-xs mt-1">{errors.cnicFront}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Back of CNIC - PDF
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange("cnicBack")}
              className="w-full p-2 border rounded"
              required
            />
            {errors.cnicBack && (
              <p className="text-red-500 text-xs mt-1">{errors.cnicBack}</p>
            )}
          </div>
        </div>

        <AuthBtn
          type="submit"
          disabled={isLoading}
          className="w-full py-2 font-semibold disabled:opacity-70"
        >
          {isLoading ? "Submitting..." : "Complete Registration"}
        </AuthBtn>
      </form>
    </Container>
  );
}
