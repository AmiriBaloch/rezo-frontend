"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function AuthErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState("Authentication failed");
  const [errorCode, setErrorCode] = useState("");

  useEffect(() => {
    const code = searchParams.get("code");
    setErrorCode(code || "unknown_error");

    // Map error codes to user-friendly messages
    const errorMessages = {
      "invalid_state": "Authentication session expired. Please try again.",
      "auth_error": "Authentication failed. Please try again.",
      "no_user": "User account not found. Please try signing up first.",
      "user_not_found": "User account not found. Please try signing up first.",
      "processing_error": "An error occurred while processing your request. Please try again.",
      "session_error": "Session creation failed. Please try again.",
      "OAUTH_FAILED": "Google authentication failed. Please try again.",
      "unknown_error": "An unexpected error occurred. Please try again."
    };

    setErrorMessage(errorMessages[code] || errorMessages["unknown_error"]);
  }, [searchParams]);

  const handleRetry = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Failed
          </h1>
          
          <p className="text-gray-600 mb-6">
            {errorMessage}
          </p>

          {errorCode && (
            <p className="text-sm text-gray-500 mb-6">
              Error Code: {errorCode}
            </p>
          )}

          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
            
            <Link
              href="/login"
              className="block w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back to Login
            </Link>
            
            <Link
              href="/"
              className="block w-full text-gray-500 hover:text-gray-700 transition-colors"
            >
              Go to Homepage
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              If this problem persists, please contact support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}
