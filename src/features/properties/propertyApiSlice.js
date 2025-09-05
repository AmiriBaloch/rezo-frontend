import { apiSlice } from "../api/apiSlice";

export const propertyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProperties: builder.query({
      query: () => "/properties",
      providesTags: ["Property"],
    }),
    getPropertiesByType: builder.query({
      query: ({ listingType, page = 1, limit = 10 }) => ({
        url: "/properties/filtered",
        params: { listingType, page, limit },
      }),
      providesTags: ["Property"],
    }),
    getPropertyById: builder.query({
      query: (id) => `/properties/${id}`,
      providesTags: (result, error, id) => [{ type: "Property", id }],
    }),
    createProperty: builder.mutation({
      query: (newProperty) => ({
        url: "/properties",
        method: "POST",
        body: newProperty,
      }),
      invalidatesTags: ["Property"],
    }),
    updateProperty: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/properties/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Property", id }],
    }),
    deleteProperty: builder.mutation({
      query: (id) => ({
        url: `/properties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Property"],
    }),
    approveProperty: builder.mutation({
      query: (id) => ({
        url: `/properties/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["Property"],
    }),
    rejectProperty: builder.mutation({
      query: (id) => ({
        url: `/properties/${id}/reject`,
        method: "DELETE",
      }),
      invalidatesTags: ["Property"],
    }),
    getOwnerProperties: builder.query({
      query: (ownerId) => `/properties/owners/${ownerId}`,
      providesTags: ["Property"],
    }),
    getOwnerCompletedTransactions: builder.query({
      query: (ownerId) => `/properties/owners/${ownerId}/completed-transactions`,
      providesTags: ["Property"],
    }),
  }),
});

export const {
  useGetAllPropertiesQuery,
  useGetPropertiesByTypeQuery,
  useGetPropertyByIdQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useApprovePropertyMutation,
  useRejectPropertyMutation,
  useGetOwnerPropertiesQuery,
  useGetOwnerCompletedTransactionsQuery,
} = propertyApiSlice;
