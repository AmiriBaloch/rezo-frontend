import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api` : 'https://api.smare.org/api',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      // Add Authorization header with JWT token
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
        // Remove token logging for security
        // console.log('Token sent:', token.substring(0, 20) + '...');
      } else {
        console.log('No token found in localStorage');
      }
      return headers;
    },
  }),
  tagTypes: ['Profile', 'User', 'Property', 'Booking', 'Message', 'Notification', 'OwnershipRequest', 'BuilderRequest', 'UserRole'],
  endpoints: () => ({}),
});
