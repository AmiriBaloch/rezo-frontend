"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyEmailMutation, useConfirmPasswordResetMutation, useVerifyPasswordResetMutation } from "../../features/auth/authApiSlice";
import { toast } from "react-hot-toast";
import Container from "../Container";
import Input from "../Input";
import AuthBtn from "../AuthBtn";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";

function VerifyEmailContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPasswordReset = searchParams.get("type") === "password-reset";
  
  const [verifyEmail, { isLoading: emailLoading }] = useVerifyEmailMutation();
  const [confirmPasswordReset, { isLoading: resetLoading }] = useConfirmPasswordResetMutation();
  const [verifyPasswordReset, { isLoading: verifyResetLoading }] = useVerifyPasswordResetMutation();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const isLoading = emailLoading || resetLoading || verifyResetLoading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code) {
      setError("OTP code is required");
      return;
    }
    if (!/^\d{6}$/.test(code)) {
      setError("OTP must be a 6-digit number");
      return;
    }
    setError("");

    try {
      if (isPasswordReset) {
        // For password reset, verify the code first
        const response = await verifyPasswordReset({ code }).unwrap();
        toast.success("Code verified successfully!");
        
        // Store the verified code in sessionStorage for the reset password page
        sessionStorage.setItem('verifiedResetCode', code);
        
        // Redirect to reset password page with the code
        router.push(`/reset-password?token=${code}`);
      } else {
        // Handle email verification
        const response = await verifyEmail({ code }).unwrap();
        
        // Store tokens in localStorage for API calls
        if (response?.data?.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken);
        }
        if (response?.data?.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        
        // Also store in Redux
        dispatch(setCredentials({ 
          data: { 
            accessToken: response?.data?.accessToken, 
            refreshToken: response?.data?.refreshToken 
          } 
        }));
        
        toast.success(response?.message || "Email verified successfully!");
        
        // New user flow: After email verification, go to user-details to complete profile
        console.log("Email verified successfully - redirecting to user-details to complete profile");
        router.replace("/user-details");
      }
    } catch (err) {
      console.error("Verification error:", err);
      
      let errorMessage = "Verification failed";
      if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.error?.data?.message) {
        errorMessage = err.error.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <Container>
      <h2 className="text-center text-4xl font-semibold text-primary mb-1">
        {isPasswordReset ? "Verify Reset Code" : "Verify Email"}
      </h2>
      <p className="text-center text-gray-500 mb-6">
        {isPasswordReset 
          ? "Enter the verification code sent to your email" 
          : "Enter the OTP sent to your email"
        }
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            type="text"
            label={isPasswordReset ? "Verification Code" : "OTP Code"}
            value={code}
            disabled={isLoading}
            onChange={(e) => setCode(e.target.value)}
            className={error ? "border-red-500" : ""}
            placeholder="Enter 6-digit code"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <AuthBtn
          type="submit"
          disabled={isLoading}
          className="w-full py-2 font-semibold disabled:opacity-70"
        >
          {isLoading ? "Verifying..." : (isPasswordReset ? "Verify Code" : "Verify Email")}
        </AuthBtn>
      </form>

      {isPasswordReset && (
        <p className="text-center text-gray-600 mt-4">
          Didn't receive the code?{" "}
          <button
            onClick={() => router.push("/forgot-password")}
            className="text-primary font-semibold hover:underline"
          >
            Request New Code
          </button>
        </p>
      )}
    </Container>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <Container>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </Container>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
