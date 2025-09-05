"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OwnerSignOut() {
  const router = useRouter();

  useEffect(() => {
    // Clear user data and redirect to home
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Signing out...</p>
      </div>
    </div>
  );
}
