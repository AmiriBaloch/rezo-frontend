'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../features/auth/authSlice';
import Dashboard from '../../../components/dashboard/layout/Dashboard';

const Page = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    console.log("Dashboard - Current user:", user);
    
    if (!user) {
      console.log("Dashboard - No user in Redux, checking localStorage...");
      // Check localStorage as fallback
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        console.log("Dashboard - Found user in localStorage:", JSON.parse(storedUser));
        // Don't redirect immediately, let the rehydration happen
        return;
      }
      console.log("Dashboard - No user found, redirecting to login");
      router.replace('/login');
      return;
    }
    
    // Check for profile completion (add more fields as needed)
    const hasRequiredFields = user.firstName && user.lastName && user.phone && user.nationality && user.avatarUrl && user.cnicNumber;
    console.log("Dashboard - User has required fields:", hasRequiredFields, {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      nationality: user.nationality,
      avatarUrl: user.avatarUrl,
      cnicNumber: user.cnicNumber
    });
    
    if (!hasRequiredFields) {
      console.log("Dashboard - Missing required fields, redirecting to user-details");
      router.replace('/user-details');
    }
  }, [user, router]);

  if (!isHydrated) {
    return <div>Loading...</div>;
  }

  if (!user || !user.firstName || !user.lastName || !user.phone || !user.nationality || !user.avatarUrl || !user.cnicNumber) {
    return (
      <div className="p-4">
        <p>Loading user data...</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <Dashboard />
    </div>
  );
};

export default Page;
