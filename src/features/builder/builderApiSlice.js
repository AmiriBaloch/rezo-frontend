import { apiSlice } from "../api/apiSlice";

export const builderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create builder request
    createBuilderRequest: builder.mutation({
      query: (requestData) => ({
        url: "/builder-requests",
        method: "POST",
        body: requestData,
      }),
      invalidatesTags: ["BuilderRequest"],
    }),

    // Get all builder requests (admin only)
    getAllBuilderRequests: builder.query({
      query: () => "/builder-requests",
      providesTags: ["BuilderRequest"],
      transformResponse: (response) => response.data,
    }),

    // Get user's builder request status
    getUserBuilderRequest: builder.query({
      query: (userId) => `/builder-requests/user/${userId}`,
      providesTags: ["BuilderRequest"],
      transformResponse: (response) => response.data,
    }),

    // Approve builder request (admin only)
    approveBuilderRequest: builder.mutation({
      query: (id) => ({
        url: `/builder-requests/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["BuilderRequest", "UserRole"],
    }),

    // Reject builder request (admin only)
    rejectBuilderRequest: builder.mutation({
      query: (id) => ({
        url: `/builder-requests/${id}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: ["BuilderRequest"],
    }),
    // Builder dashboard stats
    getBuilderDashboardStats: builder.query({
      query: () => "/builder/dashboard/stats",
    }),

    // Builder profile
    getBuilderProfile: builder.query({
      query: () => "/builder/profile",
      providesTags: ["BuilderProfile"],
    }),
    createBuilderProfile: builder.mutation({
      query: (profileData) => ({
        url: "/builder/profile",
        method: "POST",
        body: profileData,
      }),
      invalidatesTags: ["BuilderProfile"],
    }),
    updateBuilderProfile: builder.mutation({
      query: (profileData) => ({
        url: "/builder/profile",
        method: "PUT",
        body: profileData,
      }),
      invalidatesTags: ["BuilderProfile"],
    }),

    // Projects
    getBuilderProjects: builder.query({
      query: () => "/builder/projects",
      providesTags: ["BuilderProjects"],
    }),
    createProject: builder.mutation({
      query: (projectData) => ({
        url: "/builder/projects",
        method: "POST",
        body: projectData,
      }),
      invalidatesTags: ["BuilderProjects"],
    }),
    updateProject: builder.mutation({
      query: ({ id, ...projectData }) => ({
        url: `/builder/projects/${id}`,
        method: "PUT",
        body: projectData,
      }),
      invalidatesTags: ["BuilderProjects"],
    }),

    // Work submissions
    getWorkSubmissions: builder.query({
      query: () => "/builder/work-submissions",
      providesTags: ["WorkSubmissions"],
    }),
    submitWork: builder.mutation({
      query: (workData) => ({
        url: "/builder/work-submissions",
        method: "POST",
        body: workData,
      }),
      invalidatesTags: ["WorkSubmissions"],
    }),

    // Payment requests
    getPaymentRequests: builder.query({
      query: () => "/builder/payment-requests",
      providesTags: ["PaymentRequests"],
    }),
    requestPayment: builder.mutation({
      query: (paymentData) => ({
        url: "/builder/payment-requests",
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: ["PaymentRequests"],
    }),

    // Withdrawals
    getWithdrawals: builder.query({
      query: () => "/builder/withdrawals",
      providesTags: ["Withdrawals"],
    }),
    requestWithdrawal: builder.mutation({
      query: (withdrawalData) => ({
        url: "/builder/withdrawals",
        method: "POST",
        body: withdrawalData,
      }),
      invalidatesTags: ["Withdrawals"],
    }),
  }),
});

export const {
  useCreateBuilderRequestMutation,
  useGetAllBuilderRequestsQuery,
  useGetUserBuilderRequestQuery,
  useApproveBuilderRequestMutation,
  useRejectBuilderRequestMutation,
  useGetBuilderDashboardStatsQuery,
  useGetBuilderProfileQuery,
  useCreateBuilderProfileMutation,
  useUpdateBuilderProfileMutation,
  useGetBuilderProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useGetWorkSubmissionsQuery,
  useSubmitWorkMutation,
  useGetPaymentRequestsQuery,
  useRequestPaymentMutation,
  useGetWithdrawalsQuery,
  useRequestWithdrawalMutation,
} = builderApiSlice;
