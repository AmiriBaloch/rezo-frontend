import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../features/api/apiSlice";
import authReducer from "../features/auth/authSlice";
import propertyReducer from "../features/properties/propertySlice";
import messageReducer from "../features/messages/messageSlice";
import conversationReducer from "../features/conversations/conversationSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    property: propertyReducer,
    messages: messageReducer,
    conversations: conversationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
