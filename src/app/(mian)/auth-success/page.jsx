"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/authSlice";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import axios from "axios";

function AuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        // Get the session token from cookies (set by backend)
        const sessionToken = Cookies.get("session_token");
        
        if (!sessionToken) {
          throw new Error("No session token found");
        }

        // Get user profile from backend using session
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://147.93.84.104';
        
        // First, get the user data from the session
        const userResponse = await axios.get(`${backendUrl}/api/auth/me`, {
          headers: {
            'Cookie': `session_token=${sessionToken}`,
            'Authorization': `Bearer ${sessionToken}`
          },
          withCredentials: true
        });

        let userData = userResponse.data?.data || userResponse.data;
        
        // If no user data from /auth/me, try the profile endpoint
        if (!userData) {
          const profileResponse = await axios.get(`${backendUrl}/api/profile`, {
            headers: {
              'Cookie': `session_token=${sessionToken}`,
              'Authorization': `Bearer ${sessionToken}`
            },
            withCredentials: true
          });
          userData = profileResponse.data?.data || profileResponse.data;
        }
        
        if (!userData) {
          throw new Error("Failed to fetch user data");
        }

        // Normalize user data
        const normalizedUser = {
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName || userData.profile?.firstName || "",
          lastName: userData.lastName || userData.profile?.lastName || "",
          avatarUrl: userData.avatarUrl || userData.profile?.avatarUrl || "",
          phone: userData.phone || userData.profile?.phone || "",
          nationality: userData.nationality || userData.profile?.nationality || "",
          cnicNumber: userData.cnicNumber || userData.profile?.cnicNumber || "",
          isVerified: userData.isVerified,
          isActive: userData.isActive,
          googleId: userData.googleId,
          // Add any other fields you need
        };

        // Set credentials in Redux and localStorage
        dispatch(setCredentials({ 
          accessToken: sessionToken, 
          user: normalizedUser 
        }));

        // Save to localStorage
        localStorage.setItem("accessToken", sessionToken);
        localStorage.setItem("user", JSON.stringify(normalizedUser));
        localStorage.setItem("userEmail", normalizedUser.email);

        // Set cookies
        Cookies.set("accessToken", sessionToken, { expires: 30 });
        
        toast.success("Successfully signed in with Google!");

        // Simplified flow: Redirect directly to root (/) after successful Google OAuth
        console.log("Google OAuth successful - redirecting to root (/)");
        router.replace("/");

      } catch (err) {
        console.error("Auth success error:", err);
        setError(err.message || "Authentication failed");
        toast.error("Authentication failed. Please try again.");
        
        // Redirect to login after a delay
        setTimeout(() => {
          router.replace("/login");
        }, 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthSuccess();
  }, [dispatch, router]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Completing sign in...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Failed</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => router.replace("/login")}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default function AuthSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AuthSuccessContent />
    </Suspense>
  );
}
