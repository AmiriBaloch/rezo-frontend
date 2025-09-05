"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignupMutation } from "../../features/auth/authApiSlice";
import { toast } from "react-hot-toast";
import Container from "../../components/Container";
import Input from "../../components/Input";
import AuthBtn from "../../components/AuthBtn";
import { RiEyeCloseLine, RiEyeCloseFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";

const Signup = () => {
  const router = useRouter();
  const [signup, { isLoading }] = useSignupMutation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const validatePassword = (pwd) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      pwd
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&).";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const result = await signup({
        email: formData.email,
        password: formData.password,
      }).unwrap();
      
      console.log('Signup response:', result); // Debug log
      
      // Check if signup was successful
      if (result.success) {
        // Always redirect to verification page after successful signup
        toast.success("Account created successfully! Please check your email for verification code.");
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch (error) {
      console.error('Signup error:', error); // Debug log
      toast.error(error?.data?.message || "Registration failed");
    }
  };

  const renderError = (field) =>
    errors[field] && (
      <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
    );

  const handleGoogleSignup = () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://147.93.84.104';
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  const [visible, setVisible] = useState(false);
  const [visibleConfirm, setVisibleConfirm] = useState(false);

  return (
    <Container>
      <h2 className="text-center text-4xl font-semibold text-primary mb-1 font-primary">
        Sign up
      </h2>
      <p className="text-center text-gray-500 mb-6">
        Register with your email and password. <br />
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            type="email"
            label="Email"
            required={true}
            placeholder=""
            autoComplete="off"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={errors.email ? "border-red-500" : "border-gray-300"}
          />
          {renderError("email")}
        </div>

        <div className="mb-4">
          <Input
            type={visible ? "text" : "password"}
            label="Create a password"
            required={true}
            autoComplete="new-password"
            suffix={
              visible ? (
                <RiEyeCloseFill onClick={() => setVisible(false)} />
              ) : (
                <RiEyeCloseLine onClick={() => setVisible(true)} />
              )
            }
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className={errors.password ? "border-red-500" : "border-gray-300"}
          />
          {renderError("password")}
        </div>

        <div className="mb-4">
          <Input
            type={visibleConfirm ? "text" : "password"}
            label="Repeat password"
            required={true}
            value={formData.confirmPassword}
            suffix={
              visibleConfirm ? (
                <RiEyeCloseFill onClick={() => setVisibleConfirm(false)} />
              ) : (
                <RiEyeCloseLine onClick={() => setVisibleConfirm(true)} />
              )
            }
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            className={
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }
          />
          {renderError("confirmPassword")}
        </div>

        <AuthBtn
          type="submit"
          disabled={isLoading}
          className="w-full py-2 font-semibold disabled:opacity-70"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </AuthBtn>
      </form>

      <div className="mt-4 space-y-2">
        <button
          onClick={handleGoogleSignup}
          className="w-full bg-secondary flex items-center justify-center border py-2 rounded-lg hover:bg-hoversecondary"
        >
          <FcGoogle className="h-5 mr-2" />
          Sign up with Google
        </button>
      </div>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Log in
        </Link>
      </p>
    </Container>
  );
};

export default Signup;
