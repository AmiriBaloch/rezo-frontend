import { apiSlice } from "../api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    signup: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),

    googleAuth: builder.mutation({
      query: () => ({
        url: "/auth/google",
        method: "GET",
      }),
    }),

    verifyEmail: builder.mutation({
      query: (code) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: code,
      }),
    }),

    passwordReset: builder.mutation({
      query: (data) => ({
        url: "/auth/password-reset",
        method: "POST",
        body: data,
      }),
    }),

    confirmPasswordReset: builder.mutation({
      query: (data) => ({
        url: "/auth/password-reset/confirm",
        method: "POST",
        body: data,
      }),
    }),

    verifyPasswordReset: builder.mutation({
      query: (data) => ({
        url: "/auth/password-reset/verify",
        method: "POST",
        body: data,
      }),
    }),

    updateUserDetails: builder.mutation({
      query: (details) => ({
        url: "/profile",
        method: "PUT",
        body: details,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }),
      transformResponse: (response) => {
        console.log("Profile update successful", response);
        return response;
      },
    }),
    
    uploadPhoto: builder.mutation({
      query: (formData) => ({
        url: "/profile/picture",
        method: "POST",
        body: formData,
      }),
    }),
    
    updateAdditionalInfo: builder.mutation({
      query: (formData) => ({
        url: "/profile",
        method: "PUT",
        body: formData,
      }),
    }),

    getProfile: builder.query({
      query: () => ({
        url: "/profile",
        method: "GET",
      }),
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useLoginMutation,
  useSignupMutation,
  useGoogleAuthMutation,
  useVerifyEmailMutation,
  usePasswordResetMutation,
  useVerifyPasswordResetMutation,
  useConfirmPasswordResetMutation,
  useChangePasswordMutation,
  useUpdateUserDetailsMutation,
  useUploadPhotoMutation,
  useUpdateAdditionalInfoMutation,
  useLogoutMutation,
  useGetProfileQuery,
} = authApiSlice;
