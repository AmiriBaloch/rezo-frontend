"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentToken,
  setCredentials,
} from "../../../features/auth/authSlice";
import { useUpdateUserDetailsMutation } from "../../../features/auth/authApiSlice";
import { toast } from "react-hot-toast";
import Container from "../../../components/Container";
import Input from "../../../components/Input";
import AuthBtn from "../../../components/AuthBtn";
import Cookies from "js-cookie";

export default function UserDetails() {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector(selectCurrentToken);

  const [hydrated, setHydrated] = useState(false);
  const [updateDetails, { isLoading }] = useUpdateUserDetailsMutation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "+923",
    dateOfBirth: "",
    cnicNumber: "",
    gender: "",
    currentAddress: "",
    city: "",
    state: "",
    nationality: "Pakistan",
    postalCode: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    dispatch(setCredentials({ accessToken }));

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.cnicNumber) newErrors.cnicNumber = "CNIC number is required";
    if (!formData.gender) newErrors.gender = "Gender is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await updateDetails(formData).unwrap();
      localStorage.setItem("userProfile", JSON.stringify(formData));
      toast.success("Details saved successfully!");
      router.push("/user-photo");
    } catch (error) {
      toast.error(
        error?.data?.message || error?.error || "Failed to save details"
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // if (!tokenReady) return <p>Loading...</p>;
  if (!hydrated) return <p>Loading...</p>;

  return (
    <Container>
      <h2 className="text-center text-4xl font-semibold text-primary mb-6">
        Personal Details
      </h2>
      <p className="text-center text-gray-500 mb-6">
        <b>Profile completion is required to access the dashboard.</b>
      </p>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <Input
            type="text"
            label="First Name"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />
        </div>

        <div>
          <Input
            type="text"
            label="Last Name"
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />
        </div>

        <div>
          <Input
            type="tel"
            label="Phone Number"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
          />
        </div>

        <div>
          <Input
            type="date"
            label="Date of Birth"
            name="dateOfBirth"
            required
            value={formData.dateOfBirth}
            onChange={handleChange}
            error={errors.dateOfBirth}
          />
        </div>

        <div>
          <Input
            type="text"
            label="CNIC Number"
            name="cnicNumber"
            required
            value={formData.cnicNumber}
            onChange={handleChange}
            error={errors.cnicNumber}
          />
        </div>

        <div>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 bg-secondary"
            required
          >
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="PREFER NOT SAY">Other</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <Input
            type="text"
            label="Current Address"
            name="currentAddress"
            value={formData.currentAddress}
            onChange={handleChange}
          />
        </div>

        <div>
          <Input
            type="text"
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </div>

        <div>
          <Input
            type="text"
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
          />
        </div>

        <div>
          <Input
            type="text"
            label="Nationality"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
          />
        </div>

        <div>
          <Input
            type="text"
            label="Postal Code"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
          />
        </div>

        <div className="md:col-span-2 mt-4">
          <AuthBtn
            type="submit"
            disabled={isLoading}
            className="w-full py-2 font-semibold disabled:opacity-70"
          >
            {isLoading ? "Saving..." : "Save & Continue"}
          </AuthBtn>
        </div>
      </form>
    </Container>
  );
}
