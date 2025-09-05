import { apiSlice } from "../api/apiSlice";

export const ownershipApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create ownership request
    createOwnershipRequest: builder.mutation({
      query: (requestData) => ({
        url: "/ownership-requests",
        method: "POST",
        body: requestData,
      }),
      invalidatesTags: ["OwnershipRequest"],
    }),

    // Get all ownership requests (admin only)
    getAllOwnershipRequests: builder.query({
      query: () => "/ownership-requests",
      providesTags: ["OwnershipRequest"],
      transformResponse: (response) => response.data,
    }),

    // Get user's ownership request status
    getUserOwnershipRequest: builder.query({
      query: (userId) => `/ownership-requests/user/${userId}`,
      providesTags: ["OwnershipRequest"],
      transformResponse: (response) => response.data,
    }),

    // Approve ownership request (admin only)
    approveOwnershipRequest: builder.mutation({
      query: (id) => ({
        url: `/ownership-requests/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["OwnershipRequest", "UserRole"],
    }),

    // Reject ownership request (admin only)
    rejectOwnershipRequest: builder.mutation({
      query: (id) => ({
        url: `/ownership-requests/${id}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: ["OwnershipRequest", "UserRole"],
    }),

    // Check if user has owner role
    checkUserRole: builder.query({
      query: (userId) => `/user-roles/${userId}/check-owner`,
      providesTags: ["UserRole"],
      transformResponse: (response) => response.data,
    }),

    // Check user roles (owner, builder, or tenant)
    checkUserRoles: builder.query({
      query: (userId) => `/user-roles/${userId}/check-roles`,
      providesTags: ["UserRole"],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useCreateOwnershipRequestMutation,
  useGetAllOwnershipRequestsQuery,
  useGetUserOwnershipRequestQuery,
  useApproveOwnershipRequestMutation,
  useRejectOwnershipRequestMutation,
  useCheckUserRoleQuery,
  useCheckUserRolesQuery,
} = ownershipApiSlice;
