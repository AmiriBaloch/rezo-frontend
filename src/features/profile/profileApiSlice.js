import { apiSlice } from "../api/apiSlice";

export const profileApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get user profile with real-time data
    getProfile: builder.query({
      query: () => ({
        url: "/profile",
        method: "GET",
      }),
      providesTags: ["Profile"],
      transformResponse: (response) => {
        return response.data;
      },
    }),

    // Update profile
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: "/profile",
        method: "PUT",
        body: profileData,
      }),
      invalidatesTags: ["Profile"],
      transformResponse: (response) => {
        return response.data;
      },
    }),

    // Partial profile update
    partialUpdateProfile: builder.mutation({
      query: (profileData) => ({
        url: "/profile",
        method: "PATCH",
        body: profileData,
      }),
      invalidatesTags: ["Profile"],
      transformResponse: (response) => {
        return response.data;
      },
    }),

    // Update profile picture
    updateProfilePicture: builder.mutation({
      query: (formData) => ({
        url: "/profile/picture",
        method: "POST",
        body: formData,
        headers: {
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
      }),
      invalidatesTags: ["Profile"],
      transformResponse: (response) => {
        return response.data;
      },
    }),

    // Update notification preferences
    updateNotificationPreferences: builder.mutation({
      query: (preferences) => ({
        url: "/profile/notifications",
        method: "PUT",
        body: preferences,
      }),
      invalidatesTags: ["Profile"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  usePartialUpdateProfileMutation,
  useUpdateProfilePictureMutation,
  useUpdateNotificationPreferencesMutation,
} = profileApiSlice;
