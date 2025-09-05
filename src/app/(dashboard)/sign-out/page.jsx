"use client"; 

import React from "react";
import { useLogoutMutation } from "../../../features/auth/authApiSlice";
import { useRouter } from "next/navigation";  

const SignOut = () => {
  const [logout, { isLoading }] = useLogoutMutation();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      // Clear tokens or localStorage here if needed
      router.push("/login");  
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className="bg-primary text-white px-6 py-3 rounded-md shadow-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {isLoading ? "Signing out..." : "Sign Out"}
      </button>
    </div>
  );
};

export default SignOut;
