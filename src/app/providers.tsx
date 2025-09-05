'use client';

import { Provider } from 'react-redux';
import { store } from '../store/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { Toaster } from 'react-hot-toast';
import websocketService from '../services/websocketService';

// Set store reference in websocket service to avoid circular dependencies
websocketService.setStore(store);

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken');
      const user = localStorage.getItem('user');
      
      if (accessToken && user) {
        const userObj = JSON.parse(user);
        console.log("Rehydrating user from localStorage:", userObj);
        
        // Check if user has all required fields for dashboard
        const hasRequiredFields = userObj.firstName && userObj.lastName && userObj.phone && userObj.nationality && userObj.avatarUrl && userObj.cnicNumber;
        
        if (!hasRequiredFields) {
          console.log("User in localStorage is incomplete, fetching fresh data...");
          // Use local API endpoint to avoid CORS issues
          fetch("/api/profile", {
            headers: { 
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json"
            },
          })
          .then(res => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then(data => {
            console.log("API response:", data);
            if (data && data.data) {
              const userData = data.data;
              const completeUser = {
                id: userData.id,
                email: userData.email,
                isVerified: userData.isVerified,
                firstName: userData.firstName || userData.profile?.firstName,
                lastName: userData.lastName || userData.profile?.lastName,
                phone: userData.phone || userData.profile?.phone,
                nationality: userData.nationality || userData.profile?.nationality || "Pakistan",
                avatarUrl: userData.avatarUrl || userData.profile?.avatarUrl,
                cnicNumber: userData.cnicNumber || userData.profile?.cnicNumber,
                ...userData
              };
              console.log("Fetched complete user data:", completeUser);
              dispatch(setCredentials({ accessToken, user: completeUser }));
              localStorage.setItem('user', JSON.stringify(completeUser));
            } else {
              console.log("No user data in API response, using localStorage fallback");
              dispatch(setCredentials({ accessToken, user: userObj }));
            }
          })
          .catch(error => {
            console.error("Error fetching user data:", error);
            console.log("Using localStorage fallback due to API error");
            dispatch(setCredentials({ accessToken, user: userObj }));
          });
        } else {
          // User has all required fields, use localStorage data
          dispatch(setCredentials({ accessToken, user: userObj }));
        }
      }
    }
  }, [dispatch]);
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </Provider>
  );
}
