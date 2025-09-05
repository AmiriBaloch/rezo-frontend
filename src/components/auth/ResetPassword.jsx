"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useConfirmPasswordResetMutation } from "../../features/auth/authApiSlice";
import { toast } from "react-hot-toast";
import Container from "../Container";
import Input from "../Input";
import AuthBtn from "../AuthBtn";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [confirmPasswordReset, { isLoading }] = useConfirmPasswordResetMutation();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const token = searchParams.get("token");

  const validateForm = () => {
    const newErrors = {};
    if (!password) newErrors.password = "Password is required";
    if (password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
      newErrors.password = "Password must contain uppercase, lowercase, number, and special character";
    }
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!token) {
      toast.error("Invalid reset token");
      return router.push("/forgot-password");
    }

    // Additional validation for token format
    if (!/^\d{6}$/.test(token)) {
      toast.error("Invalid reset token format");
      return router.push("/forgot-password");
    }

    try {
      console.log("=== PASSWORD RESET PROCESS ===");
      console.log("Token:", token);
      console.log("Password length:", password.length);
      console.log("Password validation:", /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password));
      
      const response = await confirmPasswordReset({ code: token, newPassword: password }).unwrap();
      console.log("Password reset response:", response);
      
      // Clear any stored tokens to force fresh login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      // Clear session storage
      sessionStorage.removeItem('resetEmail');
      sessionStorage.removeItem('verifiedResetCode');
      
      toast.success("Password reset successfully! Please login with your new password.");
      
      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("=== PASSWORD RESET ERROR ===");
      console.error("Error object:", error);
      console.error("Error data:", error?.data);
      console.error("Error status:", error?.status);
      
      let errorMessage = "Password reset failed";
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.error?.data?.message) {
        errorMessage = error.error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      setErrors({ password: errorMessage });
    }
  };

  if (!token) {
    return (
      <Container>
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-4">
            The password reset link is invalid or has expired.
          </p>
          <button
            onClick={() => router.push("/forgot-password")}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Request New Reset Link
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="text-center text-4xl font-semibold text-primary mb-1">
        Reset Password
      </h2>
      <p className="text-center text-gray-500 mb-6">
        Enter your new password below
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            type="password"
            label="New Password"
            placeholder=""
            className={errors.password ? "border-red-500" : "border-gray-300"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div className="mb-4">
          <Input
            type="password"
            label="Confirm Password"
            placeholder=""
            className={errors.confirmPassword ? "border-red-500" : "border-gray-300"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <AuthBtn
          type="submit"
          disabled={isLoading || !password || !confirmPassword}
          className="w-full py-2 font-semibold disabled:opacity-70"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </AuthBtn>
      </form>
    </Container>
  );
}
