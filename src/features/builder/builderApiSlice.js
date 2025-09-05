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
  }),
});

export const {
  useCreateBuilderRequestMutation,
  useGetAllBuilderRequestsQuery,
  useGetUserBuilderRequestQuery,
  useApproveBuilderRequestMutation,
  useRejectBuilderRequestMutation,
} = builderApiSlice;
