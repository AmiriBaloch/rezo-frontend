"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePasswordResetMutation } from "../../features/auth/authApiSlice";
import { toast } from "react-hot-toast";
import Container from "../Container";
import Input from "../Input";
import AuthBtn from "../AuthBtn";

export default function ForgotPassword() {
  const router = useRouter();
  const [resetPassword, { isLoading }] = usePasswordResetMutation();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const validateEmail = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    try {
      const response = await resetPassword({ email }).unwrap();
      
      // Always redirect to verification page for password reset
      toast.success(response?.message || "Verification code sent to your email");
      
      // Store email in sessionStorage for the reset flow
      sessionStorage.setItem('resetEmail', email);
      
      router.push("/verify-email?type=password-reset");
    } catch (error) {
      console.error("Reset error:", error);
      
      let errorMessage = "Failed to send reset email";
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.error?.data?.message) {
        errorMessage = error.error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      // Handle specific error cases
      if (error?.data?.code === 'EMAIL_NOT_VERIFIED') {
        errorMessage = "Email address must be verified before password reset. Please verify your email first.";
      } else if (error?.data?.code === 'RESET_REQUEST_FAILED') {
        errorMessage = "Unable to process password reset request. Please try again later.";
      } else if (error?.data?.code === 'MISSING_CREDENTIALS') {
        errorMessage = "Email address is required.";
      }
      
      toast.error(errorMessage);
    }
  };

  return (
    <Container>
      <h2 className="text-center text-4xl font-semibold text-primary mb-1">
        Forgot Password
      </h2>
      <p className="text-center text-gray-500 mb-6">
        Enter your email to reset your password
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            type="email"
            label="Email"
            placeholder=""
            className={errors.email ? "border-red-500" : "border-gray-300"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <AuthBtn
          type="submit"
          disabled={isLoading || !email}
          className="w-full py-2 font-semibold disabled:opacity-70"
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </AuthBtn>
      </form>

      <p className="text-center text-gray-600 mt-4">
        Remember your password?{" "}
        <Link
          href="/login"
          className="text-primary font-semibold hover:underline"
        >
          Login
        </Link>
      </p>
      
      <p className="text-center text-gray-500 mt-2 text-sm">
        Haven't verified your email?{" "}
        <Link
          href="/verify-email"
          className="text-primary font-semibold hover:underline"
        >
          Verify Email First
        </Link>
      </p>
    </Container>
  );
}
